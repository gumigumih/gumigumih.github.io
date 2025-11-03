# このリポジトリのエージェントガイド

スコープ: リポジトリのルート。サブディレクトリに、より具体的な AGENTS.md が存在する場合を除き、すべてのファイルに適用します。

## プロジェクト概要
- 静的サイトは Astro + Tailwind CSS に移行済み。
- Vue（CDN）は削除済み。必要に応じて Astro コンポーネントと軽量なクライアントスクリプトを優先。
- Swiper は CDN ではなく npm（バンドル）で使用。

## 規約
- 変更は最小限・目的集中で、既存のコードスタイルと一貫性を保つ。
- ESM インポートを優先。Astro ファイルからクライアントコードを外部の `<script type="module" src={...}>` として読み込む場合、`?url` でモジュール URL を解決する。
- 実行時パスは絶対パス `/assets/...` を優先し、フェッチ時は `import.meta.env.BASE_URL` を尊重する（例: `articles.json`）。
- ページは `src/pages`、共有 UI は `src/components` に配置。
- 明示的な要望がない限り Vue を再導入しない。

## スタイリング
- Tailwind は `@astrojs/tailwind` により統合。
- グローバル Tailwind エントリ: `src/styles/tailwind.css`。
- リファクタリングの要望がない限り、既存のカスタム CSS は `public/assets/css/style.css` に保持。

## クライアントスクリプト
- クライアントモジュールは `src/scripts/` 配下に置き、外部 `<script>` ソースとして使用する場合は `.astro` から `?url` でインポートする。
- 例: `import articleListSrc from '../scripts/articleList.ts?url'` の後、`<script type="module" src={articleListSrc}></script>`。
- Swiper のようなライブラリ: Astro コンポーネント内で `import 'swiper/css/bundle'`、クライアントモジュール内で `import Swiper from 'swiper/bundle'`。

## データとアセット
- 静的アセット（画像、CSS、JSON、CNAME、サイトマップ）は `public/` 配下に配置。
- 記事データ: `public/articles.json`。クライアントでフェッチする場合は `BASE_URL` を用いて URL を組み立てる。

## リンクとルーティング
- 新規ページは拡張子なしのルート（例: `/works/warimaru`）を使用し、`.html` は使用しない。
- これに合わせて内部リンクを更新する。

## コミットメッセージ
- 説明的かつスコープ付きにする（例: `feat(astro): ...`, `fix(works): ...`）。
- チャットでコミットメッセージを求められた場合は、コピー/ペーストしやすいよう三重バッククォートのコードブロックで返答する。

## 実行とビルド
- 開発: `npm run dev`
- ビルド: `npm run build`（出力先 `dist/`）
- プレビュー: `npm run preview`

## Do / Don’t
- Do: クライアントフレームワークより Astro コンポーネントを優先し、DOM を操作するスクリプトは最小限に保つ。
- Do: アセットパスを `/assets/...` に正規化し、フェッチ時は `BASE_URL` を確認する。
- Don’t: ヘッダー/フッターを重複させない。`SiteHeader` と `SiteFooter` を再利用する。
- Don’t: 明示的な要望がない限り、新しいグローバル CDN を追加しない。
