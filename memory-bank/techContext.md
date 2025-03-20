# 技術コンテキスト (Tech Context)

## 使用技術の概要

Magrevプロジェクトは、最新のウェブ開発技術を活用したフルスタックアプリケーションです。以下に主要な技術スタックを示します。

### フロントエンド
- **React 19**: UIコンポーネントライブラリ
- **Vite**: 高速な開発サーバーとビルドツール
- **TypeScript**: 型安全なJavaScriptスーパーセット
- **CSS**: スタイリング

### バックエンド
- **Cloudflare Workers**: エッジコンピューティングプラットフォーム
- **Hono**: 軽量なWebフレームワーク
- **TypeScript**: 型安全なコード開発

### データベース
- **Cloudflare D1**: エッジに分散されたSQLiteデータベース
- **Drizzle ORM**: TypeScript向けのSQLツールキット

### 開発ツール
- **pnpm**: 高速なパッケージマネージャー
- **ESLint**: コード品質ツール
- **Prettier**: コードフォーマッター
- **Wrangler**: Cloudflare Workersの開発・デプロイツール
- **GitHub Actions**: CI/CDパイプライン

## 開発環境のセットアップ

### 前提条件
- Node.js
- pnpm

### 開発サーバーの起動
```sh
# 開発サーバーの起動
pnpm run dev
```

### Cloudflare Worker型定義の生成
```sh
# Cloudflare Worker型定義の生成
pnpm run cf-typegen
```

### マイグレーション
```sh
# マイグレーションファイルの生成
pnpm run migration:generate

# ローカル環境へのマイグレーション適用
pnpm run migration:apply:local

# 本番環境へのマイグレーション適用
pnpm run migration:apply:remote
```

### リンティングと型チェック
```sh
# 型チェック
pnpm run typecheck

# リンティング
pnpm run lint

# 自動修正
pnpm run fix
```

### ビルドとデプロイ
```sh
# 本番用ビルド
pnpm run build

# ビルド結果のプレビュー
pnpm run preview

# Cloudflareへのデプロイ
pnpm run deploy
```

## 技術的制約

### Cloudflare Workers
- 実行時間の制限（CPU時間）
- メモリ使用量の制限
- ストレージの制約（D1データベースの容量制限）

### フロントエンド
- ブラウザの互換性への配慮
- バンドルサイズの最適化

### 開発プロセス
- TypeScriptの厳格な型チェック
- ESLintとPrettierによるコード品質の維持

## 依存関係

### 本番依存関係
- `drizzle-orm`: ^0.40.1 - SQLデータベース操作用ORM
- `hono`: ^4.7.4 - バックエンドWebフレームワーク
- `react`: ^19.0.0 - UIライブラリ
- `react-dom`: ^19.0.0 - DOMレンダリング

### 開発依存関係
- `@cloudflare/vite-plugin`: ^0.1.12 - CloudflareとViteの統合
- `@cloudflare/workers-types`: ^4.20250317.0 - Workersの型定義
- `@vitejs/plugin-react-swc`: ^3.5.0 - SWCを使用したReactの高速コンパイル
- `drizzle-kit`: ^0.30.5 - Drizzle ORMのマイグレーションツール
- `eslint`: ^9.17.0 - コード品質チェック
- `prettier`: 3.5.3 - コードフォーマッター
- `typescript`: ~5.8.2 - 型チェックとコンパイル
- `vite`: ^6.0.5 - 開発サーバーとビルドツール
- `wrangler`: ^4.1.0 - Cloudflare Workersの開発・デプロイツール

## ファイル構造

```
/
├── migrations/               # データベースマイグレーションファイル
│   ├── 0000_yummy_rictor.sql # 初期マイグレーション
│   └── meta/                 # マイグレーションメタデータ
├── public/                   # 静的アセット
├── src/
│   ├── backend/              # バックエンドコード
│   │   ├── index.ts          # バックエンドエントリーポイント
│   │   └── db/               # データベース関連
│   │       └── schema.ts     # データベーススキーマ定義
│   └── frontend/             # フロントエンドコード
│       ├── app.css           # アプリケーションスタイル
│       ├── app.tsx           # メインアプリケーションコンポーネント
│       ├── index.css         # グローバルスタイル
│       ├── main.tsx          # フロントエンドエントリーポイント
│       └── assets/           # フロントエンドアセット
├── index.html                # HTMLエントリーポイント
├── package.json              # プロジェクト設定と依存関係
├── tsconfig.json             # TypeScript設定
├── vite.config.ts            # Vite設定
└── wrangler.jsonc            # Cloudflare Workers設定
```

## 開発ワークフロー

1. 機能要件の定義
2. ローカル開発環境での実装（`pnpm run dev`）
3. 必要に応じてデータベーススキーマの更新とマイグレーション
4. コードの品質チェック（`pnpm run typecheck`, `pnpm run lint`）
5. ビルドとローカルでのテスト（`pnpm run build`, `pnpm run preview`）
6. Cloudflareへのデプロイ（`pnpm run deploy`）
7. 必要に応じて本番データベースへのマイグレーション適用

## 技術的な注意点

1. Cloudflare Workersの実行制限を考慮したコード設計
2. D1データベースのパフォーマンス特性の理解
3. フロントエンドとバックエンドの型の一貫性の維持
4. エッジコンピューティングの特性を活かした設計
