import { CONFIG } from "./config.js";
const freshState = () => ({
  version: 5, coins: CONFIG.startingCoins, xp: 0, level: 1,
  energy: CONFIG.startingEnergy, maxEnergy: CONFIG.maxEnergy,
  energyUpdatedAt: Date.now(),
  distance: 0, totalDistance: 0, record: 0, runs: 0,
  character: "male",
  upgrades: { speed: 1 },
  ownedItems: ["basic-shoes"],
  equippedItems: ["basic-shoes"],
  lastSaved: Date.now()
});
export function syncEnergy(state, now = Date.now()) {
  state.maxEnergy = CONFIG.maxEnergy;
  state.energy = Math.min(CONFIG.maxEnergy, Math.max(0, Number(state.energy) || 0));
  let updatedAt = Number(state.energyUpdatedAt) || now;
  if (state.energy >= CONFIG.maxEnergy) {
    state.energy = CONFIG.maxEnergy;
    state.energyUpdatedAt = now;
    return 0;
  }
  const elapsed = Math.max(0, now - updatedAt);
  const recovered = Math.min(CONFIG.maxEnergy - state.energy, Math.floor(elapsed / CONFIG.energyRechargeMs));
  if (recovered > 0) {
    state.energy += recovered;
    updatedAt += recovered * CONFIG.energyRechargeMs;
  }
  state.energyUpdatedAt = updatedAt;
  return recovered;
}
export function loadGame() {
  try {
    const raw = localStorage.getItem(CONFIG.saveKey);
    if (!raw) return freshState();
    const saved = JSON.parse(raw), base = freshState();
    const upgrades = { speed: Math.max(1, Number(saved.upgrades?.speed) || 1) };
    const state = {
      ...base, ...saved, version: 5, upgrades,
      maxEnergy: CONFIG.maxEnergy,
      energy: Math.min(CONFIG.maxEnergy, Math.max(0, Number(saved.energy ?? CONFIG.startingEnergy))),
      energyUpdatedAt: Number(saved.energyUpdatedAt) || Number(saved.lastSaved) || Date.now(),
      coins: Math.max(0, Number(saved.coins) || 0),
      xp: Math.max(0, Number(saved.xp) || 0),
      ownedItems: Array.isArray(saved.ownedItems) ? saved.ownedItems : base.ownedItems,
      equippedItems: Array.isArray(saved.equippedItems) ? saved.equippedItems : base.equippedItems
    };
    // Recarga completa única para liberar os testes da nova animação.
    if ((Number(saved.version) || 1) < 5) {
      state.energy = CONFIG.maxEnergy;
      state.energyUpdatedAt = Date.now();
    }
    syncEnergy(state);
    return state;
  } catch (error) {
    console.warn("Não foi possível carregar o progresso salvo.", error);
    return freshState();
  }
}
export function saveGame(state) {
  try {
    state.lastSaved = Date.now();
    localStorage.setItem(CONFIG.saveKey, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn("Não foi possível salvar o progresso.", error);
    return false;
  }
}
export function resetGame() {
  localStorage.removeItem(CONFIG.saveKey);
  return freshState();
}
