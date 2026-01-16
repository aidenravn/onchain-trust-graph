🧠 On-Chain Trust Graph (OCG)

Cryptographically Provable Human Continuity for Web3
Demo / Testnet / Research Only

⸻

⚠️ Legal & Security Notice

IMPORTANT — PLEASE READ CAREFULLY

This repository and all associated smart contracts, indexers, APIs, and interfaces are provided strictly for educational, research, and testnet use.
	1.	No Financial Advice
Nothing in this repository constitutes financial, legal, or investment advice.
	2.	No Production Use
All components are experimental, unaudited, and must not be used with real funds.
	3.	No Liability
The authors assume no responsibility for any loss, damage, or harm resulting from the use of this software.
	4.	User Responsibility
You are fully responsible for verifying all code, transactions, addresses, and signatures.
	5.	No Guarantees
No guarantees are made regarding security, correctness, or reliability.
	6.	Forking & Modifications
Forking or modifying this repository does not transfer any liability to the original authors.

Use only in isolated test environments.

⸻

🧬 What is OCG?

On-Chain Trust Graph (OCG) is an experimental cryptographic identity and reputation layer for Web3.

Its purpose is to explore whether wallets can prove human continuity over time, even when:
	•	Keys are rotated
	•	Devices are replaced
	•	Wallets are migrated

OCG aggregates on-chain signals such as:
	•	Contribution NFTs
	•	DAO approvals
	•	Historical wallet behavior

into a graph-based trust representation.

⸻

🔗 Core Idea

Traditional Web3 assumption:

wallet = human

OCG explores an alternative:

human = cryptographic continuity across wallets

Wallets are treated as containers.
Continuity is inferred from cryptographic signals and time.

⸻

🧩 Architecture

```text
+--------------------+
|   ArcVault NFTs    |
| (Contribs, DAO)    |
+---------+----------+
          |
          v
+--------------------+
|    OCG Indexer     |
|  (arcvault.ts)    |
+---------+----------+
          |
          v
+--------------------+
|    Trust Graph     |
|    (graph.ts)     |
+---------+----------+
          |
     +----+----+
     |         |
     v         v
+-----------+  +-----------------+
| Risk Eng. |  | Continuity Eng. |
| (risk.ts)|  | (continuity.ts) |
+-----+-----+  +--------+--------+
      |                 |
      v                 v
 Trust Score      Wallet → Wallet
                    Proof
        \              /
         \            /
          v          v
        +------------------+
        |     REST API     |
        |   (server.ts)   |
        +------------------+
```
⸻

🧠 What It Does

Capability	Description
Trust score	Estimates wallet credibility based on observed signals
Sybil signals	Detects likely bot or farm behavior (probabilistic)
Continuity proof	Links wallets belonging to the same human
Contribution identity	Reputation derived from NFTs and approvals
Migration safety	Reputation survives wallet changes

All outputs are signals, not enforcement.

⸻

🔌 Integrations

OCG is designed to be composable with existing systems:
	•	Seedless Wallets → migrate reputation to new accounts
	•	TxGuard → flag risky or anomalous senders
	•	VEC → restrict execution to continuous humans
	•	DAOs → Sybil-resistant voting and airdrops

Integration is optional and application-defined.

⸻

🧠 Why This Matters

Current Web3 systems struggle with:
	•	Sybil attacks
	•	Bot-driven governance
	•	Reputation loss when keys change

OCG explores whether human continuity can be represented cryptographically:
	•	No KYC
	•	No biometrics
	•	No centralized identity

Only signatures, math, time, and observable on-chain data.

⸻


⚠️ Final Reminder

This is testnet-only research infrastructure.
	•	Do not use with real funds
	•	Do not assume security
	•	Do not deploy on mainnet

Expect breaking changes.

⸻

🧭 Ethical Guardrails

Blockchains may remember —
but they must never lock humans in.

OCG is designed with explicit boundaries:

OCG may record:
	•	Contributions
	•	Continuity signals
	•	On-chain behavior

OCG must never become:
	•	A global blacklist
	•	A permanent reputation prison
	•	A social credit system
	•	A tool for censorship or exclusion

Trust in OCG is:
	•	Contextual
	•	Probabilistic
	•	Decaying over time

Not absolute, permanent, or globally enforceable.

Every signal:
	•	Can change
	•	Can recover
	•	Can be ignored by applications

OCG does not decide who is allowed to exist.
It only exposes cryptographic history.

Applications decide how — or whether — to use it.

Humans always retain the right to:
	•	Start over
	•	Migrate
	•	Rebuild trust
	•	Exit the graph

OCG provides memory — not destiny.

## UX Concept (Exploratory)

![OCG UX Concept](onchain-trust-graph
/ocg-ux-concept.png)

This mockup illustrates the intended UX philosophy of OCG:
quiet, non-judgmental, and contextual.
