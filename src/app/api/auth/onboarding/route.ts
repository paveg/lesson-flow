import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { stripe } from "@/lib/stripe"
import { isValidEmail } from "@/lib/utils/validation"

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabaseUser = await getUser()
    if (!supabaseUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 })
    }

    const email = supabaseUser.email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 })
    }

    // Check if user already exists in database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    // If user already has Stripe account and completed onboarding, redirect to refresh
    if (existingUser?.stripeAccountId && existingUser?.onboardingAt) {
      return NextResponse.json({ message: "Onboarding already completed" }, { status: 400 })
    }

    let stripeAccountId = existingUser?.stripeAccountId

    // Create Stripe Connect account if doesn't exist
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "standard",
        country: "JP",
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      })
      stripeAccountId = account.id
    }

    // Update or create user in database
    if (existingUser) {
      await db
        .update(users)
        .set({
          name: name.trim(),
          stripeAccountId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
    } else {
      await db.insert(users).values({
        id: supabaseUser.id,
        email,
        name: name.trim(),
        stripeAccountId,
      })
    }

    // Get app URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const isProduction = process.env.NODE_ENV === "production"
    if (isProduction && !baseUrl) {
      console.error("NEXT_PUBLIC_APP_URL is not configured in production")
      return NextResponse.json({ message: "Application URL not configured" }, { status: 500 })
    }
    const appUrl = baseUrl || "http://localhost:3000"

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${appUrl}/onboarding`,
      return_url: `${appUrl}/dashboard`,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
