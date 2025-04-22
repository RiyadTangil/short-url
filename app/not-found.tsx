import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - URL Not Found</h1>
      <p className="text-lg mb-6">The short URL you're looking for doesn't exist or has expired.</p>
      <Button asChild>
        <Link href="/">Create a New Short URL</Link>
      </Button>
    </div>
  )
}
