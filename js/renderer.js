const canvas=document.getElementById("gameCanvas"),ctx=canvas?.getContext("2d");
let lastFrame=0;
const TAU=Math.PI*2;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();}
function line(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.stroke();}
function gradient(x,y,x2,y2,stops){const g=ctx.createLinearGradient(x,y,x2,y2);for(const [p,c] of stops)g.addColorStop(p,c);return g;}
function drawRunner(x,y,phase,female){
 const t=phase*1.8, a=Math.sin(t), b=Math.cos(t);
 const ink="#172b3d", accent=female?"#ec5b9b":"#23a7d5";
 ctx.save();ctx.translate(x,y+Math.abs(b)*2);ctx.scale(1.55,1.55);
 // sombra e pequenas linhas de velocidade
 ellipse(0,4,29,4,"#14283b55");
 ctx.globalAlpha=.5;
 line([[-48,-56],[-35,-56]],"#ffffff",2);
 line([[-43,-43],[-32,-43]],"#ffffff",1.6);
 ctx.globalAlpha=1;
 // cabeça em perfil, olhando para a direita
 ellipse(8,-91,8,8,ink);
 // nariz curto para indicar o perfil
 line([[14,-91],[19,-88]],ink,2.5);
 // cabelo simples e rabo de cavalo opcional
 if(female){
   line([[3,-98],[-3,-94],[-5,-85]],accent,3);
   line([[-3,-94],[-10,-90],[-13,-82]],accent,2.5);
 }else{
   line([[2,-98],[7,-101],[13,-98]],ink,2.5);
 }
 // tronco inclinado para frente
 line([[5,-81],[0,-57],[-2,-48]],ink,5.5);
 line([[3,-76],[1,-59]],accent,2.2);
 // quadril
 ellipse(-2,-48,3.5,3.5,ink);
 // perna de trás: quadril, joelho, tornozelo
 const bkx=-9-a*10,bky=-27+Math.max(0,-a)*10;
 line([[-2,-47],[bkx,bky],[-17-a*17,-5]],ink,4.5);
 ellipse(bkx,bky,2.2,2.2,accent);
 line([[-17-a*17,-5],[-8-a*17,-5]],ink,3.5);
 // perna da frente
 const fkx=8+a*10,fky=-28-Math.max(0,a)*10;
 line([[-2,-47],[fkx,fky],[15+a*18,-5]],ink,4.8);
 ellipse(fkx,fky,2.3,2.3,accent);
 line([[15+a*18,-5],[26+a*18,-5]],ink,3.8);
 // braços em oposição às pernas
 const rearX=-12+a*9,rearY=-65-b*7;
 line([[2,-75],[rearX,rearY],[-16+a*12,-53-b*7]],ink,4);
 ellipse(rearX,rearY,2,2,accent);
 const frontX=14-a*9,frontY=-64+b*7;
 line([[3,-75],[frontX,frontY],[20-a*12,-53+b*7]],ink,4);
 ellipse(frontX,frontY,2,2,accent);
 // tênis minimalistas
 line([[-9-a*17,-5],[-3-a*17,-3]],accent,2.5);
 line([[25+a*18,-5],[31+a*18,-3]],accent,2.5);
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
