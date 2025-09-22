// [ENVELOPE-ENC] v1
import { randomBytes } from "crypto";
import * as sodium from "libsodium-wrappers";
import { CRYPTO_POLICY } from "./crypto-config";
import { wrapKeyWithKMS, unwrapKeyWithKMS } from "./kms";

export async function encryptBlob(plaintext: Uint8Array, meta: Record<string,string>) {
  await sodium.ready;
  const dek = randomBytes(CRYPTO_POLICY.envelope.keyBytes);
  const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
  const aad = Buffer.from(CRYPTO_POLICY.envelope.aadTag);

  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext, aad, null, nonce, dek
  );

  const wrappedDek = await wrapKeyWithKMS(dek, { purpose: "file", meta });

  return {
    ciphertext: Buffer.from(ciphertext),
    header: {
      v: 1,
      alg: CRYPTO_POLICY.envelope.alg,
      nonce: Buffer.from(nonce).toString("base64"),
      wrappedDek,
      meta
    }
  };
}

export async function decryptBlob(pkg: {
  ciphertext: Uint8Array,
  header: { v:number, alg:string, nonce:string, wrappedDek:any, meta:Record<string,string> }
}) {
  await sodium.ready;
  const dek = await unwrapKeyWithKMS(pkg.header.wrappedDek);
  const aad = Buffer.from(CRYPTO_POLICY.envelope.aadTag);
  const nonce = Buffer.from(pkg.header.nonce, "base64");

  return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null, pkg.ciphertext, aad, nonce, dek
  );
}
