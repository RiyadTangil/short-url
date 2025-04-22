"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Copy, Loader2 } from "lucide-react"
import { shortenUrl } from "@/lib/actions"

export default function UrlShortenerForm() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [host, setHost] = useState("")

  // Get the current host when the component mounts
  useEffect(() => {
    // This will run only in the browser
    setHost(window.location.origin)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setShortUrl(null)

    try {
      // Pass the current host to the server action
      const result = await shortenUrl(url, host)
      if (result.error) {
        setError(result.error)
      } else if (result.shortUrl) {
        setShortUrl(result.shortUrl)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL to shorten</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !host}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Short URL"
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shortUrl && (
        <div className="mt-4 space-y-2">
          <Label htmlFor="shortUrl">Your short URL</Label>
          <div className="flex gap-2">
            <Input id="shortUrl" value={shortUrl} readOnly className="flex-1" />
            <Button type="button" size="icon" onClick={copyToClipboard} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
