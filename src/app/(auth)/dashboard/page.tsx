"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { toast } = useToast()
  const [bookingUrl] = useState("https://lessonflow.example.com/book/your-id")

  function copyBookingUrl() {
    navigator.clipboard.writeText(bookingUrl)
    toast({
      title: "コピーしました",
      description: "予約URLをクリップボードにコピーしました",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">LessonFlow</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">山田 太郎</span>
            <Button variant="outline" size="sm">
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* 予約URL */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>あなたの予約ページ</CardTitle>
            <CardDescription>
              このURLをSNSやウェブサイトでシェアして、予約を受け付けましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="flex-1 font-mono text-sm p-3 bg-muted rounded-md">
                {bookingUrl}
              </div>
              <Button size="icon" variant="outline" onClick={copyBookingUrl}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" asChild>
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* レッスン一覧 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">レッスン一覧</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新しいレッスンを作成
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* サンプルレッスンカード */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">英会話レッスン（60分）</CardTitle>
                <Badge>予約可能</Badge>
              </div>
              <CardDescription>
                2024年12月15日 14:00
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">料金</span>
                  <span className="font-semibold">¥3,000</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">定員</span>
                  <span>0 / 1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">英会話レッスン（60分）</CardTitle>
                <Badge variant="secondary">予約済み</Badge>
              </div>
              <CardDescription>
                2024年12月10日 10:00
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">料金</span>
                  <span className="font-semibold">¥3,000</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">定員</span>
                  <span>1 / 1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 新規作成カード */}
          <Card className="border-dashed">
            <CardContent className="flex h-full items-center justify-center p-6">
              <Button variant="ghost" className="h-full w-full flex-col space-y-2">
                <Plus className="h-8 w-8" />
                <span>新しいレッスンを作成</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
