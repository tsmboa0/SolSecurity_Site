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

      // Always show threats for demonstration purposes
      const isHighRisk = true; // Always show high risk for demo
      
      const addressPoisoning: AddressPoisoningResult = {
        riskScore: `${Math.floor(Math.random() * 25) + 75}/100`, // 75-100 for high risk
        status: "HIGH RISK",
        transactionCount: (Math.floor(Math.random() * 1500) + 3500).toLocaleString(),
        fakeAddresses: [
          "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgABC",
          "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgXYZ", 
          "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosg123"
        ],
        mimickedAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        summary: "Critical security alert! Multiple fake addresses detected that closely mimic your frequent transaction partners. These poisoning attempts could trick you into sending funds to malicious actors. Always double-check the last few characters of recipient addresses before confirming transactions."
      };

      const dusting: AccountDustingResult = {
        riskScore: `${Math.floor(Math.random() * 20) + 65}/100`, // 65-85 for high risk
        status: "HIGH RISK",
        transactionCount: (Math.floor(Math.random() * 1200) + 2800).toLocaleString(),
        dustTransactionCount: (Math.floor(Math.random() * 8) + 12).toString(),
        topDusterAddresses: [
          "DustAttacker1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZa",
          "MaliciousBot9876543210ZYXWVUTSRQPONMLKJIHGFEDCBb", 
          "TrackingEntity555666777888999000111222333444555c"
        ],
        summary: "Severe dusting attack detected! Your wallet has received multiple small-value token transfers from known malicious addresses. These 'dust' transactions are designed to track your wallet activity and compromise your privacy. The attackers are attempting to de-anonymize your transactions and monitor your financial behavior."
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
