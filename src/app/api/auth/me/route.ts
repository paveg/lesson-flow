import { NextResponse } from "next/server"
import { getUser } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

export async function GET() {
  try {
    // 認証チェック
    const authUser = await getUser()
    if (!authUser) {
      return NextResponse.json({ message: "認証が必要です" }, { status: 401 })
    }

    // DBからユーザー情報を取得または作成
    let dbUser = await db.query.users.findFirst({
      where: eq(users.email, authUser.email!),
    })

    if (!dbUser) {
      // ユーザーが存在しない場合は作成
      const [newUser] = await db
        .insert(users)
        .values({
          id: createId(),
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email!.split("@")[0],
          profileImageUrl: authUser.user_metadata?.avatar_url || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()

      dbUser = newUser
    }

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      profileImageUrl: dbUser.profileImageUrl,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "ユーザー情報の取得に失敗しました" }, { status: 500 })
  }
}
