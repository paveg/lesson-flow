import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LessonList } from "@/components/booking/lesson-list"
import { db } from "@/lib/db"
import { users, lessons } from "@/lib/db/schema"
import { eq, and, gt } from "drizzle-orm"

interface BookingPageProps {
  params: Promise<{
    instructorId: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { instructorId } = await params

  // 講師情報を取得
  const instructor = await db.query.users.findFirst({
    where: eq(users.id, instructorId)
  })

  if (!instructor) {
    notFound()
  }

  // 予約可能なレッスン一覧を取得
  const availableLessons = await db.query.lessons.findMany({
    where: and(
      eq(lessons.instructorId, instructorId),
      eq(lessons.isBooked, false),
      gt(lessons.startAt, new Date())
    ),
    orderBy: (lessons, { desc }) => [desc(lessons.startAt)]
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 講師情報 */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={instructor.profileImageUrl || undefined} alt={instructor.name} />
                <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{instructor.name}</CardTitle>
                <CardDescription>講師のレッスン予約ページ</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* レッスン一覧 */}
      <h2 className="text-2xl font-bold mb-6">予約可能なレッスン</h2>
      <LessonList lessons={availableLessons} />
    </div>
  )
}
