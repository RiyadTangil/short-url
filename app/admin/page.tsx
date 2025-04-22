import { getAllUrls } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminPage() {
  const { urls, error } = await getAllUrls()

  return (
    <main className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>URL Shortener Admin</CardTitle>
          <CardDescription>View all shortened URLs and their statistics</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short Code</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {urls?.map((url) => (
                  <TableRow key={url.shortCode}>
                    <TableCell className="font-medium">{url.shortCode}</TableCell>
                    <TableCell className="max-w-xs truncate">{url.originalUrl}</TableCell>
                    <TableCell>{new Date(url.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{url.visits}</TableCell>
                  </TableRow>
                ))}
                {urls?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No URLs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
