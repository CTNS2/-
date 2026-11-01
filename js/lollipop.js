(function(){
var EX=[[3,1,61],[4,62,140],[5,141,225],[6,226,329],[7,330,461],[8,462,561],[9,562,681],[10,682,852],[11,853,970],[12,971,1104]];
var DM=[['lp_lumen','Lumen',1,118,'#dde8f4'],[0,'TM1',119,154,'#bcd4ea'],[0,'TM2',155,182,'#c9dcd0'],[0,'',182,193,'#e6e9ef'],[0,'TM3',194,227,'#bcd4ea'],[0,'TM4',227,258,'#c9dcd0'],[0,'TM5',259,291,'#bcd4ea'],[0,'TM6',292,324,'#c9dcd0'],[0,'TM7',325,367,'#bcd4ea']];
var MOT=[[281,285,'YFPQA'],[362,366,'GYDQL']];
var GLY=[36,41,51,66,84,104,107];
var COL={mis:'#2a7fba',non:'#c0392b',fs:'#e08a1e',inf:'#6aa84f',spl:'#8e5aa8'};
var FCOL={Infantile:'#c0392b',Juvenile:'#e08a1e',Ocular:'#2a7fba',Unclassified:'#8d99ae',Inconclusive:'#b9b4d6'};
var CT=[['mis','vt_missense','Missense'],['non','vt_nonsense','Nonsense'],['inf','lp_inframe','In-frame indel']];
var CF=[['Infantile','mut_infantile'],['Juvenile','mut_juvenile'],['Ocular','mut_ocular'],['Unclassified','mut_unclassified_short'],['Inconclusive','lp_inconclusive']];
var FKEY={mut_infantile:'Infantile',mut_juvenile:'Juvenile',mut_ocular:'Ocular',mut_unclassified_short:'Unclassified',mut_unclassified:'Unclassified',mut_inconclusive:'Inconclusive'};
var st={mode:'type',scale:'sqrt',hid:{},dom:false,am:false};
var W=1000,L=108,R=54,PT=46,BASE=250;
function tx(k,d){ try{ var v=TRANSLATIONS[currentLanguage][k]; return v!==undefined?v:d; }catch(e){ return d; } }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function px(u){ return L+(u-1)/366*(W-L-R); }
var STEP=(W-L-R)/366;
function isCompact(){ return window.innerWidth<640; }
function collect(){
  var out=[];
  document.querySelectorAll('#mutationTable tbody tr').forEach(function(r){
    var c=r.cells; if(!c||c.length<7) return;
    var sp=c[3].querySelector('[data-i18n]'); var tk=sp?sp.getAttribute('data-i18n'):({'Missense':'vt_missense','Nonsense':'vt_nonsense','Splice site':'vt_splice','Deletion':'vt_deletion','Insertion':'vt_insertion','Indel':'vt_indel'})[c[3].textContent.trim()]||'';
    var fs_=c[4].querySelector('[data-i18n]'); var form=fs_?(FKEY[fs_.getAttribute('data-i18n')]||c[4].textContent.trim()):c[4].textContent.trim();
    var name=c[0].textContent.trim(), prot=c[1].textContent.trim(), ex=c[2].textContent.trim(), al=parseInt(c[6].textContent,10)||0;
    var s0=c[0].querySelector('[onclick]'); var oc=(r.getAttribute('onclick')||'')+' '+(s0?s0.getAttribute('onclick'):''); var m=/showPage\('([^']+)'\)/.exec(oc); var sid=m?m[1]:null;
    var cat=null;
    if(tk==='vt_missense') cat='mis'; else if(tk==='vt_nonsense') cat='non'; 
    else if(tk==='vt_deletion'||tk==='vt_insertion'||tk==='vt_indel'){ if(/fs/.test(prot)) cat=null; else if(/^p\./.test(prot)) cat='inf'; }
    if(!cat||!sid||al<1) return;
    var pos=null,u=null,mm;
    if(cat==='spl'){
      mm=/^c\.(\d+)([+-]\d+)?/.exec(name); if(!mm) return; var N=+mm[1];
      if(mm[2]) u=(mm[2].charAt(0)==='+')?N/3+0.5:(N-1)/3+0.5; else u=(N-0.5)/3+0.5;
      if(u<1||u>367.5) return;
    } else {
      if((mm=/p\.[A-Za-z*]{1,3}(\d+)/.exec(prot))) pos=+mm[1]; else if((mm=/^c\.(\d+)/.exec(name))) pos=Math.ceil(+mm[1]/3);
      if(!pos||pos<1||pos>367) return;
    }
    out.push({name:name,prot:prot,ex:ex,al:al,pos:pos,u:u,cat:cat,sid:sid,form:form});
  });
  return out;
}
var DATA=null, AMV=null;
function amVals(){
  if(AMV) return AMV; AMV=[]; var A=window.CTNS_AM;
  for(var i=1;i<=367;i++){ AMV.push(A?A.mean(i):null); }
  return AMV;
}
function keyOf(v){ return st.mode==='type'?'t:'+v.cat:'f:'+v.form; }
function colOf(v){ return st.mode==='type'?COL[v.cat]:(FCOL[v.form]||'#8d99ae'); }
function hidden(v){ return !!st.hid[keyOf(v)]; }
function yfn(mx){
  var top=BASE-PT;
  if(st.scale==='lin') return function(a){ return BASE-a/(mx*1.08)*top; };
  if(st.scale==='log') return function(a){ return BASE-(Math.log(a)+0.45)/(Math.log(mx)+0.75)*top; };
  var ax=axMax(mx); return function(a){ return BASE-Math.sqrt(a)/Math.sqrt(ax)*top; };
}
function axMax(mx){ var t=[10,20,50,100,200,300,500]; for(var i=0;i<t.length;i++) if(t[i]>=mx) return t[i]; return mx; }
function ticksFor(mx){
  var t=st.scale==='lin'?[0,50,100,150,200,250]:[1,10,20,50,100,200,300];
  var ax=axMax(mx); return t.filter(function(x){ return x<=ax; });
}
var DCOL={Lumen:'#dde8f4',TM1:'#bcd4ea',TM2:'#c9dcd0','':'#e6e9ef',TM3:'#bcd4ea',TM4:'#c9dcd0',TM5:'#bcd4ea',TM6:'#c9dcd0',TM7:'#bcd4ea'};
var DBAR={Lumen:'#7fa6d1',TM1:'#3f77b0',TM2:'#4f9a72',TM3:'#3f77b0',TM4:'#4f9a72',TM5:'#3f77b0',TM6:'#4f9a72',TM7:'#3f77b0'};
var XCOL={3:'#e6194b',4:'#f58231',5:'#ffe119',6:'#bfef45',7:'#3cb44b',8:'#42d4f4',9:'#4363d8',10:'#911eb4',11:'#f032e6',12:'#a9a9a9'};
var XTXT={5:'#222',6:'#222',8:'#12333d',12:'#222'};
var AMC={b:'#8fb8e0',a:'#c3c8d1',p:'#e58b8b'};
var AMCACHE={};
function amPanel(top,h,cp,dom){
  var key=top+'_'+h+'_'+(dom?1:0); if(AMCACHE[key]) return AMCACHE[key];
  var A=window.CTNS_AM, o=[]; function y(v){ return top+h-v*h; }
  if(!A){ return ''; }
  o.push('<rect x="'+L+'" y="'+top+'" width="'+(W-L-R)+'" height="'+h+'" fill="#fff" stroke="#e1e6ee"/>');
  [0,0.2,0.4,0.6,0.8,1].forEach(function(t){ o.push('<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(t).toFixed(1)+'" y2="'+y(t).toFixed(1)+'" stroke="#f0f2f6"/><text x="'+(L-8)+'" y="'+(y(t)+3.5).toFixed(1)+'" text-anchor="end" font-size="'+(cp?12:10)+'" fill="#556">'+t.toFixed(1)+'</text>'); });
  o.push('<text transform="translate('+(L-56)+' '+(top+h/2)+') rotate(-90)" text-anchor="middle" font-size="'+(cp?11:10)+'" font-weight="700" fill="#334">'+esc(tx('lp_am_axis','AlphaMissense score'))+'</text><text transform="translate('+(L-43)+' '+(top+h/2)+') rotate(-90)" text-anchor="middle" font-size="'+(cp?9.5:8.5)+'" fill="#667">'+esc(tx('lp_am_axis2','each possible missense substitution'))+'</text>');
  var d=[];
  for(var p=1;p<=367;p++){ var x=px(p).toFixed(1); for(var k=0;k<20;k++){ var v=A.sub(p,A.ord.charAt(k)); if(v==null) continue; d.push('<circle cx="'+x+'" cy="'+y(v).toFixed(1)+'" r="0.9" fill="'+AMC[A.cls(v)]+'" fill-opacity="0.55"/>'); } }
  o.push('<g pointer-events="none">'+d.join('')+'</g>');
  [[0.564,'#e57373'],[0.34,'#5b9bd5']].forEach(function(t){ o.push('<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(t[0]).toFixed(1)+'" y2="'+y(t[0]).toFixed(1)+'" stroke="'+t[1]+'" stroke-dasharray="4 3" stroke-width="0.9"/><text x="'+(L+3)+'" y="'+(y(t[0])-3).toFixed(1)+'" font-size="8.5" fill="'+t[1]+'">'+t[0]+'</text>'); });
  [[0,0.34,'#5b9bd5','lp_am_lo','Likely benign'],[0.34,0.564,'#8d99ae','lp_am_amb','Ambiguous'],[0.564,1,'#e57373','lp_am_hi','Likely pathogenic']].forEach(function(r){
    var y1=y(r[1]),y2=y(r[0]),bx=W-R+9, cy=(y1+y2)/2;
    o.push('<path d="M'+(bx-3)+' '+(y1+1).toFixed(1)+' H'+bx+' V'+(y2-1).toFixed(1)+' H'+(bx-3)+'" fill="none" stroke="'+r[2]+'" stroke-width="1.6"/><text transform="translate('+(bx+11)+' '+cy.toFixed(1)+') rotate(90)" text-anchor="middle" font-size="'+(cp?9.5:8.5)+'" font-weight="700" fill="'+r[2]+'">'+esc(tx(r[3],r[4]))+'</text>'); });
  var am=amVals(); var pts=[];
  DM.forEach(function(dm){ if(!dm[1]) return; var s=0,n=0; for(var q=dm[2];q<=dm[3];q++){ if(am[q-1]!=null){ s+=am[q-1]; n++; } } var m=s/n; pts.push({x:(px(dm[2])+px(dm[3]))/2,m:m,a:px(dm[2]),b:px(dm[3]),c:DBAR[dm[1]]}); });
  for(var p2=1;p2<=367;p2++){ var m=am[p2-1]; if(m==null) continue; o.push('<circle class="lp-am" data-pos="'+p2+'" cx="'+px(p2).toFixed(1)+'" cy="'+y(m).toFixed(1)+'" r="'+(cp?2.3:1.9)+'" fill="#333" fill-opacity="0.85"/>'); }
  if(dom) pts.forEach(function(q){ var yy=y(q.m); o.push('<path d="M'+q.x.toFixed(1)+' '+(yy-5.5).toFixed(1)+' l5.5 5.5 l-5.5 5.5 l-5.5 -5.5Z" fill="#fff" stroke="#111" stroke-width="1.3" pointer-events="none"/><text x="'+q.x.toFixed(1)+'" y="'+(yy-10).toFixed(1)+'" text-anchor="middle" font-size="'+(cp?11:9.5)+'" font-weight="700" fill="#111" pointer-events="none">'+q.m.toFixed(2)+'</text>'); });
  return AMCACHE[key]=o.join('');
}
function render(){
  var host=document.getElementById('ctnsLollipop'); if(!host) return;
  if(!DATA) DATA=collect();
  var cp=isCompact(), FS=cp?13:10.5;
  var mx=1; DATA.forEach(function(v){ if(v.al>mx) mx=v.al; });
  var ys=yfn(mx);
  var main=DATA.filter(function(v){ return !hidden(v); });
  var o=[];
  var XY=BASE+16, DY=XY+22, DH=24, NY=DY+DH+8, NH=st.dom?(cp?30:50):0, AT=NY+NH+8, AHt=st.am?(cp?190:235):0, H=st.am?AT+AHt+12:NY+NH+6;
  o.push('<svg id="lpSvg" viewBox="0 0 '+W+' '+H+'" style="width:100%;min-width:'+(cp?560:700)+'px;height:auto;display:block;font-family:inherit;">');
  o.push('<line x1="'+L+'" x2="'+(W-R)+'" y1="'+BASE+'" y2="'+BASE+'" stroke="#9aa5b4"/>');
  ticksFor(mx).forEach(function(t){ var y=t===0?BASE:ys(t); o.push((t?'<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="#e6ebf2"/>':'')+'<text x="'+(L-8)+'" y="'+(y+3.5).toFixed(1)+'" text-anchor="end" font-size="'+FS+'" fill="#556">'+t+'</text>'); });
  if(st.scale!=='lin') o.push('<text x="'+(L-8)+'" y="'+(BASE+3.5)+'" text-anchor="end" font-size="'+FS+'" fill="#556">0</text>');
  o.push('<text transform="translate('+(L-46)+' '+((PT+BASE)/2)+') rotate(-90)" text-anchor="middle" font-size="'+(FS+1)+'" fill="#445">'+esc(tx('lp_axis','Alleles reported'))+'</text>');
  var byPos={}; main.forEach(function(v){ (byPos[v.pos]=byPos[v.pos]||[]).push(v); });
  Object.keys(byPos).forEach(function(k){ var g=byPos[k].sort(function(a,b){ return b.al-a.al; }); g.forEach(function(v,i){ v.dx=(i-(g.length-1)/2)*(cp?5.5:4.5); }); });
  var order=main.slice().sort(function(a,b){ return b.al-a.al; });
  order.forEach(function(v){ var x=px(v.pos)+v.dx; o.push('<line x1="'+x.toFixed(1)+'" x2="'+x.toFixed(1)+'" y1="'+BASE+'" y2="'+ys(v.al).toFixed(1)+'" stroke="#9aa5b4"/>'); });
  order.forEach(function(v){ var x=px(v.pos)+v.dx, y=ys(v.al), r=Math.min(9.5,3+0.6*Math.sqrt(v.al)); v.cx=x; v.cy=y; v.r=r;
    o.push('<circle class="lp-dot" data-sid="'+esc(v.sid)+'" data-i="'+DATA.indexOf(v)+'" data-pos="'+v.pos+'" cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+r.toFixed(1)+'" fill="'+colOf(v)+'" stroke="#fff" stroke-width="0.8" style="cursor:pointer;"/>'); });
  var placed=[], nl=cp?4:10;
  order.slice(0,nl).forEach(function(v){
    var t=/^p\./.test(v.prot)?v.prot.replace(/^p\./,''):v.name; var w=t.length*(cp?7.4:6.3)+8;
    var y=v.cy-v.r-5, x0=Math.max(L,Math.min(W-R-w,v.cx-w/2)); var box=[x0,y-(FS+2.5),x0+w,y+4];
    for(var k=0;k<placed.length;k++){ var p=placed[k]; if(box[0]<p[2]&&box[2]>p[0]&&box[1]<p[3]&&box[3]>p[1]) return; }
    placed.push(box); o.push('<text x="'+(x0+w/2).toFixed(1)+'" y="'+y.toFixed(1)+'" text-anchor="middle" font-size="'+FS+'" fill="#233" pointer-events="none">'+esc(t)+'</text>');
  });
  function rl(y,h,k,d){ o.push('<text x="'+(L-8)+'" y="'+(y+h/2+3.5)+'" text-anchor="end" font-size="'+(cp?11:9.5)+'" font-weight="700" fill="#333">'+esc(tx(k,d))+'</text>'); }
  // exons (coloured)
  rl(XY,22,'lp_row_exons','Exons');
  EX.forEach(function(e){ var a=px(e[1]>1?Math.ceil(e[1]/3):1)-STEP/2, b=px(Math.ceil(e[2]/3))+STEP/2;
    o.push('<rect x="'+a.toFixed(1)+'" y="'+XY+'" width="'+(b-a).toFixed(1)+'" height="22" fill="'+(e[0]%2?'#e9edf3':'#d5dce8')+'" stroke="#fff"/><text x="'+((a+b)/2).toFixed(1)+'" y="'+(XY+15)+'" text-anchor="middle" font-size="'+(cp?11:10)+'" fill="#334">E'+e[0]+'</text>'); });
  // domains (coloured)
  { rl(DY,DH,'lp_row_domains','Domains');
  DM.forEach(function(d){ var a=px(d[2])-STEP/2, b=px(d[3])+STEP/2; var lab=d[1]?(d[0]?tx(d[0],d[1]):d[1]):'';
    o.push('<rect x="'+a.toFixed(1)+'" y="'+DY+'" width="'+(b-a).toFixed(1)+'" height="'+DH+'" fill="'+DCOL[d[1]]+'" stroke="#fff"/>'+(lab?'<text x="'+((a+b)/2).toFixed(1)+'" y="'+(DY+16)+'" text-anchor="middle" font-size="'+(cp?11:10)+'" fill="#2b3a55">'+esc(lab)+'</text>':'')); });
  }
  // annotation lane: motifs + N-glycosylation (only when toggled)
  if(st.dom){
    var ly=NY+(cp?10:14);
    MOT.forEach(function(m){ var a=px(m[0])-STEP/2, b=px(m[1])+STEP/2, cx=(a+b)/2, anchor=cx>W-110?'end':'middle', tx_=anchor==='end'?b:cx;
      o.push('<g><title>'+esc(tx('lp_motifs','Lysosomal sorting motifs'))+': '+m[2]+' ('+m[0]+'-'+m[1]+')</title><rect x="'+a.toFixed(1)+'" y="'+(ly-4)+'" width="'+(b-a).toFixed(1)+'" height="8" rx="4" fill="#c0392b"/><text x="'+tx_.toFixed(1)+'" y="'+(ly+16)+'" text-anchor="'+anchor+'" font-size="'+(cp?11:9.5)+'" font-weight="700" fill="#c0392b">'+m[2]+' '+m[0]+'–'+m[1]+'</text></g>'); });
    if(!cp){ GLY.forEach(function(g,gi){ var x=px(g);
      o.push('<g class="lp-gly" data-pos="'+g+'"><circle cx="'+x.toFixed(1)+'" cy="'+ly+'" r="4.2" fill="#10ac84" stroke="#fff" stroke-width="1"/><text x="'+x.toFixed(1)+'" y="'+(ly+16+(gi%2)*10)+'" text-anchor="middle" font-size="8.5" fill="#0b6e54">N'+g+'</text></g>'); }); }
  }
  if(st.am){ o.push(amPanel(AT,AHt,cp,false));
  o.push('<g id="lpHl" style="display:none" pointer-events="none"><rect id="lpHlR" y="'+AT+'" height="'+AHt+'" fill="rgba(20,48,90,0.16)" stroke="#14305a" stroke-width="0.8"/><circle id="lpHlC" r="5" fill="none" stroke="#c0392b" stroke-width="2"/></g>');
  window.__lpAM={top:AT,h:AHt}; } else window.__lpAM=null;
  o.push('</svg>');
  host.innerHTML=o.join('');
}
function seg(id,items,cur){ return '<div class="lp-seg" id="'+id+'">'+items.map(function(it){ return '<button type="button" class="lp-sb'+(it[0]===cur?' on':'')+'" data-v="'+it[0]+'" data-i18n="'+it[1]+'">'+esc(tx(it[1],it[2]))+'</button>'; }).join('')+'</div>'; }
function controls(){
  var el=document.getElementById('ctnsLpControls'); if(!el) return;
  el.innerHTML='<div class="lp-grp"><span class="lp-lab" data-i18n="lp_color_by">'+esc(tx('lp_color_by','Color by'))+'</span>'+seg('lpMode',[['type','lp_by_type','Variant type'],['form','lp_by_form','Clinical form']],st.mode)+'</div>'
   +'<div class="lp-grp"><button type="button" id="lpDomBtn" class="lp-sb lp-solo'+(st.dom?' on':'')+'" data-i18n="lp_show_sites">'+esc(tx('lp_show_sites','Show N-glycosylation sites and sorting motifs'))+'</button><button type="button" id="lpAmBtn" class="lp-sb lp-solo'+(st.am?' on':'')+'" data-i18n="lp_show_am" style="margin-left:8px;">'+esc(tx('lp_show_am','Show AlphaMissense scores'))+'</button></div>';
  el.addEventListener('click',function(e){ var b=e.target.closest('.lp-sb'); if(!b) return; if(b.id==='lpAmBtn'){ st.am=!st.am; b.classList.toggle('on',st.am); foot(); render(); return; } if(b.id==='lpDomBtn'){ st.dom=!st.dom; b.classList.toggle('on',st.dom); foot(); render(); return; } var g=b.parentNode.id, v=b.getAttribute('data-v');
    if(g==='lpMode'){ st.mode=v; st.hid={}; legend(); } else st.scale=v;
    b.parentNode.querySelectorAll('.lp-sb').forEach(function(x){ x.classList.toggle('on',x===b); }); render(); });
}
function legend(){
  var el=document.getElementById('ctnsLpLegend'); if(!el) return;
  var items=st.mode==='type'?CT.map(function(c){ return ['t:'+c[0],c[1],c[2],COL[c[0]]]; }):CF.map(function(c){ return ['f:'+c[0],c[1],c[0],FCOL[c[0]]]; });
  el.innerHTML=items.map(function(it){ return '<button type="button" class="lp-chip'+(st.hid[it[0]]?' off':'')+'" data-k="'+it[0]+'"><span class="lp-sw" style="background:'+it[3]+'"></span><span data-i18n="'+it[1]+'">'+esc(tx(it[1],it[2]))+'</span></button>'; }).join('');
}
function foot(){
  var el=document.getElementById('ctnsLpFoot'); if(!el) return;
  function dot(c){ return '<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:'+c+';"></span>'; }
  function it(h,k,d){ return '<span style="display:inline-flex;align-items:center;gap:6px;">'+h+'<span data-i18n="'+k+'">'+esc(tx(k,d))+'</span></span>'; }
  el.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-size:11.5px;color:var(--muted);margin-top:8px;">'
   +(st.am?it(dot('#333'),'lp_am_mean','Mean score per position'):'')
   +(st.dom?it('<span style="display:inline-block;width:14px;height:8px;border-radius:4px;background:#c0392b;"></span>','lp_motifs','Lysosomal sorting motifs')+it('<span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#10ac84;"></span>','lp_glyc_tip','N-glycosylation site'):'')+'</div>'
   +(st.am?'<div style="font-size:11.5px;color:var(--muted);margin-top:6px;" data-i18n="lp_am_note">'+esc(tx('lp_am_note',''))+'</div>':'');
}
var T3={Ala:'A',Cys:'C',Asp:'D',Glu:'E',Phe:'F',Gly:'G',His:'H',Ile:'I',Lys:'K',Leu:'L',Met:'M',Asn:'N',Pro:'P',Gln:'Q',Arg:'R',Ser:'S',Thr:'T',Val:'V',Trp:'W',Tyr:'Y'};
function subVal(v){ var m=/^p\.([A-Za-z]{3})\d+([A-Za-z]{3})$/.exec(v.prot); return (m&&T3[m[2]]&&window.CTNS_AM)?window.CTNS_AM.sub(v.pos,T3[m[2]]):null; }
function hl(v){ var g=document.getElementById('lpHl'), r=document.getElementById('lpHlR'), c=document.getElementById('lpHlC'), A=window.__lpAM; if(!g||!A) return;
  if(!v||v.cat!=='mis'){ g.style.display='none'; return; }
  var x=px(v.pos), w=Math.max(6,STEP*2.4); r.setAttribute('x',(x-w/2).toFixed(1)); r.setAttribute('width',w.toFixed(1));
  var m=subVal(v); if(m==null){ c.style.display='none'; } else { c.style.display=''; c.setAttribute('cx',x.toFixed(1)); c.setAttribute('cy',(A.top+A.h-m*A.h).toFixed(1)); }
  g.style.display=''; }
function tip(){
  var host=document.getElementById('ctnsLollipop'), tt=document.getElementById('ctnsLpTip'); if(!host||!tt) return;
  function show(h){ tt.innerHTML=h; tt.style.display='block'; }
  host.addEventListener('mouseover',function(e){
    var t=e.target; if(!t.closest){ return; }
    var d=t.closest('.lp-dot'), a=t.closest('.lp-am'), g=t.closest('.lp-gly');
    if(d){ var v=DATA[+d.getAttribute('data-i')]; if(!v) return;
      var h='<b>'+esc(v.name)+'</b><br>'+esc(v.prot)+'<br>'+v.al+' '+esc(tx('lp_alleles','alleles'))+' · '+esc(v.form);
      if(v.cat==='mis'&&st.am){ var sv=subVal(v); if(sv!=null) h+='<br>AlphaMissense: '+sv.toFixed(2); }
      if(v.cat!=='spl'){ var others=DATA.filter(function(w){ return w!==v&&w.cat!=='spl'&&w.pos===v.pos&&!hidden(w); });
        if(others.length) h+='<hr style="border:0;border-top:1px solid rgba(255,255,255,.3);margin:5px 0;"><span style="opacity:.8">'+esc(tx('lp_also','Also at this position'))+':</span><br>'+others.map(function(w){ return esc(w.name)+' · '+w.al; }).join('<br>'); }
      show(h); hl(v); }
    else if(a){ var p=+a.getAttribute('data-pos'), m=amVals()[p-1]; show('<b>'+esc(tx('lp_pos','Position'))+' '+p+'</b><br>'+esc(tx('lp_am_mean','Mean score per position'))+': '+(m==null?'–':m.toFixed(2))); }
    else if(g){ show('<b>Asn'+g.getAttribute('data-pos')+'</b><br>'+esc(tx('lp_glyc_tip','N-glycosylation site'))); }
    else { tt.style.display='none'; hl(null); }
  });
  host.addEventListener('mousemove',function(e){ var b=host.getBoundingClientRect(); tt.style.left=Math.max(4,Math.min(e.clientX-b.left+14,b.width-200))+'px'; tt.style.top=Math.max(0,e.clientY-b.top-62)+'px'; });
  host.addEventListener('mouseout',function(e){ var r=e.relatedTarget; if(!(r&&r.closest&&r.closest('.lp-dot,.lp-am,.lp-gly'))){ tt.style.display='none'; hl(null); } });
  host.addEventListener('click',function(e){ var d=e.target.closest&&e.target.closest('.lp-dot'); if(d){ showPage(d.getAttribute('data-sid')); window.scrollTo(0,0); } });
}
function init(){
  controls(); legend(); foot(); render(); tip();
  var lg=document.getElementById('ctnsLpLegend'); if(lg) lg.addEventListener('click',function(e){ var b=e.target.closest('.lp-chip'); if(!b) return; var k=b.getAttribute('data-k'); st.hid[k]=!st.hid[k]; b.classList.toggle('off',!!st.hid[k]); render(); });
  var was=isCompact(), tm=null; window.addEventListener('resize',function(){ clearTimeout(tm); tm=setTimeout(function(){ if(isCompact()!==was){ was=isCompact(); render(); } },150); });
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
var _sl=window.setLanguage; if(typeof _sl==='function'){ window.setLanguage=function(l){ var r=_sl.apply(this,arguments); try{ legend(); foot(); render(); }catch(e){} return r; }; }
})();
