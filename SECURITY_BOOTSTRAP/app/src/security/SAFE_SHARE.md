# [SAFE-SHARE] v1 — Email/Portal sharing pattern

**Default:** disable raw attachments via email for records.

Options:
1) **Portal link (preferred):** time‑limited, mTLS‑protected URL.
2) **Encrypted ZIP:** AES‑256 with out‑of‑band passphrase (phone call).

Operational notes:
- Delete transient files from mail queues and temp dirs after send.
- Log *that* a share occurred (who/when/what), not the contents.
- Add a policy toggle in Admin → Security to enforce portal‑only.
