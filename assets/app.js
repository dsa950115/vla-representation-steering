
"use strict";

const D = window.SITE_DATA;
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const NS = 'http://www.w3.org/2000/svg';
const DIR = {"sim-gradient":{n:"simulator gradient (oracle)",c:"--oracle"},"Dphi^T lambda_psi":{n:"probe via head (ours)",c:"--ours"},
             "gamma_psi":{n:"probe w/o head",c:"--wo"},"static":{n:"standard probe",c:"--std"}};
function el(tag,a,p){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function txt(p,x,y,s,a){const t=el('text',Object.assign({x,y},a||{}),p);t.textContent=s;return t;}
function clear(s){while(s.firstChild)s.removeChild(s.firstChild);}
const sc=(d0,d1,r0,r1)=>v=>r0+(v-d0)*(r1-r0)/((d1-d0)||1);
function ticks(a,b,n){const st0=(b-a)/n,p=Math.pow(10,Math.floor(Math.log10(st0))),st=[1,2,2.5,5,10].map(m=>m*p).find(x=>x>=st0);
 const o=[];for(let v=Math.ceil(a/st)*st;v<=b+1e-9;v+=st)o.push(+v.toFixed(6));return o;}
const fmt=(v,d=1)=>(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(d);
function qtl(a,p){const s=[...a].sort((x,y)=>x-y),i=(s.length-1)*p,l=Math.floor(i),h=Math.ceil(i);return s[l]+(s[h]-s[l])*(i-l);}
function path(xs,ys,x,y){return xs.map((v,i)=>(i?'L':'M')+x(v).toFixed(1)+' '+y(ys[i]).toFixed(1)).join('');}
function line(svg,xs,ys,x,y,col,w,o){return el('path',Object.assign({d:path(xs,ys,x,y),fill:'none',stroke:col,'stroke-width':w,
 'stroke-linejoin':'round','stroke-linecap':'round'},o||{}),svg);}
function hgrid(svg,y,dom,x0,x1,n,lab,fmtf){for(const t of ticks(dom[0],dom[1],n)){el('line',{x1:x0,x2:x1,y1:y(t),y2:y(t),stroke:css('--grid')},svg);
 txt(svg,x0-8,y(t)+4,fmtf?fmtf(t):String(t),{'text-anchor':'end'});}}
function cw(id){const w=document.getElementById(id).getBoundingClientRect().width;return Math.max(300,Math.round(w||640));}
const CH_W=7.1;  // conservative width of one character at 12-13 px (bold included)
function wrap(s,max){if(s.length*CH_W<=max)return [s];const w=s.split(' ');let best=[s],bd=1e9;
 for(let i=1;i<w.length;i++){const a=w.slice(0,i).join(' '),b=w.slice(i).join(' ');const d=Math.max(a.length,b.length);if(d<bd){bd=d;best=[a,b];}}
 if(Math.max(...best.map(l=>l.length))*CH_W<=max)return best;
 const L=[];let cur='';w.forEach(x=>{const t=cur?cur+' '+x:x;if(t.length*CH_W>max&&cur){L.push(cur);cur=x;}else cur=t;});if(cur)L.push(cur);return L;}
function wtext(p,x,y,s,max,a){const L=wrap(s,max);L.forEach((l,i)=>txt(p,x,y+(i-(L.length-1)/2)*15,l,a));return L.length;}
function sym(p,x,y,parts,a){const t=el('text',Object.assign({x,y},a||{}),p);let sh=0;
 parts.forEach(([s,k])=>{const ts=el('tspan',{},t);const want=k===1?4:k===2?-6:0;ts.setAttribute('dy',String(want-sh));sh=want;
  if(k)ts.setAttribute('font-size','75%');ts.textContent=s;});return t;}
const tip=document.getElementById('tip');
function showTip(ev,title,rows){clear(tip);const t=document.createElement('div');t.className='t';t.textContent=title;tip.appendChild(t);
 rows.forEach(r=>{const d=document.createElement('div');d.className='r';const l=document.createElement('span');const i=document.createElement('i');
  i.style.background=r.c;if(r.wide){i.style.height='6px';i.style.borderRadius='3px';}l.appendChild(i);l.appendChild(document.createTextNode(r.n));
  const b=document.createElement('b');b.textContent=r.v;d.appendChild(l);d.appendChild(b);tip.appendChild(d);});
 tip.style.display='block';const w=tip.offsetWidth,h=tip.offsetHeight;let X=ev.clientX+14,Y=ev.clientY+14;
 if(X+w>innerWidth-8)X=ev.clientX-w-14;if(Y+h>innerHeight-8)Y=ev.clientY-h-14;tip.style.left=X+'px';tip.style.top=Y+'px';}
function hideTip(){tip.style.display='none';}
function legend(id,items){const L=document.getElementById(id);clear(L);items.forEach(it=>{const s=document.createElement('span');const i=document.createElement('i');
 i.className=it.k;if(it.c)i.style.background=it.c;if(it.b)i.style.borderColor=it.b;if(it.dash){i.style.borderTopColor=it.dash;}
 s.appendChild(i);s.appendChild(document.createTextNode(it.n));L.appendChild(s);});}
function seg(id,cb){const S=document.getElementById(id);[...S.children].forEach(b=>b.onclick=()=>{[...S.children].forEach(c=>c.classList.toggle('on',c===b));cb(b);});}
if(D.preview)document.getElementById('pvbanner').classList.remove('hidden');

/* ---------- tiles ---------- */
const Q=D.qoi_order, ST=D.steer;
function tiles(){const T=document.getElementById('tiles');if(!T)return;clear(T);
 const mono=Math.round(Q.reduce((s,q)=>s+ST[q]["Dphi^T lambda_psi"][0]/100*D.n_states,0)), tot=Q.length*D.n_states;
 const cs=Q.map(q=>ST[q]["Dphi^T lambda_psi"][3]);const wrong=Q.filter(q=>ST[q]["static"][1]< -1).length;
 [[`${mono} / ${tot}`,'held-out states where our direction raises the quantity monotonically'],
  [`${Math.min(...cs).toFixed(2)}–${Math.max(...cs).toFixed(2)}`,"cosine with the simulator's own gradient"],
  [`${wrong} of ${Q.length}`,'quantities the standard probe pushes the wrong way'],
  ['0','simulator queries needed to find the direction']].forEach(([v,l])=>{const c=document.createElement('div');c.className='card tile';
  const a=document.createElement('div');a.className='v';a.textContent=v;const b=document.createElement('div');b.className='l';b.textContent=l;
  c.appendChild(a);c.appendChild(b);T.appendChild(c);});}
tiles();

/* ---------- 1 · chain diagram ---------- */
function box(svg,x,y,w,h,label,sub,o){const g=el('g',{},svg);el('rect',Object.assign({x,y,width:w,height:h,rx:10,fill:css('--surface'),stroke:css('--axis')},o||{}),g);
 txt(g,x+w/2,y+h/2+(sub?-3:5),label,{'text-anchor':'middle',class:'lab',style:'font-weight:600;fill:'+css('--ink')});
 if(sub)txt(g,x+w/2,y+h/2+15,sub,{'text-anchor':'middle'});return g;}
function arrow(svg,x1,y1,x2,y2,col,lab,w){el('line',{x1,y1,x2:x2-7,y2,stroke:col,'stroke-width':w||1.5},svg);
 el('path',{d:`M${x2-8} ${y2-5} L${x2} ${y2} L${x2-8} ${y2+5} Z`,fill:col},svg);if(lab)txt(svg,(x1+x2)/2,y1-8,lab,{'text-anchor':'middle'});}
function bracket(svg,x1,x2,y,col,lab,sub){el('path',{d:`M${x1} ${y-8} L${x1} ${y} L${x2} ${y} L${x2} ${y-8}`,fill:'none',stroke:col,'stroke-width':2.5,'stroke-linecap':'round'},svg);
 txt(svg,(x1+x2)/2,y+20,lab,{'text-anchor':'middle',class:'lab',style:'font-weight:600'});if(sub)txt(svg,(x1+x2)/2,y+37,sub,{'text-anchor':'middle'});}
function mt(p,x,y,segs,o){o=o||{};const fs=o.size||18;const t=el('text',{x,y,'text-anchor':o.anchor||'middle'},p);
 t.setAttribute('style',`font-family:RebuttalMath,'Cambria Math',Georgia,serif;font-size:${fs}px;fill:${o.fill||css('--ink')}`);let sh=0;
 segs.forEach(sg=>{const str=Array.isArray(sg)?sg[0]:sg,m=Array.isArray(sg)?sg[1]:'r';const ts=el('tspan',{},t);
  const want=/sub/.test(m)?0.3*fs:/sup/.test(m)?-0.42*fs:0;ts.setAttribute('dy',String(want-sh));sh=want;
  if(/sub|sup/.test(m))ts.setAttribute('font-size',String(Math.round(fs*0.66)));if(/i/.test(m))ts.setAttribute('font-style','italic');ts.textContent=str;});return t;}
function ahead(S,x,y,dx,dy,col){const l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,px=-uy,py=ux;
 el('path',{d:`M${x} ${y} L${x-9*ux+4.5*px} ${y-9*uy+4.5*py} L${x-9*ux-4.5*px} ${y-9*uy-4.5*py} Z`,fill:col},S);}
function cnode(S,x,y,w,h,cap,math,sub,strong){const g=el('g',{},S);
 el('rect',{x,y,width:w,height:h,rx:8,fill:css('--surface'),stroke:strong?css('--ink2'):css('--axis'),'stroke-width':1.2},g);
 txt(g,x+14,y+19,cap,{style:`font:10px ui-monospace,monospace;letter-spacing:.12em;fill:${css('--muted')}`});
 mt(g,x+14,y+h/2+2,math,{anchor:'start',size:22});
 if(sub)wtext(g,x+14,y+h-19,sub,w-28,{style:`font-size:11.5px;fill:${css('--ink2')}`});return g;}
function chain(){const S=document.getElementById('chain');if(!S)return;clear(S);const W=1080;
 const ax=css('--axis'),o=css('--ours'),i2=css('--ink2'),mu=css('--muted');
 legend('chleg',[{k:'lk',c:ax,n:'forward pass of the policy'},{k:'dash',dash:i2,n:'probe'},{k:'lk',c:o,n:'steering direction (ours)'}]);
 const N=[['OBSERVATION',[['x','i']],'camera image + instruction'],['REPRESENTATION',[['z','i'],'(',['x','i'],')'],'action-head input'],
  ['ACTION CHUNK',[['u','i'],' = φ(',['z','i'],')'],'8 low-level actions'],['OUTCOME',[['ψ','i']],'e.g. distance to a target']];
 const F=['VLA backbone','action head φ','physics'];
 if(W<760){const bw=W-12,H0=78,gap=46;let y=6;N.forEach((d,i)=>{cnode(S,6,y,bw,H0,d[0],d[1],d[2],i===1);
   if(i<3){const x=40,y1=y+H0,y2=y+H0+gap;el('line',{x1:x,x2:x,y1,y2:y2-8,stroke:ax,'stroke-width':1.5},S);ahead(S,x,y2,0,1,ax);
    txt(S,x+14,(y1+y2)/2+4,F[i],{style:`font-size:12px;fill:${i2}`});}y+=H0+gap;});
  S.setAttribute('viewBox',`0 0 ${W} ${y-gap+8}`);return;}
 const H0=104,Y0=126,yl=48,bw=Math.min(210,(W-12-3*80)/4),gap=(W-12-4*bw)/3,X=i=>6+i*(bw+gap),cx=i=>X(i)+bw/2,ym=Y0+H0/2,pw=78,ph=28;
 const yb=Y0+H0+32,Hs=yb+88;S.setAttribute('viewBox',`0 0 ${W} ${Hs}`);
 N.forEach((d,i)=>cnode(S,X(i),Y0,bw,H0,d[0],d[1],d[2],i===1));
 const mid=i=>(X(i)+bw+X(i+1))/2;
 F.forEach((l,i)=>{el('line',{x1:X(i)+bw+4,x2:X(i+1)-10,y1:ym,y2:ym,stroke:ax,'stroke-width':1.6},S);ahead(S,X(i+1)-3,ym,1,0,ax);
  txt(S,mid(i),ym+22,l,{'text-anchor':'middle',style:`font-size:11.5px;fill:${i2}`});});
 // 01 probe: reads z and u, predicts psi
 const dsh={'stroke':i2,'stroke-width':1.3,'stroke-dasharray':'4 4',fill:'none'};
 el('path',Object.assign({d:`M${cx(1)} ${Y0+H0+3} L${cx(1)} ${yb} L${cx(3)} ${yb}`},dsh),S);
 el('line',Object.assign({x1:cx(2),x2:cx(2),y1:Y0+H0+3,y2:yb},dsh),S);
 el('line',Object.assign({x1:cx(3),x2:cx(3),y1:yb,y2:Y0+H0+12},dsh),S);ahead(S,cx(3),Y0+H0+3,0,-1,i2);
 const pc=(cx(1)+cx(3))/2;
 txt(S,pc,yb+26,'01 · READ   the probe predicts ψ from z and u, without the simulator',{'text-anchor':'middle',style:`font:10.5px ui-monospace,monospace;letter-spacing:.06em;fill:${mu}`});
 mt(S,pc,yb+56,[['Ĵ','i'],['ψ,x','subi'],'(',['u','i'],')  =  ⟨ ',['z','i'],', ',['L','i'],['ψ','subi'],' ',['S','i'],'(',['u','i'],') ⟩'],{size:19});
 // 02 pull back (top lane, right to left)
 const pill=(x,lab,filled)=>{el('rect',{x:x-pw/2,y:yl-ph/2,width:pw,height:ph,rx:ph/2,fill:filled?o:css('--surface'),stroke:o,'stroke-width':1.6},S);
  mt(S,x,yl+6,lab,{size:17,fill:filled?css('--surface'):o});};
 el('path',{d:`M${cx(3)} ${Y0-2} L${cx(3)} ${yl} L${cx(2)+pw/2+10} ${yl}`,fill:'none',stroke:o,'stroke-width':1.8},S);ahead(S,cx(2)+pw/2+2,yl,-1,0,o);
 el('line',{x1:cx(2)-pw/2,x2:cx(1)+pw/2+10,y1:yl,y2:yl,stroke:o,'stroke-width':1.8},S);ahead(S,cx(1)+pw/2+2,yl,-1,0,o);
 pill(cx(2),[['z̃','i'],['ψ','subi'],'(',['x','i'],')'],false);pill(cx(1),[['z','i'],['ψ','subi'],'(',['x','i'],')'],true);
 txt(S,(cx(2)+pw/2+cx(3))/2,yl-13,'02 · chunk change that raises ψ',{'text-anchor':'middle',style:`font:10.5px ui-monospace,monospace;letter-spacing:.06em;fill:${o}`});
 mt(S,(cx(1)+cx(2))/2,yl-9,[['D','i'],['φ','i'],'(',['z','i'],')',['⊤','sup']],{size:16,fill:o});
 // 03 push: added to the head input
 const m1=mid(1);el('path',{d:`M${cx(1)+pw/2-6} ${yl+ph/2} C ${cx(1)+pw/2} ${Y0-16}, ${m1} ${Y0-22}, ${m1} ${ym-14}`,fill:'none',stroke:o,'stroke-width':1.8},S);
 ahead(S,m1,ym-9,0,1,o);el('circle',{cx:m1,cy:ym,r:8,fill:css('--surface'),stroke:o,'stroke-width':1.8},S);
 el('path',{d:`M${m1-4} ${ym} H${m1+4} M${m1} ${ym-4} V${ym+4}`,stroke:o,'stroke-width':1.8},S);
 mt(S,m1+14,Y0-12,['03 · ',['z','i'],' + ',['α','i'],' ',['z','i'],['ψ','subi']],{size:14,anchor:'start',fill:o});}
/* ---------- 4 · overview dot plot ---------- */
let curQ=null;
function overview(){const S=document.getElementById('over');if(!S)return;clear(S);const W=cw('over'),narrow=W<640,m={l:narrow?132:270,r:18,t:8,b:40},rh=narrow?46:38,H=m.t+m.b+Q.length*rh;
 S.setAttribute('viewBox',`0 0 ${W} ${H}`);const all=Q.flatMap(q=>["sim-gradient","Dphi^T lambda_psi","gamma_psi","static"].map(d=>ST[q][d][1]));
 const x=sc(Math.min(-13,...all)-0.5,Math.max(14,...all)+0.5,m.l,W-m.r);
 legend('oleg',[{k:'sk',b:css('--muted'),n:DIR["sim-gradient"].n},{k:'dk',c:css('--ours'),n:DIR["Dphi^T lambda_psi"].n},
  {k:'dk',c:css('--wo'),n:DIR.gamma_psi.n},{k:'dk',c:css('--std'),n:DIR.static.n},{k:'lk',c:css('--muted'),n:'random (median)'}]);
 const tk=narrow?[-10,0,10]:ticks(-12,14,6);tk.forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:m.t,y2:H-m.b,stroke:t===0?css('--axis'):css('--grid'),'stroke-width':t===0?1.5:1},S);
  txt(S,x(t),H-m.b+18,(t>0?'+':'')+t,{'text-anchor':'middle'});});
 txt(S,(m.l+W-m.r)/2,H-4,narrow?'effect (mm)':'effect (mm, positive = in the intended direction)',{'text-anchor':'middle'});
 Q.forEach((q,i)=>{const y=m.t+i*rh+rh/2,g=el('g',{style:'cursor:pointer'},S),s=ST[q];
  el('rect',{x:0,y:y-rh/2+2,width:W,height:rh-4,rx:6,fill:q===curQ?css('--sel'):'transparent'},g);
  wtext(g,m.l-14,y+4,D.qoi_label[q],m.l-18,{'text-anchor':'end',class:'lab',style:q===curQ?'font-weight:600;fill:'+css('--ink'):''});
  el('line',{x1:x(s.random[1]),x2:x(s.random[1]),y1:y-7,y2:y+7,stroke:css('--muted'),'stroke-width':2,'stroke-linecap':'round'},g);
  [["static",'--std',5],["gamma_psi",'--wo',5]].forEach(([d,c,r])=>el('circle',{cx:x(s[d][1]),cy:y,r,fill:css(c),stroke:css('--surface'),'stroke-width':2},g));
  el('rect',{x:x(s["sim-gradient"][1])-7,y:y-7,width:14,height:14,rx:2,fill:'none',stroke:css('--muted'),'stroke-width':2},g);
  el('circle',{cx:x(s["Dphi^T lambda_psi"][1]),cy:y,r:5.5,fill:css('--ours'),stroke:css('--surface'),'stroke-width':2},g);
  g.addEventListener('pointermove',ev=>showTip(ev,D.qoi_label[q],["sim-gradient","Dphi^T lambda_psi","gamma_psi","static"].map(d=>({n:DIR[d].n,v:fmt(s[d][1])+' mm',c:css(DIR[d].c)})).concat([{n:'random',v:fmt(s.random[1])+' mm',c:css('--muted')}])));
  g.addEventListener('pointerleave',hideTip);});}

