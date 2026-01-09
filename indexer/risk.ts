import { TrustGraph } from "./graph"

/*
    OCG Risk Engine

    Computes wallet trust using:
    - ArcVault contribution NFTs
    - Social continuity
    - Approver reputation
*/

export type WalletRisk = {
    wallet: string
    trust: number        // 0 → 100
    sybil: boolean
    signals: string[]
}

export class RiskEngine {
    graph: TrustGraph

    constructor(graph: TrustGraph) {
        this.graph = graph
    }

    scoreWallet(wallet: string): WalletRisk {
        const nodes = this.graph.findByOwner(wallet)

        if (nodes.length === 0) {
            return {
                wallet,
                trust: 0,
                sybil: true,
                signals: ["no_contributions"]
            }
        }

        let trust = 0
        let max = 0
        const signals: string[] = []

        for (const n of nodes) {
            max += 100

            // ArcVault NFTs = proof of contribution
            if (n.data.type === "arcvault") {
                trust += n.weight
                signals.push("arcvault")
            }

            // Bonus if approved by high-rep signer
            const approverTrust = this.graph.trustOf(n.data.approver)
            trust += approverTrust * 0.2

            if (approverTrust > 50) {
                signals.push("verified_approver")
            }
        }

        const normalized = Math.min(100, Math.round((trust / max) * 100))

        // Sybil heuristics
        let sybil = false

        if (normalized < 20) sybil = true
        if (nodes.length > 5 && normalized < 40) sybil = true
        if (nodes.length === 1 && nodes[0].weight < 30) sybil = true

        return {
            wallet,
            trust: normalized,
            sybil,
            signals
        }
    }
}
