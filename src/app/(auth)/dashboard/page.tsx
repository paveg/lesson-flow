import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { CreateLessonForm } from "@/components/forms/create-lesson-form"
import { BookingUrlCard } from "@/components/dashboard/booking-url-card"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { getUser } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { users, lessons } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

async function getOrCreateUser(authUser: { email: string; user_metadata?: { name?: string; avatar_url?: string } }) {
  let existingUser = await db.query.users.findFirst({
    where: eq(users.email, authUser.email)
  })

  if (!existingUser) {
    const [newUser] = await db.insert(users).values({
      id: createId(),
      email: authUser.email,
      name: authUser.user_metadata?.name || authUser.email.split('@')[0],
      profileImageUrl: authUser.user_metadata?.avatar_url || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()
    existingUser = newUser
  }

  return existingUser
}

export default async function DashboardPage() {
  const authUser = await getUser()
  if (!authUser) {
    redirect("/login")
  }

  const dbUser = await getOrCreateUser({
    email: authUser.email!,
    user_metadata: authUser.user_metadata
  })

  const instructorLessons = await db.query.lessons.findMany({
    where: eq(lessons.instructorId, dbUser.id),
    orderBy: [desc(lessons.startAt)]
  })

  // Server側でbaseURLを取得
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const bookingUrl = `${protocol}://${host}/book/${dbUser.id}`

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-2xl font-bold">LessonFlow</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{dbUser.name}</span>
            <Button variant="outline" size="sm">
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* 予約URL */}
        <BookingUrlCard bookingUrl={bookingUrl} />

        {/* レッスン一覧 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">レッスン一覧</h2>
          <CreateLessonForm>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新しいレッスンを作成
            </Button>
          </CreateLessonForm>
        </div>

        {instructorLessons.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">レッスンがありません</h3>
              <p className="text-sm text-muted-foreground mb-4">
                最初のレッスンを作成して、生徒の予約を受け付けましょう
              </p>
              <CreateLessonForm>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新しいレッスンを作成
                </Button>
              </CreateLessonForm>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {instructorLessons.map((lesson) => (
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
