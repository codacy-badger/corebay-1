#!/usr/bin/env bash

gpg --quiet --batch --yes --decrypt --passphrase="$SECRET_PASSPHRASE" \
--output ./test/files/config.js ./test/files/config.js.gpg