/* ---------- 6 · use case ---------- */
const UC=D.usecase;
const OCOL=['--o1','--o2','--o3','--o4','--o5'];
function aCol(a){if(!UC)return css('--a3');const s=UC.sweep,i=s.indexOf(a),n=s.length;const k=['--a1','--a2','--a3','--a4','--a5'];
 return css(k[Math.round(i*(k.length-1)/Math.max(1,n-1))]);}
function uinit(){if(!UC){document.getElementById('uavid').classList.add('hidden');document.getElementById('uaph').classList.remove('hidden');document.getElementById('uaph').textContent='Steering-strength videos are not available.';document.getElementById('uvid').classList.add('hidden');document.getElementById('usel').disabled=true;['abar'].forEach(id=>txt(document.getElementById(id),cw(id)/2,140,'use-case data not available (run step 16)',{'text-anchor':'middle'}));
  document.getElementById('uph').classList.remove('hidden');return;}
 const S=document.getElementById('usel');const succ=e=>UC.rows[e].D_steer==='success';
 const eps=[...UC.eps].sort((a,b)=>(succ(b)-succ(a))||(a-b));
 eps.forEach(e=>{const o=document.createElement('option');o.value=e;o.textContent=`start ${e}`+(succ(e)?' · steering succeeds':'');S.appendChild(o);});
 S.onchange=ushow;ushow();utab();winit();}
