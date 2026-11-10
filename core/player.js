export function createPlayer(state) {
  return {
    character: state.character,
    x: 0.22,
    y: 0,
    frame: 0,
    get speedMultiplier() { return 1 + (state.upgrades.speed - 1) * 0.12; },
    get staminaMultiplier() { return Math.max(0.55, 1 - (state.upgrades.stamina - 1) * 0.08); }
  };
}
