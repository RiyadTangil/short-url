import { describe, expect, test, beforeEach, vi } from "vitest"
import { shortenUrl, getOriginalUrl } from "@/lib/actions"
import { storage } from "@/lib/storage"
import * as utils from "@/lib/utils"

describe("URL Shortener Actions", () => {
  beforeEach(async () => {
    // Clear storage before each test
    await storage.clear()

    // Reset mocks
    vi.restoreAllMocks()
  })

  describe("shortenUrl", () => {
    const testHost = "https://shorturl.example.com"

    test("should return error for invalid URLs", async () => {
      const result = await shortenUrl("not-a-valid-url", testHost)
      expect(result.error).toBeDefined()
      expect(result.shortUrl).toBeUndefined()
    })

    test("should generate a short URL for valid URLs", async () => {
      // Mock the generateShortCode function to return a predictable value
      vi.spyOn(utils, "generateShortCode").mockReturnValue("abc123")

      const result = await shortenUrl("https://example.com", testHost)

      expect(result.error).toBeUndefined()
      expect(result.shortUrl).toBe(`${testHost}/s/abc123`)

      // Verify the URL was saved
      const exists = await storage.shortCodeExists("abc123")
      expect(exists).toBe(true)
    })

    test("should handle collisions by generating new codes", async () => {
      // First, add a URL with a known short code
      await storage.saveUrl("abc123", "https://example1.com")

      // Mock to return the collision first, then a new code
      const generateShortCodeMock = vi.spyOn(utils, "generateShortCode")
      generateShortCodeMock.mockReturnValueOnce("abc123") // This will collide
      generateShortCodeMock.mockReturnValueOnce("xyz789") // This will be used

      const result = await shortenUrl("https://example2.com", testHost)

      expect(result.error).toBeUndefined()
      expect(result.shortUrl).toBe(`${testHost}/s/xyz789`)

      // Verify both URLs exist with different codes
      const url1 = await storage.getUrl("abc123")
      const url2 = await storage.getUrl("xyz789")

      expect(url1?.originalUrl).toBe("https://example1.com")
      expect(url2?.originalUrl).toBe("https://example2.com")
    })
  })

  describe("getOriginalUrl", () => {
    test("should return error for non-existent short codes", async () => {
      const result = await getOriginalUrl("nonexistent")
      expect(result.error).toBeDefined()
      expect(result.originalUrl).toBeUndefined()
    })

    test("should return the original URL and increment visits", async () => {
      // Add a URL to storage
      await storage.saveUrl("abc123", "https://example.com")

      const result = await getOriginalUrl("abc123")

      expect(result.error).toBeUndefined()
      expect(result.originalUrl).toBe("https://example.com")

      // Verify visit count was incremented
      const mapping = await storage.getUrl("abc123")
      expect(mapping?.visits).toBe(1)
    })
  })
})