function ushow(){const e=+document.getElementById('usel').value,V=document.getElementById('uvid'),P=document.getElementById('uph');
 if(UC.videos[e]){V.classList.remove('hidden');P.classList.add('hidden');V.src='videos/'+UC.videos[e];/* Playback starts only when the visitor requests it. */}
 else{V.classList.add('hidden');P.classList.remove('hidden');}
 const descriptions={A_original:"The learned sequence starts with the white mug.",B_lang_put:"Ask for only the yellow-and-white mug using ‘put’.",C_lang_move:"Try the same intent with a different verb: ‘move’.",D_steer:"Keep the original instruction. Steer toward the yellow-and-white mug, then release the policy to finish."};
 const R=document.getElementById('uread');clear(R);UC.cond.forEach(c=>{const d=document.createElement('div');const b=document.createElement('b');b.textContent=UC.label[c];d.appendChild(b);
 const desc=document.createElement('span');desc.className='explain';desc.textContent=descriptions[c];d.appendChild(desc);
 if(c==='B_lang_put'||c==='C_lang_move'){const ins=document.createElement('span');ins.className='instruction';ins.textContent='“'+UC.instr[c]+'”';d.appendChild(ins);}
 const sp=document.createElement('span');sp.className='outcome';sp.textContent='Outcome: '+(UC.rows[e][c]||'not available')+(c==='D_steer'?` (α = ${UC.chosen})`:'');d.appendChild(sp);R.appendChild(d);});
 document.getElementById('unote').textContent='Original instruction: “'+UC.instr.A_original+'”. Each caption describes the video column directly above it.';
 document.getElementById('ucontrols').classList.toggle('hidden',!UC.videos[e]);
 const sk=document.querySelector('[data-seek="uvid"]');if(sk)sk.value=0;
 upath(e);}
