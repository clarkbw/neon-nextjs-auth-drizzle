import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { connectionString } from "../db";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // need to create this in here to ensure there's a new connection each time
  const db = drizzle(neon(connectionString));
  return {
    adapter: DrizzleAdapter(db),
    providers: [],
  };
});
