#!/usr/bin/env bash

NEW_VERSION=$(cat version | awk '{$1=$1;print}')

cd packages/web && blocklet version $NEW_VERSION && git add blocklet.yml && cd ../../
echo "bump blocklet to version $NEW_VERSION"