function winit(){const W=UC.weak,S=document.getElementById('wsel');clear(S);
 if(!W||!W.sets.length){const AP=document.getElementById('uaph');clear(AP);AP.textContent='Weaker-strength runs not available (no sweep runs found in step 16 or 18).';
  AP.classList.remove('hidden');document.getElementById('uavid').classList.add('hidden');S.disabled=true;return;}
 W.sets.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`example ${i+1}`+(i===0?' · most indecisive':'');S.appendChild(o);});
 S.onchange=wshow;wshow();}
function wshow(){const W=UC.weak,s=W.sets[+document.getElementById('wsel').value]||W.sets[0];
 const AV=document.getElementById('uavid'),AP=document.getElementById('uaph'),AR=document.getElementById('uaread');AV.pause();clear(AP);clear(AR);
 const cols=innerWidth>600?`repeat(${s.cases.length}, minmax(0,1fr))`:'';
 s.cases.forEach(c=>{const title=`α = ${c.alpha} · start ${c.start}`;const ph=document.createElement('div');ph.textContent=title;AP.appendChild(ph);
  const col=document.createElement('div'),h=document.createElement('b');h.textContent=title;col.appendChild(h);
  const d=document.createElement('span');d.className='explain';d.textContent=c.story;col.appendChild(d);
  const o=document.createElement('span');o.className='outcome';o.textContent='Outcome: '+c.outcome;col.appendChild(o);AR.appendChild(col);});
 AR.style.gridTemplateColumns=cols;AP.style.gridTemplateColumns=cols;
 if(s.video){AV.classList.remove('hidden');AP.classList.add('hidden');AV.src='videos/'+s.video;}else{AV.classList.add('hidden');AP.classList.remove('hidden');}
 document.getElementById('uacontrols').classList.toggle('hidden',!s.video);const sk=document.querySelector('[data-seek="uavid"]');if(sk)sk.value=0;
 document.getElementById('uanote').textContent=(D.preview?'Preview, placeholder cases. ':'')+`Picked, not typical: among the ${W.n_fail} failed runs at α = ${W.alphas.join(', ')} (${W.n_eps} starts each${W.first_run?', first run':''}), these switch heading most often or knock a mug over. `+
  `${W.n_switch} of the ${W.n_fail} switch between mugs at least once and ${W.n_tip} knock a mug over. Headings are read from the end-effector path: the mug it closes in on fastest, held for at least 0.6 s.`;}
