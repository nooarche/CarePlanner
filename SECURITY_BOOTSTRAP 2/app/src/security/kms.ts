// [KMS-ADAPTER] v1 (Vault Transit + KV v2 placeholders)
import { CRYPTO_POLICY } from "./crypto-config";

async function vaultTransitWrap(rawKey: Uint8Array, ctx:any) {
  // TODO: implement HTTP call to Vault transit/encrypt/{key}
  // Body: { plaintext: base64(rawKey), context: base64(optional) }
  // Return provider-opaque wrapped blob
  return { provider: "vault", key: "cp-data-wrap", blob: "<opaque>" };
}

async function vaultTransitUnwrap(wrapped:any) {
  // TODO: implement HTTP call to transit/decrypt/{key}
  // Return Uint8Array raw key
  return new Uint8Array([]);
}

export async function wrapKeyWithKMS(rawKey: Uint8Array, ctx:any) {
  if (CRYPTO_POLICY.kms.provider === "vault") {
    return vaultTransitWrap(rawKey, ctx);
  }
  throw new Error("Unsupported KMS provider");
}

export async function unwrapKeyWithKMS(wrapped:any) {
  if (CRYPTO_POLICY.kms.provider === "vault") {
    return vaultTransitUnwrap(wrapped);
  }
  throw new Error("Unsupported KMS provider");
}
