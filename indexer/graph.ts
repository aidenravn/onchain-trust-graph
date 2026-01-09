/**
 * TrustGraph
 * Stores human-linked wallets and reputation flow
 */

export type HumanNode = {
    id: string
    wallets: Set<string>
    trust: number
}

export class TrustGraph {
    humans = new Map<string, HumanNode>()     // humanId → node
    walletToHuman = new Map<string, string>() // wallet → humanId

    /**
     * Create or get human identity
     */
    getHuman(wallet: string): HumanNode {
        const existing = this.walletToHuman.get(wallet)
        if (existing) return this.humans.get(existing)!

        const id = crypto.randomUUID()

        const human: HumanNode = {
            id,
            wallets: new Set([wallet]),
            trust: 0
        }

        this.humans.set(id, human)
        this.walletToHuman.set(wallet, id)

        return human
    }

    /**
     * Link two wallets as same human
     */
    linkHuman(from: string, to: string, transferredTrust: number) {
        const h1 = this.getHuman(from)
        const h2 = this.getHuman(to)

        // Already same human
        if (h1.id === h2.id) return

        // Merge smaller into larger
        const main = h1.wallets.size >= h2.wallets.size ? h1 : h2
        const other = main === h1 ? h2 : h1

        for (const w of other.wallets) {
            main.wallets.add(w)
            this.walletToHuman.set(w, main.id)
        }

        main.trust += transferredTrust

        this.humans.delete(other.id)
    }

    /**
     * Get all wallets for a human
     */
    getHumanWallets(wallet: string): string[] {
        const h = this.getHuman(wallet)
        return [...h.wallets]
    }

    /**
     * Get trust score of a human
     */
    getHumanTrust(wallet: string): number {
        const h = this.getHuman(wallet)
        return h.trust
    }
}