function utab(){const T=document.getElementById('utab');clear(T);const tb=document.createElement('table');const hr=document.createElement('tr');
 ['condition','instruction','success rate'].forEach(h=>{const th=document.createElement('th');th.textContent=h;hr.appendChild(th);});tb.appendChild(hr);
 const pct=(k,n)=>n?`${Math.round(100*k/n)}%`:'–';
 const row=(cells,cls,tip)=>{const tr=document.createElement('tr');if(cls)tr.className=cls;if(tip)tr.title=tip;cells.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td);});tb.appendChild(tr);};
 UC.cond.filter(c=>c!=='D_steer').forEach(c=>{const n=UC.eps.filter(e=>UC.rows[e][c]).length,k=UC.eps.filter(e=>UC.rows[e][c]==='success').length;
  row([UC.label[c],c==='A_original'?'original':'changed',pct(k,n)],'',`${k} of ${n}`);});
 const ST=UC.strength&&UC.strength.length?UC.strength:[{alpha:UC.chosen,counts:[UC.eps.filter(e=>UC.rows[e].D_steer==='success').length],n:UC.eps.length}];
 ST.forEach(s=>row([s.alpha===UC.chosen?`steering (ours), α = ${s.alpha}`:`steering, α = ${s.alpha}`,'original',pct(s.counts[0],s.n)],
  s.alpha===UC.chosen?'ours':'sub',`${s.counts[0]} of ${s.n}`));
 T.appendChild(tb);
 const fr=ST.filter(s=>s.first_run);if(fr.length){const p=document.createElement('p');p.className='note';p.style.marginTop='10px';
  p.textContent=`α = ${fr.map(s=>s.alpha).join(', ')}: first run, ${fr[0].n} held-out starts; all other rows: ${UC.eps.length} new held-out starts.`;T.appendChild(p);}}

