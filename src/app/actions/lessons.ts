"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { lessons, users } from "@/lib/db/schema"
import { getUser } from "@/lib/supabase-server"
import { eq } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"
import { createLessonSchema } from "@/lib/validations/lesson"

async function getOrCreateUser(authUser: {
  email: string
  user_metadata?: { name?: string; avatar_url?: string }
}) {
  let existingUser = await db.query.users.findFirst({
    where: eq(users.email, authUser.email),
  })

  if (!existingUser) {
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

export async function createLesson(data: unknown) {
  try {
    // 認証チェック
    const user = await getUser()
    if (!user) {
      return { success: false, message: "認証が必要です" }
    }

    // バリデーション
    const validatedData = createLessonSchema.parse(data)

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

    // ダッシュボードページを再検証
    revalidatePath("/dashboard")

    return { success: true, lesson: newLesson }
  } catch (error) {
    console.error("Error creating lesson:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "レッスンの作成に失敗しました",
    }
  }
}
