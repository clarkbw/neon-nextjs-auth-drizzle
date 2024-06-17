// this is a better Postgres version of this schema
// I haven't checked if changing the exported table columns breaks things

import {
  pgTable,
  primaryKey,
  boolean,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type

export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export type Account = typeof accounts.$inferSelect; // return type when queried
export type NewAccount = typeof accounts.$inferInsert; // insert type

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type Session = typeof sessions.$inferSelect; // return type when queried
export type NewSession = typeof sessions.$inferInsert; // insert type

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export type VerificationTokens = typeof verificationTokens.$inferSelect; // return type when queried
export type NewVerificationTokens = typeof verificationTokens.$inferInsert; // insert type

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credential_id").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("provider_account_id").notNull(),
    credentialPublicKey: text("credential_public_key").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credential_device_type").notNull(),
    credentialBackedUp: boolean("credential_backed_up").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export type Authenticators = typeof authenticators.$inferSelect; // return type when queried
export type NewAuthenticators = typeof authenticators.$inferInsert; // insert type

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   username: text("username"),
//   firstName: text("first_name"),
//   lastName: text("last_name"),
//   email: text("email"),
//   emailVerified: timestamp("email_verified", { withTimezone: true }),
//   image: text("image"),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
//   lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
//   phoneNumbers: bigint("phone_numbers", { mode: "number" }),
// });
