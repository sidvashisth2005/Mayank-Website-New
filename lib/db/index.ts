import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// One pool per server instance. On Vercel, attachDatabasePool closes idle
// clients before a function is suspended; in development the pool is kept on
// globalThis so hot reloads do not open new connections.

const globalForDb = globalThis as unknown as { mayankPool?: Pool };

function createPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Run `vercel env pull` to fetch it.");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, idleTimeoutMillis: 5_000 });
  attachDatabasePool(pool);
  return pool;
}

const pool = globalForDb.mayankPool ?? createPool();
if (process.env.NODE_ENV !== "production") globalForDb.mayankPool = pool;

export const db = drizzle({ client: pool, schema });
export { schema };
