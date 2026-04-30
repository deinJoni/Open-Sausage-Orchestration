import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  walletAddress: text("wallet_address").primaryKey(),
  ensName: text("ens_name").unique(),
  ensNode: text("ens_node").unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  syncedAt: timestamp("synced_at", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .default(sql`now()`),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: "date" }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
