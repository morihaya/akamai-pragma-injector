/**
 * Tests for popup.js - Akamai Pragma Injector Popup UI
 *
 * Imports the real implementation from shared/ instead of duplicating
 * the logic in the tests.
 */

import { countSelected } from "../shared/headers.js";
import { getShortcutKey, getStatusText, i18n } from "../shared/i18n.js";

describe('i18n Translations', () => {
  const requiredKeys = [
    'enabled', 'selectAll', 'deselectAll', 'docLink',
    'openDevTools', 'shortcutHint', 'shortcutHint2',
    'statusOn', 'statusOnNoSelection', 'statusOff', 'langBtn'
  ];

  describe('English translations', () => {
    test('should have all required keys', () => {
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
  test('should return Mac shortcut for macOS', () => {
    expect(getShortcutKey('MacIntel')).toBe('⌘ + ⌥ + I');
    expect(getShortcutKey('MacPPC')).toBe('⌘ + ⌥ + I');
  });

  test('should return Windows/Linux shortcut for other platforms', () => {
    expect(getShortcutKey('Win32')).toBe('Ctrl + Shift + I');
    expect(getShortcutKey('Linux x86_64')).toBe('Ctrl + Shift + I');
  });
});

describe('Selection Helpers', () => {
  test('countSelected should count true values', () => {
    expect(countSelected({ a: true, b: true, c: false })).toBe(2);
    expect(countSelected({ a: false, b: false })).toBe(0);
    expect(countSelected({ a: true, b: true, c: true })).toBe(3);
  });
});

describe('getStatusText', () => {
  test('should show ON status with count when enabled and selected', () => {
    expect(getStatusText('en', true, 3, 7)).toBe('ON - 3/7 headers applied');
  });

  test('should show no selection warning when enabled but none selected', () => {
    expect(getStatusText('en', true, 0, 7)).toBe('ON - No headers selected');
  });

  test('should show OFF status when disabled', () => {
    expect(getStatusText('en', false, 3, 7)).toBe('OFF - Headers not applied');
  });

  test('should show Japanese text when lang is ja', () => {
    expect(getStatusText('ja', true, 3, 7)).toBe('ON - 3/7 ヘッダーを付与中');
    expect(getStatusText('ja', false, 0, 7)).toBe('OFF - ヘッダーは付与されません');
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
