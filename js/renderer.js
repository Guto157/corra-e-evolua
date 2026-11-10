const canvas=document.getElementById("gameCanvas"),ctx=canvas?.getContext("2d");
let lastFrame=0;
const TAU=Math.PI*2;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();}
function line(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.stroke();}
function gradient(x,y,x2,y2,stops){const g=ctx.createLinearGradient(x,y,x2,y2);for(const [p,c] of stops)g.addColorStop(p,c);return g;}
function drawRunner(x,y,phase,female){
 const t=phase*1.65;
 const s=Math.sin(t), c=Math.cos(t);
 const ink="#172b3d", accent=female?"#e94f98":"#168fc2";
 ctx.save();
 ctx.translate(x,y+Math.abs(c)*2);
 ctx.scale(1.48,1.48);
 ellipse(0,4,27,3.5,"#14283b44");
 // Cabeça redonda e corpo em linhas, sem roupa ou volume de boneco
 const headY=-91;
 ellipse(4,headY,8.2,8.2,"#fff");
 ctx.strokeStyle=ink;ctx.lineWidth=2.7;ctx.beginPath();ctx.arc(4,headY,8.2,0,TAU);ctx.stroke();
 // detalhe mínimo de cabelo e rosto de perfil
 line([[-2,-96],[2,-100],[8,-99]],accent,2.2);
 ellipse(8,-92,1,1,ink);
 // Tronco inclinado para frente
 line([[2,-82],[-2,-52]],ink,4);
 // Quadril e ombros
 ellipse([-2,-52][0],[-2,-52][1],2.4,2.4,accent);
 // Pernas alternadas com joelhos bem definidos
 const stride=22;
 const frontHip=-2, hipY=-52;
 const frontKneeX=frontHip+s*stride*.55+5;
 const frontKneeY=-29-Math.max(0,c)*7;
 const frontFootX=frontKneeX+10+s*stride*.55;
 const frontFootY=-4+Math.max(0,-c)*4;
 const backKneeX=frontHip-s*stride*.55-5;
 const backKneeY=-29-Math.max(0,-c)*7;
 const backFootX=backKneeX-10-s*stride*.55;
 const backFootY=-4+Math.max(0,c)*4;
 line([[frontHip,hipY],[frontKneeX,frontKneeY],[frontFootX,frontFootY]],ink,3.1);
 line([[backHip=frontHip,hipY],[backKneeX,backKneeY],[backFootX,backFootY]],ink,3.1);
 ellipse(frontKneeX,frontKneeY,2,2,accent);
 ellipse(backKneeX,backKneeY,2,2,accent);
 line([[frontFootX,frontFootY],[frontFootX+9,frontFootY]],accent,3.2);
 line([[backFootX,backFootY],[backFootX+9,backFootY]],accent,3.2);
 // Braços em oposição às pernas
 const armSwing=-s*13;
 const frontElbowX=2+armSwing, frontElbowY=-70+c*7;
 const frontHandX=frontElbowX+armSwing*.65, frontHandY=frontElbowY+13;
 const backElbowX=2-armSwing, backElbowY=-70-c*7;
 const backHandX=backElbowX-armSwing*.65, backHandY=backElbowY+13;
 line([[1,-78],[frontElbowX,frontElbowY],[frontHandX,frontHandY]],ink,3);
 line([[1,-78],[backElbowX,backElbowY],[backHandX,backHandY]],ink,3);
 ellipse(frontElbowX,frontElbowY,1.8,1.8,accent);
 ellipse(backElbowX,backElbowY,1.8,1.8,accent);
 // Pequenas marcas de velocidade
 ctx.globalAlpha=.45;
 line([[-43,-60],[-31,-60]],accent,1.8);
 line([[-38,-48],[-28,-48]],accent,1.5);
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
