import Stripe from "stripe"

let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables")
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: "2025-10-29.clover",
      typescript: true,
    })
  }
  return stripeInstance
}

export const stripe = new Proxy({} as Stripe, {
  get: (_, prop) => {
    const stripeClient = getStripe()
    return stripeClient[prop as keyof Stripe]
  },
})

// Helper function to create Stripe Connect account
export async function createConnectAccount(email: string) {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  return account
}

// Helper function to create account link for onboarding
export async function createAccountLink(accountId: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    type: "account_onboarding",
  })

  return accountLink
}

// Helper function to create payment intent
export async function createPaymentIntent(
  amount: number,
  stripeAccountId: string,
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "jpy",
    application_fee_amount: Math.floor(amount * 0.05), // 5% platform fee
    transfer_data: {
      destination: stripeAccountId,
    },
    metadata,
  })

  return paymentIntent
}
