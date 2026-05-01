import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const broadcasts = pgTable(
  "broadcasts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.walletAddress, { onDelete: "cascade" }),
    isLive: boolean("is_live").notNull().default(false),
    streamProvider: text("stream_provider").notNull(),
    streamId: text("stream_id").notNull(),
    streamProtocol: text("stream_protocol"),
    ingestSecretRef: text("ingest_secret_ref"),
    title: text("title"),
    thumbnailUrl: text("thumbnail_url"),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "date" }),
    endedAt: timestamp("ended_at", { withTimezone: true, mode: "date" }),
    lastHeartbeatAt: timestamp("last_heartbeat_at", {
      withTimezone: true,
      mode: "date",
    }),
    viewerPeak: integer("viewer_peak").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    index("broadcasts_user_started_idx").on(
      table.userId,
      table.startedAt.desc()
    ),
    index("broadcasts_live_heartbeat_idx").on(
      table.isLive,
      table.lastHeartbeatAt
    ),
  ]
);

export const broadcastGuests = pgTable(
  "broadcast_guests",
  {
    broadcastId: uuid("broadcast_id")
      .notNull()
      .references(() => broadcasts.id, { onDelete: "cascade" }),
    guestWallet: text("guest_wallet").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" })
      .notNull()
      .default(sql`now()`),
    leftAt: timestamp("left_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [primaryKey({ columns: [table.broadcastId, table.guestWallet] })]
);

export type Broadcast = typeof broadcasts.$inferSelect;
export type NewBroadcast = typeof broadcasts.$inferInsert;
export type BroadcastGuest = typeof broadcastGuests.$inferSelect;
export type NewBroadcastGuest = typeof broadcastGuests.$inferInsert;