function abar(){if(!UC)return;const S=document.getElementById('abar');clear(S);const W=cw('abar'),H=330,m={l:46,r:10,t:10,b:64};S.setAttribute('viewBox',`0 0 ${W} ${H}`);
 legend('aleg',UC.outcomes.map((o,i)=>({k:'dk',c:css(OCOL[i]),n:o})));
 const A=UC.strength||[];if(!A.length)return;const bw=Math.min(56,(W-m.l-m.r)/A.length*0.6),x=i=>m.l+(i+0.5)*(W-m.l-m.r)/A.length,y=sc(0,100,H-m.b,m.t);
 for(let t=0;t<=100;t+=25){el('line',{x1:m.l,x2:W-m.r,y1:y(t),y2:y(t),stroke:css('--grid')},S);txt(S,m.l-8,y(t)+4,t+'%',{'text-anchor':'end'});}
 A.forEach((s,i)=>{const a=s.alpha,cnt=s.counts.map(c=>100*c/s.n);let acc=0;const g=el('g',{},S);
  cnt.forEach((c,j)=>{if(!c)return;el('rect',{x:x(i)-bw/2,y:y(acc+c),width:bw,height:Math.max(0,y(acc)-y(acc+c)-2),rx:3,fill:css(OCOL[j])},g);acc+=c;});
  txt(S,x(i),H-m.b+18,String(a)+(a===UC.chosen?' *':''),{'text-anchor':'middle',style:a===UC.chosen?'font-weight:600;fill:'+css('--ink'):''});
  el('rect',{x:x(i)-bw/2-6,y:m.t,width:bw+12,height:H-m.t-m.b,fill:'transparent'},g);
  g.addEventListener('pointermove',ev=>showTip(ev,`α = ${a}`+(a===UC.chosen?(UC.confirm?' (fixed in advance)':' (chosen on dev)'):''),
   UC.outcomes.map((o,j)=>({n:o,v:`${Math.round(cnt[j])}%  (${s.counts[j]} of ${s.n})`,c:css(OCOL[j])}))));
  g.addEventListener('pointerleave',hideTip);});
 wtext(S,(m.l+W-m.r)/2,H-12,`steering strength α  (share of held-out starts; * ${UC.confirm?'fixed in advance':'chosen on development starts'})`,W-16,{'text-anchor':'middle',style:'font-size:11px'});}
