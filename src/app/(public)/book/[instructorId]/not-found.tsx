import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-4xl">講師が見つかりません</CardTitle>
          <CardDescription className="mt-4 text-lg">
            指定された講師IDが存在しないか、無効です
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            URLをご確認いただくか、講師から正しいリンクを受け取ってください。
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              ホームに戻る
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
