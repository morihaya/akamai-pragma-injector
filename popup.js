// Akamai Debug Headers - Popup Script

const masterToggle = document.getElementById("masterToggle");
const statusBar = document.getElementById("statusBar");
const headerList = document.getElementById("headerList");
const selectAllBtn = document.getElementById("selectAll");
const deselectAllBtn = document.getElementById("deselectAll");

let currentState = {
  enabled: false,
  selections: {},
  headers: []
};

// ステータスバーを更新
function updateStatusBar() {
  const selectedCount = Object.values(currentState.selections).filter(v => v).length;
  const totalCount = currentState.headers.length;

  if (currentState.enabled && selectedCount > 0) {
    statusBar.textContent = `ON - ${selectedCount}/${totalCount} ヘッダーを付与中`;
    statusBar.classList.add("enabled");
  } else if (currentState.enabled && selectedCount === 0) {
    statusBar.textContent = "ON - ヘッダーが選択されていません";
    statusBar.classList.remove("enabled");
  } else {
    statusBar.textContent = "OFF - ヘッダーは付与されません";
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
    desc.textContent = header.description;

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
  // バックグラウンドから現在の状態を取得
  currentState = await new Promise(resolve => {
    chrome.runtime.sendMessage({ action: "getStatus" }, resolve);
  });

  // UIを初期化
  masterToggle.checked = currentState.enabled;
  renderHeaderList();
  updateStatusBar();
  updateUIState();

  // イベントリスナーを設定
  masterToggle.addEventListener("change", onMasterToggle);
  selectAllBtn.addEventListener("click", onSelectAll);
  deselectAllBtn.addEventListener("click", onDeselectAll);
}

// 実行
init();
