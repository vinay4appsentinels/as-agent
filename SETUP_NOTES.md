# AS-Agent Setup Notes

## Installation Status

✅ **Bun Installed**: Version 1.3.2
- Path added to ~/.zshrc: `export PATH="$HOME/.bun/bin:$PATH"`
- Verified working in tmux pane 2.2

✅ **Repository Created**: https://github.com/vinay4appsentinels/as-agent
- All code renamed from OpenCode to AS-Agent
- Successfully pushed to GitHub

✅ **Dependencies Installed**: 3427 packages
- Located in `/home/vagrant/workspace/as-agent/node_modules`

## Known Issues

⚠️ **Workspace Symlink Issues**:
The project uses Bun's workspace feature which creates symlinks. Some symlinks have incorrect relative paths after copying from opencode directory. A fix script has been created: `./fix-all-symlinks.sh`

⚠️ **Dev Mode Module Resolution**:
Running `bun run dev` currently has module resolution issues with the workspace setup. This is a known limitation with Bun's workspace + symlink handling.

## Working Demonstrations

✅ **OpenCode Binary Works**: The compiled opencode binary in `/home/vagrant/workspace/opencode/packages/opencode/dist/opencode-linux-x64/bin/opencode` runs successfully and displays help.

## How to Run AS-Agent (Workaround)

Until the workspace symlink issues are resolved, you can:

### Option 1: Use the OpenCode binary
```bash
cd ~/workspace/opencode/packages/opencode
./dist/opencode-linux-x64/bin/opencode --help
```

### Option 2: Build AS-Agent from scratch
```bash
cd ~/workspace/as-agent
# Clean everything
rm -rf node_modules bun.lock
rm -rf packages/as-agent/node_modules

# Fresh install
bun install

# Fix symlinks
./fix-all-symlinks.sh

# Build (requires fixing build script issues first)
cd packages/as-agent
bun run build --single
```

### Option 3: Run in development from workspace root
```bash
cd ~/workspace/as-agent
export PATH="$HOME/.bun/bin:$PATH"
bun run dev
```

## Files Modified for AS-Agent

- `package.json`: Changed name and dependencies from @opencode-ai to @as-agent
- `packages/as-agent/`: Renamed from packages/opencode
- `packages/script/src/index.ts`: Updated references
- `packages/as-agent/script/build.ts`: Updated build configuration
- `README.md`: Updated with AS-Agent branding

## Next Steps

1. **Resolve workspace symlinks**: Either fix Bun's workspace configuration or migrate to a simpler structure
2. **Complete the build**: Run `bun run build --single` successfully  
3. **Test the binary**: `./dist/as-agent-linux-x64/bin/as-agent --help`
4. **Integrate with threat detection**: Add security-specific modules and features

## Quick Commands

```bash
# Start bun in any shell
export PATH="$HOME/.bun/bin:$PATH"

# Fix symlinks
cd ~/workspace/as-agent && ./fix-all-symlinks.sh

# Check bun version
bun --version

# List packages
bun pm ls
```
