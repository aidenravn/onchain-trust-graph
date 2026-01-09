/**
 * OCG Risk Engine
 * Detects sybil clusters, funding attacks, and reputation gaming
 */

export type WalletStats = {
    wallet: string
    inboundTx: number
    outboundTx: number
    firstSeen: number
    fundingSources: Set<string>
    contributionScore: number
}

export type RiskScore = {
    wallet: string
    trust: number        // 0 → 100
    risk: number         // 0 → 100
    flags: string[]
}

export class RiskEngine {
    wallets = new Map<string, WalletStats>()

    /**
     * Called by indexer when new tx / NFT / contribution happens
     */
    registerActivity(
        wallet: string,
        from: string | null,
        timestamp: number,
        contributionScore = 0
    ) {
        if (!this.wallets.has(wallet)) {
            this.wallets.set(wallet, {
                wallet,
                inboundTx: 0,
                outboundTx: 0,
                firstSeen: timestamp,
                fundingSources: new Set(),
                contributionScore: 0
            })
        }

        const w = this.wallets.get(wallet)!

        if (from) {
            w.inboundTx++
            w.fundingSources.add(from)
        }

        w.contributionScore += contributionScore
    }

    /**
     * Main scoring function
     */
    scoreWallet(wallet: string): RiskScore {
        const w = this.wallets.get(wallet)

        if (!w) {
            return {
                wallet,
                trust: 0,
                risk: 100,
                flags: ["no_history"]
            }
        }

        let trust = 50
        let risk = 0
        const flags: string[] = []

        // 1. Contribution power
        trust += Math.min(40, w.contributionScore / 10)

        // 2. Age bonus
        const ageDays = (Date.now() / 1000 - w.firstSeen) / 86400
        trust += Math.min(20, ageDays)

        // 3. Sybil detection: too many wallets funded by same source
        if (w.fundingSources.size === 1 && w.inboundTx > 5) {
            risk += 50
            flags.push("single_funder_cluster")
        }

        // 4. New wallet + high activity = suspicious
        if (ageDays < 2 && w.inboundTx > 3) {
            risk += 30
            flags.push("fresh_wallet_burst")
        }

        // Normalize
        trust = Math.max(0, Math.min(100, trust - risk))
        risk = Math.max(0, Math.min(100, risk))

        return {
            wallet,
            trust,
            risk,
            flags
        }
    }
}
