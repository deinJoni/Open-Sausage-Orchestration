import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const tips = pgTable(
  "tips",
  {
    txHash: text("tx_hash").primaryKey(),
    fromWallet: text("from_wallet").notNull(),
    toWallet: text("to_wallet").notNull(),
    amountWei: numeric("amount_wei", { precision: 78, scale: 0 }).notNull(),
    message: text("message"),
    blockNumber: bigint("block_number", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    index("tips_to_created_idx").on(table.toWallet, table.createdAt.desc()),
    index("tips_from_created_idx").on(table.fromWallet, table.createdAt.desc()),
  ]
);

export type Tip = typeof tips.$inferSelect;
export type NewTip = typeof tips.$inferInsert;
