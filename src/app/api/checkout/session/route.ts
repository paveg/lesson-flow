import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { lessons, users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lessonId, studentName, studentEmail } = body

    if (!lessonId || !studentName || !studentEmail) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
    })

    if (!lesson) {
      return NextResponse.json({ message: "Lesson not found" }, { status: 404 })
    }

    if (lesson.isBooked) {
      return NextResponse.json({ message: "Lesson already booked" }, { status: 400 })
    }

    const instructor = await db.query.users.findFirst({
      where: eq(users.id, lesson.instructorId),
    })

    if (!instructor) {
      return NextResponse.json({ message: "Instructor not found" }, { status: 404 })
    }

    if (!instructor.stripeAccountId) {
      return NextResponse.json(
        { message: "Instructor has not completed Stripe onboarding" },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            unit_amount: lesson.price,
            product_data: {
              name: lesson.title,
              description: lesson.description || undefined,
              metadata: {
                lessonId: lesson.id,
                instructorId: instructor.id,
                instructorName: instructor.name,
              },
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.floor(lesson.price * 0.05),
        transfer_data: {
          destination: instructor.stripeAccountId,
        },
        metadata: {
          lessonId: lesson.id,
          instructorId: instructor.id,
          studentName,
          studentEmail,
        },
      },
      customer_email: studentEmail,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/book/${instructor.id}`,
      metadata: {
        lessonId: lesson.id,
        instructorId: instructor.id,
        studentName,
        studentEmail,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
