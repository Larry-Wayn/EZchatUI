#!/bin/sh
set -eu

if git ls-files --error-unmatch Chatbot_dpsk/backend/.env >/dev/null 2>&1; then
  echo 'FAIL: a real backend .env file is tracked' >&2
  exit 1
fi

if ! grep -qxF '.env' .gitignore || ! grep -qxF '.env.*' .gitignore || \
   ! grep -qxF '!.env.example' .gitignore; then
  echo 'FAIL: .gitignore does not protect environment files' >&2
  exit 1
fi

if git grep -n -E 'sk-[A-Za-z0-9_-]{16,}|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}' -- ':!**/node_modules/**' ':!tests/security/no_tracked_secrets.sh'; then
  echo 'FAIL: credential-shaped value found in tracked files' >&2
  exit 1
fi