function upath(e){const S=document.getElementById('upath');if(!S)return;clear(S);if(!UC)return;const ps=UC.paths[e]||{},ob=UC.objs[e]||{};
 const W=cw('upath'),H=Math.round(Math.min(400,W*0.62)),m={l:44,r:14,t:14,b:40};S.setAttribute('viewBox',`0 0 ${W} ${H}`);
 const keys=['none'].concat(UC.sweep.map(a=>String(a))).filter(k=>ps[k]);const T=p=>[-p[1],p[0]];
 legend('pthleg',[{k:'dash',dash:css('--neutral'),n:'original instruction, no steering'}].concat(UC.sweep.filter(a=>ps[String(a)]).map(a=>({k:'lk',c:aCol(a),n:`α = ${a}: ${UC.rows[e]['a'+a]||''}`}))));
 const pts=keys.flatMap(k=>ps[k].map(T)).concat(Object.values(ob).map(T));if(!pts.length)return;
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
 const half=Math.max(Math.max(...xs)-Math.min(...xs),(Math.max(...ys)-Math.min(...ys))*(W-m.l-m.r)/(H-m.t-m.b))/2+4,hy=half*(H-m.t-m.b)/(W-m.l-m.r);
 const x=sc(cx-half,cx+half,m.l,W-m.r),y=sc(cy-hy,cy+hy,H-m.b,m.t);hgrid(S,y,[cy-hy,cy+hy],m.l,W-m.r,5);
 ticks(cx-half,cx+half,6).forEach(t=>txt(S,x(t),H-m.b+18,String(t),{'text-anchor':'middle'}));txt(S,(m.l+W-m.r)/2,H-6,'cm (camera left ↔ right)',{'text-anchor':'middle'});
 const SH={"white mug":"white","yellow-and-white mug":"yellow","right plate":"plate","red mug":"red"};
 Object.entries(ob).forEach(([k,v])=>{const p=T(v);el('circle',{cx:x(p[0]),cy:y(p[1]),r:10,fill:'none',stroke:css('--ink2'),'stroke-width':1.8},S);
  txt(S,x(p[0])+(W<520?0:14),y(p[1])+(W<520?-15:4),W<520?(SH[k]||k):k,{class:'ink','text-anchor':W<520?'middle':'start'});});
 keys.forEach(k=>{const p=ps[k].map(T);const c=k==='none'?css('--neutral'):aCol(+k);line(S,p.map(q=>q[0]),p.map(q=>q[1]),x,y,c,k===String(UC.chosen)?3:2,{'stroke-dasharray':k==='none'?'6 5':''});
  const q=p[p.length-1];el('circle',{cx:x(q[0]),cy:y(q[1]),r:4.5,fill:c,stroke:css('--surface'),'stroke-width':2},S);});}

