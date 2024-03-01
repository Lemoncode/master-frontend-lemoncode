#!/bin/sh
FILE=./.env
if test -f "$FILE"; then
  echo "Loading current .env file"
else
  cp ./.env.example ./.env
fi
