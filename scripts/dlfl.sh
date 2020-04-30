#!/bin/sh

readonly SCRIPT_DIR=$(cd $(dirname $0); pwd)
readonly APP_ROOT_DIR=$(dirname "$SCRIPT_DIR")

mkdir -p $APP_ROOT_DIR/public/js $APP_ROOT_DIR/public/models/weights

# public file branch url
BRANCH_NAME="static-files"
BRANCH_URL=https://raw.githubusercontent.com/shooontan/model-v/$BRANCH_NAME

# download files
cat scripts/files.txt | xargs -n1 -P3 -I{} curl -s -o .{} $BRANCH_URL{}
echo "download is complete."
