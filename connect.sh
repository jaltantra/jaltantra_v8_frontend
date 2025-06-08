#!/bin/bash

# Load variables from .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "❌ .env file not found. Please create it or run setup.sh."
    exit 1
fi

# Validate required variables
if [[ -z "$ROLL_NO" || -z "$SSO_KEY" ]]; then
    echo "❌ ROLL_NO or SSO_KEY not found in .env"
    exit 1
fi

# Perform the SSO login
echo "🌐 Connecting using IITB SSO for $ROLL_NO..."
curl --location-trusted -u "$ROLL_NO:$SSO_KEY" "https://internet-sso.iitb.ac.in/login.php" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ SSO login request sent."
else
    echo "❌ Failed to send SSO login request."
fi
