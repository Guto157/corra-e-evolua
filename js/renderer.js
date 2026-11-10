const canvas=document.getElementById("gameCanvas"),ctx=canvas?.getContext("2d");
let lastFrame=0;
const TAU=Math.PI*2;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();}
function line(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.stroke();}
function gradient(x,y,x2,y2,stops){const g=ctx.createLinearGradient(x,y,x2,y2);for(const [p,c] of stops)g.addColorStop(p,c);return g;}
function drawRunner(x,y,phase,female){
 const swing=Math.sin(phase*1.9), lift=Math.max(0,Math.cos(phase*1.9));
 const shirt=female?"#e95d9d":"#24a8d8";
 const shorts=female?"#a93f79":"#176b9b";
 const skin="#f2bd91", outline="#173047";
 ctx.save();
 ctx.translate(x,y+Math.abs(lift)*1.5);
 ctx.scale(1.42,1.42);
 // Sombra e movimento
 ellipse(0,4,31,4,"#14283b55");
 ctx.globalAlpha=.38;
 line([[-43,-61],[-29,-61]],"#ffffff",2);
 line([[-38,-49],[-27,-49]],"#ffffff",1.5);
 ctx.globalAlpha=1;
 // Perna de trás, com articulações arredondadas
 const backKneeX=-8-swing*11, backKneeY=-24+Math.max(0,swing)*5;
 line([[-3,-43],[backKneeX,backKneeY],[-15-swing*15,-4]],outline,7);
 line([[-3,-43],[backKneeX,backKneeY],[-15-swing*15,-4]],shorts,4.2);
 ellipse(backKneeX,backKneeY,3.2,3.2,skin);
 line([[-15-swing*15,-4],[-24-swing*15,-2]],outline,5);
 line([[-15-swing*15,-4],[-24-swing*15,-2]],"#f4f7fb",2.8);
 // Perna da frente
 const frontKneeX=7+swing*11, frontKneeY=-25-Math.max(0,-swing)*6;
 line([[-3,-43],[frontKneeX,frontKneeY],[17+swing*15,-5]],outline,7.5);
 line([[-3,-43],[frontKneeX,frontKneeY],[17+swing*15,-5]],shorts,4.5);
 ellipse(frontKneeX,frontKneeY,3.3,3.3,skin);
 line([[17+swing*15,-5],[28+swing*15,-3]],outline,5.5);
 line([[17+swing*15,-5],[28+swing*15,-3]],"#f4f7fb",3);
 // Tronco inclinado para a frente
 ctx.fillStyle=shirt;
 ctx.beginPath();
 ctx.moveTo(1,-70);ctx.quadraticCurveTo(8,-68,8,-59);
 ctx.lineTo(2,-43);ctx.quadraticCurveTo(-4,-40,-10,-45);
 ctx.lineTo(-5,-62);ctx.quadraticCurveTo(-4,-68,1,-70);ctx.fill();
 line([[1,-69],[-5,-48]],"#ffffff88",1.8);
 // Braço de trás
 const rearElbowX=-12+swing*8,rearElbowY=-58+Math.cos(phase*1.9)*5;
 line([[0,-65],[rearElbowX,rearElbowY],[-17+swing*12,-45]],outline,6);
 line([[0,-65],[rearElbowX,rearElbowY],[-17+swing*12,-45]],skin,3.5);
 ellipse(rearElbowX,rearElbowY,2.8,2.8,skin);
 // Braço da frente
 const frontElbowX=12-swing*8,frontElbowY=-59-Math.cos(phase*1.9)*5;
 line([[3,-66],[frontElbowX,frontElbowY],[19-swing*12,-48]],outline,6);
 line([[3,-66],[frontElbowX,frontElbowY],[19-swing*12,-48]],skin,3.5);
 ellipse(frontElbowX,frontElbowY,2.8,2.8,skin);
 // Pescoço e cabeça em perfil
 line([[1,-72],[3,-77]],skin,5);
 ellipse(5,-87,9,10,skin);
 // Cabelo e rosto, olhando para a direita
 ctx.fillStyle=female?"#392b36":"#263343";
 ctx.beginPath();
 ctx.moveTo(-4,-88);ctx.quadraticCurveTo(-5,-99,5,-99);
 ctx.quadraticCurveTo(14,-98,14,-89);
 ctx.lineTo(9,-91);ctx.lineTo(4,-94);ctx.lineTo(-1,-91);ctx.closePath();ctx.fill();
 if(female){
   ellipse(-5,-88,3.5,7,"#392b36",-0.35);
   line([[-4,-89],[-9,-84],[-10,-78]],"#392b36",3);
 }
 ellipse(10,-86,1.1,1.1,"#263343");
 line([[12,-82],[15,-82]],"#b86f63",1);
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
