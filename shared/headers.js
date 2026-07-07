// Akamai Pragma Injector - Shared header definitions and pure helpers
// Used by both the background service worker and the popup UI.

// Pragma header definitions with i18n support
export const PRAGMA_HEADERS = [
  {
    id: "cache",
    pragma: "akamai-x-cache-on",
    responseHeader: "X-Cache",
    description: {
      en: "Returns cache status",
      ja: "キャッシュの状態を返す"
    }
  },
  {
    id: "cache-remote",
    pragma: "akamai-x-cache-remote-on",
    responseHeader: "X-Cache-Remote",
    description: {
      en: "Returns parent server cache status",
      ja: "親サーバーのキャッシュ状態"
    }
  },
  {
    id: "check-cacheable",
    pragma: "akamai-x-check-cacheable",
    responseHeader: "X-Check-Cacheable",
    description: {
      en: "Returns if cacheable",
      ja: "キャッシュ可能かどうか"
    }
  },
  {
    id: "true-cache-key",
    pragma: "akamai-x-get-true-cache-key",
    responseHeader: "X-True-Cache-Key",
    description: {
      en: "Returns true cache key",
      ja: "真のキャッシュキーを返す"
    }
  },
  {
    id: "cache-key",
    pragma: "akamai-x-get-cache-key",
    responseHeader: "X-Cache-Key",
    description: {
      en: "Returns cache key (detailed)",
      ja: "キャッシュキー（詳細）を返す"
    }
  },
  {
    id: "serial",
    pragma: "akamai-x-serial-no",
    responseHeader: "X-Serial",
    description: {
      en: "Returns serial number",
      ja: "シリアル番号を返す"
    }
  },
  {
    id: "request-id",
    pragma: "akamai-x-get-request-id",
    responseHeader: "X-Akamai-Request-ID",
    description: {
      en: "Returns request ID",
      ja: "リクエストIDを返す"
    }
  }
];

export const RULE_ID = 1;

// デフォルトの選択状態（全てON）
export function getDefaultSelections() {
  const selections = {};
  PRAGMA_HEADERS.forEach(header => {
    selections[header.id] = true;
  });
  return selections;
}

// 選択されたヘッダーからPragma値を生成
export function buildPragmaValue(selections) {
  return PRAGMA_HEADERS
    .filter(header => selections[header.id])
    .map(header => header.pragma)
    .join(",");
}

// 選択中のヘッダー数をカウント
export function countSelected(selections) {
  return Object.values(selections).filter(Boolean).length;
}

// 言語に応じたヘッダー説明文を取得
export function getLocalizedDescription(header, lang) {
  if (typeof header.description === "object") {
    return header.description[lang] || header.description.en;
  }
  return header.description;
}
