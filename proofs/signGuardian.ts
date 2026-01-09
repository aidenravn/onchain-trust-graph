import { ethers } from "ethers";
import { continuityMessage } from "./domain";

export async function signAsGuardian(
  signer: ethers.Signer,
  oldRoot: string,
  newRoot: string,
  newWallet: string
) {
  return signer.signTypedData(
    continuityMessage.domain,
    continuityMessage.types,
    { oldRoot, newRoot, newWallet }
  );
}
