#!/usr/bin/env bash
set -e

echo "🛠️  Restructuring repo..."

# 1) Ensure target dirs exist
mkdir -p backend frontend

# 2) Move server & prisma into backend
if [ -d server ]; then
  mv server backend/
  echo "→ moved server/ → backend/server/"
else
  echo "⚠️  server/ not found; skipping"
fi
if [ -d prisma ]; then
  mv prisma backend/
  echo "→ moved prisma/ → backend/prisma/"
else
  echo "⚠️  prisma/ not found; skipping"
fi

# 3) Move frontend assets into frontend/
for item in src public index.html vite.config.js tsconfig.json tailwind.config.cjs postcss.config.js package.json; do
  if [ -e "$item" ]; then
    mv "$item" frontend/
    echo "→ moved $item → frontend/$item"
  else
    echo "⚠️  $item not found; skipping"
  fi
done

# 4) Clean up any empty leftovers
for leftover in server prisma src public index.html vite.config.js tsconfig.json tailwind.config.cjs postcss.config.js package.json; do
  if [ ! -e "$leftover" ]; then
    continue
  fi
  # only remove if directory and empty, or file
  if [ -d "$leftover" ] && [ -z "$(ls -A "$leftover")" ]; then
    rm -rf "$leftover"
    echo "→ removed empty dir $leftover"
  elif [ -f "$leftover" ]; then
    rm -f "$leftover"
    echo "→ removed stray file $leftover"
  fi
done

# 5) Show resulting structure
echo
echo "✅ Done. Top-level tree (L2):"
tree -L 2
