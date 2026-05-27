#!/bin/bash
set -m

# Kill anything on our ports
killall -9 node 2>/dev/null

# Start API server on 8080
node /tmp/serve_kage_api.js &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to start
sleep 2

# Start SSH tunnel
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -o ExitOnForwardFailure=yes -R 80:localhost:8080 nokey@localhost.run &
TUNNEL_PID=$!
echo "Tunnel PID: $TUNNEL_PID"

# Wait for tunnel to establish
sleep 10

# Print the URL
grep "lhr.life" /proc/$TUNNEL_PID/fd/1 2>/dev/null || echo "Check logs for URL"

echo "=== Server + Tunnel running ==="
echo "Local: http://localhost:8080"

# Keep running
wait $SERVER_PID $TUNNEL_PID
