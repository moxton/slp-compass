#!/bin/bash

# List of file extensions to check (add more as needed)
exts=(js jsx ts tsx md json css html toml txt)

# Build the find command with multiple -name patterns
find_cmd="find . \("
for ext in "${exts[@]}"; do
  find_cmd+=" -name '*.'$ext -o"
done
find_cmd=${find_cmd% -o} # Remove trailing -o
find_cmd+=" \) ! -name 'package-lock.json' ! -name 'bun.lockb' ! -path './node_modules/*' -type f -print0"

echo "Scanning for merge conflict markers in source files..."

eval $find_cmd | xargs -0 grep -n -E '<<<<<<<|=======|>>>>>>>' || echo "No conflict markers found."

echo "Scan complete."
