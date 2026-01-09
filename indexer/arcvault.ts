import { ethers } from "ethers"
import { TrustGraph } from "./graph"
import ArcVaultABI from "./abis/ArcVault.json"

/*
    ArcVault Indexer

    Listens to ContributionNFTUpgradeable events
    and materializes them into OCG identity nodes.
*/

export class ArcVaultIndexer {
    provider: ethers.Provider
    contract: ethers.Contract
    graph: TrustGraph

    constructor(
        rpc: string,
        arcVaultAddress: string,
        graph: TrustGraph
    ) {
        this.provider = new ethers.JsonRpcProvider(rpc)
        this.contract = new ethers.Contract(
            arcVaultAddress,
            ArcVaultABI,
            this.provider
        )
        this.graph = graph
    }

    async start() {
        console.log("🧭 ArcVault indexer online")

        this.contract.on(
            "ContributionMinted",
            async (tokenId, to, category, score, approver, cid) => {
                await this.indexToken(tokenId)
            }
        )

        this.contract.on(
            "ContributionUpdated",
            async (tokenId) => {
                await this.indexToken(tokenId)
            }
        )
    }

    async indexToken(tokenId: bigint) {
        const info = await this.contract.info(tokenId)
        const owner = await this.contract.ownerOf(tokenId)

        const node = {
            type: "arcvault",
            tokenId: tokenId.toString(),
            owner,
            category: Number(info.category),
            score: Number(info.score),
            approver: info.approver,
            cid: info.cid
        }

        const nodeId = this.graph.hash(node)

        // Remove old node for this token
        this.graph.removeByKey(`arcvault:${tokenId}`)

        // Insert new identity node
        this.graph.insert({
            id: nodeId,
            key: `arcvault:${tokenId}`,
            owner,
            weight: info.score,
            data: node
        })

        console.log("🔗 ArcVault → OCG", {
            token: tokenId.toString(),
            owner,
            score: info.score,
            nodeId
        })
    }
}
