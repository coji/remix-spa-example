# React Router v7 SPA Example

これは [React Router v7](https://reactrouter.com/en/main) を使用した、Firebase をバックエンドに持つ Web アプリケーションのサンプルプロジェクトです。ユーザーが文章を書き散らすことができるシンプルなサービスを実装しています。

[![Deploy to Firebase Hosting on merge](https://github.com/coji/remix-spa-example/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/coji/remix-spa-example/actions/workflows/firebase-hosting-merge.yml)

## 技術スタック

### フロントエンド

- [React Router v7](https://reactrouter.com/en/main)
- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

### バックエンド

- [Firebase](https://firebase.google.com)
  - Authentication (Google認証)
  - Firestore
  - Hosting

### 開発ツール

- [Vite](https://vitejs.dev)
- [pnpm](https://pnpm.io)
- [Biome](https://biomejs.dev)
- [Prettier](https://prettier.io)

## 主な機能

- Google認証によるユーザー認証
- 記事の作成・編集・削除
- Markdownによる記事作成
- レスポンシブデザイン
- ダークモード対応

## 開発環境のセットアップ

### 必要条件

- Node.js v18以上
- pnpm
- Firebase CLIツール

### インストール手順

1. リポジトリのクローン:

```bash
git clone https://github.com/yourusername/remix-spa-example.git
cd remix-spa-example
```

2. 依存関係のインストール:

```bash
pnpm install
```

3. 環境変数の設定:

```bash
cp .env.example .env
```

`.env`ファイルを編集し、必要な環境変数を設定してください:

- `VITE_GOOGLE_CLIENT_ID`: GoogleのOAuth クライアントID

4. 開発サーバーの起動:

```bash
pnpm dev
```

## デプロイ

このプロジェクトはFirebase Hostingを使用してデプロイします。

1. Firebase CLIのインストール:

```bash
npm install -g firebase-tools
```

2. Firebaseにログイン:

```bash
firebase login
```

3. プロジェクトの初期化:

```bash
firebase init
```

4. ビルドとデプロイ:

```bash
pnpm build
firebase deploy
```

## 利用可能なスクリプト

- `pnpm dev`: 開発サーバーの起動
- `pnpm build`: プロダクションビルドの作成
- `pnpm preview`: ビルドしたアプリケーションのプレビュー
- `pnpm lint`: Biomeを使用したコードの検証
- `pnpm format`: Prettierを使用したコードのフォーマット
- `pnpm typecheck`: TypeScriptの型チェック
- `pnpm validate`: lint、format、typecheckの実行
- `pnpm start`: ビルドしたアプリケーションの起動

## プロジェクトの特徴

- **React Router v7**: 最新のReact Router v7を使用し、型安全なルーティングを実現
- **Data Loaders**: React Router v7のデータローダーを活用した効率的なデータフェッチング
- **型安全なルーティング**: `remix-routes`を使用した型安全なルート生成

## プロジェクト構造

```
├── app/                    # アプリケーションのソースコード
│   ├── components/        # Reactコンポーネント
│   ├── routes/           # ルーティング
│   ├── services/         # サービスレイヤー
│   ├── models/           # データモデル
│   └── styles/           # グローバルスタイル
├── public/               # 静的ファイル
└── firebase/            # Firebase設定
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 謝辞

このプロジェクトは[しずかなインターネット](https://sizu.me)のUIデザインを参考にさせていただいています。
