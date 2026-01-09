import { TrustGraph } from "./graph"

/**
 * OCG Risk Engine
 * Detects Sybil patterns & computes wallet trust
 */

export type WalletTrust = {
    address: string
    trust: number
    risk: number
    flags: string[]
}

export class RiskEngine {
    graph: TrustGraph

    // Heuristics
    MAX_SHARED_FUNDER = 5
    RAPID_CLUSTER_SIZE = 10
    RAPID_TIME_WINDOW = 60 * 60 // 1 hour

    constructor(graph: TrustGraph) {
        this.graph = graph
    }

    /**
     * Entry point
     */
    scoreWallet(address: string): WalletTrust {
        const flags: string[] = []
        let trust = this.graph.getRawTrust(address)

        // 1. Cluster risk
        const cluster = this.graph.getCluster(address)
        if (cluster.length > this.RAPID_CLUSTER_SIZE) {
            flags.push("sybil_cluster")
            trust *= 0.4
        }

        // 2. Shared funding
        const funders = this.graph.getFunders(address)
        const suspicious = funders.filter(f => f.count > this.MAX_SHARED_FUNDER)
        if (suspicious.length > 0) {
            flags.push("shared_funding")
            trust *= 0.5
        }

        // 3. Burned wallets
        if (this.graph.isBurned(address)) {
            flags.push("burned")
            trust *= 0.2
        }

        // 4. Fresh wallet penalty
        const age = this.graph.getWalletAge(address)
        if (age < this.RAPID_TIME_WINDOW) {
            flags.push("new_wallet")
            trust *= 0.7
        }

        // 5. Continuity bonus
        const continuity = this.graph.getContinuityWeight(address)
        trust += continuity

        const risk = Math.max(0, 100 - trust)

        return {
            address,
            trust: Math.round(trust),
            risk: Math.round(risk),
            flags
        }
    }

    /**
     * Detect Sybil farms
     */
    detectSybilCluster(address: string): string[] {
        const cluster = this.graph.getCluster(address)
        if (cluster.length < this.RAPID_CLUSTER_SIZE) return []

        const funders = new Map<string, number>()

        for (const wallet of cluster) {
            const sources = this.graph.getFunders(wallet)
            for (const s of sources) {
                funders.set(s.address, (funders.get(s.address) || 0) + 1)
            }
        }

        for (const [addr, count] of funders.entries()) {
            if (count > this.MAX_SHARED_FUNDER) {
                return cluster
            }
        }

        return []
    }
}
