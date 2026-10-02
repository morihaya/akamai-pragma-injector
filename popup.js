// Akamai Debug Headers - Popup Script

import { countSelected, getLocalizedDescription } from "./shared/headers.js";
import { getShortcutKey, getStatusText, i18n } from "./shared/i18n.js";

const TOOLTIP_AUTO_HIDE_MS = 3000;

const elements = {
  masterToggle: document.getElementById("masterToggle"),
  statusBar: document.getElementById("statusBar"),
  headerList: document.getElementById("headerList"),
  selectAllBtn: document.getElementById("selectAll"),
  deselectAllBtn: document.getElementById("deselectAll"),
  langToggle: document.getElementById("langToggle"),
  openDevToolsBtn: document.getElementById("openDevToolsBtn"),
  devToolsTooltip: document.getElementById("devToolsTooltip"),
  shortcutKey: document.getElementById("shortcutKey")
};

let currentLang = "en";

let currentState = {
  enabled: false,
  selections: {},
  headers: []
};

// Apply i18n to all elements with data-i18n attribute
function applyI18n() {
  const t = i18n[currentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) {
      el.textContent = t[key];
    }
  });
  elements.langToggle.textContent = t.langBtn;
  updateStatusBar();
  renderHeaderList();
}

// Toggle language
async function toggleLanguage() {
  currentLang = currentLang === "en" ? "ja" : "en";
  await chrome.storage.local.set({ language: currentLang });
  applyI18n();
}

// Show DevTools tooltip
let tooltipTimeout = null;
function showDevToolsTooltip() {
  elements.shortcutKey.textContent = getShortcutKey(navigator.platform);
  elements.devToolsTooltip.classList.add("show");

  // Auto-hide after 3 seconds
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }
  tooltipTimeout = setTimeout(() => {
    elements.devToolsTooltip.classList.remove("show");
  }, TOOLTIP_AUTO_HIDE_MS);
}

// ステータスバーを更新
function updateStatusBar() {
  const selectedCount = countSelected(currentState.selections);
  const totalCount = currentState.headers.length;

  elements.statusBar.textContent = getStatusText(currentLang, currentState.enabled, selectedCount, totalCount);
  elements.statusBar.classList.toggle("enabled", currentState.enabled && selectedCount > 0);
}

// UIの有効/無効状態を更新
function updateUIState() {
  document.querySelectorAll(".header-checkbox").forEach(cb => {
    cb.disabled = !currentState.enabled;
  });

  document.querySelectorAll(".header-item").forEach(item => {
    item.classList.toggle("disabled", !currentState.enabled);
  });

  elements.selectAllBtn.disabled = !currentState.enabled;
  elements.deselectAllBtn.disabled = !currentState.enabled;
}

// ヘッダー項目1件分のDOM要素を生成
function createHeaderItem(header) {
  const item = document.createElement("div");
  item.className = "header-item";
  item.classList.toggle("disabled", !currentState.enabled);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "header-checkbox";
  checkbox.id = `header-${header.id}`;
  checkbox.checked = currentState.selections[header.id] || false;
  checkbox.disabled = !currentState.enabled;
  checkbox.addEventListener("change", () => onHeaderToggle(header.id, checkbox.checked));

  const info = document.createElement("div");
  info.className = "header-info";

  const name = document.createElement("div");
  name.className = "header-name";
  name.textContent = header.responseHeader;

  const desc = document.createElement("div");
  desc.className = "header-desc";
  desc.textContent = getLocalizedDescription(header, currentLang);

  info.appendChild(name);
  info.appendChild(desc);

  // ラベルクリックでもチェックボックスを切り替え
  info.addEventListener("click", () => {
    if (currentState.enabled) {
      checkbox.checked = !checkbox.checked;
      onHeaderToggle(header.id, checkbox.checked);
    }
  });

  item.appendChild(checkbox);
  item.appendChild(info);
  return item;
}

// ヘッダーリストを生成
function renderHeaderList() {
  elements.headerList.innerHTML = "";
  currentState.headers.forEach(header => {
    elements.headerList.appendChild(createHeaderItem(header));
  });
}

// 状態をバックグラウンドに送信
async function sendUpdate() {
  await chrome.runtime.sendMessage({
    action: "updateStatus",
    enabled: currentState.enabled,
    selections: currentState.selections
  });
}

// 全ヘッダーの選択状態を一括設定
async function setAllSelections(checked) {
  currentState.headers.forEach(header => {
    currentState.selections[header.id] = checked;
  });
  await sendUpdate();
  renderHeaderList();
  updateStatusBar();
}

// マスタートグル変更時
async function onMasterToggle() {
  currentState.enabled = elements.masterToggle.checked;
  await sendUpdate();
  updateStatusBar();
  updateUIState();
}

// 個別ヘッダートグル変更時
async function onHeaderToggle(headerId, checked) {
  currentState.selections[headerId] = checked;
  await sendUpdate();
  updateStatusBar();
}

// 初期化
async function init() {
  // Load saved language preference (default: English)
  const { language } = await chrome.storage.local.get({ language: "en" });
  currentLang = language;

  // バックグラウンドから現在の状態を取得
  currentState = await chrome.runtime.sendMessage({ action: "getStatus" });

  // UIを初期化
  elements.masterToggle.checked = currentState.enabled;
  applyI18n();
  updateUIState();

  // イベントリスナーを設定
  elements.masterToggle.addEventListener("change", onMasterToggle);
  elements.selectAllBtn.addEventListener("click", () => setAllSelections(true));
  elements.deselectAllBtn.addEventListener("click", () => setAllSelections(false));
  elements.langToggle.addEventListener("click", toggleLanguage);
  elements.openDevToolsBtn.addEventListener("click", showDevToolsTooltip);

  // Initialize shortcut key display based on OS
  elements.shortcutKey.textContent = getShortcutKey(navigator.platform);
}

// 実行
init();
