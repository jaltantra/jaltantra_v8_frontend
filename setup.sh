#!/bin/bash

echo "🔧 Setting up the frontend environment..."

# Detect package manager
if command -v apt &> /dev/null; then
    PACKAGE_MANAGER="apt"
else
    echo "❌ Unsupported system. Please manually install Node.js and npm."
    exit 1
fi

# Install Node.js if not found
if ! command -v node &> /dev/null; then
    echo "📦 Node.js not found. Installing Node.js 18 (LTS)..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo $PACKAGE_MANAGER install -y nodejs
else
    echo "✅ Node.js is already installed."
fi

# Install npm (comes with Node.js, but double-check)
if ! command -v npm &> /dev/null; then
    echo "⚠️ npm still not found after installing Node.js. Aborting."
    exit 1
else
    echo "✅ npm is installed."
fi

# Install frontend dependencies
echo "📦 Installing npm packages..."
npm install

# Create .env from .env.example if not present
if [ ! -f ".env" ]; then
    echo "📄 Creating .env from .env.example..."
    cp .env.example .env
else
    echo "✅ .env file already exists. Skipping."
fi

echo "✅ Setup complete! Run './run.sh' to start the development server."
