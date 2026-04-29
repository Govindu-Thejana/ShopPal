#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/shopmate}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"
APP_NAME="${APP_NAME:-shopmate}"
APP_ENV="${APP_ENV:-prod}"
REPO_URL="${REPO_URL:-https://github.com/Govindu-Thejana/ShopPal.git}"

echo "=== Starting deployment (branch: ${GITHUB_BRANCH}) ==="

# Clone the repo on a fresh instance, or update if it already exists
if [ ! -d "${APP_DIR}/.git" ]; then
  echo "=== Cloning repository ==="
  git clone --branch "${GITHUB_BRANCH}" "${REPO_URL}" "${APP_DIR}"
fi

cd "${APP_DIR}"

echo "=== Updating code ==="
git fetch origin "${GITHUB_BRANCH}"
git checkout -B "${GITHUB_BRANCH}" "origin/${GITHUB_BRANCH}"

echo "=== Writing environment config ==="
chmod +x deploy/aws/write-env.sh
APP_NAME="${APP_NAME}" APP_ENV="${APP_ENV}" ./deploy/aws/write-env.sh

echo "=== Stopping existing containers ==="
docker compose -f deploy/aws/docker-compose.prod.yml down --remove-orphans || true

echo "=== Building and starting services ==="
docker compose \
  -f deploy/aws/docker-compose.prod.yml \
  --env-file deploy/aws/env/app.env \
  up -d --build --remove-orphans

echo "=== Running containers ==="
docker compose -f deploy/aws/docker-compose.prod.yml ps

docker image prune -af --filter "until=168h" || true

echo "=== Deployment complete ==="
