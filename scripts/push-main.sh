#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/push-main.sh "commit message"
  ./scripts/push-main.sh -m "commit message"
  ./scripts/push-main.sh              # prompt for message
  yarn push:main -- "commit message"

Options:
  -m, --message   Commit message
  -a, --all       Stage all changes (default)
  -p, --patch     Stage changes interactively
  -h, --help      Show help

Flow:
  1. Run yarn build (abort if build fails)
  2. Commit staged changes
  3. Pull --rebase origin main
  4. Push origin main
EOF
}

COMMIT_MESSAGE=""
STAGE_MODE="all"

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--message)
      COMMIT_MESSAGE="${2:-}"
      shift 2
      ;;
    -a|--all)
      STAGE_MODE="all"
      shift
      ;;
    -p|--patch)
      STAGE_MODE="patch"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      if [[ -z "$COMMIT_MESSAGE" ]]; then
        COMMIT_MESSAGE="$1"
        shift
      else
        echo "Unknown argument: $1" >&2
        usage
        exit 1
      fi
      ;;
  esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository." >&2
  exit 1
fi

BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "main" ]]; then
  echo "Error: current branch is '$BRANCH'. Switch to main first:" >&2
  echo "  git checkout main" >&2
  exit 1
fi

if [[ -z "$COMMIT_MESSAGE" ]]; then
  read -r -p "Commit message: " COMMIT_MESSAGE
fi

COMMIT_MESSAGE="$(echo "$COMMIT_MESSAGE" | sed '/^[[:space:]]*$/d')"
if [[ -z "$COMMIT_MESSAGE" ]]; then
  echo "Error: commit message cannot be empty." >&2
  exit 1
fi

echo "==> Git status"
git status --short

if [[ -z "$(git status --porcelain)" ]]; then
  echo "Nothing to commit."
  exit 0
fi

echo "==> Build (must pass before commit & push)"
yarn build

echo
read -r -p "Build OK. Continue with commit and push to origin/main? [y/N] " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

if [[ "$STAGE_MODE" == "patch" ]]; then
  git add --patch
else
  git add -A
fi

if [[ -z "$(git diff --cached --name-only)" ]]; then
  echo "Nothing staged. Aborted."
  exit 0
fi

echo "==> Commit"
git commit -m "$COMMIT_MESSAGE"

echo "==> Pull rebase (avoid push rejection)"
git pull --rebase origin main

echo "==> Push"
git push origin main

echo "Done."
