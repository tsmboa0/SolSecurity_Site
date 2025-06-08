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

// Address Poisoning Analysis Result
export interface AddressPoisoningResult {
  riskScore: string;
  status: string;
  transactionCount: string;
  fakeAddresses: string[];
  mimickedAddress?: string;
  summary: string;
}

// Account Dusting Analysis Result
export interface AccountDustingResult {
  riskScore: string;
  status: string;
  transactionCount: string;
  dustTransactionCount: string;
  topDusterAddresses: string[];
  summary: string;
}

export interface SecurityAnalysisResponse {
  walletAddress: string;
  addressPoisoning: AddressPoisoningResult;
  dusting: AccountDustingResult;
  overallRiskScore: number;
  analyzedAt: string;
}
