#!/usr/bin/env bash
# Bulk-uploads dist/ (the full built site) to the R2 bucket via rclone's
# S3-compatible backend. Reads R2 S3 credentials from a gitignored .r2creds file:
#
#   R2_ACCESS_KEY_ID=...
#   R2_SECRET_ACCESS_KEY=...
#   # R2_ACCOUNT_ID is optional; defaults to this account's id below.
#
# Create those in the Cloudflare dashboard: R2 > Manage R2 API Tokens >
# Create API token (Object Read & Write). rclone sets Content-Type from each
# file's extension, so HTML/CSS/JS/XML are served with correct types.
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .r2creds ] || { echo "ERROR: .r2creds not found (needs R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)"; exit 1; }
# shellcheck disable=SC1091
source .r2creds

ACCOUNT_ID="${R2_ACCOUNT_ID:-781ee6623d910360994067aca91ed506}"
BUCKET="${1:-wordhelper-site}"

export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_ACL=private

echo "Uploading dist/ -> R2:${BUCKET} (endpoint ${ACCOUNT_ID}.r2.cloudflarestorage.com)"
rclone copy dist "R2:${BUCKET}" \
  --transfers=64 --checkers=64 \
  --s3-chunk-size=16M --no-update-modtime --fast-list \
  --progress --stats=15s --stats-one-line

echo "Done. Object count in bucket:"
rclone size "R2:${BUCKET}"
