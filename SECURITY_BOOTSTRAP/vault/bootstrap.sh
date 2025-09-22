#!/usr/bin/env bash
set -euo pipefail

# [VAULT-BOOTSTRAP] v1
# Prereqs:
#   export VAULT_ADDR=http://127.0.0.1:8200
#   export VAULT_TOKEN=<root or policy-sufficient token>
#
# This script enables KV v2 & Transit, creates keys, and installs policies for Careplanner.

echo "[*] Enabling KV v2 at path: secret/"
vault secrets enable -path=secret kv-v2 || echo "(i) secret/ already enabled"

echo "[*] Enabling Transit at path: transit/"
vault secrets enable transit || echo "(i) transit/ already enabled"

echo "[*] Creating Transit keys"
# Per-file DEK wrap/unwrap key
vault write -f transit/keys/cp-data-wrap     convergent_encryption=false     exportable=false     allow_plaintext_backup=false

# Backup wrap key (for moving backup keys between sites)
vault write -f transit/keys/cp-backup-wrap     convergent_encryption=false     exportable=false     allow_plaintext_backup=false

echo "[*] Writing example app secrets (KV v2)"
vault kv put secret/careplanner/db username="careplanner_app" password="CHANGEME-long-random"
vault kv put secret/careplanner/smtp host="smtp.healthmail.ie" user="CHANGEME" pass="CHANGEME"

echo "[*] Installing policies"
vault policy write careplanner-transit policies/careplanner-transit.hcl
vault policy write careplanner-kv policies/careplanner-kv.hcl

echo "[*] Creating example token roles (adjust for your auth method)"
# NOTE: In production, use approle/kubernetes auth and bind these policies.
echo "(i) Attach policies 'careplanner-transit' and 'careplanner-kv' to your app role."

echo "[✓] Vault bootstrap completed"
