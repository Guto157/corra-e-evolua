import { loadGame, saveGame } from "../core/save.js";
import { RunningGame } from "../core/game.js";
import { applyUpgrade, upgradeCost } from "../core/economy.js";
import { ITEMS, buyOrEquipItem } from "../core/items.js";
import { drawScene } from "./renderer.js";
const $ = id => document.getElementById(id);
const state = loadGame();
let game = null, running = false, toastTimer;
function toast(message) {
  const el = $("toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
function fmt(n) { return Math.floor(n).toLocaleString("pt-BR"); }
function renderItems() {
  const list=$("itemsList");
  list.innerHTML="";
  for(const item of ITEMS) {
    const owned=state.ownedItems.includes(item.id), equipped=state.equippedItems.includes(item.id);
    const row=document.createElement("div"); row.className="item-card";
    const info=document.createElement("div");
    info.innerHTML=`<b>${item.icon} ${item.name}</b><small>${item.description}</small>`;
    const button=document.createElement("button"); button.className="buy-button";
    button.textContent=equipped?"Equipado":owned?"Equipar":`Comprar · ${item.price} 🪙`;
    button.disabled=running||equipped||(!owned&&state.coins<item.price);
    button.addEventListener("click",()=>{
      const result=buyOrEquipItem(state,item.id);
      if(!result.ok)return toast(result.reason);
      saveGame(state);render();toast(owned?"Item equipado!":"Item comprado e equipado!");
    });
    row.append(info,button);list.append(row);
  }
}
function render() {
  $("coinsValue").textContent=fmt(state.coins);
  $("xpValue").textContent=`${fmt(state.xp)} / ${state.level*100}`;
  $("levelValue").textContent=state.level;
  $("recordValue").textContent=`${fmt(state.record)} m`;
  $("energyValue").textContent=`${Math.ceil(state.energy)} / ${state.maxEnergy}`;
  $("energyBar").style.width=`${Math.max(0,state.energy/state.maxEnergy*100)}%`;
  $("totalDistance").textContent=`${fmt(state.totalDistance)} m`;
  $("runsValue").textContent=fmt(state.runs);
  $("maxEnergy").textContent=fmt(state.maxEnergy);
  $("energyLevel").textContent=`Nível ${state.upgrades.energy} · ${state.maxEnergy} pontos`;
  $("speedLevel").textContent=`Nível ${state.upgrades.speed} · +12% por nível`;
  $("staminaLevel").textContent=`Nível ${state.upgrades.stamina} · consumo reduzido`;
  for(const type of ["energy","speed","stamina"]){
    const btn=$(`buy${type[0].toUpperCase()+type.slice(1)}`),cost=upgradeCost(type,state.upgrades[type]);
    btn.textContent=`Melhorar · ${cost} 🪙`;btn.disabled=running||state.coins<cost;
  }
  $("runButton").disabled=running||state.energy<=0;
  $("recoverButton").disabled=running||state.energy>=state.maxEnergy;
  document.querySelectorAll("[data-character]").forEach(b=>{
    b.classList.toggle("active",b.dataset.character===state.character);b.disabled=running;
  });
  renderItems();
}
function finish(reward){
  running=false;state.energy=0;
  $("runStatus").textContent="CONCLUÍDA";
  $("runHint").textContent=`Você percorreu ${reward.distance} m e ganhou ${reward.coins} moedas e ${reward.xp} XP.`;
  $("runButton").textContent="⚡ Energia esgotada";
  toast(`Corrida concluída! +${reward.coins} moedas · +${reward.xp} XP${reward.leveled?" · Subiu de nível!":""}`);
  saveGame(state);render();
}
function startRun(){
  if(state.energy<=0){toast("Recupere sua energia para correr novamente.");return;}
  game?.dispose();
  game=new RunningGame(state,{
    onStart:()=>{running=true;$("runStatus").textContent="CORRENDO";$("runButton").textContent="Correndo...";$("runHint").textContent="Seu corredor está em movimento. Acompanhe a distância!";render();},
    onFrame:data=>{
      $("distanceValue").textContent=`${fmt(data.distance)} m`;
      $("speedValue").textContent=`${Math.round(data.speed*3.6)} km/h`;
      $("energyValue").textContent=`${Math.ceil(data.energy)} / ${state.maxEnergy}`;
      $("energyBar").style.width=`${Math.max(0,data.energy/state.maxEnergy*100)}%`;
      drawScene(data);
    },onFinish:finish
  });
  game.start();
}
$("runButton").addEventListener("click",startRun);
$("recoverButton").addEventListener("click",()=>{
  if(running||state.energy>=state.maxEnergy)return;
  const recovered=Math.min(state.maxEnergy-state.energy, state.maxEnergy);
  state.energy+=recovered;saveGame(state);render();
  toast(`+${Math.ceil(recovered)} pontos de energia recuperados.`);
  $("runStatus").textContent="PRONTO";$("runButton").textContent="▶ Iniciar corrida";
  $("runHint").textContent="Energia recuperada. Prepare-se para uma nova corrida.";
});
for(const type of ["energy","speed","stamina"]){
  $(`buy${type[0].toUpperCase()+type.slice(1)}`).addEventListener("click",()=>{
    const result=applyUpgrade(state,type);
    if(!result.ok)return toast("Moedas insuficientes para essa melhoria.");
    saveGame(state);render();toast("Melhoria comprada com sucesso!");
  });
}
document.querySelectorAll("[data-character]").forEach(button=>button.addEventListener("click",()=>{
  if(running)return;
  state.character=button.dataset.character;
  document.documentElement.dataset.character=state.character;window.currentRunner=state.character;
  saveGame(state);render();drawScene({frame:0});
}));
$("soundButton").addEventListener("click",()=>toast("O áudio será adicionado em uma atualização futura."));
window.addEventListener("beforeunload",()=>{game?.dispose();saveGame(state);});
document.documentElement.dataset.character=state.character;window.currentRunner=state.character;
$("distanceValue").textContent="0 m";
render();drawScene({frame:0});
