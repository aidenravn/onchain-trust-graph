"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { IdentityTree } from "../proofs/identityTree";
import { signAsGuardian } from "../proofs/signGuardian";

const OCG_REGISTRY = "0xOCG_REGISTRY_HERE";

export default function Migrate() {
  const [status, setStatus] = useState("idle");

  async function migrate() {
    try {
      setStatus("Connecting old wallet…");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const oldWallet = await signer.getAddress();

      // Example guardians (MVP)
      const guardian1 = "0xGuardian1";
      const guardian2 = "0xGuardian2";

      setStatus("Building identity tree…");

      const tree = new IdentityTree([
        { type: "WALLET", value: oldWallet },
        { type: "GUARDIAN", value: guardian1 },
        { type: "GUARDIAN", value: guardian2 },
        { type: "DEVICE", value: "phone-key" }
      ]);

      const oldRoot = tree.root();

      // Simulate new wallet (in real life this is MPC smart wallet)
      const newWallet = ethers.Wallet.createRandom();
      const newAddress = newWallet.address;

      const newTree = new IdentityTree([
        { type: "WALLET", value: newAddress },
        { type: "GUARDIAN", value: guardian1 },
        { type: "GUARDIAN", value: guardian2 },
        { type: "DEVICE", value: "phone-key" }
      ]);

      const newRoot = newTree.root();

      setStatus("Collecting guardian signatures…");

      const sig1 = await signAsGuardian(signer, oldRoot, newRoot, newAddress);
      const sig2 = sig1; // MVP shortcut — second guardian mocked

      setStatus("Submitting to OCG…");

      const ocg = new ethers.Contract(
        OCG_REGISTRY,
        [
          "function registerContinuity(bytes32,bytes32,address[],bytes[])"
        ],
        signer
      );

      const tx = await ocg.registerContinuity(
        oldRoot,
        newRoot,
        [guardian1, guardian2],
        [sig1, sig2]
      );

      await tx.wait();

      setStatus("Done! New wallet linked.");
    } catch (e) {
      console.error(e);
      setStatus("Error");
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Identity Migration
      </h1>

      <button
        className="bg-black text-white px-4 py-2"
        onClick={migrate}
      >
        Migrate Identity
      </button>

      <div className="mt-4">{status}</div>
    </div>
  );
}
