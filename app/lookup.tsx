"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getRiskScore } from "../indexer/risk";

const OCG_REGISTRY = "0xOCG_REGISTRY_HERE";

export default function Lookup() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);

  async function lookup() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const rootAbi = ["function identityRoot(address) view returns (bytes32)"];
    const ocg = new ethers.Contract(OCG_REGISTRY, rootAbi, provider);

    const root = await ocg.identityRoot(address);
    const risk = await getRiskScore(address, provider, OCG_REGISTRY);

    setResult({
      root,
      risk
    });
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        On-Chain Trust Graph Lookup
      </h1>

      <input
        className="border p-2 w-full mb-4"
        placeholder="0x…"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2"
        onClick={lookup}
      >
        Analyze
      </button>

      {result && (
        <div className="mt-6 border p-4 rounded">
          <div>
            <b>Identity Root:</b> {result.root}
          </div>

          <div className="mt-2">
            <b>Human Continuity:</b>{" "}
            {result.root !== ethers.ZeroHash ? "YES" : "NO"}
          </div>

          <div className="mt-2">
            <b>Risk Score:</b>{" "}
            <span
              className={
                result.risk > 60
                  ? "text-red-600"
                  : result.risk > 30
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {Math.round(result.risk)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
