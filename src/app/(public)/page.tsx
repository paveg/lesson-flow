import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/layouts/header"
import { Footer } from "@/components/layouts/footer"
import Link from "next/link"
import { Clock, Sparkles, CreditCard } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <section className="py-20 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                3分で始める<br />
                <span className="text-primary">最も美しい予約システム</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                オンラインレッスンの予約管理をシンプルに。
                手数料は業界最安クラス。
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/login">無料で始める</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">デモを見る</Link>
                </Button>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 grid md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">3分でスタート</h3>
                <p className="text-muted-foreground">
                  複雑な設定は不要。メールアドレスだけで今すぐ始められます。
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">美しいデザイン</h3>
                <p className="text-muted-foreground">
                  プロがデザインした予約ページで、信頼感のある印象を。
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">安心の決済</h3>
                <p className="text-muted-foreground">
                  Stripeによる安全な決済。手数料も明瞭です。
                </p>
              </Card>
            </section>

            {/* Pricing Section */}
            <section className="py-20">
              <h2 className="text-3xl font-bold text-center mb-12">
                シンプルな料金プラン
              </h2>
              <div className="max-w-lg mx-auto">
                <Card className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">スタンダード</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">5%</span>
                      <span className="text-muted-foreground ml-2">の手数料のみ</span>
                    </div>
                    <p className="text-muted-foreground mb-8">
                      月額固定費なし。売上の5%のみの明瞭な料金体系。
                    </p>
                    <ul className="text-left space-y-3 mb-8">
                      <li className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        無制限のレッスン作成
                      </li>
                      <li className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        Stripe決済対応
                      </li>
                      <li className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        自動メール通知
                      </li>
                      <li className="flex items-center">
                        <span className="text-primary mr-2">✓</span>
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
