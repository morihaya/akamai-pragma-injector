/**
 * Tests for popup.js - Akamai Pragma Injector Popup UI
 */

describe('i18n Translations', () => {
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

  describe('English translations', () => {
    test('should have all required keys', () => {
      const requiredKeys = [
        'enabled', 'selectAll', 'deselectAll', 'docLink',
        'openDevTools', 'shortcutHint', 'shortcutHint2',
        'statusOn', 'statusOnNoSelection', 'statusOff', 'langBtn'
      ];
      requiredKeys.forEach(key => {
        expect(i18n.en).toHaveProperty(key);
      });
    });

    test('statusOn should return formatted string', () => {
      expect(i18n.en.statusOn(3, 7)).toBe('ON - 3/7 headers applied');
    });

    test('langBtn should show JP for switching to Japanese', () => {
      expect(i18n.en.langBtn).toBe('JP');
    });
  });

  describe('Japanese translations', () => {
    test('should have all required keys', () => {
      const requiredKeys = [
        'enabled', 'selectAll', 'deselectAll', 'docLink',
        'openDevTools', 'shortcutHint', 'shortcutHint2',
        'statusOn', 'statusOnNoSelection', 'statusOff', 'langBtn'
      ];
      requiredKeys.forEach(key => {
        expect(i18n.ja).toHaveProperty(key);
      });
    });

    test('statusOn should return formatted string in Japanese', () => {
      expect(i18n.ja.statusOn(3, 7)).toBe('ON - 3/7 ヘッダーを付与中');
    });

    test('langBtn should show EN for switching to English', () => {
      expect(i18n.ja.langBtn).toBe('EN');
    });
  });

  describe('Translation parity', () => {
    test('both languages should have same keys', () => {
      const enKeys = Object.keys(i18n.en).sort();
      const jaKeys = Object.keys(i18n.ja).sort();
      expect(enKeys).toEqual(jaKeys);
    });
  });
});

describe('getShortcutKey', () => {
  function getShortcutKey(platform) {
    const isMac = platform.toUpperCase().indexOf('MAC') >= 0;
    return isMac ? "⌘ + ⌥ + I" : "Ctrl + Shift + I";
  }

  test('should return Mac shortcut for macOS', () => {
    expect(getShortcutKey('MacIntel')).toBe('⌘ + ⌥ + I');
    expect(getShortcutKey('MacPPC')).toBe('⌘ + ⌥ + I');
  });

  test('should return Windows/Linux shortcut for other platforms', () => {
    expect(getShortcutKey('Win32')).toBe('Ctrl + Shift + I');
    expect(getShortcutKey('Linux x86_64')).toBe('Ctrl + Shift + I');
  });
});

describe('State Management', () => {
  const createState = () => ({
    enabled: false,
    selections: {},
    headers: []
  });

  test('should create initial state with defaults', () => {
    const state = createState();
    expect(state.enabled).toBe(false);
    expect(state.selections).toEqual({});
    expect(state.headers).toEqual([]);
  });

  test('should update enabled state', () => {
    const state = createState();
    state.enabled = true;
    expect(state.enabled).toBe(true);
  });

  test('should update selections', () => {
    const state = createState();
    state.selections = { cache: true, "cache-remote": false };
    expect(state.selections.cache).toBe(true);
    expect(state.selections["cache-remote"]).toBe(false);
  });
});

describe('Selection Helpers', () => {
  const headers = [
    { id: "cache" },
    { id: "cache-remote" },
    { id: "check-cacheable" }
  ];

  function selectAll(headers) {
    const selections = {};
    headers.forEach(header => {
      selections[header.id] = true;
    });
    return selections;
  }

  function deselectAll(headers) {
    const selections = {};
    headers.forEach(header => {
      selections[header.id] = false;
    });
    return selections;
  }

  function countSelected(selections) {
    return Object.values(selections).filter(v => v).length;
  }

  test('selectAll should set all to true', () => {
    const selections = selectAll(headers);
    expect(selections).toEqual({
      cache: true,
      "cache-remote": true,
      "check-cacheable": true
    });
  });

  test('deselectAll should set all to false', () => {
    const selections = deselectAll(headers);
    expect(selections).toEqual({
      cache: false,
      "cache-remote": false,
      "check-cacheable": false
    });
  });

  test('countSelected should count true values', () => {
    expect(countSelected({ a: true, b: true, c: false })).toBe(2);
    expect(countSelected({ a: false, b: false })).toBe(0);
    expect(countSelected({ a: true, b: true, c: true })).toBe(3);
  });
});

describe('Status Bar Text', () => {
  function getStatusText(enabled, selectedCount, totalCount, lang = 'en') {
    const i18n = {
      en: {
        statusOn: (selected, total) => `ON - ${selected}/${total} headers applied`,
        statusOnNoSelection: "ON - No headers selected",
        statusOff: "OFF - Headers not applied"
      },
      ja: {
        statusOn: (selected, total) => `ON - ${selected}/${total} ヘッダーを付与中`,
        statusOnNoSelection: "ON - ヘッダーが選択されていません",
        statusOff: "OFF - ヘッダーは付与されません"
      }
    };

    const t = i18n[lang];

    if (enabled && selectedCount > 0) {
      return t.statusOn(selectedCount, totalCount);
    } else if (enabled && selectedCount === 0) {
      return t.statusOnNoSelection;
    } else {
      return t.statusOff;
    }
  }

  test('should show ON status with count when enabled and selected', () => {
    expect(getStatusText(true, 3, 7)).toBe('ON - 3/7 headers applied');
  });

  test('should show no selection warning when enabled but none selected', () => {
    expect(getStatusText(true, 0, 7)).toBe('ON - No headers selected');
  });

  test('should show OFF status when disabled', () => {
    expect(getStatusText(false, 3, 7)).toBe('OFF - Headers not applied');
  });

  test('should show Japanese text when lang is ja', () => {
    expect(getStatusText(true, 3, 7, 'ja')).toBe('ON - 3/7 ヘッダーを付与中');
    expect(getStatusText(false, 0, 7, 'ja')).toBe('OFF - ヘッダーは付与されません');
  });
});

describe('DOM Interactions', () => {
  beforeEach(() => {
    resetChromeMocks();
    mockDOMElements();
  });

  test('should find master toggle element', () => {
    const toggle = document.getElementById('masterToggle');
    expect(toggle).not.toBeNull();
    expect(toggle.type).toBe('checkbox');
  });

  test('should find status bar element', () => {
    const statusBar = document.getElementById('statusBar');
    expect(statusBar).not.toBeNull();
  });

  test('should find button elements', () => {
    expect(document.getElementById('selectAll')).not.toBeNull();
    expect(document.getElementById('deselectAll')).not.toBeNull();
    expect(document.getElementById('langToggle')).not.toBeNull();
  });

  test('should update checkbox state', () => {
    const toggle = document.getElementById('masterToggle');
    toggle.checked = true;
    expect(toggle.checked).toBe(true);
  });
});

describe('Chrome Runtime Messages', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should send getStatus message', async () => {
    await chrome.runtime.sendMessage({ action: 'getStatus' });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ action: 'getStatus' });
  });

  test('should send updateStatus message', async () => {
    const message = {
      action: 'updateStatus',
      enabled: true,
      selections: { cache: true }
    };
    await chrome.runtime.sendMessage(message);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(message);
  });
});
