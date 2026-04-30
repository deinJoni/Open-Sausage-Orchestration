import { sql } from "drizzle-orm";
import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const follows = pgTable(
  "follows",
  {
    followerWallet: text("follower_wallet").notNull(),
    followeeWallet: text("followee_wallet").notNull(),
    followedAt: timestamp("followed_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    primaryKey({ columns: [table.followerWallet, table.followeeWallet] }),
    index("follows_followee_idx").on(table.followeeWallet),
  ]
);

export type Follow = typeof follows.$inferSelect;
export type NewFollow = typeof follows.$inferInsert;
