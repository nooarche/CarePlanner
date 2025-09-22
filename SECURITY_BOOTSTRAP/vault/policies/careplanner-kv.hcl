# careplanner-kv.hcl
# [POLICY-KV] v1 — allow read of runtime secrets, no list

path "secret/data/careplanner/*" {
  capabilities = ["read"]
}

path "secret/metadata/careplanner/*" {
  capabilities = ["read"]
}
