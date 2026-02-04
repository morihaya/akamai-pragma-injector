// Akamai Debug Headers - Background Service Worker

const AKAMAI_DEBUG_PRAGMA = "akamai-x-cache-on,akamai-x-cache-remote-on,akamai-x-check-cacheable,akamai-x-get-cache-key,akamai-x-get-extracted-values,akamai-x-get-request-id,akamai-x-serial-no,akamai-x-get-true-cache-key";

const RULE_ID = 1;

// デバッグヘッダールールを追加
async function enableDebugHeaders() {
  const rule = {
    id: RULE_ID,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "Pragma",
          operation: "set",
          value: AKAMAI_DEBUG_PRAGMA
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
function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

// 状態を切り替え
async function toggleDebugHeaders() {
  const { enabled } = await chrome.storage.local.get({ enabled: false });
  const newEnabled = !enabled;

  await chrome.storage.local.set({ enabled: newEnabled });

  if (newEnabled) {
    await enableDebugHeaders();
  } else {
    await disableDebugHeaders();
  }

  updateBadge(newEnabled);
  return newEnabled;
}

// 現在の状態を取得
async function getStatus() {
  const { enabled } = await chrome.storage.local.get({ enabled: false });
  return enabled;
}

// 拡張機能インストール/更新時の初期化
chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: false });

  if (enabled) {
    await enableDebugHeaders();
  } else {
    await disableDebugHeaders();
  }

  updateBadge(enabled);
});

// 起動時の初期化
chrome.runtime.onStartup.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: false });

  if (enabled) {
    await enableDebugHeaders();
  }

  updateBadge(enabled);
});

// ポップアップからのメッセージを受信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggle") {
    toggleDebugHeaders().then(sendResponse);
    return true; // 非同期レスポンスを示す
  }

  if (message.action === "getStatus") {
    getStatus().then(sendResponse);
    return true;
  }
});
