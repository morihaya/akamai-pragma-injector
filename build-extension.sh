#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"
UNPACKED_DIR="$BUILD_DIR/unpacked"
EXTENSION_NAME="akamai-pragma-injector"
VERSION="$(node -p "JSON.parse(require('node:fs').readFileSync('$SCRIPT_DIR/manifest.json', 'utf8')).version")"
CHROME_ZIP="$BUILD_DIR/${EXTENSION_NAME}-chrome-v${VERSION}.zip"
EDGE_ZIP="$BUILD_DIR/${EXTENSION_NAME}-edge-v${VERSION}.zip"

if ! command -v zip >/dev/null 2>&1; then
  echo "Error: zip is required to build the store packages." >&2
  exit 1
fi

mkdir -p "$BUILD_DIR"
rm -rf "$UNPACKED_DIR"
mkdir -p "$UNPACKED_DIR"

cp "$SCRIPT_DIR"/{manifest.json,background.js,popup.html,popup.js} "$UNPACKED_DIR/"
cp -R "$SCRIPT_DIR/icons" "$SCRIPT_DIR/shared" "$UNPACKED_DIR/"

find "$UNPACKED_DIR" -name .DS_Store -delete

rm -f "$CHROME_ZIP" "$EDGE_ZIP"
(
  cd "$UNPACKED_DIR"
  zip -qr "$CHROME_ZIP" .
)
cp "$CHROME_ZIP" "$EDGE_ZIP"

unzip -tq "$CHROME_ZIP"
unzip -tq "$EDGE_ZIP"

echo "Build completed for ${EXTENSION_NAME} v${VERSION}:"
echo "  Chrome Web Store: $CHROME_ZIP"
echo "  Microsoft Edge Add-ons: $EDGE_ZIP"
echo "  Unpacked extension: $UNPACKED_DIR"
