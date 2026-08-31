# Contact Form GAS Project

このプロジェクトは、Google フォームの問い合わせフォーム用の Google Apps Script（GAS）プロジェクトです。

## 機能

1. フォーム送信時の自動処理

   - フォームの回答を取得
   - 管理者への通知メール送信
   - 送信者への自動返信メール送信

2. メール送信機能
   - 管理者宛メール（`sendAdminNotification`関数）
   - 自動返信メール（`sendAutoReply`関数）

## セットアップ方法

1. CLASP のインストール

```bash
npm install -g @google/clasp
```

2. Google アカウントへのログイン

```bash
clasp login
```

3. プロジェクトのクローン

```bash
clasp clone [PROJECT_ID]
```

## 開発方法

1. ローカルでコードを編集
2. 変更をアップロード

```bash
clasp push
```

3. 変更を確認

```bash
clasp open
```

## Turnstile連携

1. Cloudflare Turnstileで `meggumi.com` 用のウィジェットを作成する
2. Apps Scriptのプロジェクト設定「スクリプト プロパティ」に、`TURNSTILE_SECRET_KEY` とSecret keyを登録する
3. Webアプリとしてデプロイし、アクセス権を「全員」にする
4. Astroのビルド環境に次を設定する

   - `PUBLIC_TURNSTILE_SITE_KEY`: TurnstileのSite key
   - `PUBLIC_CONTACT_FORM_ENDPOINT`: GAS Webアプリの実行URL（`/exec`）

未設定の場合は既存のGoogleフォーム直送を維持します。設定後はサイトを再ビルドしてください。

## 注意事項

- フォームの項目順序が変更された場合は、`onFormSubmit`関数内のインデックスを適切に更新してください。
- メールアドレスやその他の設定値は、必要に応じて`Code.js`内で更新してください。
