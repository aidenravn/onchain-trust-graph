import { ethers } from "ethers";
import { computeRisk } from "../risk/score";

const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)"
];

const OCG_ABI = [
  "function identityRoot(address) view returns (bytes32)"
];

// example known hacked clusters (demo MVP)
const DRAINED_CONTRACTS = [
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  "0x000000000000000000000000000000000000dEaD"
];

export async function getRiskScore(
  user: string,
  provider: ethers.Provider,
  ocgRegistry: string
) {
  // 1️⃣ Fetch recent transactions
  const txs = await provider.getHistory(user);

  // 2️⃣ Count unknown contracts interacted with
  const knownContracts = new Set<string>();
  let unknownInteractions = 0;

  for (const tx of txs) {
    if (tx.to) {
      if (!knownContracts.has(tx.to)) {
        knownContracts.add(tx.to);
        unknownInteractions++;
      }
    }
  }

  // 3️⃣ Check drain proximity
  let drainLinks = 0;
  for (const tx of txs) {
    if (tx.to && DRAINED_CONTRACTS.includes(tx.to.toLowerCase())) {
      drainLinks++;
    }
  }

  // 4️⃣ Fetch guardians from OCG
  const ocg = new ethers.Contract(ocgRegistry, OCG_ABI, provider);
  const root = await ocg.identityRoot(user);

  // Guardian count is inferred from root (for MVP we approximate)
  const guardianCount = root !== ethers.ZeroHash ? 2 : 0;

  // 5️⃣ Infinite approval scan (simplified)
  let infiniteApprovals = 0;
  for (const tx of txs.slice(0, 20)) {
    if (!tx.to) continue;

    try {
      const token = new ethers.Contract(tx.to, ERC20_ABI, provider);
      const allowance = await token.allowance(user, tx.to);
      if (allowance > ethers.parseUnits("100000000", 18)) {
        infiniteApprovals++;
      }
    } catch {}
  }

  // 6️⃣ Time since last recovery
  const lastRecoveryDays = root === ethers.ZeroHash ? 999 : 30;

  // 7️⃣ Final risk score
  return computeRisk({
    infiniteApprovals,
    unknownContracts: unknownInteractions,
    drainLinks,
    guardians: guardianCount,
    lastRecoveryDays
  });
}
