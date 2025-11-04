"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, ExternalLink } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { CreateLessonForm } from "@/components/forms/create-lesson-form"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import type { Lesson } from "@/lib/db/schema"

export default function DashboardPage() {
  const { toast } = useToast()
  const [bookingUrl] = useState("https://lessonflow.example.com/book/your-id")
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLessons = useCallback(async () => {
    try {
      const response = await fetch("/api/lessons")
      if (!response.ok) {
        throw new Error("レッスンの取得に失敗しました")
      }
      const data = await response.json()
      setLessons(data)
    } catch (error) {
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "レッスンの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

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
          <CreateLessonForm onSuccess={fetchLessons}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新しいレッスンを作成
            </Button>
          </CreateLessonForm>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">レッスンがありません</h3>
              <p className="text-sm text-muted-foreground mb-4">
                最初のレッスンを作成して、生徒の予約を受け付けましょう
              </p>
              <CreateLessonForm onSuccess={fetchLessons}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新しいレッスンを作成
                </Button>
              </CreateLessonForm>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <Badge variant={lesson.isBooked ? "secondary" : "default"}>
                      {lesson.isBooked ? "予約済み" : "予約可能"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {format(new Date(lesson.startAt), "yyyy年MM月dd日 HH:mm", { locale: ja })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lesson.description && (
                      <>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lesson.description}
                        </p>
                        <Separator />
                      </>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">料金</span>
                      <span className="font-semibold">¥{lesson.price.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">定員</span>
                      <span>{lesson.isBooked ? lesson.maxStudents : 0} / {lesson.maxStudents}</span>
                    </div>
                    {lesson.durationMinutes && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">時間</span>
                          <span>{lesson.durationMinutes}分</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
