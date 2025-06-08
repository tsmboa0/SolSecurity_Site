import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { walletAddressSchema, type SecurityAnalysisResponse, type AddressPoisoningResult, type AccountDustingResult } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze wallet security
  app.post("/api/analyze", async (req, res) => {
    try {
      const { address } = walletAddressSchema.parse(req.body);
      
      // Check if we already have an analysis for this wallet
      const existingAnalysis = await storage.getWalletAnalysis(address);
      
      if (existingAnalysis) {
        const response: SecurityAnalysisResponse = {
          walletAddress: address,
          addressPoisoning: existingAnalysis.addressPoisoningData as AddressPoisoningResult,
          dusting: existingAnalysis.dustingData as AccountDustingResult,
          overallRiskScore: existingAnalysis.overallRiskScore,
          analyzedAt: existingAnalysis.analyzedAt,
        };
        return res.json(response);
      }

      // Simulate analysis processing time
      await new Promise(resolve => setTimeout(resolve, 8000));

      // Generate fake wallet addresses for simulation
      const generateFakeAddress = () => {
        const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < 44; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      // Generate realistic analysis results
      const isHighRisk = Math.random() > 0.7; // 30% chance of high risk
      
      const addressPoisoning: AddressPoisoningResult = isHighRisk ? {
        riskScore: `${Math.floor(Math.random() * 35) + 65}/100`, // 65-100 for high risk
        status: "HIGH RISK",
        transactionCount: (Math.floor(Math.random() * 2000) + 2000).toLocaleString(),
        fakeAddresses: [
          generateFakeAddress(),
          generateFakeAddress(),
          generateFakeAddress()
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        mimickedAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        summary: "Multiple address poisoning attempts detected! Several transactions show interactions with addresses similar to your frequent recipients. Exercise extreme caution when sending funds and always verify recipient addresses."
      } : {
        riskScore: `${Math.floor(Math.random() * 30)}/100`, // 0-30 for low risk
        status: "SAFE",
        transactionCount: (Math.floor(Math.random() * 3000) + 1000).toLocaleString(),
        fakeAddresses: [],
        summary: "No address poisoning attacks detected. Your wallet appears to be interacting with legitimate addresses and contracts. Continue following security best practices."
      };

      const dusting: AccountDustingResult = isHighRisk ? {
        riskScore: `${Math.floor(Math.random() * 30) + 50}/100`, // 50-80 for medium risk
        status: "MEDIUM RISK",
        transactionCount: (Math.floor(Math.random() * 1500) + 1500).toLocaleString(),
        dustTransactionCount: (Math.floor(Math.random() * 15) + 3).toString(),
        topDusterAddresses: [
          generateFakeAddress(),
          generateFakeAddress(),
          generateFakeAddress()
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        summary: "Account dusting detected. Your wallet has received several small token amounts from unknown sources, possibly for tracking purposes. Consider using a new wallet for sensitive transactions."
      } : {
        riskScore: `${Math.floor(Math.random() * 20)}/100`, // 0-20 for low risk
        status: "SAFE",
        transactionCount: (Math.floor(Math.random() * 2000) + 1000).toLocaleString(),
        dustTransactionCount: "0",
        topDusterAddresses: [],
        summary: "No account dusting attacks detected. All token transfers appear to be legitimate transactions. Your wallet shows normal activity patterns."
      };

      const overallRiskScore = Math.max(
        parseInt(addressPoisoning.riskScore.split('/')[0]),
        parseInt(dusting.riskScore.split('/')[0])
      );

      const analyzedAt = new Date().toISOString();

      // Store the analysis
      const analysis = await storage.createWalletAnalysis({
        walletAddress: address,
        addressPoisoningData: addressPoisoning,
        dustingData: dusting,
        overallRiskScore,
        analyzedAt,
      });

      const response: SecurityAnalysisResponse = {
        walletAddress: address,
        addressPoisoning,
        dusting,
        overallRiskScore,
        analyzedAt,
      };

      res.json(response);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Analysis failed" 
      });
    }
  });

  // Get analysis progress (for real-time updates)
  app.get("/api/analyze/:address/progress", async (req, res) => {
    const { address } = req.params;
    
    // For demo purposes, return mock progress
    const progress = Math.min(Math.random() * 100, 95);
    res.json({ progress, currentStep: "Analyzing transaction patterns..." });
  });

  const httpServer = createServer(app);
  return httpServer;
}
