# ストア掲載用テキスト

ストアに掲載する説明文のテンプレートです。

---

## 拡張機能名

**日本語:** Akamai Pragma Injector

**英語:** Akamai Pragma Injector

**リポジトリ名:** `akamai-pragma-injector`

---

## 短い説明（132 文字以内）

**英語:**
Easily inject Akamai Pragma debug headers into your requests. Debug CDN cache behavior with one click.

**日本語:**
AkamaiのPragmaデバッグヘッダーをワンクリックで付与。CDNキャッシュの動作確認を簡単に。

---

## 詳細な説明（英語 / English）

A Chrome/Edge extension that injects Akamai Pragma debug headers into HTTP requests, helping developers inspect CDN cache behavior.

🔧 One-Click Toggle
Turn header injection on or off instantly with a simple toggle switch.

📋 Selective Headers
Choose only the debug headers you need. Select all or clear all with one click.

🌐 Bilingual UI
Switch between English and Japanese with one click.

📖 Documentation Link
Quick access to the official Akamai Pragma headers documentation.

Debugging Capabilities:
Inspect cache hit/miss status, remote cache state, cacheability, cache keys, extracted values, request IDs, serial numbers, and more — covering the major Pragma debug headers provided by Akamai.

Who Is This For?
- Web developers working with sites delivered through Akamai CDN
- Site administrators who need to verify CDN cache behavior
- Engineers debugging Akamai configurations

Privacy:
- No user data is collected
- Settings are stored locally in your browser only
- No communication with external servers
- When turned off, requests are not modified in any way

This extension is open source:
https://github.com/morihaya/akamai-pragma-injector

---

## 詳細な説明（日本語 / Japanese）

Akamai CDNのデバッグ用Pragmaヘッダーをリクエストに付与するChrome/Edge拡張機能です。開発者やサイト管理者がAkamaiのキャッシュ動作を確認する際に便利です。

🔧 ワンクリックでON/OFF
トグルスイッチで簡単にヘッダー付与のON/OFFを切り替えられます。

📋 選択式ヘッダー付与
必要なデバッグヘッダーだけを選んで付与できます。全選択・全解除も可能。

🌐 多言語対応
英語・日本語UIに対応。ワンクリックで切り替え可能。

📖 ドキュメントへのリンク
Akamaiの公式ドキュメントへのリンク付き。

デバッグできる項目:
キャッシュヒット/ミスの確認、リモートキャッシュの状態、キャッシュ可否の判定、キャッシュキーの取得、抽出値やリクエストID・シリアル番号の確認など、Akamaiが提供する主要なPragmaデバッグヘッダーに対応しています。

対象ユーザー:
- Akamai CDNを利用しているWebサイトの開発者
- CDNキャッシュの動作確認が必要なサイト管理者
- Akamaiの設定をデバッグするエンジニア

プライバシー:
- ユーザーデータの収集は行いません
- 設定情報はブラウザ内にのみ保存されます
- 外部サーバーへの通信は一切ありません
- OFFの時はリクエストに一切影響を与えません

この拡張機能はオープンソースです:
https://github.com/morihaya/akamai-pragma-injector

---

## カテゴリ

**Chrome:** デベロッパー ツール (Developer Tools)

**Edge:** デベロッパー ツール (Developer Tools)

---

## 言語

英語、日本語

---

## サポート情報

**サポート URL:** https://github.com/morihaya/akamai-pragma-injector/issues

**プライバシーポリシー URL:** （必要に応じて作成）

---

# Microsoft Edge Add-ons: プライバシー フォーム

Partner Center の「プライバシー」欄に入力する日本語回答です。提出時は、公開するバージョンの manifest と実装に変更がないか確認してください。

## 単一目的の説明

この拡張機能の単一の目的は、ユーザーが有効にしたときに、HTTP リクエストへ Akamai CDN のキャッシュ動作を調べるための Pragma デバッグヘッダーを付与することです。ユーザーは拡張機能のポップアップで機能の ON/OFF と、付与するヘッダーを選択できます。Akamai を利用するウェブサイトの開発者や管理者が、キャッシュ状態などを確認するために使用します。

## アクセス許可の理由

### declarativeNetRequest の正当化理由

ユーザーが機能を ON にしたとき、選択された Akamai Pragma デバッグ値を HTTP リクエストの `Pragma` ヘッダーに設定するために使用します。OFF のとき、またはヘッダーが選択されていないときは、リクエストを変更するルールを適用しません。この権限を使ってページの内容や閲覧履歴を収集することはありません。

### storage の正当化理由

拡張機能の ON/OFF 状態、ユーザーが選択した Pragma ヘッダー、およびポップアップの表示言語を、次回の利用時にも反映できるようブラウザー内の `storage.local` に保存します。この情報を外部サーバーへ送信することはありません。

### ホストへのアクセス許可 (`<all_urls>`)

Akamai CDN は特定のドメインに限らずさまざまなウェブサイトで利用されるため、ユーザーがデバッグ対象のサイトを選ばずに済むよう、すべての URL へのアクセスを要求します。このアクセスは、ON のときに対象サイトへの HTTP リクエストへ選択した `Pragma` ヘッダーを付与するためにのみ使用します。OFF のときはリクエストを変更しません。
