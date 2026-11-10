const canvas=document.getElementById("gameCanvas"),ctx=canvas?.getContext("2d");
let lastFrame=0;
const TAU=Math.PI*2;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();}
function line(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.stroke();}
function gradient(x,y,x2,y2,stops){const g=ctx.createLinearGradient(x,y,x2,y2);for(const [p,c] of stops)g.addColorStop(p,c);return g;}
function drawRunner(x,y,phase,female){
 const t=phase*1.9;
 const swing=Math.sin(t), lift=Math.max(0,Math.cos(t));
 const ink="#152b3d", skin="#ffd8b8", accent=female?"#e94f98":"#168fc2";
 const shirt=female?"#d94b91":"#168fc2";
 ctx.save();
 ctx.translate(x,y+Math.abs(Math.sin(t*2))*.9);
 ctx.scale(1.32,1.32);
 // Sombra acompanha o impacto dos passos
 ctx.globalAlpha=.22;
 ellipse(0,4,25+lift*2,3,"#10283b");
 ctx.globalAlpha=1;
 // pernas em ciclo de passada, com joelhos e pés independentes
 const hipX=-2,hipY=-49;
 const stride=25;
 const nearKnee=[hipX+swing*stride*.62+5,-27-lift*7];
 const nearFoot=[nearKnee[0]+swing*stride*.62+7,-3+Math.max(0,-Math.cos(t))*3];
 const farKnee=[hipX-swing*stride*.62-5,-28-Math.max(0,-Math.cos(t))*7];
 const farFoot=[farKnee[0]-swing*stride*.62-7,-3+Math.max(0,Math.cos(t))*3];
 // perna de trás
 line([[hipX,hipY],farKnee,farFoot],ink,4.2);
 line([farFoot,[farFoot[0]-8,farFoot[1]+1]],accent,4.2);
 // tronco inclinado para frente
 line([[-1,-79],[3,-50]],shirt,8);
 line([[-1,-79],[3,-50]],ink,1.2);
 // braço de trás balança em oposição à perna
 const arm=swing*13;
 line([[-1,-74],[-8-arm,-62+Math.cos(t)*5],[-13-arm*1.35,-51+Math.cos(t)*7]],ink,3.8);
 ellipse(-13-arm*1.35,-51+Math.cos(t)*7,2.1,2.1,skin);
 // braço da frente
 line([[1,-74],[9+arm,-64-Math.cos(t)*5],[14+arm*1.35,-55-Math.cos(t)*7]],shirt,4.5);
 line([[1,-74],[9+arm,-64-Math.cos(t)*5],[14+arm*1.35,-55-Math.cos(t)*7]],ink,1.1);
 ellipse(14+arm*1.35,-55-Math.cos(t)*7,2.1,2.1,skin);
 // perna da frente por cima
 line([[hipX,hipY],nearKnee,nearFoot],ink,4.4);
 ellipse(nearKnee[0],nearKnee[1],2.4,2.4,accent);
 line([nearFoot,[nearFoot[0]+10,nearFoot[1]]],accent,4.5);
 // cabeça e perfil
 ellipse(5,-89,8.1,8.8,skin);
 ctx.strokeStyle=ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(5,-89,8.1,-1.35,1.45);ctx.stroke();
 // cabelo curto, com silhueta própria
 ctx.fillStyle=female?"#432b42":"#26384a";
 ctx.beginPath();ctx.moveTo(-3,-91);ctx.quadraticCurveTo(-4,-101,5,-100);ctx.quadraticCurveTo(13,-99,13,-91);ctx.lineTo(8,-94);ctx.lineTo(3,-96);ctx.lineTo(-1,-93);ctx.closePath();ctx.fill();
 ellipse(9,-89,1,1.1,ink);
 // nariz de perfil
 line([[12,-87],[15,-85],[12,-84]],skin,1.6);
 // linhas de velocidade
 ctx.globalAlpha=.48;
 line([[-40,-63],[-27,-63]],accent,2);
 line([[-36,-51],[-25,-51]],accent,1.6);
 ctx.restore();
}
function drawCity(w,ground,phase){
 // distant skyline
 for(let i=0;i<9;i++){const bw=25+(i%3)*12,bh=35+(i*17%58),x=((i*91-phase*2)%(w+110)+w+110)%(w+110)-45;
 rounded(x,ground-75-bh,bw,bh,3,i%2?"#8bb8c8":"#a4c8d2");
 ctx.fillStyle="#e5f4ed";for(let yy=ground-68-bh;yy<ground-18;yy+=13)for(let xx=x+6;xx<x+bw-4;xx+=10)ctx.fillRect(xx,yy,4,6);
 }
 // hills
 ctx.fillStyle="#78b98b";ctx.beginPath();ctx.moveTo(0,ground-38);for(let x=0;x<=w;x+=20)ctx.lineTo(x,ground-40-Math.sin(x*.012+phase*.04)*14);ctx.lineTo(w,ground);ctx.lineTo(0,ground);ctx.fill();
 // clouds
 for(let i=0;i<4;i++){const x=((i*190-phase*5)%(w+150)+w+150)%(w+150)-60;ellipse(x,31+(i%2)*17,24,8,"#ffffffb8");ellipse(x+17,28+(i%2)*17,18,9,"#ffffffb8");}
 // trees
 for(let i=0;i<5;i++){const x=((i*155-phase*3)%(w+190)+w+190)%(w+190)-60;rounded(x,ground-65,7,37,3,"#80654a");ellipse(x+4,ground-68,19,20,"#378b69");ellipse(x-7,ground-59,12,13,"#4da878");ellipse(x+13,ground-58,11,13,"#2f805f");}
}
export function drawScene(data={}){
 if(!canvas||!ctx)return;
 const dpr=Math.min(window.devicePixelRatio||1,2),w=canvas.clientWidth||700,h=canvas.clientHeight||220;
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);
 const phase=(data.frame??lastFrame)*.7,ground=h*.79;
 ctx.fillStyle=gradient(0,0,0,h,[[0,"#76c8ef"],[.58,"#d7f0e6"],[1,"#a6d18d"]]);ctx.fillRect(0,0,w,h);
 ellipse(w*.83,h*.17,19,19,"#fff2b0");
 drawCity(w,ground,phase);
 // pista com profundidade e sombras
 ctx.fillStyle="#6b8490";ctx.fillRect(0,ground-2,w,7);
 ctx.fillStyle=gradient(0,ground,0,h,[[0,"#526b7a"],[.18,"#344e61"],[1,"#263c4e"]]);ctx.fillRect(0,ground+5,w,h-ground);
 ctx.fillStyle="#d9e6dc";ctx.fillRect(0,ground+5,w,3);
 ctx.fillStyle="#e5b96f";ctx.fillRect(0,ground+10,w,3);
 ctx.strokeStyle="#d9e8e8aa";ctx.lineWidth=2;ctx.setLineDash([22,20]);ctx.lineDashOffset=-(phase*12)%42;ctx.beginPath();ctx.moveTo(0,ground+42);ctx.lineTo(w,ground+42);ctx.stroke();ctx.setLineDash([]);
 // reflexos e marcas em movimento
 for(let i=0;i<7;i++){const x=((i*115-phase*11)%(w+100)+w+100)%(w+100)-30;rounded(x,ground+23,30,2,1,"#ffffff24");}
 const female=(document.documentElement.dataset.character||"male")==="female";
 drawRunner(w*.28,ground+7,phase,female);
 lastFrame=data.frame??lastFrame;
}
window.addEventListener("resize",()=>drawScene({frame:lastFrame}));
