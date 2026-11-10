import { CONFIG } from "./config.js";
import { createPlayer } from "./player.js";
import { awardRun } from "./economy.js";
export class RunningGame {
  constructor(state, callbacks = {}) {
    this.state = state;
    this.callbacks = callbacks;
    this.player = createPlayer(state);
    this.running = false;
    this.distance = 0;
    this.energy = state.energy;
    this.frame = 0;
    this.lastTime = 0;
    this.raf = 0;
  }
  start() {
    if (this.running || this.energy <= 0) return false;
    this.running = true;
    this.lastTime = 0;
    this.callbacks.onStart?.();
    this.raf = requestAnimationFrame(t => this.tick(t));
    return true;
  }
  tick(time) {
    if (!this.running) return;
    const dt = this.lastTime ? Math.min((time - this.lastTime) / 1000, 0.05) : 0;
    this.lastTime = time;
    const speed = CONFIG.baseRunSpeed * this.player.speedMultiplier;
    this.distance += speed * dt;
    this.energy = Math.max(0, this.energy - CONFIG.energyDrainPerSecond * this.player.staminaMultiplier * dt);
    this.frame += dt * 10;
    this.callbacks.onFrame?.({ distance: this.distance, energy: this.energy, speed, frame: this.frame });
    if (this.energy <= 0) return this.finish();
    this.raf = requestAnimationFrame(t => this.tick(t));
  }
  finish() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
    const reward = awardRun(this.state, this.distance);
    this.state.energy = 0;
    this.callbacks.onFinish?.(reward);
  }
  dispose() { this.running = false; cancelAnimationFrame(this.raf); }
}
