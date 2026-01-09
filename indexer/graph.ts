/**
 * OCG Trust Graph
 * The canonical source of wallet → human → reputation mapping
 */

export type ContinuityLink = {
    from: string
    to: string
    weight: number
}

export type FundingEdge = {
    address: string
    count: number
}

export class TrustGraph {
    // wallet → base reputation (from ArcVault NFTs etc)
    reputation = new Map<string, number>()

    // wallet → wallets it claims to be same human
    continuity = new Map<string, ContinuityLink[]>()

    // wallet → wallets that funded it
    funders = new Map<string, FundingEdge[]>()

    // wallet → timestamp
    createdAt = new Map<string, number>()

    // wallet → burned flag
    burned = new Set<string>()

    /* ------------------ REPUTATION ------------------ */

    addReputation(address: string, score: number) {
        const prev = this.reputation.get(address) || 0
        this.reputation.set(address, prev + score)
    }

    getRawTrust(address: string): number {
        return this.reputation.get(address) || 0
    }

    /* ------------------ CONTINUITY ------------------ */

    linkHuman(from: string, to: string, weight: number) {
        if (!this.continuity.has(to)) {
            this.continuity.set(to, [])
        }

        this.continuity.get(to)!.push({
            from,
            to,
            weight
        })
    }

    getContinuityWeight(address: string): number {
        const links = this.continuity.get(address) || []
        return links.reduce((sum, l) => sum + l.weight, 0)
    }

    /* ------------------ FUNDING ------------------ */

    addFunding(from: string, to: string) {
        if (!this.funders.has(to)) {
            this.funders.set(to, [])
        }

        const list = this.funders.get(to)!
        const existing = list.find(f => f.address === from)

        if (existing) {
            existing.count++
        } else {
            list.push({ address: from, count: 1 })
        }
    }

    getFunders(address: string): FundingEdge[] {
        return this.funders.get(address) || []
    }

    /* ------------------ CLUSTERS ------------------ */

    getCluster(address: string): string[] {
        const visited = new Set<string>()
        const stack = [address]

        while (stack.length > 0) {
            const current = stack.pop()!
            if (visited.has(current)) continue
            visited.add(current)

            const links = this.continuity.get(current) || []
            for (const l of links) {
                stack.push(l.from)
            }
        }

        return Array.from(visited)
    }

    /* ------------------ LIFECYCLE ------------------ */

    registerWallet(address: string, timestamp: number) {
        if (!this.createdAt.has(address)) {
            this.createdAt.set(address, timestamp)
        }
    }

    getWalletAge(address: string): number {
        const created = this.createdAt.get(address)
        if (!created) return 0
        return Math.floor(Date.now() / 1000) - created
    }

    burnWallet(address: string) {
        this.burned.add(address)
    }

    isBurned(address: string): boolean {
        return this.burned.has(address)
    }

    /* ------------------ DEBUG ------------------ */

    exportGraph() {
        return {
            reputation: Object.fromEntries(this.reputation),
            continuity: Object.fromEntries(this.continuity),
            funders: Object.fromEntries(this.funders)
        }
    }
}
