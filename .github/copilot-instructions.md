# GitHub Copilot Custom Instructions for Akamai Pragma Injector

## Project Overview

This is a Chrome/Edge browser extension that injects Akamai Pragma debug headers into HTTP requests. It helps developers debug Akamai CDN cache behavior.

## Tech Stack

- **Type**: Browser Extension (Manifest V3)
- **Languages**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **APIs**: Chrome Extension APIs (declarativeNetRequest, storage, runtime)
- **Testing**: Jest with jsdom
- **Target Browsers**: Chrome, Edge (Chromium-based)

## Project Structure

```
/
├── manifest.json      # Extension manifest (Manifest V3)
├── background.js      # Service worker for header injection
├── popup.html         # Extension popup UI
├── popup.js           # Popup interaction logic
├── icons/             # Extension icons (16, 48, 128px)
├── tests/             # Jest test files
└── store-assets/      # Chrome/Edge store submission assets
```

## Code Style Guidelines

### JavaScript
- Use ES6+ features (const/let, arrow functions, async/await, template literals)
- No external dependencies in production code
- Use Chrome Extension APIs directly (chrome.*)
- All user-facing strings should support i18n (English and Japanese)
- Prefer descriptive variable names over comments

### Naming Conventions
- Functions: camelCase (e.g., `updateDebugHeadersRule`)
- Constants: UPPER_SNAKE_CASE (e.g., `PRAGMA_HEADERS`)
- DOM IDs: camelCase (e.g., `masterToggle`)
- CSS classes: kebab-case (e.g., `header-item`)

### i18n Pattern
```javascript
const i18n = {
  en: { key: "English text" },
  ja: { key: "日本語テキスト" }
};
```

## Key Components

### PRAGMA_HEADERS (background.js)
Array of Akamai debug header definitions:
```javascript
{
  id: "cache",           // Unique identifier
  pragma: "akamai-x-cache-on",  // Pragma header value
  responseHeader: "X-Cache",     // Expected response header
  description: { en: "...", ja: "..." }  // i18n descriptions
}
```

### State Management
- Uses `chrome.storage.local` for persistence
- State shape: `{ enabled: boolean, selections: { [headerId]: boolean } }`

### declarativeNetRequest Rules
- Single rule with ID 1
- Modifies Pragma header for all resource types
- Rule is added/removed based on enabled state

## Testing Guidelines

- Mock Chrome APIs in `tests/setup.js`
- Test pure functions directly
- Test state transitions
- Test i18n text retrieval

## Common Tasks

### Adding a new Pragma header
1. Add entry to `PRAGMA_HEADERS` in `background.js`
2. Include `id`, `pragma`, `responseHeader`, `description` (en/ja)
3. Add test case in `tests/background.test.js`

### Modifying UI
1. Update `popup.html` for structure changes
2. Update CSS in `<style>` tag within `popup.html`
3. Update `popup.js` for behavior changes
4. Add i18n keys to both `en` and `ja` objects

### Store Submission
- Update version in `manifest.json`
- Update `store-assets/` files if needed
- Run `npm run zip` to create submission package

## Important Notes

- No remote code loading (Chrome Web Store requirement)
- Minimal permissions only
- Extension must work completely offline
- All data stays local (no external API calls)
