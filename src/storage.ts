import {
  users,
  requests,
  facilities,
  marketPrices,
  walletTransactions,
  otpVerifications,
  type User,
  type UpsertUser,
  type Request,
  type InsertRequest,
  type Facility,
  type InsertFacility,
  type MarketPrice,
  type InsertMarketPrice,
  type WalletTransaction,
  type InsertWalletTransaction,
  type OtpVerification,
} from "@shared/schema";

import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Facilities
  async getFacilities() {
    return db.select().from(facilities);
  }

  async seedFacilities() {
    await db.insert(facilities).values({
      name: "Test Facility",
      address: "123 Street",
      acceptedMaterials: ["plastic", "paper", "metal"], // ✅ plain array, ORM serializes to JSONB
      phone: "123456789",
      operatingHours: "9am-5pm"
    });
  }

  // Market Prices
  async getMarketPrices() {
    return db.select().from(marketPrices);
  }

  async getMarketPrice(type: string) {
    return (await db.select().from(marketPrices).where(eq(marketPrices.materialType, type)))[0];
  }

  async updateMarketPrice(id: number, pricePerKg: string) {
    return (await db.update(marketPrices)
      .set({ pricePerKg, updatedAt: new Date() })
      .where(eq(marketPrices.id, id))
      .returning())[0];
  }

  async seedMarketPrices(data: InsertMarketPrice[]) {
    const existing = await this.getMarketPrices();
    if (existing.length === 0) {
      await db.insert(marketPrices).values(data);
    }
  }

  // Wallet Transactions
  async getWalletTransactions(userId: string) {
    return db.select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt));
  }

  async getAllWalletTransactions() {
    return db.select()
      .from(walletTransactions)
      .orderBy(desc(walletTransactions.createdAt));
  }

  async createWalletTransaction(tx: InsertWalletTransaction) {
    return (await db.insert(walletTransactions).values(tx).returning())[0];
  }

  async updateUserBalance(userId: string, amount: number) {
    return (await db.update(users).set({
      balance: sql`CAST(COALESCE(${users.balance}, '0') AS DECIMAL) + ${amount}`
    }).where(eq(users.id, userId)).returning())[0];
  }

  // Stats
  async getStats() {
    const reqs = await db.select().from(requests).where(eq(requests.status, "completed"));
    const totalJobs = reqs.length;
    const totalWeight = reqs.reduce((sum, r) => sum + Number(r.actualWeight || 0), 0);
    const totalPayout = reqs.reduce((sum, r) => sum + Number(r.totalPayout || 0), 0);
    const totalCommission = reqs.reduce((sum, r) => sum + Number(r.commissionAmount || 0), 0);
    const totalCollectorEarnings = totalPayout - totalCommission;

    return {
      totalJobs,
      totalWeight,
      totalPayout,
      totalCommission,
      totalCollectorEarnings,
    };
  }
}

// ✅ Export a single instance
export const storage = new DatabaseStorage();
