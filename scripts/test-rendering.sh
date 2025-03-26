#!/bin/bash

# Enhanced test script with detailed output
PORT=5174
BASE_URL="http://localhost:$PORT/rwzb/"

echo "Testing server response from $BASE_URL"

# 1. Verify server is running
echo -n "Checking server status... "
if curl -s -L --head "$BASE_URL" | grep -q "HTTP/1.[01] [23].."; then
  echo "OK"
else
  echo "FAILED"
  echo "ERROR: Server not running at $BASE_URL"
  exit 1
fi

# 2. Get page content
echo -n "Fetching page content... "
HTML=$(curl -s -L "$BASE_URL")
echo "DONE"

# 3. Verify required elements
echo "Checking required elements:"
required_elements=(
  "div id=\"app\""
  "Zugerberg Running Time"
  "Loading data|Error:|No running time data available"
)

all_ok=true
for element in "${required_elements[@]}"; do
  echo -n "- Checking '$element'... "
  if echo "$HTML" | grep -qE "$element"; then
    echo "FOUND"
  else
    echo "MISSING"
    all_ok=false
  fi
done

if $all_ok; then
  echo "SUCCESS: All required elements found"
  exit 0
else
  echo "ERROR: Some required elements missing"
  exit 1
fi

echo "SUCCESS: Page rendering validated"
exit 0