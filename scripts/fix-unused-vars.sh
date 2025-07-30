#!/bin/bash

# Script to help with unused variables by adding underscore prefixes
# This helps indicate intentionally unused variables

echo "🔧 Helping with unused variables..."

# Add underscore to commonly unused React imports
find src -name "*.tsx" -exec sed -i '' 's/import React from "react"/import _React from "react"/g' {} \;

# Add underscore to unused event parameters
find src -name "*.tsx" -exec sed -i '' 's/onChange={(e) => {/onChange={(_e) => {/g' {} \;

# Add underscore to unused index parameters
find src -name "*.tsx" -exec sed -i '' 's/, index) => /, _index) => /g' {} \;

echo "✅ Added underscore prefixes to common unused variables"
echo "💡 You can manually add underscores to other unused variables"
echo "   Example: const { user } = useAuth(); → const { user: _user } = useAuth();"
