// Akamai Debug Headers - Popup Script

// i18n translations
const i18n = {
  en: {
    enabled: "Enabled",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    docLink: "Debug Headers Documentation",
    openDevTools: "Open Network Panel to check Response Headers",
    shortcutHint: "Press",
    shortcutHint2: "then click Network tab",
    statusOn: (selected, total) => `ON - ${selected}/${total} headers applied`,
    statusOnNoSelection: "ON - No headers selected",
    statusOff: "OFF - Headers not applied",
    langBtn: "JP"
  },
  ja: {
    enabled: "有効",
    selectAll: "全選択",
    deselectAll: "全解除",
    docLink: "デバッグヘッダの説明",
    openDevTools: "Response Headerを確認（Networkパネルを開く）",
    shortcutHint: "",
    shortcutHint2: "を押してNetworkタブをクリック",
    statusOn: (selected, total) => `ON - ${selected}/${total} ヘッダーを付与中`,
    statusOnNoSelection: "ON - ヘッダーが選択されていません",
    statusOff: "OFF - ヘッダーは付与されません",
    langBtn: "EN"
  }
};

let currentLang = "en";

const masterToggle = document.getElementById("masterToggle");
const statusBar = document.getElementById("statusBar");
const headerList = document.getElementById("headerList");
const selectAllBtn = document.getElementById("selectAll");
const deselectAllBtn = document.getElementById("deselectAll");
const langToggle = document.getElementById("langToggle");
const openDevToolsBtn = document.getElementById("openDevToolsBtn");
const devToolsTooltip = document.getElementById("devToolsTooltip");
const shortcutKey = document.getElementById("shortcutKey");

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
  langToggle.textContent = t.langBtn;
  updateStatusBar();
  renderHeaderList();
}

// Toggle language
async function toggleLanguage() {
  currentLang = currentLang === "en" ? "ja" : "en";
  await chrome.storage.local.set({ language: currentLang });
  applyI18n();
}

// Detect OS and return appropriate shortcut
function getShortcutKey() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  return isMac ? "⌘ + ⌥ + I" : "Ctrl + Shift + I";
}

// Show DevTools tooltip
let tooltipTimeout = null;
function showDevToolsTooltip() {
  // Update shortcut key based on OS
  shortcutKey.textContent = getShortcutKey();
  devToolsTooltip.classList.add("show");

  // Auto-hide after 3 seconds
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout);
  }
  tooltipTimeout = setTimeout(() => {
    devToolsTooltip.classList.remove("show");
  }, 3000);
}

// ステータスバーを更新
function updateStatusBar() {
  const selectedCount = Object.values(currentState.selections).filter(v => v).length;
  const totalCount = currentState.headers.length;
  const t = i18n[currentLang];

  if (currentState.enabled && selectedCount > 0) {
    statusBar.textContent = t.statusOn(selectedCount, totalCount);
    statusBar.classList.add("enabled");
  } else if (currentState.enabled && selectedCount === 0) {
    statusBar.textContent = t.statusOnNoSelection;
    statusBar.classList.remove("enabled");
  } else {
    statusBar.textContent = t.statusOff;
    statusBar.classList.remove("enabled");
  }
}

// UIの有効/無効状態を更新
function updateUIState() {
  const checkboxes = document.querySelectorAll(".header-checkbox");
  const items = document.querySelectorAll(".header-item");

  checkboxes.forEach(cb => {
    cb.disabled = !currentState.enabled;
  });

  items.forEach(item => {
    item.classList.toggle("disabled", !currentState.enabled);
  });

  selectAllBtn.disabled = !currentState.enabled;
  deselectAllBtn.disabled = !currentState.enabled;
}

// ヘッダーリストを生成
function renderHeaderList() {
  headerList.innerHTML = "";

  currentState.headers.forEach(header => {
    const item = document.createElement("div");
    item.className = "header-item";
    if (!currentState.enabled) {
      item.classList.add("disabled");
    }

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
    // Use localized description
    const description = typeof header.description === "object"
      ? (header.description[currentLang] || header.description.en)
      : header.description;
    desc.textContent = description;

    info.appendChild(name);
    info.appendChild(desc);

    item.appendChild(checkbox);
    item.appendChild(info);

    // ラベルクリックでもチェックボックスを切り替え
    info.addEventListener("click", () => {
      if (currentState.enabled) {
        checkbox.checked = !checkbox.checked;
        onHeaderToggle(header.id, checkbox.checked);
      }
    });
    info.style.cursor = currentState.enabled ? "pointer" : "default";

    headerList.appendChild(item);
  });
}

// 状態をバックグラウンドに送信
async function sendUpdate() {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({
      action: "updateStatus",
      enabled: currentState.enabled,
      selections: currentState.selections
    }, resolve);
  });
}

// マスタートグル変更時
async function onMasterToggle() {
  currentState.enabled = masterToggle.checked;
  await sendUpdate();
  updateStatusBar();
  updateUIState();

  // カーソルスタイルを更新
  document.querySelectorAll(".header-info").forEach(info => {
    info.style.cursor = currentState.enabled ? "pointer" : "default";
  });
}

// 個別ヘッダートグル変更時
async function onHeaderToggle(headerId, checked) {
  currentState.selections[headerId] = checked;
  await sendUpdate();
  updateStatusBar();
}

// 全選択
async function onSelectAll() {
  currentState.headers.forEach(header => {
    currentState.selections[header.id] = true;
  });
  await sendUpdate();
  renderHeaderList();
  updateStatusBar();
}

// 全解除
async function onDeselectAll() {
  currentState.headers.forEach(header => {
    currentState.selections[header.id] = false;
  });
  await sendUpdate();
  renderHeaderList();
  updateStatusBar();
}

// 初期化
async function init() {
  // Load saved language preference (default: English)
  const { language } = await chrome.storage.local.get({ language: "en" });
  currentLang = language;

  // バックグラウンドから現在の状態を取得
  currentState = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: "getStatus" }, resolve);
  });

  // UIを初期化
  masterToggle.checked = currentState.enabled;
  applyI18n();
  updateUIState();

  // イベントリスナーを設定
  masterToggle.addEventListener("change", onMasterToggle);
  selectAllBtn.addEventListener("click", onSelectAll);
  deselectAllBtn.addEventListener("click", onDeselectAll);
  langToggle.addEventListener("click", toggleLanguage);
  openDevToolsBtn.addEventListener("click", showDevToolsTooltip);

  // Initialize shortcut key display based on OS
  shortcutKey.textContent = getShortcutKey();
}

// 実行
init();
