import { getEquippedBonuses } from "./items.js";
export function createPlayer(state) {
  const bonuses = getEquippedBonuses(state);
  return {
    character: state.character,
    x: 0.22,
    y: 0,
    frame: 0,
    distanceMultiplier: bonuses.distance * (1 + (state.upgrades.speed - 1) * 0.12),
    get speedMultiplier() { return this.distanceMultiplier; },
    staminaMultiplier: Math.max(0.55, 1 - (state.upgrades.stamina - 1) * 0.08) * bonuses.energyUse
  };
}
