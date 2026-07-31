# crispy CLI

Codex-style interactive client for Crispy CMS admin AI agent.

## Build (local)

```bash
cd tools/crispy-cli
go build -ldflags="-s -w" -o crispy .
```

## Release (Windows / Linux / macOS)

```bash
cd tools/crispy-cli
chmod +x build-release.sh
./build-release.sh          # version from git describe
./build-release.sh 0.1.0    # explicit version
```

Outputs under `dist/`:

| Artifact | Platform |
|----------|----------|
| `crispy-*-darwin-arm64` | macOS Apple Silicon |
| `crispy-*-darwin-amd64` | macOS Intel |
| `crispy-*-linux-amd64` | Linux x86_64 |
| `crispy-*-linux-arm64` | Linux ARM64 |
| `crispy-*-windows-amd64.exe` | Windows x64 |
| `crispy-*-windows-arm64.exe` | Windows ARM64 |
| `SHA256SUMS` | checksums |

Static binaries (`CGO_ENABLED=0`), no runtime deps.

## Usage

```bash
./crispy
./crispy --url http://localhost:3333
```

| Input | Behavior |
|-------|----------|
| plain text | Multi-turn agent chat |
| `/` then Enter | Show command recommendations |
| `/lo` + Tab | Autocomplete `/login` / `/logout` |
| ← → | Move cursor |
| ↑ ↓ | History |
| Ctrl-C | Clear line |
| Ctrl-D | Quit |

Commands: `/login` `/logout` `/whoami` `/url` `/clear` `/session` `/tools` `/status` `/help` `/quit`

Colors via lipgloss (disable with `NO_COLOR=1`).
