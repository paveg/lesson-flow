import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL!

declare global {
  var dbClient: postgres.Sql | undefined
}

const getClient = () => {
  if (!global.dbClient) {
    global.dbClient = postgres(connectionString, {
      prepare: false,
      max: 1,
    })
  }
  return global.dbClient
}

const client = getClient()

export const db = drizzle(client, { schema })
