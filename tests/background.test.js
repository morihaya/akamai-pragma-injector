/**
 * Tests for background.js - Akamai Pragma Injector Service Worker
 *
 * Imports the real implementation from shared/headers.js and background.js
 * instead of duplicating the logic in the tests.
 */

import {
  PRAGMA_HEADERS,
  RULE_ID,
  buildPragmaValue,
  countSelected,
  getDefaultSelections
} from "../shared/headers.js";

import {
  disableDebugHeaders,
  getStatus,
  updateBadge,
  updateDebugHeadersRule,
  updateStatus
} from "../background.js";

describe('PRAGMA_HEADERS Configuration', () => {
  test('should have 7 pragma headers defined', () => {
    expect(PRAGMA_HEADERS).toHaveLength(7);
  });

  test('each header should have required properties', () => {
    PRAGMA_HEADERS.forEach(header => {
      expect(header).toHaveProperty('id');
      expect(header).toHaveProperty('pragma');
      expect(header).toHaveProperty('responseHeader');
      expect(typeof header.id).toBe('string');
      expect(typeof header.pragma).toBe('string');
      expect(typeof header.responseHeader).toBe('string');
    });
  });

  test('each header should have English and Japanese descriptions', () => {
    PRAGMA_HEADERS.forEach(header => {
      expect(typeof header.description.en).toBe('string');
      expect(typeof header.description.ja).toBe('string');
    });
  });

  test('all pragma values should start with "akamai-x-"', () => {
    PRAGMA_HEADERS.forEach(header => {
      expect(header.pragma).toMatch(/^akamai-x-/);
    });
  });

  test('all header IDs should be unique', () => {
    const ids = PRAGMA_HEADERS.map(h => h.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids).toEqual(uniqueIds);
  });
});

describe('getDefaultSelections', () => {
  test('should return all headers selected by default', () => {
    const selections = getDefaultSelections();
    PRAGMA_HEADERS.forEach(header => {
      expect(selections[header.id]).toBe(true);
    });
  });

  test('should return object with correct number of keys', () => {
    const selections = getDefaultSelections();
    expect(Object.keys(selections)).toHaveLength(PRAGMA_HEADERS.length);
  });
});

describe('buildPragmaValue', () => {
  test('should return comma-separated pragma values for selected headers', () => {
    const selections = { cache: true, "cache-remote": true };
    const result = buildPragmaValue(selections);
    expect(result).toBe("akamai-x-cache-on,akamai-x-cache-remote-on");
  });

  test('should return empty string when no headers selected', () => {
    expect(buildPragmaValue({})).toBe("");
  });

  test('should return all pragma values when all selected', () => {
    const result = buildPragmaValue(getDefaultSelections());
    expect(result).toBe(PRAGMA_HEADERS.map(h => h.pragma).join(","));
  });

  test('should return single pragma value when one selected', () => {
    const result = buildPragmaValue({ "cache-remote": true });
    expect(result).toBe("akamai-x-cache-remote-on");
  });
});

describe('countSelected', () => {
  test('should count true values', () => {
    expect(countSelected({ a: true, b: true, c: false })).toBe(2);
    expect(countSelected({ a: false, b: false })).toBe(0);
    expect(countSelected({ a: true, b: true, c: true })).toBe(3);
  });
});

describe('updateDebugHeadersRule', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should add a Pragma header rule for selected headers', async () => {
    await updateDebugHeadersRule({ cache: true });

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledTimes(1);
    const arg = chrome.declarativeNetRequest.updateDynamicRules.mock.calls[0][0];
    expect(arg.removeRuleIds).toEqual([RULE_ID]);
    expect(arg.addRules).toHaveLength(1);
    expect(arg.addRules[0].action.requestHeaders).toEqual([
      { header: "Pragma", operation: "set", value: "akamai-x-cache-on" }
    ]);
  });

  test('should remove the rule when no headers are selected', async () => {
    await updateDebugHeadersRule({});

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [RULE_ID],
      addRules: []
    });
  });
});

describe('disableDebugHeaders', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should remove the dynamic rule', async () => {
    await disableDebugHeaders();

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [RULE_ID],
      addRules: []
    });
  });
});

describe('updateBadge', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should set badge text to ON when enabled with selections', () => {
    updateBadge(true, { cache: true });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "ON" });
    expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#4CAF50" });
  });

  test('should clear badge text when enabled without selections', () => {
    updateBadge(true, {});
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "" });
  });

  test('should clear badge text when disabled', () => {
    updateBadge(false, { cache: true });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "" });
  });
});

describe('getStatus', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should return defaults when nothing is stored', async () => {
    const status = await getStatus();
    expect(status.enabled).toBe(false);
    expect(status.selections).toEqual(getDefaultSelections());
    expect(status.headers).toBe(PRAGMA_HEADERS);
  });

  test('should return stored values when available', async () => {
    setMockStorage({ enabled: true, selections: { cache: true } });
    const status = await getStatus();
    expect(status.enabled).toBe(true);
    expect(status.selections).toEqual({ cache: true });
  });
});

describe('updateStatus', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should persist state and add rule when enabled with selections', async () => {
    const result = await updateStatus(true, { cache: true });

    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      enabled: true,
      selections: { cache: true }
    });
    const arg = chrome.declarativeNetRequest.updateDynamicRules.mock.calls[0][0];
    expect(arg.addRules).toHaveLength(1);
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "ON" });
    expect(result).toEqual({ enabled: true, selections: { cache: true } });
  });

  test('should remove rule and clear badge when disabled', async () => {
    await updateStatus(false, { cache: true });

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [RULE_ID],
      addRules: []
    });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "" });
  });

  test('should remove rule when enabled but nothing selected', async () => {
    await updateStatus(true, {});

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [RULE_ID],
      addRules: []
    });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "" });
  });
});
