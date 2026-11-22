import { readFileSync, writeFileSync } from 'node:fs';
import { ApkSigner, SigningKey } from 'apk_sign_ts';
const [inp, out] = process.argv.slice(2);
const signer = new ApkSigner({ signingKey: SigningKey.fromPEM(readFileSync('keys/iqlab.key.pem', 'utf8'), readFileSync('keys/iqlab.cert.pem', 'utf8')) });
const { signedApk } = await signer.sign(new Uint8Array(readFileSync(inp)));
writeFileSync(out, signedApk);
