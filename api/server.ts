import express from "express"
import cors from "cors"

import { TrustGraph } from "../indexer/graph"
import { ArcVaultIndexer } from "../indexer/arcvault"
import { RiskEngine } from "../indexer/risk"
import { ContinuityEngine } from "../indexer/continuity"

const RPC = process.env.RPC!
const ARCVault = process.env.ARCVault!

const app = express()
app.use(cors())
app.use(express.json())

// Core brain
const graph = new TrustGraph()
const risk = new RiskEngine(graph)
const continuity = new ContinuityEngine(graph, risk)
const arc = new ArcVaultIndexer(RPC, ARCVault, graph)

// Start chain indexer
arc.start()

// -----------------------------
// 🔍 Wallet trust
// -----------------------------
app.get("/wallet/:addr", (req, res) => {
    const wallet = req.params.addr.toLowerCase()
    const score = risk.scoreWallet(wallet)
    res.json(score)
})

// -----------------------------
// 🧬 Wallet continuity
// -----------------------------
app.get("/continuity", (req, res) => {
    const { from, to } = req.query as any
    if (!from || !to) {
        return res.status(400).json({ error: "from and to required" })
    }

    const proof = continuity.prove(
        from.toLowerCase(),
        to.toLowerCase()
    )

    res.json(proof)
})

// -----------------------------
// 🕸️ Raw graph
// -----------------------------
app.get("/graph", (req, res) => {
    res.json(graph.dump())
})

app.listen(3333, () => {
    console.log("🧠 On-Chain Trust Graph API running on :3333")
})
