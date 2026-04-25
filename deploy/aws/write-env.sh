#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-shopmate}"
APP_ENV="${APP_ENV:-prod}"
PARAM_BASE="/${APP_NAME}/${APP_ENV}"
TARGET_FILE="deploy/aws/env/app.env"

get_parameter() {
  local key="$1"
  aws ssm get-parameter \
    --name "${PARAM_BASE}/${key}" \
    --with-decryption \
    --query 'Parameter.Value' \
    --output text
}

mkdir -p "$(dirname "${TARGET_FILE}")"

cat > "${TARGET_FILE}" <<EOF
MONGO_URI=$(get_parameter MONGO_URI)
JWT_SECRET=$(get_parameter JWT_SECRET)
ALLOWED_ORIGINS=$(get_parameter ALLOWED_ORIGINS)
EMAIL_USER=$(get_parameter EMAIL_USER)
EMAIL_PASS=$(get_parameter EMAIL_PASS)
EMAIL_TO=$(get_parameter EMAIL_TO)
EOF

chmod 600 "${TARGET_FILE}"
