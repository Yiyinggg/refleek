#!/usr/bin/env bash
# Boots the whole ReFleek dev stack in one tmux window:
#   • convex   — backend sync + codegen (npx convex dev)
#   • vite     — React frontend      (npm run dev, http://localhost:5173)
#   • api      — /api/generate proxy (node dev-server.cjs, port 3939)
#
# Usage: ./scripts/dev.sh            (or: npm run dev:all)
# Detach without stopping: Ctrl-b then d   ·   Reattach: tmux attach -t refleek
set -euo pipefail

SESSION="refleek"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v tmux >/dev/null 2>&1; then
  echo "tmux is not installed. Install it, then re-run this script:"
  echo "  macOS:  brew install tmux"
  echo "  Debian: sudo apt-get install tmux"
  exit 1
fi

# Start clean so re-running never stacks duplicate panes.
tmux kill-session -t "$SESSION" 2>/dev/null || true

# Keep a crashed process visible instead of collapsing its pane.
tmux new-session -d -s "$SESSION" -n stack -c "$ROOT"
tmux set-option -t "$SESSION" mouse on
tmux set-option -t "$SESSION" -g remain-on-exit on

# Pane 0 (left): backend.
tmux send-keys -t "$SESSION":stack.0 'npx convex dev' C-m

# Pane 1 (top-right): frontend.
tmux split-window -h -t "$SESSION":stack -c "$ROOT"
tmux send-keys -t "$SESSION":stack.1 'npm run dev' C-m

# Pane 2 (bottom-right): image-generation endpoint.
tmux split-window -v -t "$SESSION":stack.1 -c "$ROOT"
tmux send-keys -t "$SESSION":stack.2 'node dev-server.cjs' C-m

tmux select-layout -t "$SESSION":stack main-vertical
tmux select-pane -t "$SESSION":stack.0

exec tmux attach-session -t "$SESSION"
