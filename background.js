// Akamai Debug Headers - Background Service Worker

// Pragma header definitions with i18n support
const PRAGMA_HEADERS = [
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

const RULE_ID = 1;

// デフォルトの選択状態（全てON）
function getDefaultSelections() {
  const selections = {};
  PRAGMA_HEADERS.forEach(header => {
    selections[header.id] = true;
  });
  return selections;
}

// 選択されたヘッダーからPragma値を生成
function buildPragmaValue(selections) {
  return PRAGMA_HEADERS
    .filter(header => selections[header.id])
    .map(header => header.pragma)
    .join(",");
}

// デバッグヘッダールールを更新
async function updateDebugHeadersRule(selections) {
  const pragmaValue = buildPragmaValue(selections);

  // 選択されたヘッダーがない場合はルールを削除
  if (!pragmaValue) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID],
      addRules: []
    });
    return;
  }

  const rule = {
    id: RULE_ID,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "Pragma",
          operation: "set",
          value: pragmaValue
        }
      ]
    },
    condition: {
      urlFilter: "*",
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "webtransport",
        "webbundle",
        "other"
      ]
    }
  };

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: [rule]
  });
}

// デバッグヘッダールールを削除
async function disableDebugHeaders() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: []
  });
}

// バッジを更新
function updateBadge(enabled, selections) {
  if (enabled) {
    // 有効なヘッダー数をカウント
    const count = Object.values(selections).filter(v => v).length;
    chrome.action.setBadgeText({ text: count > 0 ? "ON" : "" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

// 現在の状態を取得
async function getStatus() {
  const defaults = {
    enabled: false,
    selections: getDefaultSelections()
  };
  const { enabled, selections } = await chrome.storage.local.get(defaults);
  return { enabled, selections, headers: PRAGMA_HEADERS };
}

// 状態を更新
async function updateStatus(enabled, selections) {
  await chrome.storage.local.set({ enabled, selections });

  if (enabled && Object.values(selections).some(v => v)) {
    await updateDebugHeadersRule(selections);
  } else {
    await disableDebugHeaders();
  }

  updateBadge(enabled, selections);
  return { enabled, selections };
}

// 拡張機能インストール/更新時の初期化
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled, selections } = await getStatus();

  if (enabled) {
    await updateDebugHeadersRule(selections);
  } else {
    await disableDebugHeaders();
  }

  updateBadge(enabled, selections);
});

// 起動時の初期化
chrome.runtime.onStartup.addListener(async () => {
  const { enabled, selections } = await getStatus();

  if (enabled) {
    await updateDebugHeadersRule(selections);
  }

  updateBadge(enabled, selections);
});

// ポップアップからのメッセージを受信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getStatus") {
    getStatus().then(sendResponse);
    return true;
  }

  if (message.action === "updateStatus") {
    updateStatus(message.enabled, message.selections).then(sendResponse);
    return true;
  }
});
