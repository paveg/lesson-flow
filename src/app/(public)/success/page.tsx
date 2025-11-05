import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { stripe } from "@/lib/stripe"

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>
}

async function SuccessContent({ searchParams }: SuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  // Validate session_id is provided
  if (!sessionId) {
    redirect("/")
  }

  // Verify the session with Stripe
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Ensure payment was successful
    if (session.payment_status !== "paid") {
      redirect("/")
    }
  } catch (error) {
    console.error("Failed to verify checkout session:", error)
    redirect("/")
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">決済が完了しました！</CardTitle>
          <CardDescription>
            レッスンの予約が確定しました。確認メールを送信しました。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="text-muted-foreground">
              講師から開始時間とミーティングURLが記載されたメールが送信されます。
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">トップページに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function SuccessPage(props: SuccessPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent searchParams={props.searchParams} />
    </Suspense>
  )
}
