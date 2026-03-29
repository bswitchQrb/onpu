# おんぷクイズ

五線譜に表示された音符を、ピアノ鍵盤UIから回答する音楽クイズアプリです。

**本番**: https://onpu.onrender.com/onpu/

## システム構成

```
┌─────────────────────────────────────────────────────────┐
│                      Render                             │
│                                                         │
│  ┌─────────────────┐       ┌──────────────────────┐    │
│  │  Static Site     │       │  Web Service (Docker) │    │
│  │  onpu (React)    │──────>│  onpu-api (Spring)    │    │
│  │                  │ HTTPS │                       │    │
│  │  Port: -         │       │  Port: 8080           │    │
│  └─────────────────┘       └──────────┬─────────────┘    │
│                                       │                  │
└───────────────────────────────────────│──────────────────┘
                                        │ JDBC
                              ┌─────────▼──────────┐
                              │  Supabase           │
                              │  PostgreSQL 16      │
                              │  (ap-northeast-1)   │
                              └────────────────────┘
```

### リポジトリ構成

| リポジトリ | 役割 | デプロイ先 |
|-----------|------|-----------|
| [onpu](https://github.com/bswitchQrb/onpu) | フロントエンド (React SPA) | Render Static Site |
| [onpu-api](https://github.com/bswitchQrb/onpu-api) | バックエンド API (Spring Boot) | Render Web Service |

## 機能

- **ト音記号（鍵盤）モード**: 五線譜に表示された1つの音符を鍵盤から回答
- **ト音記号（3音）モード**: 3音の和音を鍵盤から回答
- **ヘ音記号（鍵盤）モード**: ヘ音記号の音符を鍵盤から回答
- **ヘ音記号（3音）モード**: ヘ音記号の3音和音を鍵盤から回答
- **コードモード**: コード名から構成音を当てるクイズ
- **ユーザー認証**: ログインID/パスワードによるJWT認証
- **成績記録**: 回答履歴・正答率の記録
- **弱点克服**: 苦手な問題を重点的に出題

### 音域

| 記号 | 範囲 | 音数 |
|------|------|------|
| ト音記号（G Clef） | F3〜C6 | 19音 |
| ヘ音記号（F Clef） | C2〜G4 | 19音 |

## 技術スタック

### フロントエンド
- **React 19** + **TypeScript 5.9**
- **Vite 7.3**（ビルドツール）
- **VexFlow 5**（五線譜の描画）

### バックエンド
- **Spring Boot 3.4.4** (Java 17)
- **jOOQ**（型安全SQL）
- **Flyway**（DBマイグレーション）
- **Spring Security** + **JWT**（認証）

### インフラ
- **Render**（ホスティング）
- **Supabase**（PostgreSQL データベース）

## ディレクトリ構成

```
src/
├── main.tsx                     # エントリーポイント
├── index.css                    # グローバルスタイル
├── domain/                      # ドメイン層（ビジネスロジック・型定義）
│   ├── clef.ts                  # 音部記号の型（G Clef / F Clef）
│   ├── note.ts                  # 音符データの型定義（NoteData）
│   ├── chord.ts                 # コード定義
│   └── noteCollection.ts       # 音符データの定義（音域・鍵盤用データ）
├── application/                 # アプリケーション層（ユースケース）
│   └── quizService.ts          # クイズのロジック（出題・シャッフル）
├── infrastructure/              # インフラ層（外部通信）
│   ├── apiClient.ts            # API クライアント（JWT管理）
│   ├── authApi.ts              # 認証 API
│   ├── answerApi.ts            # 回答・成績 API
│   └── questionApi.ts          # 出題 API
├── presentation/                # プレゼンテーション層（UI）
│   ├── App.tsx                  # メインコンポーネント
│   ├── App.css                  # アプリ全体のスタイル
│   ├── AuthContext.tsx          # 認証コンテキスト
│   └── components/
│       ├── Staff.tsx            # 五線譜コンポーネント（VexFlow）
│       ├── PianoKeyboard.tsx    # ピアノ鍵盤コンポーネント
│       └── HamburgerMenu.tsx   # モード切替メニュー
└── i18n/                        # 国際化（i18n）
    ├── index.ts                 # 翻訳関数（t, tClef）
    └── ja.json                  # 日本語テキスト定義
```

### アーキテクチャ（クリーンアーキテクチャ）

- **domain/**: 音楽理論に基づくドメインモデル。UIやフレームワークに依存しない
- **application/**: ドメインを使ったユースケース（クイズ出題ロジック）
- **infrastructure/**: API通信・外部サービスとの接続
- **presentation/**: React コンポーネントとスタイル
- **i18n/**: 表示テキストの一元管理

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 型チェック + ビルド
npm run build

# リント
npm run lint
```

### 環境変数

| 変数名 | 説明 | デフォルト |
|--------|------|-----------|
| `VITE_API_BASE_URL` | バックエンド API の URL | (空文字 = Viteプロキシ使用) |

開発時は Vite のプロキシ (`/api` → `localhost:8080`) を使うため設定不要です。
