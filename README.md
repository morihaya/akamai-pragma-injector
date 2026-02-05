# Akamai Pragma Injector
[![Test](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/test.yml/badge.svg)](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/test.yml)
[![CodeQL](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/github-code-scanning/codeql)
[![Dependabot Updates](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/morihaya/akamai-pragma-injector/actions/workflows/dependabot/dependabot-updates)

[日本語版 README はこちら](README.ja.md)

A Chrome/Edge browser extension that easily injects Akamai Pragma debug headers into HTTP requests. Helps developers debug Akamai CDN cache behavior.

## Features

- **One-click ON/OFF**: Toggle debug headers with a simple switch
- **Visual status indicator**: Badge shows "ON" when active
- **Selective headers**: Choose which debug headers to inject
- **Bilingual UI**: Supports English and Japanese
- **Minimal permissions**: Only requests necessary permissions

## Debug Headers

Adds the following parameters to the `Pragma` header:

- `akamai-x-cache-on`
- `akamai-x-cache-remote-on`
- `akamai-x-check-cacheable`
- `akamai-x-get-cache-key`
- `akamai-x-get-extracted-values`
- `akamai-x-get-request-id`
- `akamai-x-serial-no`
- `akamai-x-get-true-cache-key`

## Installation

### From Chrome Web Store / Edge Add-ons

Coming soon...

### Developer Mode Installation

1. Clone or download this repository
2. Open `chrome://extensions/` in Chrome/Edge
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the downloaded folder

## Usage

1. Click the extension icon in the browser toolbar
2. Toggle the switch to enable/disable header injection
3. Select the specific headers you want to inject
4. When enabled, all HTTP requests will include the selected Akamai debug headers
5. Open DevTools (F12) → Network tab to view response headers

## Permissions

This extension uses the following permissions:

| Permission | Purpose |
|------------|---------|
| `declarativeNetRequest` | Add headers to outgoing requests |
| `storage` | Save ON/OFF state and preferences |
| `<all_urls>` | Apply headers to all websites |

**Note**: Although it shows "Read and change all your data on all websites", this extension:
- Only **adds** Pragma headers; it does not read any data
- Does nothing when disabled
- Never accesses cookies or other sensitive data

## References

- [Akamai Pragma Headers Documentation](https://techdocs.akamai.com/edge-diagnostics/docs/pragma-headers)

## Development

### Setup

```bash
npm install
```

### Run Tests

```bash
# Run tests
npm test

# Watch mode (auto-run on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Lint

```bash
npm run lint
```

### Build ZIP for Store Submission

```bash
npm run zip
```

## License

MIT License
