#!/bin/bash

# Get the port number (default: 5174)
PORT=${1:-5174}

# Start ngrok in the background and capture the output
ngrok http $PORT > ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for the URL to be generated
sleep 3

# Extract the public URL
PUBLIC_URL=$(grep -o 'https://.*\.ngrok-free\.app' ngrok.log | head -1)

if [ -z "$PUBLIC_URL" ]; then
  echo "Failed to get ngrok URL. Check ngrok.log for details."
  exit 1
fi

echo "✅ App is now accessible at: $PUBLIC_URL"
echo "✅ Share this URL with your friend"
echo "✅ Press Ctrl+C to stop ngrok when done"

# Keep the script running so ngrok stays alive
wait $NGROK_PID