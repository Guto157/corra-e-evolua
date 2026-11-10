import { loadGame, saveGame, syncEnergy } from "../core/save.js";
import { CONFIG } from "../core/config.js";
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
function energyCountdown() {
  if (state.energy >= CONFIG.maxEnergy) return "Energia completa";
  const remaining = Math.max(0, CONFIG.energyRechargeMs - (Date.now() - state.energyUpdatedAt));
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `Próxima energia em ${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
}
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
  syncEnergy(state);
  $("coinsValue").textContent=fmt(state.coins);
  $("xpValue").textContent=`${fmt(state.xp)} / ${state.level*100}`;
  $("levelValue").textContent=state.level;
  $("recordValue").textContent=`${fmt(state.record)} m`;
  $("energyValue").textContent=`${state.energy} / ${CONFIG.maxEnergy}`;
  $("energyTimer").textContent=energyCountdown();
  $("totalDistance").textContent=`${fmt(state.totalDistance)} m`;
  $("runsValue").textContent=fmt(state.runs);
  $("maxEnergy").textContent=CONFIG.maxEnergy;
  $("speedLevel").textContent=`Nível ${state.upgrades.speed} · +12% por nível`;
  const speedButton=$("buySpeed"),cost=upgradeCost("speed",state.upgrades.speed);
  speedButton.textContent=`Melhorar · ${cost} 🪙`;
  speedButton.disabled=running||state.coins<cost;
  $("runButton").disabled=running||state.energy<1;
  $("runButton").textContent=running?"Correndo...":state.energy<1?"Aguardando energia":"▶ Iniciar corrida";
  document.querySelectorAll("[data-character]").forEach(b=>{
    b.classList.toggle("active",b.dataset.character===state.character);b.disabled=running;
  });
  renderItems();
}
function finish(reward){
  running=false;
  $("runStatus").textContent="CONCLUÍDA";
  $("runHint").textContent=`Você percorreu ${reward.distance} m e ganhou ${reward.coins} moedas e ${reward.xp} XP. Pode iniciar outra corrida quando quiser.`;
  toast(`Corrida concluída! +${reward.coins} moedas · +${reward.xp} XP${reward.leveled?" · Subiu de nível!":""}`);
  saveGame(state);render();
}
function startRun(){
  syncEnergy(state);
  if(state.energy<1){render();toast("Você está sem energia. Aguarde a recarga automática.");return;}
  game?.dispose();
  const wasFull=state.energy>=CONFIG.maxEnergy;
  state.energy-=1;
  if(wasFull)state.energyUpdatedAt=Date.now();
  saveGame(state);
  game=new RunningGame(state,{
    onStart:()=>{running=true;$("runStatus").textContent="CORRENDO";$("runHint").textContent="Corrida em andamento. A distância depende da velocidade e dos itens equipados.";render();},
    onFrame:data=>{
      $("distanceValue").textContent=`${fmt(data.distance)} m`;
      $("speedValue").textContent=`${Math.round(data.speed*3.6)} km/h`;
      $("energyValue").textContent=`${state.energy} / ${CONFIG.maxEnergy}`;
      $("energyTimer").textContent=energyCountdown();
      drawScene(data);
    },
    onFinish:finish
  });
  if(!game.start()){
    state.energy=Math.min(CONFIG.maxEnergy,state.energy+1);saveGame(state);render();
  }
}
$("runButton").addEventListener("click",startRun);
$("buySpeed").addEventListener("click",()=>{
  const result=applyUpgrade(state,"speed");
  if(!result.ok)return toast("Moedas insuficientes para essa melhoria.");
  saveGame(state);render();toast("Melhoria de distância comprada!");
});
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
setInterval(()=>{
  const before=state.energy;
  syncEnergy(state);
  if(state.energy!==before)saveGame(state);
  $("energyValue").textContent=`${state.energy} / ${CONFIG.maxEnergy}`;
  $("energyTimer").textContent=energyCountdown();
  if(!running)$("runButton").disabled=state.energy<1;
  if(!running&&state.energy>0)$("runButton").textContent="▶ Iniciar corrida";
},1000);
