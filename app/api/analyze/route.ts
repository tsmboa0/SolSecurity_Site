import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { walletAddressSchema, type SecurityAnalysisResponse, type AddressPoisoningResult, type AccountDustingResult } from '@/shared/schema'
import { checkWalletPoisoning } from '../../../utils/helpers/poisoning'
import { checkWalletDusting } from '../../../utils/helpers/dusting'

export async function POST(request: NextRequest) {
  console.log("Analyzing wallet...")
  let poisoning: AddressPoisoningResult;
  let dusting: AccountDustingResult;

  try {
    const body = await request.json()
    const { address } = walletAddressSchema.parse(body)

    try {
      const poisoningResult = await checkWalletPoisoning(address);
      
      poisoning = {
        riskScore: poisoningResult.score,
        status: poisoningResult.score > 0.2 ? "High Risk" : poisoningResult.score > 0.1 ? "Medium Risk" : "Low Risk",
        transactionCount: poisoningResult.total_transactions_analyzed,
        fakeAddresses: poisoningResult.poisoned_addresses,
        mimickedAddress: poisoningResult.mimicked_addresses,
        summary: poisoningResult.summary
      }
    } catch (error) {
      console.error("Poisoning analysis error:", error)
      return NextResponse.json(
        { message: "Poisoning analysis failed" },
        { status: 500 }
      )
    }

    try {
      const dustingResult = await checkWalletDusting(address);
      dusting = {
        riskScore: dustingResult.score,
        status: dustingResult.score > 0.2 ? "High Risk" : dustingResult.score > 0.1 ? "Medium Risk" : "Low Risk",
        transactionCount: dustingResult.total_transactions_analyzed,
        dustTransactionCount: dustingResult.dusting_count,
        topDusterAddresses: dustingResult.top_duster_addresses,
        summary: dustingResult.summary
      }
    } catch (error) {
      console.error("Dusting analysis error:", error)
      return NextResponse.json(
        { message: "Dusting analysis failed" },
        { status: 500 }
      )
    }

    const analyzedAt = new Date().toISOString()

    const response: SecurityAnalysisResponse = {
      walletAddress: address,
      poisoning,
      dusting,
      overallRiskScore: (Number(poisoning.riskScore) + Number(dusting.riskScore))*100 / 2,
      analyzedAt,
    }

    console.log(`Analysis response: ${JSON.stringify(response)}`);

    return NextResponse.json(response)
  } catch (error) {
    console.error("Analysis error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid wallet address format" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    )
  }
}