#!/bin/bash

# Script to modernize React components from React.FC to modern function declarations

echo "🚀 Modernizing React components..."

# Find all TypeScript React files and update React.FC patterns
find src -name "*.tsx" -type f | while read file; do
    echo "Processing: $file"
    
    # Replace React.FC with no props
    sed -i '' 's/const \([A-Z][a-zA-Z0-9]*\): React\.FC = () => {/function \1() {/g' "$file"
    
    # Replace React.FC with props
    sed -i '' 's/const \([A-Z][a-zA-Z0-9]*\): React\.FC<\([^>]*\)> = (/function \1(/g' "$file"
    
    # Remove duplicate export statements if they exist
    sed -i '' '/^export default [A-Z][a-zA-Z0-9]*;$/d' "$file"
    
    # Add export default to function declarations that need it
    sed -i '' 's/^function \([A-Z][a-zA-Z0-9]*\)(/export default function \1(/g' "$file"
done

echo "✅ React.FC modernization complete!"
echo "📝 Remember to:"
echo "   1. Check for any compilation errors"
echo "   2. Remove unused React imports where possible"
echo "   3. Test your components"
