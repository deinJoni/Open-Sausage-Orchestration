import { sql } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const profileDrafts = pgTable("profile_drafts", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.walletAddress, { onDelete: "cascade" }),
  draft: jsonb("draft").notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .default(sql`now()`),
});

export type ProfileDraft = typeof profileDrafts.$inferSelect;
export type NewProfileDraft = typeof profileDrafts.$inferInsert;
