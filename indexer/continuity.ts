import { TrustGraph } from "./graph"
import { RiskEngine } from "./risk"

/*
    Continuity Engine

    Links wallets across migrations, smart wallets,
    and device changes using cryptographic & social signals.
*/

export type ContinuityProof = {
    from: string
    to: string
    confidence: number   // 0 → 100
    valid: boolean
    reasons: string[]
}

export class ContinuityEngine {
    graph: TrustGraph
    risk: RiskEngine

    constructor(graph: TrustGraph, risk: RiskEngine) {
        this.graph = graph
        this.risk = risk
    }

    prove(oldWallet: string, newWallet: string): ContinuityProof {
        const reasons: string[] = []
        let score = 0

        // 1️⃣ Shared ArcVault history
        const oldNodes = this.graph.findByOwner(oldWallet)
        const newNodes = this.graph.findByOwner(newWallet)

        for (const o of oldNodes) {
            for (const n of newNodes) {
                if (o.data.cid === n.data.cid && o.data.type === "arcvault") {
                    score += 40
                    reasons.push("shared_contribution")
                }
            }
        }

        // 2️⃣ Same approvers
        const oldApprovers = new Set(oldNodes.map(n => n.data.approver))
        const newApprovers = new Set(newNodes.map(n => n.data.approver))

        for (const a of oldApprovers) {
            if (newApprovers.has(a)) {
                score += 20
                reasons.push("shared_approver")
            }
        }

        // 3️⃣ Trust level consistency
        const oldTrust = this.risk.scoreWallet(oldWallet).trust
        const newTrust = this.risk.scoreWallet(newWallet).trust

        const diff = Math.abs(oldTrust - newTrust)

        if (diff < 20) {
            score += 20
            reasons.push("trust_continuity")
        }

        // 4️⃣ No Sybil jump
        const oldRisk = this.risk.scoreWallet(oldWallet)
        const newRisk = this.risk.scoreWallet(newWallet)

        if (!oldRisk.sybil && !newRisk.sybil) {
            score += 20
            reasons.push("non_sybil")
        }

        const confidence = Math.min(100, score)

        return {
            from: oldWallet,
            to: newWallet,
            confidence,
            valid: confidence >= 60,
            reasons
        }
    }
}
