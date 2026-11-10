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
    this.elapsed = 0;
    this.frame = 0;
    this.lastTime = 0;
    this.raf = 0;
  }
  start() {
    if (this.running || this.state.energy < 1) return false;
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
    this.elapsed += dt;
    this.distance += speed * dt;
    this.frame += dt * 10;
    this.callbacks.onFrame?.({ distance: this.distance, energy: this.state.energy, speed, frame: this.frame, progress: Math.min(1, this.elapsed / CONFIG.runDurationSeconds) });
    if (this.elapsed >= CONFIG.runDurationSeconds) return this.finish();
    this.raf = requestAnimationFrame(t => this.tick(t));
  }
  finish() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
    const reward = awardRun(this.state, this.distance);
    this.callbacks.onFinish?.(reward);
  }
  dispose() { this.running = false; cancelAnimationFrame(this.raf); }
}
