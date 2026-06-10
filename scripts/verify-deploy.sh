#!/usr/bin/env bash
# Smoke-test deployed Pokedex services.
# Usage: REST_URL=... GQL_URL=... FE_URL=... ./scripts/verify-deploy.sh
set -euo pipefail

: "${REST_URL:?Set REST_URL}"
: "${GQL_URL:?Set GQL_URL}"
: "${FE_URL:?Set FE_URL}"

echo "Checking REST health..."
curl -sf "$REST_URL/health" | grep -q '"status":"ok"'

echo "Checking GraphQL..."
curl -sf -X POST "$GQL_URL/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ regions { id name } }"}' | grep -q '"data"'

echo "Checking frontend..."
curl -sf "$FE_URL" | grep -q -i "pok"

echo "All checks passed."
