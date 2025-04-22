import { MongoClient } from "mongodb"

const MONGODB_URI =
  "mongodb+srv://sadamon:Ri11559988@cluster0.ez5ix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const DB_NAME = "client_com"

// Cache the MongoDB connection to reuse it across requests
let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Create a new connection
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(DB_NAME)

  // Cache the connection
  cachedClient = client
  cachedDb = db

  return { client, db }
}
