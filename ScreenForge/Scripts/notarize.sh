#!/bin/bash
set -euo pipefail

APP_NAME="ScreenForge"
DMG_PATH="$(cd "$(dirname "$0")/.." && pwd)/${APP_NAME}.dmg"
BUNDLE_ID="com.ghostfee.ScreenForge"

# These should be set as environment variables
: "${APPLE_ID:?Set APPLE_ID environment variable}"
: "${TEAM_ID:?Set TEAM_ID environment variable}"
: "${APP_PASSWORD:?Set APP_PASSWORD environment variable (app-specific password)}"

echo "Signing app..."
APP_PATH="$(cd "$(dirname "$0")/.." && pwd)/.build/dmg/${APP_NAME}.app"
codesign --force --deep --sign "Developer ID Application: ${TEAM_ID}" \
    --options runtime \
    --entitlements "$(dirname "$0")/../${APP_NAME}/ScreenForge.entitlements" \
    "${APP_PATH}"

echo "Submitting for notarization..."
xcrun notarytool submit "${DMG_PATH}" \
    --apple-id "${APPLE_ID}" \
    --team-id "${TEAM_ID}" \
    --password "${APP_PASSWORD}" \
    --wait

echo "Stapling notarization..."
xcrun stapler staple "${DMG_PATH}"

echo "Notarization complete!"
echo "Verifying..."
spctl --assess --type open --context context:primary-signature --verbose "${DMG_PATH}"
