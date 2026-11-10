/*
 * Estrutura reservada para o sistema de missões.
 * Será ativada em uma atualização futura, sem alterar o motor da corrida.
 */
export const missionsModule = {
  id: "missions",
  register(api) {
    if (api?.registerFeature) api.registerFeature("missions", { enabled: false });
  }
};
