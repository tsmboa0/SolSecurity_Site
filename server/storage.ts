import { walletAnalyses, type WalletAnalysis, type InsertWalletAnalysis } from "@shared/schema";

export interface IStorage {
  getWalletAnalysis(walletAddress: string): Promise<WalletAnalysis | undefined>;
  createWalletAnalysis(analysis: InsertWalletAnalysis): Promise<WalletAnalysis>;
  updateWalletAnalysis(walletAddress: string, analysis: Partial<InsertWalletAnalysis>): Promise<WalletAnalysis>;
}

export class MemStorage implements IStorage {
  private analyses: Map<string, WalletAnalysis>;
  private currentId: number;

  constructor() {
    this.analyses = new Map();
    this.currentId = 1;
  }

  async getWalletAnalysis(walletAddress: string): Promise<WalletAnalysis | undefined> {
    return Array.from(this.analyses.values()).find(
      (analysis) => analysis.walletAddress === walletAddress,
    );
  }

  async createWalletAnalysis(insertAnalysis: InsertWalletAnalysis): Promise<WalletAnalysis> {
    const id = this.currentId++;
    const analysis: WalletAnalysis = { ...insertAnalysis, id };
    this.analyses.set(insertAnalysis.walletAddress, analysis);
    return analysis;
  }

  async updateWalletAnalysis(walletAddress: string, updateData: Partial<InsertWalletAnalysis>): Promise<WalletAnalysis> {
    const existing = await this.getWalletAnalysis(walletAddress);
    if (!existing) {
      throw new Error("Analysis not found");
    }
    
    const updated: WalletAnalysis = { ...existing, ...updateData };
    this.analyses.set(walletAddress, updated);
    return updated;
  }
}

export const storage = new MemStorage();