/* ---------- code link ---------- */
{const L=document.getElementById('codelink'),add=(href,t)=>{const a=document.createElement('a');a.href=href;a.textContent=t;L.appendChild(a);};
 if(location.protocol!=='file:')fetch('code.zip',{method:'HEAD'}).then(r=>{if(r.ok)L.prepend(Object.assign(document.createElement('a'),{href:'code.zip',textContent:'Download code.zip'}));}).catch(()=>{});
 if(D.repo_url)add(D.repo_url,'Anonymous repository');}

/* ---------- draw all + theme ---------- */
function heroNums(){if(!UC)return;const n=UC.eps.length,lang=['B_lang_put','C_lang_move'];
 const kl=lang.reduce((s,c)=>s+UC.eps.filter(e=>UC.rows[e][c]==='success').length,0);
 const ks=UC.eps.filter(e=>UC.rows[e].D_steer==='success').length;
 document.getElementById('hl1').textContent=`${kl} of ${lang.length*n} runs`;
 document.getElementById('hl2').textContent=UC.confirm?`${ks} of ${n} new held-out starts, with the strength fixed in advance`
  :`${ks} of ${n} held-out starts at the strength chosen on development starts`;}
function drawAll(){chain();overview();tiles();
 if(UC){abar();upath(+document.getElementById('usel').value);}}
// Both rows show the original grid video, cropped without altering its pixels.
['uvid','uavid'].forEach(id=>{const video=document.getElementById(id);video.addEventListener('loadedmetadata',()=>{const rows=id==='uvid'&&UC&&UC.grid_rows?(UC.grid_rows[document.getElementById('usel').value]||1):1;
 video.parentElement.style.aspectRatio=`${video.videoWidth} / ${video.videoHeight/rows}`;});video.addEventListener('timeupdate',()=>{const seek=document.querySelector(`[data-seek="${id}"]`);seek.value=video.duration?100*video.currentTime/video.duration:0;});});
document.querySelectorAll('[data-video]').forEach(button=>button.onclick=()=>{const v=document.getElementById(button.dataset.video);if(v.paused)v.play().catch(()=>{});else v.pause();});
document.querySelectorAll('[data-restart]').forEach(button=>button.onclick=()=>{const v=document.getElementById(button.dataset.restart);v.currentTime=0;v.play().catch(()=>{});});
document.querySelectorAll('[data-seek]').forEach(input=>input.oninput=()=>{const v=document.getElementById(input.dataset.seek);if(Number.isFinite(v.duration))v.currentTime=v.duration*input.value/100;});
uinit();heroNums();drawAll();
document.getElementById('theme').onclick=()=>{const r=document.documentElement,dark=r.getAttribute('data-theme')==='dark';
 r.setAttribute('data-theme',dark?'light':'dark');drawAll();};

const navLinks=[...document.querySelectorAll('nav.top a[href^="#"]')];
const navObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>{const on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-10% 0px -65% 0px'});
['demo','how','code'].forEach(id=>navObserver.observe(document.getElementById(id)));
document.fonts.ready.then(drawAll);

matchMedia('(prefers-color-scheme: dark)').addEventListener('change',drawAll);
let _rz=null,_lw=innerWidth;addEventListener('resize',()=>{if(Math.abs(innerWidth-_lw)<4)return;_lw=innerWidth;clearTimeout(_rz);_rz=setTimeout(drawAll,150);});
