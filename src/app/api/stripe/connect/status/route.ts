import { NextResponse } from "next/server"
import { getUser } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { stripe } from "@/lib/stripe"

export async function GET() {
  try {
    // Get authenticated user
    const supabaseUser = await getUser()
    if (!supabaseUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.email, supabaseUser.email!),
    })

    if (!user || !user.stripeAccountId) {
      return NextResponse.json(
        {
          completed: false,
          hasStripeAccount: false,
        },
        { status: 200 }
      )
    }

    // Check Stripe account status
    const account = await stripe.accounts.retrieve(user.stripeAccountId)

    // Check if account can accept payments (charges_enabled means fully onboarded)
    const isFullyOnboarded = account.charges_enabled === true

    // If fully onboarded but onboardingAt not set, update it
    if (isFullyOnboarded && !user.onboardingAt) {
      await db
        .update(users)
        .set({
          onboardingAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
    }

    return NextResponse.json({
      completed: isFullyOnboarded,
      hasStripeAccount: true,
      onboardingAt: user.onboardingAt,
    })
  } catch (error) {
    console.error("Check onboarding status error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
