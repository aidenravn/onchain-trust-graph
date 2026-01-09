import { ethers } from "ethers"
import { TrustGraph } from "./graph"
import { RiskEngine } from "./risk"

/**
 * OCG-1 Human Continuity Engine
 * Implements cryptographic wallet → wallet identity transfer
 */

export type ContinuityEdge = {
    from: string
    to: string
    issuedAt: number
    expiresAt: number
    nonce: number
    confidence: number
}

export class ContinuityEngine {
    graph: TrustGraph
    risk: RiskEngine

    // replay protection
    usedNonces = new Set<string>()

    domain = {
        name: "OnChainTrustGraph",
        version: "1"
    }

    types = {
        HumanContinuity: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "issuedAt", type: "uint256" },
            { name: "expiresAt", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "scope", type: "string" }
        ]
    }

    constructor(graph: TrustGraph, risk: RiskEngine) {
        this.graph = graph
        this.risk = risk
    }

    verify(message: any, signature: string, chainId: number, verifyingContract: string) {
        const domain = {
            ...this.domain,
            chainId,
            verifyingContract
        }

        const signer = ethers.verifyTypedData(
            domain,
            this.types,
            message,
            signature
        )

        return signer.toLowerCase() === message.from.toLowerCase()
    }

    register(message: any, signature: string, chainId: number, verifyingContract: string) {
        if (Date.now() / 1000 > message.expiresAt) {
            throw new Error("Continuity expired")
        }

        const key = `${message.from}:${message.nonce}`
        if (this.usedNonces.has(key)) {
            throw new Error("Replay attack")
        }

        const valid = this.verify(message, signature, chainId, verifyingContract)
        if (!valid) throw new Error("Invalid signature")

        this.usedNonces.add(key)

        const fromTrust = this.risk.scoreWallet(message.from).trust
        const decay = 0.9
        const transferred = Math.round(fromTrust * decay)

        this.graph.linkHuman(message.from, message.to, transferred)

        return {
            from: message.from,
            to: message.to,
            transferredTrust: transferred
        }
    }
}
