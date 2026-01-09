import { ethers } from "ethers";

export async function getIdentityRoot(addr: string) {
  const ocg = new ethers.Contract(
    OCG_REGISTRY,
    ["function identityRoot(address) view returns (bytes32)"],
    provider
  );

  return ocg.identityRoot(addr);
}
