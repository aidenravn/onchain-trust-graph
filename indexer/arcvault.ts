import { ethers } from "ethers"
import { RiskEngine } from "./risk"

/**
 * Listens to ArcVault Contribution NFT contract
 * and feeds Trust Scores into OCG
 */

export class ArcVaultIndexer {
    provider: ethers.Provider
    contract: ethers.Contract
    risk: RiskEngine

    constructor(
        rpc: string,
        contractAddress: string,
        abi: any,
        risk: RiskEngine
    ) {
        this.provider = new ethers.JsonRpcProvider(rpc)
        this.contract = new ethers.Contract(contractAddress, abi, this.provider)
        this.risk = risk
    }

    start() {
        console.log("ArcVault Indexer started")

        // Minted contributions
        this.contract.on(
            "ContributionMinted",
            (tokenId, to, category, score, approver, cid) => {
                this.handleContribution(to, category, score)
            }
        )

        // Updated contributions
        this.contract.on(
            "ContributionUpdated",
            (tokenId, score, approver, cid) => {
                this.contract.ownerOf(tokenId).then((owner: string) => {
                    this.handleContribution(owner, null, score)
                })
            }
        )
    }

    handleContribution(wallet: string, category: number | null, score: number) {
        const base = score

        const weight =
            category === 0 ? 1 :
            category === 1 ? 2 :
            category === 2 ? 5 :
            1

        const trust = base * weight

        this.risk.addContribution(wallet, trust)

        console.log(`Trust +${trust} → ${wallet}`)
    }
}
