// [CRYPTO-AGILITY PANEL] v1
export const CRYPTO_POLICY = {
  tls: { preferHybrid: true, allowClassicalFallback: true },
  envelope: { alg: "xchacha20-poly1305", keyBytes: 32, aadTag: "careplanner-doc-v1" },
  kms: {
    provider: "vault",
    dataKeyRole: "cp-data-key",
    backupWrapRole: "cp-backup-wrap",
    pqc: { kem: "ML-KEM-768", sig: "ML-DSA-65", useHybridWrap: true }
  },
  signatures: {
    dualSign: true,
    classical: "ECDSA_P256_SHA256",
    pqc: "ML-DSA-65"
  }
};
