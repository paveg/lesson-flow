import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/layouts/header"
import { Footer } from "@/components/layouts/footer"
import Link from "next/link"
import { Clock, Sparkles, CreditCard } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <section className="py-20 text-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                3分で始める
                <br />
                <span className="text-primary">最も美しい予約システム</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground">
                オンラインレッスンの予約管理をシンプルに。 手数料は業界最安クラス。
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">無料で始める</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">デモを見る</Link>
                </Button>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="grid gap-8 py-20 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">3分でスタート</h3>
                <p className="text-muted-foreground">
                  複雑な設定は不要。メールアドレスだけで今すぐ始められます。
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">美しいデザイン</h3>
                <p className="text-muted-foreground">
                  プロがデザインした予約ページで、信頼感のある印象を。
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">安心の決済</h3>
                <p className="text-muted-foreground">Stripeによる安全な決済。手数料も明瞭です。</p>
              </Card>
            </section>

            {/* Pricing Section */}
            <section className="py-20">
              <h2 className="mb-12 text-center text-3xl font-bold">シンプルな料金プラン</h2>
              <div className="mx-auto max-w-lg">
                <Card className="p-8">
                  <div className="text-center">
                    <h3 className="mb-2 text-2xl font-bold">スタンダード</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">5%</span>
                      <span className="ml-2 text-muted-foreground">の手数料のみ</span>
                    </div>
                    <p className="mb-8 text-muted-foreground">
                      月額固定費なし。売上の5%のみの明瞭な料金体系。
                    </p>
                    <ul className="mb-8 space-y-3 text-left">
                      <li className="flex items-center">
                        <span className="mr-2 text-primary">✓</span>
                        無制限のレッスン作成
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-primary">✓</span>
                        Stripe決済対応
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-primary">✓</span>
                        自動メール通知
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-primary">✓</span>
                        美しい予約ページ
                      </li>
                    </ul>
                    <Button asChild className="w-full" size="lg">
                      <Link href="/login">今すぐ始める</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
