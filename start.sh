#!/bin/bash

# Startup script for TEI-IIIF Viewer
# Starts both Cantaloupe and the frontend

set -e

echo "=========================================="
echo "  TEI-IIIF Viewer - Starting"
echo "=========================================="
echo ""

# Cleanup function when script is stopped
cleanup() {
    echo ""
    echo "Stopping services..."
    if [ ! -z "$CANTALOUPE_PID" ]; then
        kill $CANTALOUPE_PID 2>/dev/null || true
        echo "✓ Cantaloupe stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        echo "✓ Frontend stopped"
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Check that setup has been run
if [ ! -f "cantaloupe/cantaloupe-5.0.6/cantaloupe-5.0.6.jar" ]; then
    echo "❌ Cantaloupe not found. Please run ./setup.sh first"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed. Please run ./setup.sh first"
    exit 1
fi

# Check if there are images
if [ -z "$(ls -A cantaloupe/images/*.jpg 2>/dev/null)" ] && [ -z "$(ls -A cantaloupe/images/*.png 2>/dev/null)" ]; then
    echo "⚠️  No images found in cantaloupe/images/"
    echo ""
    echo "Options:"
    echo "  1. Copy your images to cantaloupe/images/"
    echo "  2. Run ./create-sample-images.sh to create test images"
    echo ""
    read -p "Do you want to create test images now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./create-sample-images.sh
    else
        echo "Exiting. Add images and try again."
        exit 1
    fi
fi

echo "Starting Cantaloupe IIIF Server..."
cd cantaloupe
java -Dcantaloupe.config=./cantaloupe.properties -Xmx2g -jar cantaloupe-5.0.6/cantaloupe-5.0.6.jar &
CANTALOUPE_PID=$!
cd ..

echo "✓ Cantaloupe starting (PID: $CANTALOUPE_PID)"
echo "  IIIF Server: http://localhost:8182"
echo ""

# Wait for Cantaloupe to start completely
echo "Waiting for Cantaloupe to initialize (this takes ~8 seconds)..."
sleep 8

# Verify that Cantaloupe actually started
if ! ps -p $CANTALOUPE_PID > /dev/null; then
    echo "❌ Cantaloupe failed to start"
    echo "Please check for errors above"
    exit 1
fi

echo "✓ Cantaloupe ready"
echo ""

echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "  Application Started!"
echo "=========================================="
echo ""
echo "The frontend URL will appear above (usually http://localhost:5173)"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for one of the processes to terminate
wait $CANTALOUPE_PID $FRONTEND_PID
