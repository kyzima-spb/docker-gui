#!/usr/bin/env bash

set -e

find /docker-entrypoint.d -maxdepth 1 -follow -type f -print | sort -V | while read -r f; do
  case "$f" in
    *.sh)
      if [[ -x "$f" ]]; then
        "$f"
      else
        echo >&2 "$f not executable"
      fi
      ;;
    *)
      echo >&2 "$f was found but ignored." ;;
  esac
done

exec "$@"
