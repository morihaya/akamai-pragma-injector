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

# アップロード時の入力

## Chrome Web Store

### 単一用途

Q: 拡張機能の用途は、単一で範囲の限られたわかりやすいものである必要があります。

A: この拡張機能は、勤怠システム「リシテア」の勤務計画入力画面において、休日・休暇区分で「休日」を選択した際に、同じ行の時刻入力欄（出勤・退勤・休憩時間）を自動的にクリアする単一の機能のみを提供します。

## 権限が必要な理由

権限は、「activeTab」などの所定の文字列のリスト、または 1 つ以上のホストにアクセスを許可するマッチパターンのいずれかです。
拡張機能の単一用途に不要な権限はすべて削除してください。不要な権限をリクエストした場合、このバージョンは不承認となります。

### storage

Q: storage が必要な理由

A: ユーザーがオプションページで設定したカスタム値（対象 URL パターン、デフォルトの出勤・退勤・休憩時間）を保存・読み込みするために使用します。chrome.storage.sync API を使用して設定を保存し、content script で読み込んで動作に反映します。

### tabs

Q: tabs が必要な理由

A: オプションページで設定が保存された際に、既に開いているリシテアのタブに設定変更を通知し、ページをリロードせずに新しい設定を反映させるために使用します。chrome.tabs.query と chrome.tabs.sendMessage で対象タブにメッセージを送信します。

### ホスト権限

Q: ホスト権限が必要な理由

A: リシテア勤怠システムの Web ページ上で Content Script を実行し、勤務計画入力画面の休日・休暇区分セレクトボックスの変更を監視して時刻入力欄を自動クリア・自動入力するために必要です。対象 URL はユーザーがオプションページでカスタマイズ可能です。

## リモートコード を使用していますか？

Q: リモートコード を使用していますか？

A: いいえ。

## 販売地域

- 決済方法: 料金なし
- 公開設定: 限定公開
- 販売地域: 日本（のみ選択）

---

# For Edge Addons (Partner Center)

Edge Addons にはパートーナーセンターから登録する。
https://partner.microsoft.com/en-us/dashboard/

申請直前に以下の警告が出る。

Q: Notes for certification (less than 2,000 characters)Learn More
Provide any info that testers need to understand and use this extension. Customers won’t see this info.

A: This extension is designed for "Lysithea", a specific attendance management system used by our company.

FUNCTIONALITY:

- When user selects a holiday option in the work schedule form, time input fields (start/end time, break times) are automatically cleared
- When user changes back to a workday, default times are auto-filled

TESTING LIMITATIONS:

- This extension only works on a specific internal company URL (jtkpwb00.aeonpeople.biz)
- Testing requires login credentials to the Lysithea system, which is not publicly accessible
- The extension has no effect on other websites

PERMISSIONS USED:

- storage: Save user preferences (default times, URL pattern)
- tabs: Notify open tabs when settings change

NO remote code is loaded. All JavaScript is bundled within the extension package.
