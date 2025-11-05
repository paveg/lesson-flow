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
        { message: "Stripe account not found. Please complete onboarding first." },
        { status: 404 }
      )
    }

    // Get app URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const isProduction = process.env.NODE_ENV === "production"
    if (isProduction && !baseUrl) {
      console.error("NEXT_PUBLIC_APP_URL is not configured in production")
      return NextResponse.json({ message: "Application URL not configured" }, { status: 500 })
    }
    const appUrl = baseUrl || "http://localhost:3000"

    // Create a new account link for the existing Stripe account
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${appUrl}/onboarding`,
      return_url: `${appUrl}/dashboard`,
      type: "account_onboarding",
    })

    // Redirect to Stripe onboarding
    return NextResponse.redirect(accountLink.url)
  } catch (error) {
    console.error("Refresh account link error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
