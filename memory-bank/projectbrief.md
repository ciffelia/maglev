# プロジェクト概要 (Project Brief)

## プロジェクト名
Magrev

## 概要
Magrevは、Cloudflare Workersを利用したフルスタックウェブアプリケーションです。ReactフロントエンドとHonoバックエンド、Cloudflare D1データベースを組み合わせた構成になっています。

## 主要目標
現時点では明確な目標は定義されていませんが、Cloudflare Workersプラットフォーム上でのフルスタックアプリケーション開発の基盤として機能します。

## 技術スタック
- **フロントエンド**: React 19, Vite
- **バックエンド**: Cloudflare Workers, Hono
- **データベース**: Cloudflare D1 (SQLite), Drizzle ORM
- **開発ツール**: TypeScript, ESLint, Prettier
- **デプロイ**: Wrangler (Cloudflare Workers CLI)

## リポジトリ情報
- GitHub: https://github.com/ciffelia/magrev
- CI: GitHub Actions

## 現在の状態
基本的なスケルトンアプリケーションが実装されており、以下の機能が含まれています：
- シンプルなReactフロントエンド（カウンター機能とAPIリクエスト機能）
- 基本的なAPIエンドポイント（/api/ping, /api/user）
- usersテーブルを持つデータベース構造

## 次のステップ
プロジェクトの具体的な目的と機能要件を定義し、それに基づいて開発を進める必要があります。
