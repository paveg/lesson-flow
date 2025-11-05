import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { DB_POOL_CONFIG } from "@/config/constants"

const connectionString = process.env.DATABASE_URL!

declare global {
  var dbClient: postgres.Sql | undefined
}

const getClient = () => {
  if (!global.dbClient) {
    global.dbClient = postgres(connectionString, {
      prepare: false,
      max: DB_POOL_CONFIG.MAX_CONNECTIONS,
    })
  }
  return global.dbClient
}

const client = getClient()

export const db = drizzle(client, { schema })
