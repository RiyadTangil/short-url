import UrlShortenerForm from "@/components/url-shortener-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>URL Shortener</CardTitle>
          <CardDescription>Enter a long URL to generate a shorter version</CardDescription>
        </CardHeader>
        <CardContent>
          <UrlShortenerForm />
        </CardContent>
      </Card>
    </main>
  )
}
