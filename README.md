# 🧠 On-Chain Trust Graph (OCG)
**Cryptographically Provable Human Continuity**

> **Demo / Testnet / Research Only**

---

## ⚠️ LEGAL & SECURITY NOTICE  
**IMPORTANT — READ BEFORE USING**

This repository and all associated smart contracts, indexers, APIs, and interfaces are provided strictly for educational, research, and testnet purposes.

1. **No Financial Advice**  
Nothing in this repository constitutes financial, legal, or investment advice.

2. **No Production Use**  
These contracts, indexers, and services are **NOT audited** and **MUST NOT** be used with real funds.

3. **No Liability**  
The authors assume **no responsibility** for any loss, damage, or harm caused by using this software.

4. **User Responsibility**  
You are fully responsible for verifying all code, transactions, addresses, and signatures.

5. **No Guarantees**  
This system makes **no promises** of security, correctness, or safety.

6. **Forking & Usage**  
Forking or modifying this repository does **not** transfer liability to the original authors.

**Use only in isolated test environments.**

---

## 🧬 What is OCG?

**On-Chain Trust Graph (OCG)** is a cryptographic identity layer for Web3.

It allows wallets to prove:

> **“I am still the same human”**

even when devices, keys, or wallets change.

OCG turns:

- Contribution NFTs  
- DAO approvals  
- On-chain history  

into a **graph of cryptographic trust**.

---

## 🔗 Core Idea

Traditional Web3 identity:

wallet = human

OCG changes it to:

human = cryptographic continuity across wallets

---

## 🧩 Architecture

        ┌────────────────────────┐
        │   ArcVault NFTs         │
        │  (contributions)        │
        └────────────┬───────────┘
                     │
                     ▼
           ┌────────────────┐
           │  OCG Indexer    │
           │ (arcvault.ts)  │
           └────────┬───────┘
                    │
                    ▼
           ┌────────────────┐
           │ Trust Graph     │
           │  (graph.ts)     │
           └────────┬───────┘
                    │
        ┌───────────┼────────────┐
        ▼                           ▼

┌────────────────┐        ┌────────────────┐
│ Risk Engine     │        │ Continuity     │
│  (risk.ts)      │        │  Engine        │
└───────┬─────────┘        └───────┬─────────┘
│                          │
▼                          ▼
wallet trust score        old → new wallet proof

                    │
                    ▼
           ┌────────────────┐
           │ REST API        │
           │ (server.ts)     │
           └────────────────┘

---

## 🧠 What it Does

| Capability | Meaning |
|-----------|--------|
| **Trust score** | How credible a wallet is |
| **Sybil detection** | Is this likely a bot or farm? |
| **Continuity proof** | Are two wallets the same human? |
| **Contribution identity** | NFTs define reputation |
| **Migration safety** | Reputation survives wallet changes |

---

## 🔌 Integrations

OCG is designed to plug into:

- **Seedless Wallet** → move reputation to new smart wallets  
- **TxGuard** → block risky or bot-like senders  
- **VEC** → allow execution only if same human  
- **DAOs** → Sybil-resistant airdrops & voting  

---

## 🧪 Demo Setup

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

```bash
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

Building systems where humans can prove they are real — without revealing who they are.

⸻

⚠️ Final Reminder

This is a testnet-only experimental protocol.

Do NOT use with real money.
Do NOT assume safety.
Do NOT deploy on mainnet.

This is research infrastructure.
