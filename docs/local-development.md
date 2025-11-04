# ローカル開発環境のセットアップ

このドキュメントでは、lesson-flowをローカルで開発・テストするためのセットアップ手順を説明します。

## 前提条件

- Node.js 20以上
- pnpm 10以上
- PostgreSQL（またはSupabaseプロジェクト）

## 環境変数の設定

`.env.local`ファイルをプロジェクトルートに作成し、以下の環境変数を設定します：

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

```

**Stripe Connect送金について**:

lesson-flowはマーケットプレイス型のプラットフォームですが、**開発環境では決済フローのみテスト**します。Stripe Connectによる講師への送金処理は本番環境でのみ動作します。

これにより、開発時に複雑なStripe Connectアカウント設定を行う必要がなくなります。

## Stripe CLI のインストール

### macOS (Homebrew)

```bash
brew install stripe/stripe-cli/stripe
```

### Linux

```bash
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz
tar -xvf stripe_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### Windows (Scoop)

```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

### その他のインストール方法

公式ドキュメントを参照：<https://stripe.com/docs/stripe-cli#install>

## Stripe CLI のログイン

```bash
stripe login
```

ブラウザが開き、Stripeアカウントにログインして認証を完了します。

## ローカルでのWebhookテスト

### 1. 開発サーバーの起動

別のターミナルウィンドウで：

```bash
pnpm dev
```

### 2. Stripe Webhook リスナーの起動

```bash
pnpm stripe:listen
```

このコマンドは以下を実行します：

- StripeからのWebhookイベントをローカルの`http://localhost:3000/api/webhooks/stripe`に転送
- Webhook署名検証用のシークレット（`whsec_...`）を表示

**重要**: 初回実行時に表示される`whsec_...`で始まるWebhookシークレットを`.env.local`の`STRIPE_WEBHOOK_SECRET`に設定してください。

### 3. Webhookイベントのテスト

別のターミナルウィンドウで、テストイベントをトリガーします：

```bash
pnpm stripe:trigger
```

これにより`checkout.session.completed`イベントがローカルのWebhookエンドポイントに送信されます。

### 4. ログの確認

- `pnpm stripe:listen`を実行しているターミナルでStripeからのイベントを確認
- `pnpm dev`を実行しているターミナルでアプリケーションのログを確認

## 実際の決済フローのテスト

### 1. テストカード番号

Stripeのテストモードでは、以下のカード番号を使用できます：

- **成功する決済**: `4242 4242 4242 4242`
- **3Dセキュア認証が必要**: `4000 0027 6000 3184`
- **決済失敗**: `4000 0000 0000 0002`

有効期限：任意の将来の日付（例：`12/34`）
CVC：任意の3桁の数字（例：`123`）
郵便番号：任意の番号

### 2. 決済フローの確認手順

1. アプリケーションでレッスンを選択
2. 生徒情報（名前、メールアドレス）を入力
3. 「予約を確定する（決済ページへ）」をクリック
4. Stripe Checkoutページでテストカード情報を入力
5. 決済を完了
6. 成功ページ（`/success`）にリダイレクトされることを確認
7. Webhookリスナーのログで`checkout.session.completed`イベントを確認
8. データベースで予約（bookings）とレッスンの`isBooked`フラグを確認

## トラブルシューティング

### Webhook署名の検証エラー

```
Webhook signature verification failed
```

**解決方法**:

- `.env.local`の`STRIPE_WEBHOOK_SECRET`が`pnpm stripe:listen`で表示されたシークレットと一致しているか確認
- 開発サーバーを再起動

### Webhookが受信されない

**解決方法**:

- `pnpm stripe:listen`が実行中か確認
- `pnpm dev`が実行中か確認
- `http://localhost:3000`でアプリケーションにアクセスできるか確認

### Instructorに`stripeAccountId`がない

```
Instructor has not completed Stripe onboarding
```

**解決方法**:
データベースで講師（users）レコードに`stripeAccountId`を設定する必要があります。

```sql
UPDATE users
SET stripe_account_id = 'acct_test_...'
WHERE id = 'instructor-id';
```

## 開発ワークフロー

### 1. 新機能の開発

```bash
# 機能ブランチを作成
git checkout -b feat/your-feature

# 開発サーバーを起動
pnpm dev

# Stripe Webhookリスナーを起動（必要な場合）
pnpm stripe:listen
```

### 2. コード品質チェック

```bash
# Lintチェック
pnpm lint

# 型チェック
pnpm type-check

# フォーマットチェック
pnpm format:check

# テスト実行
pnpm test:run

# すべてのチェックを一括実行（CIと同じ）
pnpm ci
```

### 3. データベース操作

```bash
# マイグレーションファイル生成
pnpm db:generate

# マイグレーション適用
pnpm db:push

# Drizzle Studio起動（GUIでデータ確認）
pnpm db:studio
```

## 参考リンク

- [Stripe CLI ドキュメント](https://stripe.com/docs/stripe-cli)
- [Stripe Testing ガイド](https://stripe.com/docs/testing)
- [Next.js App Router ドキュメント](https://nextjs.org/docs/app)
- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)
