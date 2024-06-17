import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

export const connectionString = `${process.env.DATABASE_URL}`;
export const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
