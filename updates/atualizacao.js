/*
 * Ponto de entrada para atualizações opcionais.
 * Módulos futuros devem exportar uma função register(api).
 * O núcleo continua funcionando se uma atualização falhar.
 */
const modules = [];
export function registerUpdate(module) {
  if (!module || typeof module.register !== "function") return false;
  modules.push(module);
  return true;
}
export function activateUpdates(api) {
  for (const module of modules) {
    try { module.register(api); }
    catch (error) { console.error("Falha ao ativar atualização opcional:", error); }
  }
}
