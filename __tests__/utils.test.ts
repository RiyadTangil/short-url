import { isValidUrl, generateShortCode } from "@/lib/utils"
import { describe, expect, test } from "vitest"

describe("URL Shortener Utils", () => {
  describe("isValidUrl", () => {
    test("should return true for valid URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true)
      expect(isValidUrl("http://localhost:3000")).toBe(true)
      expect(isValidUrl("https://sub.domain.co.uk/path?query=string")).toBe(true)
    })

    test("should return false for invalid URLs", () => {
      expect(isValidUrl("not-a-url")).toBe(false)
      // expect(isValidUrl("http:/example.com")).toBe(false)
      expect(isValidUrl("")).toBe(false)
    })
  })

  describe("generateShortCode", () => {
    test("should generate a string of the specified length", () => {
      expect(generateShortCode(6).length).toBe(6)
      expect(generateShortCode(8).length).toBe(8)
      expect(generateShortCode(10).length).toBe(10)
    })

    test("should generate different codes on each call", () => {
      const code1 = generateShortCode()
      const code2 = generateShortCode()
      expect(code1).not.toBe(code2)
    })

    test("should only contain alphanumeric characters", () => {
      const code = generateShortCode(20)
      expect(code).toMatch(/^[A-Za-z0-9]+$/)
    })
  })
})
