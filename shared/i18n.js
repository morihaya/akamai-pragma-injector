// Akamai Pragma Injector - Shared i18n translations and helpers

export const i18n = {
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

// ステータスバーに表示するテキストを決定
export function getStatusText(lang, enabled, selectedCount, totalCount) {
  const t = i18n[lang];
  if (enabled && selectedCount > 0) {
    return t.statusOn(selectedCount, totalCount);
  }
  if (enabled) {
    return t.statusOnNoSelection;
  }
  return t.statusOff;
}

// OSに応じたDevToolsショートカット表記を返す
export function getShortcutKey(platform) {
  const isMac = platform.toUpperCase().includes("MAC");
  return isMac ? "⌘ + ⌥ + I" : "Ctrl + Shift + I";
}
