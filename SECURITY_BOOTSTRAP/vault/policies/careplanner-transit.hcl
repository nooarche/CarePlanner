# careplanner-transit.hcl
# [POLICY-TRANSIT] v1 — allow wrap/unwrap using specific Transit keys

path "transit/encrypt/cp-data-wrap" {
  capabilities = ["update"]
}
path "transit/decrypt/cp-data-wrap" {
  capabilities = ["update"]
}

path "transit/encrypt/cp-backup-wrap" {
  capabilities = ["update"]
}
path "transit/decrypt/cp-backup-wrap" {
  capabilities = ["update"]
}

# Deny key export and raw key access
path "transit/keys/*" {
  capabilities = ["read"] # metadata only, not the key material
}
