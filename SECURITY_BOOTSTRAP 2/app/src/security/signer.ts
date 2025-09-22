// [DUAL-SIGN] v1
export async function dualSign(bytes: Uint8Array) {
  const classicalSig = await signECDSA(bytes); // implement with your current signer
  const pqcSig = await trySignMLDSA(bytes);   // returns null until provider available
  return { classicalSig, pqcSig, format: "ecdsa+ml-dsa" };
}

// Stubs (replace with your actual implementations)
async function signECDSA(bytes: Uint8Array): Promise<string> {
  return "base64:CLASSICAL_SIG";
}
async function trySignMLDSA(bytes: Uint8Array): Promise<string|null> {
  // Return null until PQC signer is wired up
  return null;
}
