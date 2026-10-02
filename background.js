// Akamai Debug Headers - Background Service Worker

import {
  PRAGMA_HEADERS,
  RULE_ID,
  buildPragmaValue,
  countSelected,
  getDefaultSelections
} from "./shared/headers.js";

// Pragmaヘッダーを付与する対象のリソースタイプ
const TARGET_RESOURCE_TYPES = [
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
];

// 選択内容からdeclarativeNetRequestのルールを生成
function buildRule(pragmaValue) {
  return {
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
      resourceTypes: TARGET_RESOURCE_TYPES
    }
  };
}

// デバッグヘッダールールを更新（選択がない場合はルールを削除）
export async function updateDebugHeadersRule(selections) {
  const pragmaValue = buildPragmaValue(selections);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: pragmaValue ? [buildRule(pragmaValue)] : []
  });
}

// デバッグヘッダールールを削除
export async function disableDebugHeaders() {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: []
  });
}

// バッジを更新
export function updateBadge(enabled, selections) {
  if (enabled && countSelected(selections) > 0) {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

// 現在の状態を取得
export async function getStatus() {
  const defaults = {
    enabled: false,
    selections: getDefaultSelections()
  };
  const { enabled, selections } = await chrome.storage.local.get(defaults);
  return { enabled, selections, headers: PRAGMA_HEADERS };
}

// 状態に応じてルールとバッジを反映
export async function applyState(enabled, selections) {
  if (enabled && countSelected(selections) > 0) {
    await updateDebugHeadersRule(selections);
  } else {
    await disableDebugHeaders();
  }
  updateBadge(enabled, selections);
}

// 状態を更新
export async function updateStatus(enabled, selections) {
  await chrome.storage.local.set({ enabled, selections });
  await applyState(enabled, selections);
  return { enabled, selections };
}

// 拡張機能インストール/更新時・ブラウザ起動時に保存済みの状態を反映
async function restoreState() {
  const { enabled, selections } = await getStatus();
  await applyState(enabled, selections);
}

chrome.runtime.onInstalled.addListener(restoreState);
chrome.runtime.onStartup.addListener(restoreState);

// ポップアップからのメッセージを受信
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "getStatus") {
    getStatus().then(sendResponse);
    return true;
  }

  if (message.action === "updateStatus") {
    updateStatus(message.enabled, message.selections).then(sendResponse);
    return true;
  }
});
