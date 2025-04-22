import { connectToDatabase } from "./mongodb"

// Interface for URL mapping
interface UrlMapping {
  originalUrl: string
  shortCode: string
  createdAt: Date
  visits: number
}

// Collection name
const COLLECTION_NAME = "url_mappings"

export const storage = {
  // Save a new URL mapping
  saveUrl: async (shortCode: string, originalUrl: string): Promise<void> => {
    const { db } = await connectToDatabase()
    const collection = db.collection(COLLECTION_NAME)

    await collection.insertOne({
      originalUrl,
      shortCode,
      createdAt: new Date(),
      visits: 0,
    })
  },

  // Get a URL mapping by short code
  getUrl: async (shortCode: string): Promise<UrlMapping | null> => {
    const { db } = await connectToDatabase()
    const collection = db.collection(COLLECTION_NAME)

    return await collection.findOne({ shortCode })
  },

  // Check if a short code already exists
  shortCodeExists: async (shortCode: string): Promise<boolean> => {
    const { db } = await connectToDatabase()
    const collection = db.collection(COLLECTION_NAME)

    const count = await collection.countDocuments({ shortCode })
    return count > 0
  },

  // Increment visit count
  incrementVisits: async (shortCode: string): Promise<void> => {
    const { db } = await connectToDatabase()
    const collection = db.collection(COLLECTION_NAME)

    await collection.updateOne({ shortCode }, { $inc: { visits: 1 } })
  },

  // Get all URL mappings (for debugging or admin purposes)
  getAllUrls: async (): Promise<UrlMapping[]> => {
    const { db } = await connectToDatabase()
    const collection = db.collection(COLLECTION_NAME)

    return await collection.find({}).toArray()
  },

  // Clear all mappings (for testing)
  clear: async (): Promise<void> => {
    const { db } = await connectToDatabase()
    const collection = db.collection(COLLECTION_NAME)

    await collection.deleteMany({})
  },
}
