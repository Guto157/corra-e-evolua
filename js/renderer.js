const canvas=document.getElementById("gameCanvas"),ctx=canvas.getContext("2d");
let lastFrame=0;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function limb(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.stroke();}
function drawRunner(x,y,phase,female){
 const bob=Math.sin(phase*2)*2,arm=Math.sin(phase*2)*9,leg=Math.sin(phase*2)*12;
 ctx.save();ctx.translate(x,y+bob);ctx.scale(1.35,1.35);
 ctx.fillStyle="#24445a33";ctx.beginPath();ctx.ellipse(0,3,28,6,0,0,Math.PI*2);ctx.fill();
 const skin="#d99b73",shirt=female?"#e85b91":"#277bd1",shorts=female?"#803c75":"#243e69",shoe="#f7f8fc";
 // pernas e tênis
 limb([[-5,-24],[-12+leg,-9],[-19+leg,-2]],"#26364b",7);
 limb([[6,-24],[12-leg,-10],[20-leg,-3]],"#34465b",7);
 limb([[-19+leg,-2],[-25+leg,-1]],shoe,6);limb([[20-leg,-3],[27-leg,-2]],shoe,6);
 // tronco esportivo
 ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-10,-56);ctx.quadraticCurveTo(0,-62,10,-55);ctx.lineTo(12,-27);ctx.quadraticCurveTo(0,-21,-11,-27);ctx.closePath();ctx.fill();
 ctx.fillStyle="#ffffff55";ctx.fillRect(-3,-54,3,21);
 // braços em movimento
 limb([[-8,-51],[-16+arm*.35,-39],[-12+arm*.35,-31]],skin,6);
 limb([[8,-51],[16-arm*.35,-40],[12-arm*.35,-32]],skin,6);
 // pescoço
 rounded(-3,-62,7,10,3,skin);
 // cabeça e orelha
 ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(1,-70,10,12,-.08,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#c98261";ctx.beginPath();ctx.arc(10,-69,2.5,0,Math.PI*2);ctx.fill();
 // cabelo e detalhes diferentes por personagem
 ctx.fillStyle=female?"#3d263b":"#342820";ctx.beginPath();ctx.moveTo(-9,-73);ctx.quadraticCurveTo(-10,-85,1,-84);ctx.quadraticCurveTo(12,-84,11,-73);ctx.lineTo(6,-77);ctx.quadraticCurveTo(-1,-80,-7,-74);ctx.fill();
 if(female){ctx.beginPath();ctx.moveTo(-8,-73);ctx.quadraticCurveTo(-15,-67,-11,-57);ctx.quadraticCurveTo(-7,-62,-6,-68);ctx.fill();}
 ctx.fillStyle="#263447";ctx.beginPath();ctx.arc(5,-70,1.3,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#9a594b";ctx.lineWidth=1;ctx.beginPath();ctx.arc(6,-65,2,0.2,1.3);ctx.stroke();
 // punhos e faixas do tênis
 ctx.fillStyle="#f8fafc";ctx.fillRect(-15+arm*.35,-33,5,3);ctx.fillRect(9-arm*.35,-34,5,3);
 ctx.restore();
}
export function drawScene(data={}){
 if(!canvas||!ctx)return;
 const dpr=Math.min(window.devicePixelRatio||1,2),w=canvas.clientWidth||700,h=canvas.clientHeight||220;
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);
 const phase=(data.frame??lastFrame)*.7,ground=h*.78;
 const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,"#a8dfe8");sky.addColorStop(.72,"#e4efcb");sky.addColorStop(1,"#d5e8bd");ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 ctx.fillStyle="#fff2b7";ctx.beginPath();ctx.arc(w*.84,h*.2,23,0,Math.PI*2);ctx.fill();
 for(let i=0;i<6;i++){const x=((i*155-phase*8)%(w+180)+w+180)%(w+180)-60;ctx.fillStyle="#ffffffb8";ctx.beginPath();ctx.ellipse(x,32+(i%2)*17,25,8,0,0,Math.PI*2);ctx.ellipse(x+17,30+(i%2)*17,17,7,0,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle="#9bc99c";ctx.beginPath();ctx.moveTo(0,ground-36);for(let x=0;x<=w;x+=25)ctx.lineTo(x,ground-36-Math.sin(x*.016+phase*.1)*12);ctx.lineTo(w,ground);ctx.lineTo(0,ground);ctx.fill();
 ctx.fillStyle="#76ad78";ctx.fillRect(0,ground,w,h-ground);ctx.fillStyle="#d7bd86";ctx.fillRect(0,ground+11,w,h-ground-11);
 ctx.fillStyle="#c2a36e";ctx.fillRect(0,ground+11,w,4);
 ctx.strokeStyle="#fff0c5";ctx.lineWidth=3;ctx.setLineDash([25,20]);ctx.lineDashOffset=-(phase*15)%45;ctx.beginPath();ctx.moveTo(0,ground+31);ctx.lineTo(w,ground+31);ctx.stroke();ctx.setLineDash([]);
 // árvores estilizadas no fundo
 for(let i=0;i<4;i++){const x=((i*220-phase*4)%(w+240)+w+240)%(w+240)-70;ctx.fillStyle="#805f48";ctx.fillRect(x,ground-55,7,25);ctx.fillStyle="#4f9a76";ctx.beginPath();ctx.arc(x+3,ground-60,17,0,Math.PI*2);ctx.fill();}
 const female=(document.documentElement.dataset.character||"male")==="female";
 drawRunner(w*.28,ground+8,phase,female);lastFrame=data.frame??lastFrame;
}
window.addEventListener("resize",()=>drawScene({frame:lastFrame}));
