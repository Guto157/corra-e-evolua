const canvas=document.getElementById("gameCanvas"),ctx=canvas?.getContext("2d");
let lastFrame=0;
const TAU=Math.PI*2;
function rounded(x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,fill,rotation=0){ctx.fillStyle=fill;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();}
function line(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.stroke();}
function gradient(x,y,x2,y2,stops){const g=ctx.createLinearGradient(x,y,x2,y2);for(const [p,c] of stops)g.addColorStop(p,c);return g;}
function drawRunner(x,y,phase,female){
 const bounce=Math.sin(phase*2)*2.5, swing=Math.sin(phase*2), front=swing*13, back=-swing*13;
 ctx.save();ctx.translate(x,y+bounce);ctx.scale(1.48,1.48);
 ellipse(0,4,31,7,"#10263b42");
 const skin="#e6a77f",skinShade="#c98160",shirt=female?"#d94d91":"#2678d2",shirtDark=female?"#9e326d":"#174e9a",pants=female?"#563c70":"#263b59";
 // legs behind and front
 line([[-5,-29],[-13+back*.55,-14],[-19+back,-4]],"#26344a",9);
 line([[5,-29],[13+front*.55,-14],[20+front,-4]],"#26344a",9);
 ellipse(-19+back,-4,5,5,skin);ellipse(20+front,-4,5,5,skin);
 // shorts
 ctx.fillStyle=pants;ctx.beginPath();ctx.moveTo(-11,-43);ctx.quadraticCurveTo(0,-39,11,-43);ctx.lineTo(10,-25);ctx.lineTo(3,-23);ctx.lineTo(0,-34);ctx.lineTo(-4,-23);ctx.lineTo(-12,-25);ctx.closePath();ctx.fill();
 line([[-7,-26],[-13+back*.55,-13],[-20+back,-4]],skin,6.5);
 line([[6,-26],[14+front*.55,-13],[21+front,-4]],skin,6.5);
 // sneakers with layered sole
 function shoe(sx,sy,flip){ctx.save();ctx.translate(sx,sy);ctx.scale(flip,1);ellipse(0,1,11,4,"#182d47");rounded(-10,-6,19,7,3,"#f6f8ff");rounded(-8,-10,15,6,3,"#2467bb");line([[-4,-8],[1,-5],[5,-8]],"#d9f1ff",1.5);ctx.restore();}
 shoe(-21+back,-4,1);shoe(21+front,-4,1);
 // torso jacket
 ctx.fillStyle=shirtDark;ctx.beginPath();ctx.moveTo(-11,-61);ctx.quadraticCurveTo(-2,-68,10,-61);ctx.lineTo(12,-37);ctx.quadraticCurveTo(0,-30,-12,-37);ctx.closePath();ctx.fill();
 ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-9,-62);ctx.quadraticCurveTo(0,-67,9,-61);ctx.lineTo(10,-39);ctx.quadraticCurveTo(0,-34,-10,-39);ctx.closePath();ctx.fill();
 // shirt details / zipper
 line([[0,-62],[1,-39]],"#d8efff",1.4);ellipse(-6,-53,2,2,"#ffffff88");
 // arms in running pose
 line([[-9,-58],[-17+back*.35,-47],[-11+back*.35,-39]],shirtDark,8);
 line([[-9,-57],[-17+back*.35,-47],[-11+back*.35,-39]],skin,5.2);
 line([[9,-58],[17+front*.35,-49],[13+front*.35,-41]],shirtDark,8);
 line([[9,-57],[17+front*.35,-48],[13+front*.35,-40]],skin,5.2);
 ellipse(-11+back*.35,-39,4,4,skin);ellipse(13+front*.35,-41,4,4,skin);
 // neck and head
 rounded(-3,-69,7,12,3,skin);
 ellipse(1,-77,12,14,skin,-.12);
 ellipse(11,-75,3,4,skin);
 // ear detail
 ellipse(10,-75,1.5,2,skinShade);
 // hair silhouette
 ctx.fillStyle=female?"#39243a":"#39291f";ctx.beginPath();ctx.moveTo(-10,-77);ctx.quadraticCurveTo(-14,-91,0,-93);ctx.quadraticCurveTo(13,-94,14,-81);ctx.quadraticCurveTo(9,-84,5,-87);ctx.quadraticCurveTo(0,-81,-6,-82);ctx.lineTo(-9,-72);ctx.closePath();ctx.fill();
 if(female){ctx.beginPath();ctx.moveTo(-9,-81);ctx.quadraticCurveTo(-17,-72,-12,-57);ctx.quadraticCurveTo(-5,-63,-6,-77);ctx.fill();ctx.fillStyle="#e85b9c";ctx.fillRect(-7,-88,13,2);}
 else {ctx.fillStyle="#65442d";ctx.beginPath();ctx.moveTo(-6,-89);ctx.quadraticCurveTo(1,-96,8,-88);ctx.lineTo(2,-86);ctx.fill();}
 // face, eye and expression
 ellipse(6,-78,1.7,2.3,"#253044");
 line([[7,-71],[10,-70],[12,-71]],"#9d554c",1.1);
 // wrist bands
 rounded(-17+back*.35,-44,6,3,1.5,"#172d45");rounded(10+front*.35,-46,6,3,1.5,"#172d45");
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
