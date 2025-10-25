#!/bin/bash

echo ""
echo "🚀 FNG App Deployment Script"
echo "=============================="
echo ""

# Step 1: Fix _redirects
echo "Step 1/3: Fixing _redirects file..."
rm -rf public/_redirects
echo "/* /index.html 200" > public/_redirects

# Verify
if [ -f "public/_redirects" ]; then
    echo "✅ _redirects file created successfully"
    echo "   Content: $(cat public/_redirects)"
else
    echo "❌ ERROR: Failed to create _redirects file"
    exit 1
fi

echo ""

# Step 2: Commit
echo "Step 2/3: Committing changes..."
git add .
git commit -m "Deploy FNG app - $(date '+%Y-%m-%d %H:%M:%S')"

if [ $? -eq 0 ]; then
    echo "✅ Changes committed"
else
    echo "⚠️  No changes to commit (or git error)"
fi

echo ""

# Step 3: Push
echo "Step 3/3: Pushing to GitHub..."
git push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Deployment initiated"
    echo ""
    echo "🌐 Your site will be live in ~3 minutes"
    echo "📊 Check status at: https://app.netlify.com"
    echo ""
else
    echo ""
    echo "❌ ERROR: Failed to push to GitHub"
    echo "   Check your internet connection and Git configuration"
    echo ""
    exit 1
fi
