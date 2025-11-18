#!/bin/bash
cd /home/vagrant/workspace/as-agent/node_modules
mkdir -p @as-agent @opentui
cd @as-agent
rm -f script plugin sdk
ln -s ../../packages/script script
ln -s ../../packages/plugin plugin
ln -s ../../packages/sdk/js sdk
cd ../@opentui
rm -f solid core
ln -s ../.bun/@opentui+solid@0.1.46+1753ef9b65046169/node_modules/@opentui/solid solid
ln -s ../.bun/@opentui+core@0.1.46+81ecd8642a1892ca/node_modules/@opentui/core core
echo "Symlinks fixed"
