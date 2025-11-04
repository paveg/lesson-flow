import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { lessons, users } from "@/lib/db/schema"
import { createLessonSchema } from "@/lib/validations/lesson"
import { getUser } from "@/lib/supabase-server"
import { eq, desc, and, gt } from "drizzle-orm"
import { z } from "zod"
import { createId } from "@paralleldrive/cuid2"

// ユーザーを取得または作成するヘルパー関数
async function getOrCreateUser(authUser: {
  email: string
  user_metadata?: { name?: string; avatar_url?: string }
}) {
  let existingUser = await db.query.users.findFirst({
    where: eq(users.email, authUser.email),
  })

  if (!existingUser) {
    // ユーザーが存在しない場合は作成
    const [newUser] = await db
      .insert(users)
      .values({
        id: createId(),
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split("@")[0],
        profileImageUrl: authUser.user_metadata?.avatar_url || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    existingUser = newUser
  }

  return existingUser
}

export async function POST(request: Request) {
  try {
    // 認証チェック
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
    }

    // リクエストボディを取得
    const body = await request.json()

    // バリデーション
    const validatedData = createLessonSchema.parse({
      ...body,
      startAt: new Date(body.startAt),
    })

    // ユーザーを取得または作成
    const dbUser = await getOrCreateUser({
      email: user.email!,
      user_metadata: user.user_metadata,
    })

    // レッスンを作成
    const [newLesson] = await db
      .insert(lessons)
      .values({
        instructorId: dbUser.id,
        title: validatedData.title,
        description: validatedData.description || null,
        price: validatedData.price,
        durationMinutes: validatedData.durationMinutes,
        startAt: validatedData.startAt,
        meetingUrl: validatedData.meetingUrl || null,
        maxStudents: validatedData.maxStudents,
      })
      .returning()

    return NextResponse.json(newLesson, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "バリデーションエラー", errors: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating lesson:", error)
    return NextResponse.json({ message: "レッスンの作成に失敗しました" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get("instructorId")

    // instructorIdが指定されている場合は、公開予約ページ用（認証不要）
    if (instructorId) {
      const availableLessons = await db.query.lessons.findMany({
        where: and(
          eq(lessons.instructorId, instructorId),
          eq(lessons.isBooked, false),
          gt(lessons.startAt, new Date()) // 未来のレッスンのみ
        ),
        orderBy: [desc(lessons.startAt)],
      })

      return NextResponse.json(availableLessons)
    }

    // instructorIdがない場合は、ダッシュボード用（認証必要）
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
    }

    // ユーザーを取得または作成
    const dbUser = await getOrCreateUser({
      email: user.email!,
      user_metadata: user.user_metadata,
    })

    // インストラクターのレッスン一覧を取得（新しい順）
    const instructorLessons = await db.query.lessons.findMany({
      where: eq(lessons.instructorId, dbUser.id),
      orderBy: [desc(lessons.startAt)],
    })

    return NextResponse.json(instructorLessons)
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return NextResponse.json({ message: "レッスンの取得に失敗しました" }, { status: 500 })
  }
}
