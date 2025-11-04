import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // 講師情報を取得
    const instructor = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    if (!instructor) {
      return NextResponse.json({ message: "講師が見つかりません" }, { status: 404 })
    }

    // 公開情報のみを返す
    const publicInstructor = {
      id: instructor.id,
      name: instructor.name,
      profileImageUrl: instructor.profileImageUrl,
      email: instructor.email,
    }

    return NextResponse.json(publicInstructor)
  } catch (error) {
    console.error("Error fetching instructor:", error)
    return NextResponse.json({ message: "講師情報の取得に失敗しました" }, { status: 500 })
  }
}
