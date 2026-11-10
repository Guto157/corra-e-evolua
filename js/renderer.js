const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let lastFrame = 0;
function roundedRect(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
export function drawScene(data={}) {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth || 700, height = canvas.clientHeight || 220;
  if (canvas.width !== Math.round(width*dpr) || canvas.height !== Math.round(height*dpr)) {
    canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
  }
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const w=width,h=height,ground=h*.78,phase=(data.frame||lastFrame)*.7;
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,"#bdebe4");sky.addColorStop(1,"#e5f2cf");ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#fff4c4";ctx.beginPath();ctx.arc(w*.83,h*.2,22,0,Math.PI*2);ctx.fill();
  for(let i=0;i<5;i++){const x=((i*155-(phase*8)% (w+170))+w+170)%(w+170)-50;ctx.fillStyle="#ffffffaa";ctx.beginPath();ctx.ellipse(x,35+(i%2)*19,25,8,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(x+17,34+(i%2)*19,17,7,0,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle="#8bc7a0";ctx.beginPath();ctx.moveTo(0,ground-38);for(let x=0;x<=w;x+=35)ctx.lineTo(x,ground-38-Math.sin(x*.018+phase*.12)*13);ctx.lineTo(w,ground);ctx.lineTo(0,ground);ctx.fill();
  ctx.fillStyle="#78ad73";ctx.fillRect(0,ground,w,h-ground);
  ctx.fillStyle="#d7c58d";ctx.fillRect(0,ground+13,w,h-ground-13);
  ctx.strokeStyle="#fff2c5";ctx.lineWidth=3;ctx.setLineDash([22,18]);ctx.lineDashOffset=-(phase*15)%40;ctx.beginPath();ctx.moveTo(0,ground+30);ctx.lineTo(w,ground+30);ctx.stroke();ctx.setLineDash([]);
  const px=w*.27,py=ground+8,bob=Math.sin(phase*1.8)*2,leg=Math.sin(phase*2)*9,skin="#f0b98e",female=document.documentElement.dataset.character==="female"||window.currentRunner==="female";
  ctx.save();ctx.translate(px,py+bob);
  ctx.fillStyle="#31516a";ctx.beginPath();ctx.ellipse(0,3,22,5,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#263f59";ctx.lineWidth=7;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-3,-23);ctx.lineTo(-7+leg,-4);ctx.lineTo(-14+leg,-1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(5,-23);ctx.lineTo(10-leg,-5);ctx.lineTo(18-leg,-2);ctx.stroke();
  ctx.strokeStyle=female?"#e75d91":"#347fce";ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(0,-54);ctx.lineTo(2,-25);ctx.stroke();
  ctx.strokeStyle=skin;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(-12+Math.sin(phase*2)*5,-35);ctx.stroke();ctx.beginPath();ctx.moveTo(2,-48);ctx.lineTo(14-Math.sin(phase*2)*5,-37);ctx.stroke();
  ctx.fillStyle=skin;ctx.beginPath();ctx.arc(1,-67,11,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=female?"#49324a":"#3a2d28";ctx.beginPath();ctx.arc(0,-72,11,Math.PI,Math.PI*2);ctx.fill();if(female){ctx.beginPath();ctx.arc(-9,-65,5,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle="#24364b";ctx.beginPath();ctx.arc(5,-68,1.4,0,Math.PI*2);ctx.fill();
  ctx.restore();lastFrame=data.frame||lastFrame;
}
window.addEventListener("resize",()=>drawScene({frame:lastFrame}));
