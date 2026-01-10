🧠 On-Chain Trust Graph (OCG)

Cryptographically Provable Human Continuity
Demo / Testnet / Research Only

⸻

⚠️ LEGAL & SECURITY NOTICE

IMPORTANT — READ BEFORE USING

This repository and all associated smart contracts, indexers, APIs, and interfaces are provided strictly for educational, research, and testnet purposes.
	1.	No Financial Advice
Nothing in this repository constitutes financial, legal, or investment advice.
	2.	No Production Use
These contracts, indexers, and services are NOT audited and MUST NOT be used with real funds.
	3.	No Liability
The authors assume no responsibility for any loss, damage, or harm caused by using this software.
	4.	User Responsibility
You are fully responsible for verifying all code, transactions, addresses, and signatures.
	5.	No Guarantees
This system makes no promises of security, correctness, or safety.
	6.	Forking & Usage
Forking or modifying this repository does not transfer liability to the original authors.

Use only in isolated test environments.

⸻

🧬 What is OCG?

On-Chain Trust Graph (OCG) is a cryptographic identity layer for Web3.

It allows wallets to prove:

“I am still the same human”

even when devices, keys, or wallets change.

OCG transforms:
	•	Contribution NFTs
	•	DAO approvals
	•	On-chain history

into a graph of cryptographic trust.

⸻

🔗 Core Idea

Traditional Web3 identity:

wallet = human

OCG changes this to:

human = cryptographic continuity across wallets

Your reputation becomes portable, verifiable, and non-custodial.

⸻

🧩 Architecture

This system is built as a data pipeline:

ArcVault NFTs
  ↓
arcvault.ts   (on-chain indexer)
  ↓
graph.ts      (trust graph)
  ↓
risk.ts       (trust scoring & sybil detection)
  ↓
continuity.ts (wallet → wallet human continuity)
  ↓
server.ts     (REST API)

And logically:

arcvault.ts   → collects contribution NFTs
graph.ts      → builds the wallet ↔ human graph
risk.ts       → calculates trust & detects bots
continuity.ts → verifies "same human" signatures
server.ts     → exposes everything via HTTP


⸻

🧠 What OCG Provides

Capability	Meaning
Trust Score	How credible a wallet is
Sybil Detection	Is this likely a bot or farm?
Continuity Proof	Are two wallets the same human?
Contribution Identity	NFTs define reputation
Migration Safety	Reputation survives wallet changes


⸻

🔌 Integrations

OCG is designed to plug into:
	•	Seedless Wallet → migrate reputation to new smart wallets
	•	TxGuard → block risky or bot-like senders
	•	VEC (Voluntary Execution Context) → allow actions only if same human
	•	DAOs → Sybil-resistant voting & airdrops

⸻

🧪 Demo Setup

onchain-trust-graph/
├── indexer/
│   ├── graph.ts
│   ├── arcvault.ts
│   ├── risk.ts
│   └── continuity.ts
│
├── api/
│   └── server.ts
│
└── README.md

Run:

export RPC=https://your-testnet-rpc
export ARCVault=0xArcVaultContract

npm install
npm start

API:

GET /wallet/:address
GET /continuity?from=0xA&to=0xB
GET /graph


⸻

🧠 Why This Matters

Web3 today has:
	•	bots
	•	sybil farms
	•	fake wallets
	•	identity loss when keys change

OCG creates:

A cryptographic layer of human continuity

Not KYC.
Not biometrics.
Not centralized.

Just math, signatures, and reputation.

⸻

🧑‍🚀 Created by

ravN
Builder at the intersection of AI × Web3 × Cryptographic Trust

Building systems where humans can prove they are real —
without revealing who they are.

⸻

⚠️ Final Reminder

This is a testnet-only experimental protocol.

Do NOT use with real money.
Do NOT assume safety.
Do NOT deploy on mainnet.

This is research infrastructure.

⸻
