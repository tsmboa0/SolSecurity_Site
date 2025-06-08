import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const walletAnalyses = pgTable("wallet_analyses", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  addressPoisoningData: json("address_poisoning_data").notNull(),
  dustingData: json("dusting_data").notNull(),
  overallRiskScore: integer("overall_risk_score").notNull(),
  analyzedAt: text("analyzed_at").notNull(),
});

export const insertWalletAnalysisSchema = createInsertSchema(walletAnalyses).omit({
  id: true,
});

export type InsertWalletAnalysis = z.infer<typeof insertWalletAnalysisSchema>;
export type WalletAnalysis = typeof walletAnalyses.$inferSelect;

// Wallet address validation schema
export const walletAddressSchema = z.object({
  address: z.string()
    .min(32, "Wallet address must be at least 32 characters")
    .max(44, "Wallet address must be at most 44 characters")
    .regex(/^[1-9A-HJ-NP-Za-km-z]+$/, "Invalid Solana wallet address format"),
});

export type WalletAddressInput = z.infer<typeof walletAddressSchema>;

// Analysis result types
export interface AnalysisResult {
  riskScore: string;
  status: string;
  transactionCount: string;
  suspiciousCount?: string;
  dustCount?: string;
  lastActivity: string;
  riskLevel?: string;
  tokenTransfers?: string;
  summary: string;
}

export interface SecurityAnalysisResponse {
  walletAddress: string;
  addressPoisoning: AnalysisResult;
  dusting: AnalysisResult;
  overallRiskScore: number;
  analyzedAt: string;
}
