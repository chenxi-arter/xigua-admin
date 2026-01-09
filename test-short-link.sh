#!/bin/bash

# Test short link creation API
# Endpoint: POST /api/short-links

echo "Testing Short Link Creation API..."
echo "===================================="
echo ""

# Test data
curl -X POST http://localhost:8080/api/short-links \
  -H "Content-Type: application/json" \
  -d '{
    "originalURL": "https://t.me/xgshort_bot/xgapp?startapp=__series__AMsKWubRa5y___eid=CAZdMvPgJmI",
    "domain": "xgtv.short.gy",
    "allowDuplicates": false,
    "ttl": "2026-01-18T00:00:00Z"
  }' | jq '.'

echo ""
echo "===================================="
