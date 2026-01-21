#!/bin/bash

echo "=========================================="
echo "  TEI-IIIF Viewer - Diagnostics"
echo "=========================================="
echo ""

echo "1. Checking Java..."
if command -v java &> /dev/null; then
    echo "✓ Java found: $(java -version 2>&1 | head -n 1)"
else
    echo "❌ Java NOT found"
    echo "   Please install Java 11+ (see setup.sh for instructions)"
fi
echo ""

echo "2. Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✓ Node.js found: $(node --version)"
else
    echo "❌ Node.js NOT found"
fi
echo ""

echo "3. Checking if Cantaloupe JAR exists..."
if [ -f "cantaloupe/cantaloupe-5.0.6/cantaloupe-5.0.6.jar" ]; then
    echo "✓ Cantaloupe JAR found"
else
    echo "❌ Cantaloupe JAR NOT found"
    echo "   Run ./setup.sh to download it"
fi
echo ""

echo "4. Checking if frontend dependencies are installed..."
if [ -d "frontend/node_modules" ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies NOT installed"
    echo "   Run ./setup.sh to install them"
fi
echo ""

echo "5. Checking for images..."
image_count=$(ls cantaloupe/images/*.jpg 2>/dev/null | wc -l | xargs)
if [ "$image_count" -gt 0 ]; then
    echo "✓ Found $image_count images"
else
    echo "⚠️  No images found in cantaloupe/images/"
    echo "   Run ./create-sample-images.sh for test images"
fi
echo ""

echo "6. Checking if services are running..."
echo ""
echo "   Checking Cantaloupe (port 8182)..."
if lsof -i :8182 &> /dev/null; then
    echo "   ✓ Cantaloupe is running"
else
    echo "   ❌ Cantaloupe is NOT running"
fi
echo ""

echo "   Checking Frontend (port 5173)..."
if lsof -i :5173 &> /dev/null; then
    echo "   ✓ Frontend is running on port 5173"
else
    echo "   ⚠️  Frontend is NOT running on port 5173"
    echo "   (May be using a different port - check start.sh output)"
fi
echo ""

echo "7. Testing Cantaloupe connection..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8182/ | grep -q "200"; then
    echo "✓ Cantaloupe responds correctly"
else
    echo "❌ Cantaloupe is not responding"
    echo "   Make sure it's running with ./start.sh"
fi
echo ""

echo "=========================================="
echo "  Diagnostics Complete"
echo "=========================================="
