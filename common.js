const $=id=>document.getElementById(id);

// floating decorations
['🎈','✨','💙','🦋','⭐','🎀'].forEach(e=>{for(let k=0;k<3;k++){const s=document.createElement('div');s.className='fl';s.textContent=e;
 s.style.left=Math.random()*95+'vw';s.style.fontSize=16+Math.random()*22+'px';
 s.style.animationDuration=14+Math.random()*14+'s';s.style.animationDelay=-Math.random()*20+'s';document.body.appendChild(s)}});

function confetti(){
 const c=document.createElement('canvas');
 c.style.cssText='position:fixed;inset:0;z-index:60;pointer-events:none';
 c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);
 const x=c.getContext('2d'),W=c.width,H=c.height;
 const cols=['#2f6bff','#8ec5ff','#ffffff','#1a3fa8','#5aa0ff'];let P=[];
 // 3 blasts: one from the middle (all directions), two cannons from the bottom corners
 function blast(ox,oy,n,a0,spread){for(let i=0;i<n;i++){
  const a=a0+(Math.random()-.5)*spread,s=5+Math.random()*10;
  P.push({x:ox,y:oy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,w:6+Math.random()*7,h:4+Math.random()*8,
   r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[i%cols.length],l:1,round:Math.random()<.3})}}
 blast(W/2,H*.4,110,0,Math.PI*2);
 blast(W*.05,H*.95,60,-Math.PI/2+.5,1.2);
 blast(W*.95,H*.95,60,-Math.PI/2-.5,1.2);
 (function loop(){
  x.clearRect(0,0,W,H);
  P=P.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy=p.vy*.99+.18;p.r+=p.vr;p.l-=.0055;
   x.save();x.globalAlpha=Math.max(p.l,0);x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;
   if(p.round){x.beginPath();x.arc(0,0,p.w/2,0,7);x.fill()}else x.fillRect(-p.w/2,-p.h/2,p.w,p.h);
   x.restore();return p.l>0&&p.y<H+40});
  if(P.length)requestAnimationFrame(loop);else c.remove()})();
}

// saved name (set on the login page)
function getName(){try{return localStorage.getItem('b18name')||''}catch(e){return ''}}

// pop-up viewer (used by gallery and videos)
function openM(h){let m=$('modal');
 if(!m){m=document.createElement('div');m.id='modal';
  m.innerHTML='<div class="in"><div id="mc"></div><button class="btn" onclick="closeM()">Close ✕</button></div>';
  m.onclick=e=>{if(e.target===m)closeM()};document.body.appendChild(m)}
 $('mc').innerHTML=h;m.style.display='flex'}
function closeM(){$('mc').innerHTML='';$('modal').style.display='none'}

// fireworks (auto-launches, and click/tap anywhere to launch one)
function startFireworks(){
 const c=document.createElement('canvas');
 c.style.cssText='position:fixed;inset:0;z-index:1;pointer-events:none';
 document.body.appendChild(c);
 const x=c.getContext('2d');let W,H,P=[],R=[];
 const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight};rs();addEventListener('resize',rs);
 const cols=['#2f6bff','#8ec5ff','#ffffff','#5aa0ff','#c8e1ff'];
 function launch(tx,ty){R.push({x:tx!==undefined?tx:Math.random()*W*.8+W*.1,y:H,
  ty:ty!==undefined?ty:H*(.12+Math.random()*.35),vy:-9-Math.random()*3})}
 function boom(px,py){const col=cols[Math.random()*cols.length|0];
  for(let i=0;i<70;i++){const a=Math.PI*2*i/70,s=1+Math.random()*4;
   P.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:col})}}
 (function loop(){
  x.globalCompositeOperation='destination-out';x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,0,W,H);
  x.globalCompositeOperation='lighter';
  R=R.filter(r=>{r.y+=r.vy;x.fillStyle='#fff';x.fillRect(r.x,r.y,3,8);
   if(r.y<=r.ty){boom(r.x,r.y);return false}return true});
  P=P.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.vx*=.985;p.l-=.012;
   x.globalAlpha=Math.max(p.l,0);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,2,0,7);x.fill();
   return p.l>0});
  x.globalAlpha=1;requestAnimationFrame(loop)})();
 setInterval(launch,1300);launch();
 addEventListener('pointerdown',e=>launch(e.clientX,e.clientY));
}

// tell the shell (index.html) which page is open, so it can pause the music on music.html
try{if(parent!==window)parent.postMessage({b18page:location.pathname.split('/').pop()},'*')}catch(e){}
