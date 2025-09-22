# Careplanner Security Bootstrap v1

Search anchors are in **ALL CAPS inside square brackets** to make BBEdit searches easy.

## What this is
A drop‑in baseline for:
- TLS at the edge (nginx)
- Key management + envelope encryption (Vault Transit + KV v2)
- Dual‑signing hooks for audit artefacts
- Safer “share via portal / encrypted ZIP” pattern

## Files
- `nginx/careplanner.conf` — TLS 1.3 config with hybrid‑ready placeholders.
- `vault/bootstrap.sh` — one‑shot Vault setup (Transit + KV v2 + policies).
- `vault/policies/*.hcl` — least‑privilege policies.
- `app/src/security/crypto-config.ts` — [CRYPTO‑AGILITY PANEL].
- `app/src/security/envelope.ts` — [ENVELOPE‑ENC].
- `app/src/security/kms.ts` — [KMS‑ADAPTER].
- `app/src/security/signer.ts` — [DUAL‑SIGN].
- `app/src/security/SAFE_SHARE.md` — operational notes for email/portal sharing.
- `SECURITY_BASELINE.yaml` — one‑page, human‑readable toggles for governance.

## Quick start
1. **Vault** (dev/test): set `VAULT_ADDR` and `VAULT_TOKEN`, then run:
   ```bash
   cd vault
   ./bootstrap.sh
   ```
2. **nginx**: copy `nginx/careplanner.conf` into your reverse proxy and reload.
3. **App**: copy the files in `app/src/security/` into your repo; search for the anchors
   and wire `encryptBlob`/`decryptBlob` in your document upload/download flow.

## Governance mapping (JSF 2025)
- Reg 27 **Maintenance of Records** → envelope enc, KMS, backups, audit.
- Reg 15 **Individual Care Plan** → authentic PDFs with dual signatures.
- Reg 31/32 **Complaints/Risk** → tamper‑evident logs with signature fields.

## Roadmap to PQC (post‑quantum)
- Keep TLS 1.3 now; enable hybrid KEX once your TLS stack exposes groups.
- Start dual‑signing; PQ sig may be `null` until provider ships ML‑DSA.
- Re‑wrap backup keys when KMS gains hybrid/PQC wraps.
