# Running AS-Agent

## ✅ Status: FULLY OPERATIONAL

Both dev mode and release mode are now working!

## Prerequisites

- **Bun v1.3.2** installed and in PATH
- All dependencies installed
- Symlinks fixed with `./fix-all-symlinks.sh`

## Running in Dev Mode

Dev mode runs directly from source with hot reloading:

```bash
cd ~/workspace/as-agent/packages/as-agent
export PATH="$HOME/.bun/bin:$PATH"

# Run with any command
bun --conditions=browser ./src/index.ts --help
bun --conditions=browser ./src/index.ts --version
bun --conditions=browser ./src/index.ts [your-project-path]
```

**Dev Mode Features:**
- ✅ Instant startup
- ✅ Direct source execution
- ✅ Version: `local`
- ✅ No build required
- ⚠️ Requires symlinks to be fixed

## Running in Release Mode

Release mode uses the compiled binary (faster startup, standalone):

```bash
cd ~/workspace/as-agent/packages/as-agent

# Run the release binary
./dist/as-agent-linux-x64/bin/as-agent --help
./dist/as-agent-linux-x64/bin/as-agent --version
./dist/as-agent-linux-x64/bin/as-agent [your-project-path]
```

**Release Mode Features:**
- ✅ Fast startup (compiled)
- ✅ Standalone binary (128MB)
- ✅ Version: `0.0.0-main-202511180757`
- ✅ Can be copied anywhere
- ✅ No dependencies needed

## Building Release Binary

To rebuild the release binary:

```bash
cd ~/workspace/as-agent
export PATH="$HOME/.bun/bin:$PATH"

# Make sure symlinks are fixed first
./fix-all-symlinks.sh

# Build for current platform only (faster)
cd packages/as-agent
bun run build --single

# OR build for all platforms (slower, ~10min)
bun run build
```

**Build Outputs:**
- `dist/as-agent-linux-x64/bin/as-agent` - Standard Linux x64
- `dist/as-agent-linux-x64-baseline/bin/as-agent` - Linux x64 (no AVX2)
- `dist/as-agent-linux-x64-musl/bin/as-agent` - Alpine Linux
- `dist/as-agent-linux-x64-baseline-musl/bin/as-agent` - Alpine (no AVX2)

## Quick Start Commands

### Setup (one-time)
```bash
cd ~/workspace/as-agent
export PATH="$HOME/.bun/bin:$PATH"
./fix-all-symlinks.sh
```

### Run Dev Mode
```bash
cd ~/workspace/as-agent/packages/as-agent
bun --conditions=browser ./src/index.ts
```

### Run Release Mode
```bash
cd ~/workspace/as-agent/packages/as-agent
./dist/as-agent-linux-x64/bin/as-agent
```

### Create Alias (optional)
```bash
echo 'alias as-agent="~/workspace/as-agent/packages/as-agent/dist/as-agent-linux-x64/bin/as-agent"' >> ~/.zshrc
source ~/.zshrc

# Now you can run from anywhere:
as-agent --help
```

## Troubleshooting

### Issue: Module not found errors

**Solution:** Run the symlink fix script:
```bash
cd ~/workspace/as-agent
./fix-all-symlinks.sh
```

### Issue: Bun not found

**Solution:** Add bun to PATH:
```bash
export PATH="$HOME/.bun/bin:$PATH"
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
```

### Issue: Build fails

**Solution:** 
1. Clean and reinstall dependencies:
```bash
cd ~/workspace/as-agent
rm -rf node_modules bun.lock
bun install
./fix-all-symlinks.sh
```

2. Try building again:
```bash
cd packages/as-agent
bun run build --single
```

### Issue: "opencode" branding still shows

This is expected - the help text and CLI messages still reference "opencode". To update:
- Edit `src/cli/cmd/cmd.ts` for CLI command names
- Edit `src/cli/ui.ts` for the ASCII art logo

## Available Commands

```bash
# Core Commands
as-agent [project]           # Start interactive TUI
as-agent run [message..]     # Run with a message
as-agent attach <url>        # Attach to running server
as-agent serve               # Start headless server

# Management
as-agent auth                # Manage credentials
as-agent agent               # Manage agents
as-agent models [provider]   # List available models
as-agent stats               # Show token usage stats

# Data Management
as-agent export [sessionID]  # Export session as JSON
as-agent import <file>       # Import session data

# GitHub Integration
as-agent github              # Manage GitHub agent
as-agent pr <number>         # Checkout PR and run

# Advanced
as-agent acp                 # Start ACP server
as-agent upgrade [target]    # Upgrade to specific version
```

## Options

```bash
-h, --help        # Show help
-v, --version     # Show version number
--print-logs      # Print logs to stderr
--log-level       # Set log level (DEBUG|INFO|WARN|ERROR)
-m, --model       # Model to use (provider/model)
-c, --continue    # Continue last session
-s, --session     # Session ID to continue
-p, --prompt      # Prompt to use
--agent           # Agent to use
--port            # Port to listen on (default: 0)
--hostname        # Hostname (default: 127.0.0.1)
```

## Next Steps

1. **Update Branding**: Change "opencode" references to "as-agent" in CLI output
2. **Add Security Features**: Integrate threat detection modules
3. **Configure Models**: Set up API keys for LLM providers
4. **Test Integration**: Run against your security codebase

## Files and Locations

- **Source Code**: `~/workspace/as-agent/packages/as-agent/src/`
- **Build Script**: `~/workspace/as-agent/packages/as-agent/script/build.ts`
- **Binary Output**: `~/workspace/as-agent/packages/as-agent/dist/*/bin/as-agent`
- **Symlink Fix**: `~/workspace/as-agent/fix-all-symlinks.sh`
- **Main Config**: `~/workspace/as-agent/package.json`

---

**Both dev and release modes are fully functional!** 🎉
