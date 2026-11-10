import { CONFIG } from "./config.js";
export function upgradeCost(type, level) {
  const bases = { energy: CONFIG.energyUpgradeBase, speed: CONFIG.speedUpgradeBase, stamina: CONFIG.staminaUpgradeBase };
  return Math.round(bases[type] * Math.pow(1.55, Math.max(0, level - 1)));
}
export function applyUpgrade(state, type) {
  if (!Object.hasOwn(state.upgrades, type)) return { ok: false, cost: 0 };
  const current = state.upgrades[type], cost = upgradeCost(type, current);
  if (state.coins < cost) return { ok: false, cost };
  state.coins -= cost;
  state.upgrades[type] += 1;
  if (type === "energy") {
    state.maxEnergy += 5;
    state.energy = Math.min(state.maxEnergy, state.energy + 5);
  }
  return { ok: true, cost };
}
export function awardRun(state, meters) {
  const distance = Math.max(0, Math.floor(meters));
  const coins = Math.max(1, Math.floor(distance * CONFIG.coinPerMeter));
  const xp = Math.max(1, Math.floor(distance * CONFIG.xpPerMeter));
  state.coins += coins;
  state.xp += xp;
  state.totalDistance += distance;
  state.record = Math.max(state.record, distance);
  state.runs += 1;
  let leveled = 0;
  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level += 1;
    leveled += 1;
  }
  return { distance, coins, xp, leveled };
}
