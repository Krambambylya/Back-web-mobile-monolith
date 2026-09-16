#!/usr/bin/env bash
# Print a phone-reachable API origin for EXPO_PUBLIC_API_URL.
set -euo pipefail

lan_ip=""
if command -v ipconfig >/dev/null 2>&1; then
  lan_ip="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
fi
if [[ -z "$lan_ip" ]] && command -v hostname >/dev/null 2>&1; then
  lan_ip="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
fi
if [[ -z "$lan_ip" ]]; then
  echo "Could not detect a LAN IP. On the phone use your computer's Wi-Fi address, not localhost." >&2
  exit 1
fi

echo "Physical device (same Wi-Fi):"
echo "  EXPO_PUBLIC_API_URL=http://${lan_ip}:4000"
echo
echo "Android emulator:"
echo "  EXPO_PUBLIC_API_URL=http://10.0.2.2:4000"
echo
echo "iOS simulator and web:"
echo "  EXPO_PUBLIC_API_URL=http://localhost:4000"
