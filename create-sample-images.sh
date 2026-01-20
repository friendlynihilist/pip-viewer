#!/bin/bash

# Script to create sample images for testing the viewer

set -e

echo "=========================================="
echo "  Creating Test Images"
echo "=========================================="
echo ""

cd cantaloupe/images

echo "Downloading placeholder images..."

# Use placeholder.com to create test images
curl -s -o page-1.jpg "https://via.placeholder.com/2000x3000/e8e8e8/333333?text=Page+1"
echo "✓ page-1.jpg"

curl -s -o page-2.jpg "https://via.placeholder.com/2000x3000/e8e8e8/333333?text=Page+2"
echo "✓ page-2.jpg"

curl -s -o page-3.jpg "https://via.placeholder.com/2000x3000/e8e8e8/333333?text=Page+3"
echo "✓ page-3.jpg"

curl -s -o page-4.jpg "https://via.placeholder.com/2000x3000/e8e8e8/333333?text=Page+4"
echo "✓ page-4.jpg"

cd ../..

echo ""
echo "✓ 4 test images created in cantaloupe/images/"
echo ""
echo "These images correspond to the sample TEI file:"
echo "  frontend/public/sample-data/sample.xml"
echo ""
echo "To use your own images:"
echo "  1. Replace the images in cantaloupe/images/"
echo "  2. Update the references in your TEI file"
echo ""
