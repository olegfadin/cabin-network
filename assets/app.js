/* ============================================================
   The Cabin Network — interactive layer
   ============================================================ */
const el = id => document.getElementById(id);
const cssv = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const hex2rgb = h => { h = h.replace('#',''); if(h.length===3) h = h.split('').map(c=>c+c).join('');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; };
const rgba = (h,a) => { const c = hex2rgb(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
const fmt = n => n.toLocaleString();

/* ---------- navigation: scroll spy + progress ---------- */
(function(){
  const links = [...document.querySelectorAll('#navlinks a')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const prog = el('prog');
  let ticking = false;
  function update(){
    ticking = false;
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if(prog) prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    const line = h.scrollTop + 140;
    let idx = 0;
    targets.forEach((t,i)=>{ if(t.offsetTop <= line) idx = i; });
    links.forEach((a,i)=> a.classList.toggle('on', i === idx));
  }
  addEventListener('scroll', ()=>{ if(!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update);
  update();
})();

/* ---------- vendor chips ---------- */
const LOGOS = {"aeromobile":{"f":"aeromobile.png"},"airalo":{"f":"airalo.png"},"airbus":{"f":"airbus.svg","inv":1},"airbus-hbcplus":{"f":"airbus-hbcplus.svg","inv":1,"q":"HBCplus"},"allot":{"f":"allot.svg"},"amazon-leo":{"f":"amazon-leo.svg"},"applogic-networks":{"f":"applogic-networks.png"},"astronics":{"f":"astronics.png","inv":1},"aws":{"f":"aws.svg"},"axinom":{"f":"axinom.svg","inv":1},"bics":{"f":"bics.png"},"boeing":{"f":"boeing.svg","inv":1},"catchpoint":{"f":"catchpoint.svg","inv":1},"cisco-thousandeyes":{"f":"cisco-thousandeyes.svg"},"collins-aerospace":{"f":"collins-aerospace.png"},"de-cix":{"f":"de-cix.svg"},"e-du":{"f":"e-du.svg","q":"du"},"ekahau":{"f":"ekahau.svg"},"equinix":{"f":"equinix.svg"},"eutelsat-oneweb":{"f":"eutelsat-oneweb.svg","q":"OneWeb"},"flexiroam":{"f":"flexiroam.png"},"giesecke-devrient":{"f":"giesecke-devrient.png"},"gogo":{"f":"gogo.svg"},"google-ggc":{"f":"google-ggc.svg","q":"GGC"},"hpe-aruba-networking":{"f":"hpe-aruba-networking.svg"},"hughes":{"f":"hughes.png"},"idemia":{"f":"idemia.svg","inv":1},"intellian":{"f":"intellian.svg"},"kentik":{"f":"kentik.svg"},"kontron":{"f":"kontron.svg","inv":1},"microsoft-azure":{"f":"microsoft-azure.svg"},"moment":{"f":"moment.svg"},"netally":{"f":"netally.png","inv":1},"netflix-open-connect":{"f":"netflix-open-connect.svg","q":"Open Connect"},"netskrt":{"f":"netskrt.svg","inv":1},"nomad":{"f":"nomad.svg"},"panasonic-avionics":{"f":"panasonic-avionics.svg"},"quvia":{"f":"quvia.png","inv":1},"ses":{"f":"ses.svg"},"siden":{"f":"siden.png","inv":1},"sita":{"f":"sita.svg"},"spacesail-qianfan":{"f":"spacesail-qianfan.png","q":"Qianfan"},"spacex-starlink":{"f":"spacex-starlink.png","inv":1},"syniverse":{"f":"syniverse.svg"},"telesat":{"f":"telesat.png"},"telna":{"f":"telna.svg","inv":1},"thales":{"f":"thales.svg"},"thinkom":{"f":"thinkom.png"},"ubigi-transatel":{"f":"ubigi-transatel.png","q":"Transatel"},"viasat":{"f":"viasat.svg"}};
(function(){
  document.querySelectorAll('[data-vendors]').forEach(row=>{
    row.innerHTML = row.dataset.vendors.split(';').map(v=>{
      const [name, cat] = v.split('|');
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      const L = LOGOS[slug];
      /* Where a wordmark carries the name, the chip shows the mark alone.
         Only a product qualifier the logo cannot express is set in type. */
      const img = L ? `<img class="lg${L.inv ? ' inv' : ''}" src="logos/${L.f}" alt="${name}" title="${name}" loading="lazy" onerror="this.closest('.vchip').classList.add('nolg');this.remove()">` : '';
      const qual = L && L.q ? `<span class="q">${L.q}</span>` : '';
      return `<span class="vchip${L ? '' : ' nolg'}" data-logo="${slug}" title="${name}">
        ${img}<span class="nm">${name}</span>${qual}${cat ? `<span class="cat">${cat}</span>` : ''}</span>`;
    }).join('');
  });
})();

/* ============================================================
   SECTION 3 — capacity model
   ============================================================ */
const SIL = {
  a380:{f:"img/a380.png", w:1300,h:410, L:72.72, crown:57.8, ant:[75.0,60.0,45.0]},
  a350:{f:"img/a350.png", w:1300,h:321, L:66.80, crown:51.4, ant:[68.0,50.0]},
  b77w:{f:"img/b77w.png", w:1300,h:302, L:73.86, crown:54.6, ant:[68.0,50.0]},
  b772:{f:"img/b772.png", w:1300,h:350, L:63.73, crown:54.9, ant:[68.0,50.0]},
  b779:{f:"img/b779.png", w:1300,h:322, L:76.72, crown:54.7, ant:[68.0,50.0]},
  b778:{f:"img/b778.png", w:1300,h:330, L:69.79, crown:53.0, ant:[68.0,50.0]},
  b78x:{f:"img/b78x.png", w:1300,h:302, L:68.28, crown:53.4, ant:[68.0,50.0]},
  b788:{f:"img/b788.png", w:1300,h:364, L:56.72, crown:53.7, ant:[68.0,50.0]}
};
const LMAX = 76.72;
const FLEET = {
  a380:{now:116, ord:0,   then:116, note:"Production ended · no successor"},
  b77w:{now:119, ord:0,   then:119, note:"777-9 deliveries replace part of this fleet"},
  b772:{now:10,  ord:0,   then:10,  note:"Oldest passenger type in the fleet"},
  a350:{now:19,  ord:54,  then:73,  note:"Deliveries continue through the decade"},
  b779:{now:0,   ord:235, then:235, note:"Largest single order in the book"},
  b778:{now:0,   ord:35,  then:35,  note:"Shorter 777X variant"},
  b78x:{now:0,   ord:15,  then:15,  note:"787-10 · first Emirates 787 type"},
  b788:{now:0,   ord:20,  then:20,  note:"787-8 · smallest widebody ordered"}
};
const AC = [
  {t:"A380-800", c:"4-class retrofit",      s:484, a:3, cr:26, b:"14F / 76J / 56W / 338Y", k:"a380", st:"svc", rep:1},
  {t:"A380-800", c:"high-density retrofit", s:569, a:3, cr:26, b:"76J / 56W / 437Y",       k:"a380", st:"svc"},
  {t:"A380-800", c:"legacy 2-class",        s:615, a:3, cr:28, b:"58J / 557Y",             k:"a380", st:"svc"},
  {t:"777-300ER",c:"4-class retrofit",      s:328, a:2, cr:18, b:"8F / 40J / 24W / 256Y",  k:"b77w", st:"svc", rep:1},
  {t:"777-300ER",c:"3-class",               s:354, a:2, cr:18, b:"8F / 42J / 304Y",        k:"b77w", st:"svc"},
  {t:"777-300ER",c:"2-class high-density",  s:428, a:2, cr:20, b:"42J / 386Y",             k:"b77w", st:"svc"},
  {t:"777-200LR",c:"3-class",               s:302, a:2, cr:16, b:"8F / 38J / 256Y",        k:"b772", st:"svc", rep:1},
  {t:"A350-900", c:"3-class",               s:312, a:2, cr:15, b:"32J / 21W / 259Y",       k:"a350", st:"svc", rep:1},
  {t:"777-9",    c:"estimated 4-class",     s:380, a:2, cr:20, b:"configuration unpublished", k:"b779", st:"ord", rep:1},
  {t:"777-8",    c:"estimated 3-class",     s:350, a:2, cr:19, b:"configuration unpublished", k:"b778", st:"ord", rep:1},
  {t:"787-10",   c:"estimated 3-class",     s:330, a:2, cr:16, b:"configuration unpublished", k:"b78x", st:"ord", rep:1},
  {t:"787-8",    c:"estimated 3-class",     s:260, a:2, cr:14, b:"configuration unpublished", k:"b788", st:"ord", rep:1}
];
const CLASSES = [
  {k:"msg",  n:"Messaging &amp; social feed", dn:0.50, up:0.12, d:"Chat, feeds, thumbnails, the occasional short clip"},
  {k:"web",  n:"Web &amp; app browsing",      dn:2.80, up:0.35, d:"Page and app loads in bursts, idle in between"},
  {k:"str",  n:"Video streaming",             dn:5.20, up:0.08, d:"Adaptive bitrate, mixed SD and HD on a phone or tablet"},
  {k:"call", n:"Video calling",               dn:2.50, up:2.50, d:"Symmetric by definition. Permitted on Emirates"},
  {k:"voip", n:"Voice over IP",               dn:0.10, up:0.10, d:"Audio calls, symmetric and tiny"},
  {k:"work", n:"Work, VPN, cloud documents",  dn:1.40, up:0.55, d:"Mail, collaboration tools, file saves over a tunnel"},
  {k:"bg",   n:"Background sync &amp; backup",dn:0.90, up:8.50, d:"Photo and cloud backup. Nobody asked for it; almost pure uplink"},
  {k:"ab",   n:"Heavy users",                 dn:85.0, up:21.3, d:"OS updates, torrents, bulk downloads. Greedy — no natural rate"}
];
const CTLS = [
  {g:"g1", id:"lf",   lab:"Load factor",             min:50, max:100, step:1, def:90,  unit:"%", hint:"Busy-sector default. Published network seat factor is 78.9%"},
  {g:"g1", id:"tr",   lab:"Take-up rate",            min:10, max:100, step:1, def:85,  unit:"%", hint:"Share of passengers who connect. Free Wi-Fi pushes this high"},
  {g:"g1", id:"dev",  lab:"Devices per connected pax",min:100,max:300, step:5, def:180, unit:"×", hint:"Phone plus tablet, laptop or watch", div:100},
  {g:"g1", id:"conc", lab:"Peak concurrency",        min:10, max:90,  step:1, def:42,  unit:"%", hint:"Share of associated devices transferring at once"},
  {g:"g1", id:"crew", lab:"Crew devices active",     min:0,  max:150, step:5, def:35,  unit:"%", hint:"Of crew complement. Crew are working; this is rest-period and between-service use"},
  {g:"g2", id:"str",  lab:"Video streaming",         min:0,  max:70,  step:1, def:20,  unit:"%", hint:"Of active sessions"},
  {g:"g2", id:"call", lab:"Video calling",           min:0,  max:30,  step:1, def:6,   unit:"%", hint:"Symmetric — the uplink's second problem"},
  {g:"g2", id:"bg",   lab:"Background sync",         min:0,  max:25,  step:1, def:7,   unit:"%", hint:"Photo and cloud backup. Uplink-heavy"},
  {g:"g2", id:"ab",   lab:"Heavy users — share",     min:0,  max:20,  step:1, def:5,   unit:"%", hint:"The rest splits across messaging, browsing, VoIP and work", hv:1},
  {g:"g2", id:"abr",  lab:"Heavy users — rate each", min:10, max:200, step:5, def:85,  unit:" Mb",hint:"Downlink per heavy session; uplink about 15% of it", hv:1},
  {g:"g3", id:"dnp",  lab:"Downlink per terminal",   min:200,max:1000,step:1, def:667, unit:" Mb",hint:"667 = Emirates' >2 Gbps over three A380 terminals. 1000 = Starlink's quoted maximum"},
  {g:"g3", id:"upp",  lab:"Uplink per terminal",     min:20, max:250, step:5, def:100, unit:" Mb",hint:"Starlink Performance Kit specification. Never confirmed by Emirates"},
  {g:"g3", id:"beam", lab:"Beam availability",       min:10, max:100, step:1, def:100, unit:"%", hint:"Fraction of nominal capacity actually delivered in the cell"}
];
const PRESETS = {
  base:  {lf:90, tr:85, dev:180, conc:42, crew:35, str:20, call:6,  bg:7,  ab:5, abr:85,  dnp:667, upp:100, beam:100, mHeavy:0,mBg:0,mCache:0,mRes:0},
  avg:   {lf:78, tr:75, dev:160, conc:35, crew:35, str:17, call:5,  bg:6,  ab:4, abr:70,  dnp:667, upp:100, beam:100, mHeavy:0,mBg:0,mCache:0,mRes:0},
  stress:{lf:97, tr:92, dev:200, conc:52, crew:55, str:30, call:9,  bg:10, ab:7, abr:100, dnp:667, upp:100, beam:55,  mHeavy:0,mBg:0,mCache:0,mRes:0},
  mitig: {lf:90, tr:85, dev:180, conc:42, crew:35, str:20, call:6,  bg:7,  ab:5, abr:85,  dnp:667, upp:100, beam:100, mHeavy:1,mBg:1,mCache:1,mRes:1}
};

const ANT_SVG = `<svg viewBox="0 0 24 23" aria-hidden="true" fill="none" stroke="currentColor"
  stroke-width="2.6" stroke-linecap="round">
  <path d="M1.9 12.4a13.4 13.4 0 0 1 20.2 0"/><path d="M5.6 16.1a8.4 8.4 0 0 1 12.8 0"/>
  <path d="M9.2 19.6a3.7 3.7 0 0 1 5.6 0"/><circle cx="12" cy="21.6" r="1.4" fill="currentColor" stroke="none"/></svg>`;
document.querySelectorAll('.tmk').forEach(e => e.innerHTML = ANT_SVG);

CTLS.forEach(c=>{
  const host = el(c.g); if(!host) return;
  const d = document.createElement("div"); d.className = "ctl" + (c.hv ? " hv" : "");
  d.innerHTML = `<label for="${c.id}">${c.lab}</label>
    <div class="row"><input type="range" id="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.def}" aria-label="${c.lab}"><span class="val" id="${c.id}v"></span></div>
    <div class="hint">${c.hint}</div>`;
  host.appendChild(d);
});

function vals(){
  const o = {};
  CTLS.forEach(c=>{ const raw = +el(c.id).value; o[c.id] = c.div ? raw/c.div : raw; });
  ["mHeavy","mBg","mCache","mRes"].forEach(k=> o[k] = el(k).checked);
  return o;
}
function mix(v){
  const rest = Math.max(0, 1 - (v.str + v.call + v.bg + v.ab)/100);
  const share = {str:v.str/100, call:v.call/100, bg:v.bg/100, ab:v.ab/100,
                 msg:rest*0.45, web:rest*0.42, voip:rest*0.05, work:rest*0.08};
  return CLASSES.map(c=>{
    let dn = c.dn, up = c.up;
    if(c.k === "str"){ if(v.mRes) dn = 2.60; if(v.mCache) dn *= 0.40; }
    if(c.k === "bg" && v.mBg){ dn = 0.06; up = 0.25; }
    if(c.k === "ab"){ dn = v.abr; up = v.abr*0.15; if(v.mHeavy){ dn = Math.min(dn,6); up = Math.min(up,1.5); } }
    return {...c, sh:share[c.k], edn:dn, eup:up, cdn:share[c.k]*dn, cup:share[c.k]*up};
  });
}
/* Crew are on duty. Their sessions are modelled explicitly as a light
   messaging-and-browsing mix — no streaming, no backup, no heavy transfers. */
const CREW_MIX = {msg:0.58, web:0.28, voip:0.05, work:0.09};
function crewRates(m){
  let dn=0, up=0;
  m.forEach(c=>{ const w = CREW_MIX[c.k]; if(w){ dn += w*c.edn; up += w*c.eup; } });
  return {dn, up};
}
function totals(m){
  const dn = m.reduce((s,c)=>s+c.cdn,0), up = m.reduce((s,c)=>s+c.cup,0);
  const ab = m.find(c=>c.k === "ab");
  const cr = crewRates(m);
  return {dn, up, crewDn:cr.dn, crewUp:cr.up,
    abDn: dn>0 ? ab.cdn/dn : 0, abUp: up>0 ? ab.cup/up : 0};
}
function band(p){
  if(p > 100) return ["p-crit","Oversubscribed","var(--crit)"];
  if(p >= 85) return ["p-ser","At limit","var(--ser)"];
  if(p >= 60) return ["p-warn","Tight","var(--warn)"];
  return ["p-ok","Headroom","var(--ok)"];
}
function meter(label,pct,off,av,color){
  return `<div class="m"><div class="mtop"><span class="mlab">${label}</span><span class="mval">${pct.toFixed(0)}%</span></div>
    <div class="track"><div class="fill" style="width:${Math.min(100,pct)}%;background:${color}"></div></div>
    <div class="mnote">${off.toFixed(0)} of ${av.toFixed(0)} Mbps</div></div>`;
}
function draw(k, cls){
  const s = SIL[k];
  const dots = s.ant.map(x=>`<span class="ant" style="left:${x}%;top:${s.crown}%">${ANT_SVG}</span>`).join("");
  return `<div class="draw ${cls}" style="width:${(s.L/LMAX*100).toFixed(2)}%;aspect-ratio:${s.w}/${s.h}">
    <img src="${s.f}" alt="Emirates ${k} side profile" loading="lazy">${dots}</div>`;
}

function renderCapacity(){
  const v = vals(), m = mix(v), T = totals(m);
  CTLS.forEach(c=>{ const raw = +el(c.id).value; el(c.id+"v").textContent = (c.div ? (raw/c.div).toFixed(2) : raw) + c.unit; });

  el("mixrows").innerHTML = m.map(c=>`<tr${c.k==="ab"?' style="color:var(--crit)"':''}>
    <td><b>${c.n}</b></td><td class="n">${(c.sh*100).toFixed(1)}%</td>
    <td class="n">${c.edn.toFixed(2)}</td><td class="n">${c.eup.toFixed(2)}</td>
    <td class="n">${(T.dn>0?c.cdn/T.dn*100:0).toFixed(1)}%</td>
    <td class="n">${(T.up>0?c.cup/T.up*100:0).toFixed(1)}%</td>
    <td style="color:var(--muted);font-size:12.5px">${c.d}</td></tr>`).join("");
  el("mixfoot").innerHTML = `<tr><td>Weighted mean per active session</td><td class="n">100%</td>
    <td class="n" style="color:var(--dn)">${T.dn.toFixed(2)}</td>
    <td class="n" style="color:var(--up)">${T.up.toFixed(2)}</td>
    <td class="n" colspan="3">offered traffic ratio ${(T.dn/Math.max(1e-6,T.up)).toFixed(1)}:1 down to up</td></tr>`;
  el("crewnote").innerHTML = `<b>Figure 2b — the per-session assumption.</b> Crew are modelled deliberately lightly, because they are working: a messaging-and-browsing mix with no streaming, no backup and no heavy transfers, giving <b>${T.crewDn.toFixed(2)} Mbps down and ${T.crewUp.toFixed(2)} Mbps up</b> per active crew session. The default assumes roughly a third of the complement is connected at any moment — rest periods and gaps between services, not cabin crew on their phones. Crew complements are estimates: 26–28 on the A380, 14–20 on the twin-aisles, flight crew included. They are a rounding error against the passenger load, and are included for completeness rather than because they move the answer.`;

  let worstUp = 0, worstName = "", over = 0, unitsNow = 0, unitsThen = 0, hitNow = 0, hitThen = 0;
  const seen = new Set();
  el("rows").innerHTML = AC.map(a=>{
    const f = FLEET[a.k];
    const first = !seen.has(a.k); seen.add(a.k);
    const fnote = first ? (f.ord ? f.ord + " on order · " + f.note : f.note) : "Same " + f.now + " aircraft, different cabin";
    const pax = a.s*(v.lf/100)*(v.tr/100), devs = pax*v.dev, sess = devs*(v.conc/100), crew = a.cr*(v.crew/100);
    const dn = sess*T.dn + crew*T.crewDn, up = sess*T.up + crew*T.crewUp;
    const avD = v.dnp*a.a*(v.beam/100), avU = v.upp*a.a*(v.beam/100);
    const pD = dn/avD*100, pU = up/avU*100;
    if(pU > worstUp){ worstUp = pU; worstName = a.t + " " + a.c; }
    if(pU > 100 || pD > 100) over++;
    if(a.rep){ unitsNow += f.now; unitsThen += f.then; if(pU>100||pD>100){ hitNow += f.now; hitThen += f.then; } }
    const bind = pU >= pD ? "Uplink" : "Downlink";
    const bp = band(Math.max(pD,pU));
    const stp = a.st === "ord" ? '<span class="pill p-dn">On order</span>' : '<span class="pill p-off">In service</span>';
    return `<tr class="${a.st==='ord'?'dim':''}">
      <td class="ac"><div class="acw"><span class="thumb">${draw(a.k,"")}</span>
        <span><span class="nm">${a.t}</span><div class="cf">${a.c} · ${a.b}</div><div class="st">${stp}</div></span></div></td>
      <td class="n">${a.s}</td>
      <td class="n"><span class="fu${first?'':' dim'}"><b>${f.now}</b><span class="ar">→</span><b class="${f.then>f.now?'gr':''}">${f.then}</b></span><div class="fn">${fnote}</div></td>
      <td class="n">${a.a}</td><td class="n">${devs.toFixed(0)}</td>
      <td class="n">${sess.toFixed(0)}<div class="fn">+${crew.toFixed(0)} crew</div></td>
      <td>${meter("Down",pD,dn,avD,"var(--dn)")}</td>
      <td>${meter("Up",pU,up,avU,"var(--up)")}</td>
      <td><span class="pill ${bp[0]}">${bind} · ${bp[1]}</span></td></tr>`;
  }).join("");

  el("capTiles").innerHTML = `
    <div class="hl"><div class="k">Mean per active session</div><div class="v" style="color:var(--dn)">${T.dn.toFixed(1)} <small>/ ${T.up.toFixed(1)} Mbps</small></div><div class="n">down / up, from the mix below</div></div>
    <div class="hl"><div class="k">Offered traffic ratio</div><div class="v">${(T.dn/Math.max(1e-6,T.up)).toFixed(1)}:1</div><div class="n">against a link asymmetric at ${(v.dnp/v.upp).toFixed(1)}:1</div></div>
    <div class="hl"><div class="k">Heavy users' share</div><div class="v" style="color:${T.abDn*100>50?'var(--crit)':'var(--ink)'}">${(T.abDn*100).toFixed(0)}% <small>/ ${(T.abUp*100).toFixed(0)}%</small></div><div class="n">of downlink / uplink, from ${v.ab}% of sessions</div></div>
    <div class="hl"><div class="k">Worst uplink load</div><div class="v" style="color:${band(worstUp)[2]}">${worstUp.toFixed(0)}%</div><div class="n">${worstName}</div></div>
    <div class="hl"><div class="k">Over capacity</div><div class="v" style="color:${over?'var(--crit)':'var(--ok)'}">${over} of ${AC.length}</div><div class="n">configurations, either direction</div></div>
    <div class="hl"><div class="k">Aircraft affected</div><div class="v" style="color:${hitNow?'var(--crit)':'var(--ok)'}">${hitNow} <small>→ ${hitThen}</small></div><div class="n">of ${unitsNow} flying today → ${unitsThen} once orders deliver</div></div>`;

  const st = el("sumTiles");
  if(st) st.innerHTML = `
    <div class="hl"><div class="k">Downlink at a busy sector</div><div class="v" style="color:var(--ser)">~100%</div><div class="n">of available, before mitigation</div></div>
    <div class="hl"><div class="k">Uplink at the same sector</div><div class="v" style="color:var(--crit)">~200%</div><div class="n">the constraint nobody publishes</div></div>
    <div class="hl"><div class="k">Network outside the licence</div><div class="v" style="color:var(--crit)">42%</div><div class="n">of route distance · 65 of 143 destinations</div></div>
    <div class="hl"><div class="k">Traffic from 5% of sessions</div><div class="v" style="color:var(--crit)">~66%</div><div class="n">of all downlink</div></div>
    <div class="hl"><div class="k">Connected fleet</div><div class="v">264 <small>→ 623</small></div><div class="n">aircraft, on the current orderbook</div></div>
    <div class="hl"><div class="k">V3 uplink improvement</div><div class="v" style="color:var(--dn)">22×</div><div class="n">against 10× downlink — their constraint too</div></div>`;
}
CTLS.forEach(c=> el(c.id) && el(c.id).addEventListener("input", renderCapacity));
["mHeavy","mBg","mCache","mRes"].forEach(id=> el(id) && el(id).addEventListener("change", renderCapacity));
document.querySelectorAll("#presets button").forEach(b=>{
  b.addEventListener("click", ()=>{
    const p = PRESETS[b.dataset.p];
    CTLS.forEach(c=> el(c.id).value = p[c.id]);
    ["mHeavy","mBg","mCache","mRes"].forEach(k=> el(k).checked = !!p[k]);
    document.querySelectorAll("#presets button").forEach(x=>x.classList.remove("on"));
    b.classList.add("on"); renderCapacity();
  });
});
renderCapacity();
