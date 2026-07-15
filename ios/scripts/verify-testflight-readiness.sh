#!/bin/sh
set -e

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PBXPROJ="$ROOT_DIR/ios/bplusvansales.xcodeproj/project.pbxproj"
ICON="$ROOT_DIR/ios/bplusvansales/Images.xcassets/AppIcon.appiconset/vansales_icon.png"
PLIST="$ROOT_DIR/ios/bplusvansales/Info.plist"

echo "=== TestFlight Readiness Check ==="

BUNDLE_ID=$(rg -m1 "PRODUCT_BUNDLE_IDENTIFIER = " "$PBXPROJ" | sed 's/.*= //;s/;//')
MARKETING_VERSION=$(rg -m1 "MARKETING_VERSION = " "$PBXPROJ" | sed 's/.*= //;s/;//')
BUILD_NUMBER=$(rg -m1 "CURRENT_PROJECT_VERSION = " "$PBXPROJ" | sed 's/.*= //;s/;//')
TEAM_ID=$(rg -m1 "DEVELOPMENT_TEAM = " "$PBXPROJ" | sed 's/.*= //;s/;//')

echo "Bundle ID       : $BUNDLE_ID"
echo "Version         : $MARKETING_VERSION ($BUILD_NUMBER)"
echo "Development Team: $TEAM_ID"
echo ""
echo "App Store Connect ต้องใช้ Bundle ID เดียวกัน: $BUNDLE_ID"
echo ""

if [ ! -f "$ICON" ]; then
  echo "[FAIL] App icon not found: $ICON"
  exit 1
fi

ICON_META=$(sips -g pixelWidth -g pixelHeight -g hasAlpha "$ICON")
echo "$ICON_META"
echo ""

echo "$ICON_META" | rg -q "pixelWidth: 1024" || { echo "[FAIL] Icon width must be 1024"; exit 1; }
echo "$ICON_META" | rg -q "pixelHeight: 1024" || { echo "[FAIL] Icon height must be 1024"; exit 1; }
echo "$ICON_META" | rg -q "hasAlpha: no" || { echo "[FAIL] Icon must not have alpha channel"; exit 1; }

rg -q "ITSAppUsesNonExemptEncryption" "$PLIST" && echo "[OK] ITSAppUsesNonExemptEncryption present" || echo "[WARN] Missing ITSAppUsesNonExemptEncryption"
rg -q "NSPhotoLibraryUsageDescription" "$PLIST" && echo "[OK] NSPhotoLibraryUsageDescription set" || echo "[FAIL] Missing NSPhotoLibraryUsageDescription"
rg -q "NSLocationWhenInUseUsageDescription" "$PLIST" && echo "[OK] NSLocationWhenInUseUsageDescription set" || echo "[WARN] NSLocationWhenInUseUsageDescription empty"
rg -q "NSPhotoLibraryUsageDescription" "$PLIST" || exit 1

echo ""
echo "[OK] Local iOS project checks passed."
echo "Next: Archive in Xcode → Upload → wait 10-60 min → TestFlight → Builds"
echo "If build 1 failed validation, upload again with incremented build number."
