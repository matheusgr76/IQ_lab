#!/usr/bin/env bash
# Builds a signed IQ-Lab.apk from ../web using apktool + a JS APK signer (no Android SDK needed).
# Needs: java, node/npm, openssl. Output: ../releases/IQ-Lab-local.apk
set -euo pipefail
cd "$(dirname "$0")"
WORK=build; rm -rf "$WORK"; mkdir -p "$WORK" keys
[ -d node_modules/apktool-jar ] || npm install --no-audit --no-fund apktool-jar apk_sign_ts
cp -r smali res AndroidManifest.xml apktool.yml "$WORK/"
mkdir -p "$WORK/assets" && cp ../web/* "$WORK/assets/"
java -jar node_modules/apktool-jar/bin/apktool_2.4.1.jar b -f "$WORK" -o "$WORK/unsigned.apk"
if [ ! -f keys/iqlab.key.pem ]; then
  openssl req -x509 -newkey rsa:2048 -nodes -keyout keys/iqlab.key.pem -out keys/iqlab.cert.pem -days 10000 -subj "/CN=IQ Lab"
  echo "Created a new signing key in android/keys/. Keep it: updates must use the same key."
fi
node sign.mjs "$WORK/unsigned.apk" ../releases/IQ-Lab-local.apk
echo "Built ../releases/IQ-Lab-local.apk"
