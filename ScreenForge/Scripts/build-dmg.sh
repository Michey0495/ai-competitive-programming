#!/bin/bash
set -euo pipefail

APP_NAME="ScreenForge"
BUILD_DIR="$(cd "$(dirname "$0")/.." && pwd)/.build/release"
DMG_DIR="$(cd "$(dirname "$0")/.." && pwd)/.build/dmg"
DMG_OUTPUT="$(cd "$(dirname "$0")/.." && pwd)/${APP_NAME}.dmg"

echo "Building ${APP_NAME}..."
cd "$(dirname "$0")/.."
swift build -c release

echo "Creating app bundle..."
APP_BUNDLE="${DMG_DIR}/${APP_NAME}.app"
rm -rf "${DMG_DIR}"
mkdir -p "${APP_BUNDLE}/Contents/MacOS"
mkdir -p "${APP_BUNDLE}/Contents/Resources"

cp "${BUILD_DIR}/${APP_NAME}" "${APP_BUNDLE}/Contents/MacOS/"
cp "${APP_NAME}/Info.plist" "${APP_BUNDLE}/Contents/"
cp "${APP_NAME}/ScreenForge.entitlements" "${APP_BUNDLE}/Contents/"

if [ -d "${APP_NAME}/Resources/Assets.xcassets" ]; then
    echo "Note: Assets.xcassets needs to be compiled with actool"
fi

echo "Creating DMG..."
rm -f "${DMG_OUTPUT}"

# Create temporary DMG
hdiutil create -volname "${APP_NAME}" \
    -srcfolder "${DMG_DIR}" \
    -ov -format UDZO \
    "${DMG_OUTPUT}"

echo "DMG created: ${DMG_OUTPUT}"
echo "Size: $(du -h "${DMG_OUTPUT}" | cut -f1)"
