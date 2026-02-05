# Akamai Pragma Injector

[![Test](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/test.yml/badge.svg)](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/test.yml)
[![CodeQL](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/github-code-scanning/codeql)
[![Dependabot Updates](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/dependabot/dependabot-updates)

Chrome/Edge用の拡張機能です。Akamai CDNのPragmaデバッグヘッダーを簡単に付与・ON/OFFできます。

## 機能

- **ワンクリックでON/OFF**: アイコンをクリックしてトグルスイッチで切り替え
- **視覚的な状態表示**: ONの時はバッジで「ON」と表示
- **最小限の権限**: 必要最低限の権限のみを要求

## 付与されるデバッグヘッダー

`Pragma` ヘッダーに以下のパラメータを追加します:

- `akamai-x-cache-on`
- `akamai-x-cache-remote-on`
- `akamai-x-check-cacheable`
- `akamai-x-get-cache-key`
- `akamai-x-get-extracted-values`
- `akamai-x-get-request-id`
- `akamai-x-serial-no`
- `akamai-x-get-true-cache-key`

## インストール方法

### 開発者モードでのインストール

1. このリポジトリをクローンまたはダウンロード
2. Chrome/Edgeで `chrome://extensions/` を開く
3. 「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. ダウンロードしたフォルダを選択

## 使い方

1. ブラウザのツールバーにある拡張機能アイコンをクリック
2. トグルスイッチでON/OFFを切り替え
3. ONにすると、すべてのリクエストにAkamaiデバッグヘッダーが付与されます
4. ブラウザの開発者ツール（F12）→ ネットワークタブでレスポンスヘッダーを確認

## 権限について

この拡張機能は以下の権限を使用します:

| 権限 | 用途 |
|------|------|
| `declarativeNetRequest` | リクエストヘッダーの追加 |
| `storage` | ON/OFF状態の保存 |
| `<all_urls>` | すべてのサイトでヘッダーを付与可能にする |

**注意**: 「すべてのウェブサイトのデータの読み取りと変更」と表示されますが、実際には:
- Pragmaヘッダーを**追加**するだけで、データの読み取りはしません
- OFFの時は何も動作しません
- 他のデータやCookieには一切アクセスしません

## 参考資料

- [Akamaiデバッグヘッダの説明](https://techdocs.akamai.com/edge-diagnostics/docs/pragma-headers)

## 開発

### セットアップ

```bash
npm install
```

### テスト実行

```bash
# テスト実行
npm test

# ウォッチモード（ファイル変更時に自動実行）
npm run test:watch

# カバレッジレポート付き
npm run test:coverage
```

### Lint

```bash
npm run lint
```

### ストア提出用ZIPの作成

```bash
npm run zip
```

## ライセンス

MIT License
