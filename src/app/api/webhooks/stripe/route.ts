import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"
import { bookings, lessons } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ message: "Missing stripe-signature header" }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ message: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const { lessonId, studentName, studentEmail } = session.metadata || {}

      if (!lessonId || !studentName || !studentEmail) {
        console.error("Missing metadata in checkout session", session.id)
        return NextResponse.json({ message: "Missing metadata" }, { status: 400 })
      }

      const paymentIntentId = session.payment_intent as string

      if (!paymentIntentId) {
        console.error("Missing payment_intent in checkout session", session.id)
        return NextResponse.json({ message: "Missing payment_intent" }, { status: 400 })
      }

      // Use transaction to prevent race conditions
      await db.transaction(async (tx) => {
        // Check lesson exists and is available within transaction
        const lesson = await tx.query.lessons.findFirst({
          where: eq(lessons.id, lessonId),
        })

        if (!lesson) {
          throw new Error(`Lesson not found: ${lessonId}`)
        }

        if (lesson.isBooked) {
          console.warn("Lesson already booked:", lessonId)
          // Return gracefully - this is idempotent webhook handling
          return
        }

        // Create booking and mark lesson as booked atomically
        await tx.insert(bookings).values({
          lessonId,
          studentName,
          studentEmail,
          paymentIntentId,
          amount: lesson.price,
          status: "confirmed",
        })

        await tx.update(lessons).set({ isBooked: true }).where(eq(lessons.id, lessonId))
      })

      console.log(`Booking created for lesson ${lessonId}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ message: "Webhook processing error" }, { status: 500 })
  }
}
