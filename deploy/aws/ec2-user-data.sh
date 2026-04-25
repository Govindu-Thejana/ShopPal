#!/bin/bash
set -euxo pipefail

APP_DIR="/opt/shopmate"
APP_NAME="${APP_NAME:-shopmate}"
APP_ENV="${APP_ENV:-prod}"
REPO_URL="${REPO_URL:-https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"

dnf update -y
dnf install -y git docker awscli

systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

mkdir -p "${APP_DIR}"
chown -R ec2-user:ec2-user "${APP_DIR}"

if [ ! -d "${APP_DIR}/.git" ]; then
  sudo -u ec2-user git clone --branch "${GITHUB_BRANCH}" "${REPO_URL}" "${APP_DIR}"
fi

cat > /etc/profile.d/shopmate.sh <<EOF
export APP_NAME=${APP_NAME}
export APP_ENV=${APP_ENV}
export GITHUB_BRANCH=${GITHUB_BRANCH}
export APP_DIR=${APP_DIR}
EOF

cd "${APP_DIR}"
sudo -u ec2-user chmod +x deploy/aws/deploy.sh deploy/aws/write-env.sh
sudo -u ec2-user env APP_NAME="${APP_NAME}" APP_ENV="${APP_ENV}" GITHUB_BRANCH="${GITHUB_BRANCH}" APP_DIR="${APP_DIR}" ./deploy/aws/deploy.sh
