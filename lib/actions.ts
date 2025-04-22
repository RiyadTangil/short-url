"use server"

import { storage } from "@/lib/storage"
import { isValidUrl, generateShortCode } from "@/lib/utils"

export async function shortenUrl(originalUrl: string, host: string) {
  // Validate URL
  if (!isValidUrl(originalUrl)) {
    return { error: "Please enter a valid URL" }
  }

  try {
    // Generate a unique short code
    let shortCode = generateShortCode()
    let isUnique = false
    let attempts = 0
    const MAX_ATTEMPTS = 5

    // Ensure the short code is unique
    while (!isUnique && attempts < MAX_ATTEMPTS) {
      const exists = await storage.shortCodeExists(shortCode)
      if (!exists) {
        isUnique = true
      } else {
        shortCode = generateShortCode()
        attempts++
      }
    }

    if (!isUnique) {
      return { error: "Failed to generate a unique short URL. Please try again." }
    }

    // Store the mapping
    await storage.saveUrl(shortCode, originalUrl)

    // Use the provided host to construct the short URL
    const shortUrl = `${host}/s/${shortCode}`
    return { shortUrl }
  } catch (error) {
    console.error("Error shortening URL:", error)
    return { error: "Failed to shorten URL" }
  }
}

export async function getOriginalUrl(shortCode: string) {
  try {
    // Find the URL mapping
    const urlMapping = await storage.getUrl(shortCode)

    if (!urlMapping) {
      return { error: "Short URL not found" }
    }

    // Update visit count
    await storage.incrementVisits(shortCode)

    return { originalUrl: urlMapping.originalUrl }
  } catch (error) {
    console.error("Error retrieving URL:", error)
    return { error: "Failed to retrieve URL" }
  }
}

// For debugging or admin purposes
export async function getAllUrls() {
  try {
    return { urls: await storage.getAllUrls() }
  } catch (error) {
    console.error("Error getting all URLs:", error)
    return { error: "Failed to retrieve URLs" }
  }
}
