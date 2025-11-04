"use client"

import { useState } from "react"
import { LessonCard } from "@/components/ui/lesson-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Lesson } from "@/lib/db/schema"

interface LessonListProps {
  lessons: Lesson[]
}

export function LessonList({ lessons }: LessonListProps) {
  const { toast } = useToast()
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
  }

  const handleBack = () => {
    setSelectedLesson(null)
    setStudentName("")
    setStudentEmail("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedLesson) return

    if (!studentName.trim() || !studentEmail.trim()) {
      toast({
        title: "入力エラー",
        description: "名前とメールアドレスを入力してください",
        variant: "destructive",
      })
      return
    }

    // TODO: 次のフェーズで決済処理を実装
    toast({
      title: "予約機能は準備中です",
      description: "決済機能の実装後に予約できるようになります",
    })
  }

  if (!selectedLesson) {
    if (lessons.length === 0) {
      return (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            現在予約可能なレッスンはありません
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} onSelect={handleLessonSelect} />
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" className="mb-4" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        レッスン一覧に戻る
      </Button>

      <div className="space-y-6">
        {/* 選択されたレッスンの詳細 */}
        <div>
          <h2 className="mb-4 text-2xl font-bold">選択されたレッスン</h2>
          <LessonCard lesson={selectedLesson} showBookButton={false} />
        </div>

        {/* 生徒情報入力フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>予約者情報</CardTitle>
            <CardDescription>レッスンを予約するために情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="山田 太郎"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                予約を確定する（決済ページへ）
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
