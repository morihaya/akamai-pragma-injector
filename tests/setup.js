// Jest setup file - Mock Chrome Extension APIs

// Mock chrome.storage.local
const mockStorage = {};
global.chrome = {
  storage: {
    local: {
      get: jest.fn((keys) => {
        return new Promise((resolve) => {
          if (typeof keys === 'string') {
            resolve({ [keys]: mockStorage[keys] });
          } else if (Array.isArray(keys)) {
            const result = {};
            keys.forEach(key => {
              result[key] = mockStorage[key];
            });
            resolve(result);
          } else if (typeof keys === 'object') {
            const result = { ...keys };
            Object.keys(keys).forEach(key => {
              if (mockStorage[key] !== undefined) {
                result[key] = mockStorage[key];
              }
            });
            resolve(result);
          } else {
            resolve({});
          }
        });
      }),
      set: jest.fn((items) => {
        return new Promise((resolve) => {
          Object.assign(mockStorage, items);
          resolve();
        });
      }),
      clear: jest.fn(() => {
        return new Promise((resolve) => {
          Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
          resolve();
        });
      })
    }
  },

  declarativeNetRequest: {
    updateDynamicRules: jest.fn(() => Promise.resolve()),
    getDynamicRules: jest.fn(() => Promise.resolve([]))
  },

  action: {
    setBadgeText: jest.fn(() => Promise.resolve()),
    setBadgeBackgroundColor: jest.fn(() => Promise.resolve())
  },

  runtime: {
    onInstalled: {
      addListener: jest.fn()
    },
    onStartup: {
      addListener: jest.fn()
    },
    onMessage: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn((message) => {
      return new Promise((resolve) => {
        // Simulate response based on message action
        if (message.action === 'getStatus') {
          resolve({
            enabled: false,
            selections: {},
            headers: []
          });
        } else if (message.action === 'updateStatus') {
          resolve({
            enabled: message.enabled,
            selections: message.selections
          });
        } else {
          resolve();
        }
      });
    })
  }
};

// Helper to reset mocks between tests
global.resetChromeMocks = () => {
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  jest.clearAllMocks();
};

// Helper to set mock storage values
global.setMockStorage = (values) => {
  Object.assign(mockStorage, values);
};

// Mock document methods for popup tests
global.mockDOMElements = () => {
  document.body.innerHTML = `
    <input type="checkbox" id="masterToggle" />
    <div id="statusBar"></div>
    <div id="headerList"></div>
    <button id="selectAll"></button>
    <button id="deselectAll"></button>
    <button id="langToggle">JP</button>
    <button id="openDevToolsBtn"></button>
    <div id="devToolsTooltip" class="tooltip-content"></div>
    <kbd id="shortcutKey"></kbd>
  `;
};
