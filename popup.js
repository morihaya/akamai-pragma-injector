// Akamai Debug Headers - Popup Script

const toggle = document.getElementById("toggle");
const statusText = document.getElementById("status");

// ステータス表示を更新
function updateStatusDisplay(enabled) {
  toggle.checked = enabled;
  statusText.textContent = enabled ? "ON - ヘッダーを付与中" : "OFF";
  statusText.classList.toggle("enabled", enabled);
}

// 初期状態を取得
chrome.runtime.sendMessage({ action: "getStatus" }, (enabled) => {
  updateStatusDisplay(enabled);
});

// トグル切り替え時
toggle.addEventListener("change", () => {
  chrome.runtime.sendMessage({ action: "toggle" }, (newEnabled) => {
    updateStatusDisplay(newEnabled);
  });
});
