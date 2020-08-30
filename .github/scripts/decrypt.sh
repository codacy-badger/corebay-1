#!/usr/bin/env bash

gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
--output ./test/files/config.js ./.github/config/config.js.gpg