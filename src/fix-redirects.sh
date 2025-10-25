#!/bin/bash

echo "🔧 Fixing _redirects file..."
echo ""

# Remove the _redirects directory if it exists
if [ -d "public/_redirects" ]; then
    echo "❌ Found _redirects as a directory - deleting..."
    rm -rf public/_redirects
fi

# Remove the _redirects file if it exists (to start fresh)
if [ -f "public/_redirects" ]; then
    echo "🗑️  Removing old _redirects file..."
    rm public/_redirects
fi

# Create proper _redirects file
echo "/* /index.html 200" > public/_redirects

# Verify it was created
if [ -f "public/_redirects" ]; then
    echo ""
    echo "✅ SUCCESS! _redirects file created properly"
    echo ""
    echo "📄 File content:"
    cat public/_redirects
    echo ""
    echo "📝 File details:"
    ls -lah public/_redirects
    echo ""
    echo "🚀 You can now deploy to Netlify!"
else
    echo ""
    echo "❌ ERROR: Failed to create _redirects file"
    echo "Please create it manually in /public/_redirects"
fi
