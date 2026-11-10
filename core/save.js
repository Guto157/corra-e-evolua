import { CONFIG } from "./config.js";
const freshState = () => ({
  version: 1, coins: CONFIG.startingCoins, xp: 0, level: 1,
  energy: CONFIG.startingEnergy, maxEnergy: CONFIG.startingEnergy,
  distance: 0, totalDistance: 0, record: 0, runs: 0,
  character: "male",
  upgrades: { energy: 1, speed: 1, stamina: 1 },
  lastSaved: Date.now()
});
export function loadGame() {
  try {
    const raw = localStorage.getItem(CONFIG.saveKey);
    if (!raw) return freshState();
    const saved = JSON.parse(raw);
    const base = freshState();
    return {
      ...base, ...saved,
      upgrades: { ...base.upgrades, ...(saved.upgrades || {}) },
      coins: Math.max(0, Number(saved.coins) || 0),
      xp: Math.max(0, Number(saved.xp) || 0),
      energy: Math.max(0, Number(saved.energy ?? base.energy) || 0),
      maxEnergy: Math.max(base.maxEnergy, Number(saved.maxEnergy) || base.maxEnergy)
    };
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
