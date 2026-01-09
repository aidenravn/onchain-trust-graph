export function computeRisk(input: {
  infiniteApprovals: number;
  unknownContracts: number;
  drainLinks: number;
  guardians: number;
  lastRecoveryDays: number;
}) {
  const approvalRisk = Math.min(input.infiniteApprovals * 5, 100);
  const interactionRisk = Math.min(input.unknownContracts * 8, 100);
  const drainProximity = Math.min(input.drainLinks * 20, 100);
  const guardianWeakness = input.guardians === 0 ? 100 : 50 / input.guardians;
  const recoveryNeglect = Math.min(input.lastRecoveryDays / 3, 100);

  return (
    0.25 * approvalRisk +
    0.25 * interactionRisk +
    0.2 * drainProximity +
    0.15 * guardianWeakness +
    0.15 * recoveryNeglect
  );
}
