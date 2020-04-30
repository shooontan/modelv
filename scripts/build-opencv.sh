#!/bin/sh

if !(type "docker" > /dev/null 2>&1); then
  echo "does not exist docker command."
  exit 1
fi

readonly SCRIPT_DIR=$(cd $(dirname $0); pwd)
readonly APP_ROOT_DIR=$(dirname "$SCRIPT_DIR")

# copy whitelist config file
cp $SCRIPT_DIR/opencv_js.config.py $APP_ROOT_DIR/opencv/platforms/js/opencv_js.config.py

# build with Docker
docker run --rm --workdir /code -v $APP_ROOT_DIR/opencv:/code trzeci/emscripten:latest python ./platforms/js/build_js.py build

# copy build file
cp $APP_ROOT_DIR/opencv/build/bin/opencv.js $APP_ROOT_DIR/public/js/
