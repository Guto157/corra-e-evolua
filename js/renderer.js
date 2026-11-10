const canvas=document.getElementById("gameCanvas"),ctx=canvas?.getContext("2d");
let lastFrame=0;
const TAU=Math.PI*2;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();}
function line(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.stroke();}
function gradient(x,y,x2,y2,stops){const g=ctx.createLinearGradient(x,y,x2,y2);for(const [p,c] of stops)g.addColorStop(p,c);return g;}
function drawRunner(x,y,phase,female){
 const t=phase*1.55, swing=Math.sin(t), lift=Math.cos(t);
 const skin="#d99a73", skinHi="#efb28e", hair=female?"#39243a":"#30251f";
 const shirt=female?"#e84f91":"#1688cf", shirtDark=female?"#a92f68":"#105789";
 const shorts=female?"#6e3158":"#243d58";
 ctx.save();ctx.translate(x,y+Math.abs(lift)*2);ctx.scale(1.48,1.48);
 // sombra no chão e rastro de velocidade
 ellipse(0,5,35,5,"#14283b55");
 ctx.globalAlpha=.42;
 for(let i=0;i<3;i++)line([[-58-i*5,-72+i*13],[-43-i*5,-72+i*13]],"#f7ffff",2-i*.35);
 ctx.globalAlpha=1;
 // perna de trás, com articulação e canela
 const backHip=-2, backKneeX=-5-swing*13, backKneeY=-31+Math.max(0,-swing)*13;
 line([[backHip,-39],[backKneeX,backKneeY],[-19-swing*24,-8]],"#243449",11);
 line([[backHip,-39],[backKneeX,backKneeY],[-19-swing*24,-8]],"#d58f6d",7);
 ctx.save();ctx.translate(-19-swing*24,-8);ctx.rotate(-.18+swing*.32);
 rounded(-4,-5,22,8,4,"#f6f7f8");rounded(1,-9,13,5,2,female?"#d94b88":"#1977b8");
 line([[3,-5],[9,-2],[15,-5]],"#d6efff",1.4);ctx.restore();
 // perna da frente
 const kneeX=10+swing*14,kneeY=-29-Math.max(0,swing)*13;
 line([[2,-40],[kneeX,kneeY],[17+swing*25,-7]],"#26364c",12);
 line([[2,-40],[kneeX,kneeY],[17+swing*25,-7]],"#e0a17d",7.5);
 ctx.save();ctx.translate(17+swing*25,-7);ctx.rotate(.12-swing*.3);
 ellipse(5,2,12,4,"#142b40");rounded(-2,-5,23,8,4,"#fff");rounded(3,-9,15,5,2,female?"#e34d91":"#1688cf");
 line([[4,-5],[11,-2],[17,-5]],"#b8e7ff",1.5);ctx.restore();
 // shorts e quadril
 ctx.fillStyle=shorts;ctx.beginPath();ctx.moveTo(-10,-48);ctx.quadraticCurveTo(0,-53,12,-45);ctx.lineTo(11,-33);ctx.quadraticCurveTo(2,-28,-9,-34);ctx.closePath();ctx.fill();
 // tronco inclinado para frente
 ctx.save();ctx.translate(0,-62);ctx.rotate(-.13);
 ctx.fillStyle=shirtDark;ctx.beginPath();ctx.moveTo(-12,-15);ctx.quadraticCurveTo(-8,-23,4,-22);ctx.quadraticCurveTo(15,-18,16,-3);ctx.lineTo(10,13);ctx.quadraticCurveTo(-2,18,-14,9);ctx.closePath();ctx.fill();
 ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-9,-16);ctx.quadraticCurveTo(-5,-21,4,-19);ctx.quadraticCurveTo(12,-16,12,-3);ctx.lineTo(7,10);ctx.quadraticCurveTo(-2,14,-10,7);ctx.closePath();ctx.fill();
 // costura e faixa lateral da roupa
 line([[7,-12],[9,7]],"#ffffff75",1.5);
 // braço de trás, cotovelo acompanha a passada
 const rearElbowX=-17+swing*10,rearElbowY=-8+lift*5;
 line([[-8,-13],[rearElbowX,rearElbowY],[-24+swing*14,-21-lift*5]],shirtDark,9);
 line([[-8,-13],[rearElbowX,rearElbowY],[-24+swing*14,-21-lift*5]],skin,5.5);
 ellipse(-24+swing*14,-21-lift*5,3.5,4,skin);
 // braço da frente
 const armX=17-swing*10,armY=-7-lift*5;
 line([[9,-13],[armX,armY],[23-swing*14,-20+lift*5]],shirtDark,9);
 line([[9,-13],[armX,armY],[23-swing*14,-20+lift*5]],skinHi,5.5);
 ellipse(23-swing*14,-20+lift*5,3.5,4,skinHi);
 ctx.restore();
 // pescoço, cabeça e rosto de perfil voltado para a direita
 rounded(2,-82,9,15,3,skin);
 ellipse(7,-96,11,13,skinHi,-.12);
 ctx.beginPath();ctx.moveTo(14,-99);ctx.lineTo(22,-94);ctx.lineTo(15,-90);ctx.closePath();ctx.fillStyle=skinHi;ctx.fill();
 ellipse(16,-91,2,1.5,"#bd795e");
 // orelha e cabelo
 ellipse(-1,-96,3.2,4,skin);
 ctx.fillStyle=hair;ctx.beginPath();ctx.moveTo(-4,-97);ctx.quadraticCurveTo(-8,-116,7,-116);ctx.quadraticCurveTo(21,-115,19,-99);ctx.quadraticCurveTo(14,-105,8,-105);ctx.quadraticCurveTo(3,-100,1,-91);ctx.lineTo(-5,-88);ctx.closePath();ctx.fill();
 if(female){ctx.fillStyle=hair;ctx.beginPath();ctx.moveTo(-3,-101);ctx.quadraticCurveTo(-14,-89,-8,-72);ctx.quadraticCurveTo(0,-79,1,-96);ctx.fill();ctx.fillStyle="#ff9cc7";ctx.beginPath();ctx.arc(5,-112,3,0,TAU);ctx.fill();}
 else {ctx.fillStyle="#725039";ctx.beginPath();ctx.moveTo(2,-113);ctx.quadraticCurveTo(10,-121,17,-111);ctx.lineTo(9,-108);ctx.fill();}
 // olho, sobrancelha e expressão focada
 ellipse(13,-99,1.4,1.8,"#202c3b");
 line([[11,-104],[15,-105]],"#51382f",1.3);
 line([[17,-85],[20,-84]],"#a75d50",1);
 // relógio esportivo
 rounded(armX-1,armY-1,5,3,1,"#f4d16c");
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
