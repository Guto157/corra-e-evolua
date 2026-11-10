const canvas=document.getElementById("gameCanvas"),ctx=canvas?.getContext("2d");
let lastFrame=0;
const TAU=Math.PI*2;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();}
function line(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.stroke();}
function gradient(x,y,x2,y2,stops){const g=ctx.createLinearGradient(x,y,x2,y2);for(const [p,c] of stops)g.addColorStop(p,c);return g;}
function drawRunner(x,y,phase,female){
 const cycle=phase*1.35, s=Math.sin(cycle), c=Math.cos(cycle);
 ctx.save();ctx.translate(x,y+Math.abs(s)*2);ctx.scale(1.42,1.42);
 const skin="#d99a73",skinLight="#f0b58d",shirt=female?"#df4c91":"#1680c9",shirtShade=female?"#9f2d64":"#10528b";
 // sombra e linhas de velocidade atrás do corpo
 ellipse(-2,3,30,5,"#10263b55");
 ctx.globalAlpha=.5;
 line([[-47,-63],[-32,-63]],"#f8ffff",2.5);
 line([[-53,-48],[-36,-48]],"#f8ffff",2);
 line([[-43,-31],[-31,-31]],"#f8ffff",1.7);
 ctx.globalAlpha=1;
 // perna distante, joelho e pé em movimento
 const rearKneeX=-7-s*12, rearKneeY=-17-Math.max(0,-s)*12;
 line([[-3,-34],[rearKneeX,rearKneeY],[-13-s*23,-5]],"#26374b",9);
 line([[-3,-34],[rearKneeX,rearKneeY],[-13-s*23,-5]],"#344b62",5.5);
 // tênis distante apontado para a direita
 ctx.save();ctx.translate(-13-s*23,-5);ctx.rotate(-.12+s*.28);
 ellipse(1,2,11,4,"#142b40");rounded(-1,-5,18,7,3,"#f3f6f8");rounded(2,-8,13,5,2,"#2674b8");line([[5,-5],[10,-3],[14,-5]],"#d7f3ff",1.3);ctx.restore();
 // perna próxima
 const kneeX=8+s*13,kneeY=-18+Math.max(0,s)*12;
 line([[2,-35],[kneeX,kneeY],[13+s*24,-5]],"#1d2d43",10);
 line([[2,-35],[kneeX,kneeY],[13+s*24,-5]],"#425b76",6);
 // tênis próximo
 ctx.save();ctx.translate(13+s*24,-5);ctx.rotate(.08-s*.3);
 ellipse(1,2,12,4,"#10283e");rounded(-1,-5,20,8,3,"#ffffff");rounded(3,-9,14,6,2,female?"#d94d8c":"#1c75bd");line([[5,-6],[10,-3],[15,-6]],"#d7f3ff",1.4);ctx.restore();
 // tronco inclinado para frente
 ctx.save();ctx.translate(1,-49);ctx.rotate(-.13);
 ctx.fillStyle=shirtShade;ctx.beginPath();ctx.moveTo(-10,-13);ctx.quadraticCurveTo(-4,-20,8,-16);ctx.lineTo(14,8);ctx.quadraticCurveTo(2,15,-12,8);ctx.closePath();ctx.fill();
 ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-8,-14);ctx.quadraticCurveTo(-2,-19,8,-14);ctx.lineTo(11,6);ctx.quadraticCurveTo(0,12,-10,6);ctx.closePath();ctx.fill();
 line([[2,-13],[4,7]],"#d9f3ff",1.5);
 // braço de trás
 line([[-7,-10],[-18+s*8,-1],[-25+s*10,-12]],shirtShade,8);
 line([[-7,-10],[-18+s*8,-1],[-25+s*10,-12]],skin,5);
 // braço da frente
 line([[8,-10],[17-s*8,-1],[22-s*10,-12]],shirtShade,8);
 line([[8,-10],[17-s*8,-1],[22-s*10,-12]],skinLight,5);
 ellipse(-25+s*10,-12,3.5,4,skin);ellipse(22-s*10,-12,3.5,4,skin);
 ctx.restore();
 // pescoço e cabeça em perfil, olhando para a direita
 rounded(3,-76,8,13,3,skin);
 ellipse(7,-86,11,13,skinLight,-.16);
 // nariz e queixo do perfil
 ctx.beginPath();ctx.moveTo(15,-88);ctx.lineTo(21,-83);ctx.lineTo(15,-81);ctx.fillStyle=skinLight;ctx.fill();
 ellipse(17,-83,2,2,skin);
 // cabelo e nuca
 ctx.fillStyle=female?"#39243a":"#34251e";
 ctx.beginPath();ctx.moveTo(-3,-87);ctx.quadraticCurveTo(-8,-105,8,-104);ctx.quadraticCurveTo(21,-103,19,-91);ctx.quadraticCurveTo(13,-96,8,-95);ctx.quadraticCurveTo(2,-90,0,-82);ctx.lineTo(-5,-78);ctx.closePath();ctx.fill();
 if(female){ctx.beginPath();ctx.moveTo(-2,-92);ctx.quadraticCurveTo(-14,-79,-7,-65);ctx.quadraticCurveTo(0,-72,1,-86);ctx.fill();ctx.fillStyle="#f16ca7";ctx.beginPath();ctx.arc(4,-100,3,0,TAU);ctx.fill();}
 else {ctx.fillStyle="#68452d";ctx.beginPath();ctx.moveTo(0,-101);ctx.quadraticCurveTo(9,-109,16,-100);ctx.lineTo(9,-98);ctx.fill();}
 // olho visível e expressão determinada
 ellipse(13,-88,1.5,2,"#202c3b");
 line([[17,-77],[20,-76]],"#a75d50",1.1);
 // faixa esportiva no pulso
 rounded(18-s*8,-4,5,2,1,"#f7d36a");
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
