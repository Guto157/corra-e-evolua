export const ITEMS = [
  { id:"basic-shoes", name:"Tênis básico", icon:"👟", price:0, distance:1, energyUse:1, description:"Seu primeiro par. Sem bônus." },
  { id:"runner-shoes", name:"Tênis corredor", icon:"🥾", price:120, distance:1.35, energyUse:0.96, description:"+35% de distância por corrida." },
  { id:"pro-shoes", name:"Tênis profissional", icon:"⚡", price:350, distance:1.8, energyUse:0.9, description:"+80% de distância por corrida." },
  { id:"ultra-shoes", name:"Tênis ultraleve", icon:"🚀", price:900, distance:2.5, energyUse:0.82, description:"+150% de distância por corrida." }
];
export function getEquippedBonuses(state) {
  const equipped = (state.equippedItems || []).map(id => ITEMS.find(item => item.id === id)).filter(Boolean);
  return equipped.reduce((sum,item)=>({distance:sum.distance*item.distance,energyUse:sum.energyUse*item.energyUse}),{distance:1,energyUse:1});
}
export function buyOrEquipItem(state,id) {
  const item=ITEMS.find(entry=>entry.id===id);
  if(!item) return {ok:false,reason:"Item não encontrado."};
  if((state.ownedItems||[]).includes(id)) {
    state.equippedItems=[id];
    return {ok:true,equipped:true,item};
  }
  if(state.coins<item.price) return {ok:false,reason:"Moedas insuficientes."};
  state.coins-=item.price;
  state.ownedItems.push(id);
  state.equippedItems=[id];
  return {ok:true,equipped:true,item};
}
