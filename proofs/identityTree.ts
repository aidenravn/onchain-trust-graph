import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { ethers } from "ethers";

export type IdentityLeaf =
  | { type: "WALLET"; value: string }
  | { type: "DEVICE"; value: string }
  | { type: "GUARDIAN"; value: string }
  | { type: "CONTRIBUTION"; value: string };

function hashLeaf(leaf: IdentityLeaf): Buffer {
  return Buffer.from(
    ethers.solidityPackedKeccak256(
      ["string", "string"],
      [leaf.type, leaf.value]
    ).slice(2),
    "hex"
  );
}

export class IdentityTree {
  leaves: IdentityLeaf[];
  tree: MerkleTree;

  constructor(leaves: IdentityLeaf[]) {
    this.leaves = leaves;
    const hashed = leaves.map(hashLeaf);
    this.tree = new MerkleTree(hashed, keccak256, { sortPairs: true });
  }

  root(): string {
    return this.tree.getHexRoot();
  }

  prove(leaf: IdentityLeaf) {
    const hashed = hashLeaf(leaf);
    return this.tree.getHexProof(hashed);
  }
}
