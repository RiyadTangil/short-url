import { describe, expect, test, beforeEach, afterAll } from "vitest"
import { storage } from "@/lib/storage"
import { connectToDatabase } from "@/lib/mongodb"

describe("MongoDB Storage", () => {
  beforeEach(async () => {
    // Clear storage before each test
    await storage.clear()
  })

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    const { client } = await connectToDatabase()
    await client.close()
  })

  test("should save and retrieve a URL mapping", async () => {
    const shortCode = "abc123"
    const originalUrl = "https://example.com"

    await storage.saveUrl(shortCode, originalUrl)
    const mapping = await storage.getUrl(shortCode)

    expect(mapping).not.toBeNull()
    expect(mapping?.originalUrl).toBe(originalUrl)
    expect(mapping?.shortCode).toBe(shortCode)
    expect(mapping?.visits).toBe(0)
  })

  test("should check if a short code exists", async () => {
    const shortCode = "abc123"
    const originalUrl = "https://example.com"

    expect(await storage.shortCodeExists(shortCode)).toBe(false)

    await storage.saveUrl(shortCode, originalUrl)

    expect(await storage.shortCodeExists(shortCode)).toBe(true)
  })

  test("should increment visit count", async () => {
    const shortCode = "abc123"
    const originalUrl = "https://example.com"

    await storage.saveUrl(shortCode, originalUrl)
    await storage.incrementVisits(shortCode)

    const mapping = await storage.getUrl(shortCode)
    expect(mapping?.visits).toBe(1)

    await storage.incrementVisits(shortCode)
    await storage.incrementVisits(shortCode)

    const updatedMapping = await storage.getUrl(shortCode)
    expect(updatedMapping?.visits).toBe(3)
  })

  test("should return null for non-existent short codes", async () => {
    const mapping = await storage.getUrl("nonexistent")
    expect(mapping).toBeNull()
  })

  test("should get all URL mappings", async () => {
    await storage.saveUrl("code1", "https://example1.com")
    await storage.saveUrl("code2", "https://example2.com")
    await storage.saveUrl("code3", "https://example3.com")

    const allUrls = await storage.getAllUrls()

    expect(allUrls.length).toBe(3)
    expect(allUrls.map((u) => u.shortCode).sort()).toEqual(["code1", "code2", "code3"])
  })
})
