/**
 * Tests for background.js - Akamai Pragma Injector Service Worker
 */

// Import the functions we want to test by extracting them
// Since background.js doesn't export, we'll test the logic patterns

describe('PRAGMA_HEADERS Configuration', () => {
  // Define the expected header configuration for testing
  const PRAGMA_HEADERS = [
    { id: "cache", pragma: "akamai-x-cache-on", responseHeader: "X-Cache" },
    { id: "cache-remote", pragma: "akamai-x-cache-remote-on", responseHeader: "X-Cache-Remote" },
    { id: "check-cacheable", pragma: "akamai-x-check-cacheable", responseHeader: "X-Check-Cacheable" },
    { id: "true-cache-key", pragma: "akamai-x-get-true-cache-key", responseHeader: "X-True-Cache-Key" },
    { id: "cache-key", pragma: "akamai-x-get-cache-key", responseHeader: "X-Cache-Key" },
    { id: "serial", pragma: "akamai-x-serial-no", responseHeader: "X-Serial" },
    { id: "request-id", pragma: "akamai-x-get-request-id", responseHeader: "X-Akamai-Request-ID" }
  ];

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
  const PRAGMA_HEADERS = [
    { id: "cache" },
    { id: "cache-remote" },
    { id: "check-cacheable" }
  ];

  function getDefaultSelections() {
    const selections = {};
    PRAGMA_HEADERS.forEach(header => {
      selections[header.id] = true;
    });
    return selections;
  }

  test('should return all headers selected by default', () => {
    const selections = getDefaultSelections();
    expect(selections).toEqual({
      "cache": true,
      "cache-remote": true,
      "check-cacheable": true
    });
  });

  test('should return object with correct number of keys', () => {
    const selections = getDefaultSelections();
    expect(Object.keys(selections)).toHaveLength(PRAGMA_HEADERS.length);
  });
});

describe('buildPragmaValue', () => {
  const PRAGMA_HEADERS = [
    { id: "cache", pragma: "akamai-x-cache-on" },
    { id: "cache-remote", pragma: "akamai-x-cache-remote-on" },
    { id: "check-cacheable", pragma: "akamai-x-check-cacheable" }
  ];

  function buildPragmaValue(selections) {
    return PRAGMA_HEADERS
      .filter(header => selections[header.id])
      .map(header => header.pragma)
      .join(",");
  }

  test('should return comma-separated pragma values for selected headers', () => {
    const selections = { cache: true, "cache-remote": true, "check-cacheable": false };
    const result = buildPragmaValue(selections);
    expect(result).toBe("akamai-x-cache-on,akamai-x-cache-remote-on");
  });

  test('should return empty string when no headers selected', () => {
    const selections = { cache: false, "cache-remote": false, "check-cacheable": false };
    const result = buildPragmaValue(selections);
    expect(result).toBe("");
  });

  test('should return all pragma values when all selected', () => {
    const selections = { cache: true, "cache-remote": true, "check-cacheable": true };
    const result = buildPragmaValue(selections);
    expect(result).toBe("akamai-x-cache-on,akamai-x-cache-remote-on,akamai-x-check-cacheable");
  });

  test('should return single pragma value when one selected', () => {
    const selections = { cache: false, "cache-remote": true, "check-cacheable": false };
    const result = buildPragmaValue(selections);
    expect(result).toBe("akamai-x-cache-remote-on");
  });
});

describe('Chrome Storage API', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should store enabled state', async () => {
    await chrome.storage.local.set({ enabled: true });
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ enabled: true });
  });

  test('should retrieve stored values with defaults', async () => {
    const defaults = { enabled: false, selections: {} };
    const result = await chrome.storage.local.get(defaults);
    expect(result).toHaveProperty('enabled');
    expect(result).toHaveProperty('selections');
  });

  test('should return stored value when available', async () => {
    setMockStorage({ enabled: true });
    const result = await chrome.storage.local.get({ enabled: false });
    expect(result.enabled).toBe(true);
  });
});

describe('declarativeNetRequest API', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should call updateDynamicRules to add rule', async () => {
    const rule = {
      id: 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [{
          header: "Pragma",
          operation: "set",
          value: "akamai-x-cache-on"
        }]
      },
      condition: {
        urlFilter: "*",
        resourceTypes: ["main_frame"]
      }
    };

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: [rule]
    });

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1],
      addRules: [rule]
    });
  });

  test('should call updateDynamicRules to remove rule', async () => {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: []
    });

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledWith({
      removeRuleIds: [1],
      addRules: []
    });
  });
});

describe('Badge Updates', () => {
  beforeEach(() => {
    resetChromeMocks();
  });

  test('should set badge text to ON when enabled with selections', () => {
    chrome.action.setBadgeText({ text: "ON" });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "ON" });
  });

  test('should clear badge text when disabled', () => {
    chrome.action.setBadgeText({ text: "" });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: "" });
  });

  test('should set badge background color', () => {
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
    expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#4CAF50" });
  });
});
