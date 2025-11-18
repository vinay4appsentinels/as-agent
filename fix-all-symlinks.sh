#!/bin/bash
set -e
cd /home/vagrant/workspace/as-agent/node_modules

echo "Fixing workspace symlinks..."

# Fix workspace packages (@as-agent/*)
mkdir -p @as-agent
cd @as-agent
rm -f script plugin sdk
ln -s ../../packages/script script
ln -s ../../packages/plugin plugin  
ln -s ../../packages/sdk/js sdk
cd ..

echo "Fixed @as-agent workspace packages"

# Fix all top-level package symlinks that point wrong
echo "Fixing top-level package symlinks..."
for link in $(find . -maxdepth 1 -type l 2>/dev/null); do
    target=$(readlink "$link")
    # Fix if pointing to ../../../node_modules/.bun/
    if [[ "$target" == ../../../node_modules/.bun/* ]]; then
        new_target=".bun/${target#../../../node_modules/.bun/}"
        echo "  Fixing $link"
        rm "$link"
        ln -s "$new_target" "$link"
    fi
done

# Fix all scoped package symlinks (@scope/package)
echo "Fixing scoped package symlinks..."
for scope_dir in @*/; do
    [ -d "$scope_dir" ] || continue
    cd "$scope_dir"
    for link in *; do
        if [ -L "$link" ]; then
            target=$(readlink "$link")
            # Fix if pointing to ../../../../node_modules/.bun/
            if [[ "$target" == ../../../../node_modules/.bun/* ]]; then
                new_target="../.bun/${target#../../../../node_modules/.bun/}"
                echo "  Fixing $scope_dir$link"
                rm "$link"
                ln -s "$new_target" "$link"
            fi
        fi
    done
    cd ..
done

echo "✓ All symlinks fixed!"
