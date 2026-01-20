#!/bin/bash

# Setup script for TEI-IIIF Viewer
# Performs initial installation of all components

set -e  # Exit on error

echo "=========================================="
echo "  TEI-IIIF Viewer - Initial Setup"
echo "=========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Java
if ! command -v java &> /dev/null; then
    echo "❌ Java not found"
    echo ""
    echo "Java is required to run the IIIF image server (Cantaloupe)."
    echo "Please install Java 11 or higher:"
    echo ""
    echo "macOS:"
    echo "  brew install openjdk@11"
    echo "  OR download from: https://adoptium.net/temurin/releases/?os=mac"
    echo ""
    echo "Windows:"
    echo "  winget install EclipseAdoptium.Temurin.11"
    echo "  OR download from: https://adoptium.net/temurin/releases/?os=windows"
    echo ""
    echo "Linux (Ubuntu/Debian):"
    echo "  sudo apt update && sudo apt install openjdk-11-jdk"
    echo ""
    echo "After installing Java, run ./setup.sh again."
    exit 1
fi
echo "✓ Java $(java -version 2>&1 | head -n 1)"

# npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✓ npm $(npm --version)"

echo ""
echo "=========================================="
echo "  1. Frontend Setup"
echo "=========================================="
cd frontend
echo "Installing frontend dependencies..."
npm install
echo "✓ Frontend configured"
cd ..

echo ""
echo "=========================================="
echo "  2. Cantaloupe Setup"
echo "=========================================="
cd cantaloupe

# Check if Cantaloupe is already downloaded
if [ -f "cantaloupe-5.0.6/cantaloupe-5.0.6.jar" ]; then
    echo "✓ Cantaloupe already downloaded"
else
    echo "Downloading Cantaloupe IIIF Server..."
    curl -L -o cantaloupe-5.0.6.zip https://github.com/cantaloupe-project/cantaloupe/releases/download/v5.0.6/cantaloupe-5.0.6.zip
    echo "Extracting..."
    unzip -q cantaloupe-5.0.6.zip
    rm cantaloupe-5.0.6.zip
    echo "✓ Cantaloupe installed"
fi

# Create necessary directories
mkdir -p images
mkdir -p cache

echo "✓ Directories created"

cd ..

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Add your images to: cantaloupe/images/"
echo "   Example: page-1.jpg, page-2.jpg, ..."
echo ""
echo "2. Add your TEI file to: frontend/public/sample-data/"
echo "   Make sure <pb facs> references match image names"
echo ""
echo "3. Start the application with:"
echo "   ./start.sh"
echo ""
echo "To test immediately with placeholder images, run:"
echo "   ./create-sample-images.sh"
echo ""
