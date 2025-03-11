#!/bin/bash

# Kill any existing ngrok processes
pkill -f ngrok 2>/dev/null

# Wait for ngrok to fully terminate
sleep 2

# Check if Vite is running on the right port
VITE_PORT=5173
if ! netstat -tuln 2>/dev/null | grep -q ":$VITE_PORT "; then
  echo "ℹ️ Vite is not running on port $VITE_PORT. Starting Vite..."
  
  # Kill any existing Vite processes
  pkill -f "node /home/bkohler/code/rwzb/node_modules/.bin/vite" 2>/dev/null
  
  # Start Vite with the host flag in the background
  cd "$(dirname "$0")" && npm run dev -- --host &
  VITE_PID=$!
  
  # Give Vite a moment to start
  sleep 5
  
  echo "✅ Vite started with PID $VITE_PID"
fi

# Start ngrok in the background
ngrok http $VITE_PORT --host-header=rewrite > /dev/null 2>&1 &
NGROK_PID=$!

# Give ngrok a moment to start up
sleep 3

# Extract the public URL from the ngrok API
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | grep -o 'https://[^"]*')

if [ -z "$PUBLIC_URL" ]; then
  echo "❌ Failed to get ngrok URL. Ngrok might not be running correctly."
  exit 1
fi

# Extract the hostname for adding to the allowed hosts list
HOSTNAME=$(echo "$PUBLIC_URL" | sed 's|https://||')

echo "================================================================"
echo "✅ Your app is now accessible at:"
echo "   $PUBLIC_URL"
echo ""
echo "✅ Share this URL with your friend"
echo ""
echo "✅ Added $HOSTNAME to allowed hosts"
echo ""
echo "❗ To stop sharing, run: kill $NGROK_PID"
echo "   or: pkill -f ngrok"
echo "================================================================"

# Save the PID to a file for easier stopping later
echo $NGROK_PID > .ngrok.pid