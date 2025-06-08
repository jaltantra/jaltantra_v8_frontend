#!/bin/bash

echo "🚀 Starting the Vite development server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️ node_modules not found. Please run ./setup.sh first."
    exit 1
fi

# Run Vite dev server
npm run dev
