# ストア公開用画像資材

Chrome Web Store と Microsoft Edge Add-ons に公開するために必要な画像資材です。

## 📁 ディレクトリ構成

```
store-assets/
├── icons/              # ストア用アイコン
├── screenshots/        # スクリーンショット
├── promotional/        # プロモーション画像
└── README.md           # このファイル
```

---

## 🎨 Chrome Web Store 必要資材

### 必須

| 種類           | サイズ     | ファイル名          | 説明                                 |
| -------------- | ---------- | ------------------- | ------------------------------------ |
| ストアアイコン | 128x128 px | `icons/icon128.png` | ※既存の icons/icon128.png を使用可能 |

### 推奨

| 種類                     | サイズ                        | ファイル名                     | 説明                               |
| ------------------------ | ----------------------------- | ------------------------------ | ---------------------------------- |
| スクリーンショット       | 1280x800 px または 640x400 px | `screenshots/screenshot-*.png` | 最大 5 枚。実際の動作画面          |
| プロモーション画像（小） | 440x280 px                    | `promotional/promo-small.png`  | ストア検索結果に表示               |
| プロモーション画像（大） | 1400x560 px                   | `promotional/promo-large.png`  | 注目の拡張機能に表示（オプション） |

---

## 🔷 Microsoft Edge Add-ons 必要資材

### 必須

| 種類       | サイズ     | ファイル名                 | 説明                          |
| ---------- | ---------- | -------------------------- | ----------------------------- |
| ストアロゴ | 300x300 px | `icons/store-logo-300.png` | Edge ストア用の大きいアイコン |

### 推奨

| 種類               | サイズ      | ファイル名                     | 説明              |
| ------------------ | ----------- | ------------------------------ | ----------------- |
| スクリーンショット | 1280x800 px | `screenshots/screenshot-*.png` | 最大 10 枚        |
| プロモーション画像 | 1400x560 px | `promotional/promo-large.png`  | Chrome と共用可能 |

---

## 📝 画像作成ガイドライン

### アイコン

- 背景は透明または単色
- シンプルで認識しやすいデザイン
- 小さいサイズでも視認性を確保

### スクリーンショット

- 実際の動作画面をキャプチャ
- 機能がわかりやすい場面を選ぶ
- 個人情報は必ずモザイク処理

### プロモーション画像

- 拡張機能の名前とアイコンを含める
- 主要機能を簡潔にアピール
- テキストは読みやすいサイズで

---

## 🛠️ 画像作成ツール

- **Figma** (無料): https://www.figma.com/
- **Canva** (無料): https://www.canva.com/
- **GIMP** (無料): https://www.gimp.org/

---

## 📤 公開手順

### Chrome Web Store

1. https://chrome.google.com/webstore/devconsole にアクセス
2. デベロッパー登録（初回のみ $5）
3. 「新しいアイテム」→ ZIP ファイルをアップロード
4. 画像資材とストア情報を入力
5. 審査を申請

### Microsoft Edge Add-ons

1. https://partner.microsoft.com/dashboard にアクセス
2. Microsoft アカウントでサインイン（無料）
3. 「新しい拡張機能」→ ZIP ファイルをアップロード
4. 画像資材とストア情報を入力
5. 審査を申請

---

## ✅ チェックリスト

- [ ] icons/store-logo-300.png (300x300) - Edge 用
- [ ] screenshots/screenshot-01.png (1280x800)
- [ ] screenshots/screenshot-02.png (1280x800) - オプション
- [ ] promotional/promo-small.png (440x280) - Chrome 用
- [ ] promotional/promo-large.png (1400x560) - オプション

---

# アップロード時の入力

## Chrome Web Store

### 単一用途

Q: 拡張機能の用途は、単一で範囲の限られたわかりやすいものである必要があります。

A: この拡張機能は、AkamaiのPragmaデバッグヘッダーをHTTPリクエストに付与するという単一の機能のみを提供します。開発者がAkamai CDNのキャッシュ動作をデバッグする際に使用します。

## 権限が必要な理由

権限は、「activeTab」などの所定の文字列のリスト、または 1 つ以上のホストにアクセスを許可するマッチパターンのいずれかです。
拡張機能の単一用途に不要な権限はすべて削除してください。不要な権限をリクエストした場合、このバージョンは不承認となります。

### declarativeNetRequest

Q: declarativeNetRequest が必要な理由

A: すべてのHTTPリクエストにAkamaiのPragmaデバッグヘッダー（例: akamai-x-cache-on, akamai-x-get-cache-key）を付与するために使用します。ユーザーがONにした場合のみ、リクエストヘッダーを変更します。

### storage

Q: storage が必要な理由

A: ユーザーのON/OFF設定、選択したヘッダーの種類、言語設定をブラウザ内に保存・読み込みするために使用します。chrome.storage.local APIを使用して設定を永続化します。

### ホスト権限 (`<all_urls>`)

Q: ホスト権限が必要な理由

A: Akamai CDNは様々なドメインで使用されるため、ユーザーがアクセスするすべてのURLに対してPragmaデバッグヘッダーを付与できる必要があります。特定のドメインに限定するとデバッグ機能の有用性が大幅に低下します。OFFの場合は一切のリクエスト変更は行いません。

## リモートコード を使用していますか？

Q: リモートコード を使用していますか？

A: いいえ。

## 販売地域

- 決済方法: 料金なし
- 公開設定: 公開
- 販売地域: すべての地域

---

# For Edge Addons (Partner Center)

Edge Addons にはパートーナーセンターから登録する。
https://partner.microsoft.com/en-us/dashboard/

申請直前に以下の警告が出る。

Q: Notes for certification (less than 2,000 characters)Learn More
Provide any info that testers need to understand and use this extension. Customers won't see this info.

A: This extension injects Akamai Pragma debug headers into HTTP requests to help developers debug Akamai CDN cache behavior.

FUNCTIONALITY:

- Toggle ON/OFF to enable/disable debug header injection
- Select specific debug headers to inject (e.g., akamai-x-cache-on, akamai-x-get-cache-key)
- View Akamai debug response headers in browser DevTools Network panel

TESTING:

- Install extension and click the icon to open popup
- Enable the toggle and select desired headers
- Visit any website behind Akamai CDN
- Open DevTools (F12) → Network tab → check response headers for X-Cache, X-Cache-Key, etc.

PERMISSIONS USED:

- declarativeNetRequest: Add Pragma headers to outgoing requests
- storage: Save user preferences (ON/OFF state, selected headers, language)
- host_permissions (<all_urls>): Akamai CDN is used across many domains, so all URLs need to be covered

NO remote code is loaded. All JavaScript is bundled within the extension package.
