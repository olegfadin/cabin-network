/* ============================================================
   SECTION 4 — authorisation globes and route overlay
   ============================================================ */
const PTS = [
  {n:"Bahrain",lon:50.55,lat:26.07,s:0},{n:"Maldives",lon:73.51,lat:4.17,s:1},
  {n:"Hong Kong",lon:114.17,lat:22.32,s:0},{n:"Singapore",lon:103.82,lat:1.35,s:0},
  {n:"Malta",lon:14.5,lat:35.9,s:1},{n:"Mauritius",lon:57.55,lat:-20.28,s:0},
  {n:"Seychelles",lon:55.45,lat:-4.62,s:0}
];
const D2R = Math.PI/180;
const BYBAD = ROUTES.r.map((r,i)=>{
  const s = r.s, n = s.length; let bad = 0;
  for(let k=1;k<n;k++) if(s[k] === "0") bad++;
  return {i, pc: bad/(n-1)};
}).sort((a,b)=>b.pc-a.pc);
const WORST = new Set(BYBAD.slice(0,20).map(o=>o.i));
const RS = {mode:"all", h:1, ground:true};

function makeGlobe(id, lam0, phi0, rFrac, withRoutes){
  const cv = el(id); if(!cv) return null;
  const ctx = cv.getContext("2d");
  let L = lam0, P = phi0;

  function drawIt(){
    const W = cv.width, H = cv.height, R = W*rFrac, cx = W/2, cy = H/2;
    const sp = Math.sin(P*D2R), cp = Math.cos(P*D2R);
    const pr = (lon,lat,r)=>{ const dl=(lon-L)*D2R, ph=lat*D2R, sf=Math.sin(ph), cf=Math.cos(ph), cd=Math.cos(dl);
      r = r || 1; return {x:r*cf*Math.sin(dl), y:r*(cp*sf-sp*cf*cd), c:r*(sp*sf+cp*cf*cd)}; };
    const vis = p => p.c > 0 || Math.hypot(p.x,p.y) > 1;
    function limbPoint(a,b){ let lo=0, hi=1;
      for(let k=0;k<22;k++){ const t=(lo+hi)/2; const p=pr(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t); if(p.c>0) lo=t; else hi=t; }
      const t=(lo+hi)/2, p=pr(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t), m=Math.hypot(p.x,p.y)||1;
      return {x:p.x/m, y:p.y/m, limb:true}; }
    function clip(ring){ const n=ring.length, out=[]; let prev=pr(ring[n-1][0], ring[n-1][1]);
      for(let i=0;i<n;i++){ const a=ring[(i-1+n)%n], b=ring[i], cur=pr(b[0],b[1]);
        if(cur.c>0){ if(prev.c<=0) out.push(limbPoint(a,b)); out.push({x:cur.x,y:cur.y}); }
        else if(prev.c>0) out.push(limbPoint(b,a));
        prev = cur; }
      return out; }
    function pathRing(pts){ if(pts.length<3) return false; ctx.beginPath();
      for(let i=0;i<pts.length;i++){ const p=pts[i], q=pts[(i+1)%pts.length];
        const X=cx+p.x*R, Y=cy-p.y*R; i===0?ctx.moveTo(X,Y):ctx.lineTo(X,Y);
        if(p.limb && q.limb){ let a0=Math.atan2(-p.y,p.x), a1=Math.atan2(-q.y,q.x), d=a1-a0;
          while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
          const st=Math.max(1,Math.round(Math.abs(d)/0.12));
          for(let k=1;k<=st;k++){ const a=a0+d*k/st; ctx.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R); } } }
      ctx.closePath(); return true; }

    const SEA=cssv("--sea"), LAND=cssv("--land"), OK=cssv("--ok"), EM=cssv("--em"),
          RULE=cssv("--rule"), SURF=cssv("--surface"), ROU=cssv("--route");
    const arcs = withRoutes && RS.mode !== "off";
    ctx.clearRect(0,0,W,H);
    ctx.save();
    ctx.beginPath(); ctx.arc(cx,cy,R,0,7); ctx.closePath(); ctx.fillStyle=SEA; ctx.fill(); ctx.clip();
    ctx.globalAlpha = arcs ? .42 : 1;
    for(const c of WORLD){ ctx.fillStyle = c.s ? OK : (c.e ? EM : LAND);
      for(const ring of c.g){ if(pathRing(clip(ring))) ctx.fill(); } }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(128,132,138," + (arcs ? .26 : .40) + ")"; ctx.lineWidth = 1.1;
    for(const c of WORLD) for(const ring of c.g){ if(pathRing(clip(ring))) ctx.stroke(); }
    ctx.strokeStyle = "rgba(128,132,138,.24)"; ctx.lineWidth = 1;
    for(let lon=-180;lon<180;lon+=30){ ctx.beginPath(); let on=false;
      for(let lat=-90;lat<=90;lat+=2){ const p=pr(lon,lat);
        if(p.c>0){ const X=cx+p.x*R, Y=cy-p.y*R; on?ctx.lineTo(X,Y):ctx.moveTo(X,Y); on=true; } else on=false; }
      ctx.stroke(); }
    for(let lat=-60;lat<=60;lat+=30){ ctx.beginPath(); let on=false;
      for(let lon=-180;lon<=180;lon+=2){ const p=pr(lon,lat);
        if(p.c>0){ const X=cx+p.x*R, Y=cy-p.y*R; on?ctx.lineTo(X,Y):ctx.moveTo(X,Y); on=true; } else on=false; }
      ctx.stroke(); }
    if(!arcs) for(const q of PTS){ const p=pr(q.lon,q.lat); if(p.c<=0) continue;
      ctx.beginPath(); ctx.arc(cx+p.x*R, cy-p.y*R, R*0.016, 0, 7);
      ctx.fillStyle = q.s ? OK : EM; ctx.fill(); ctx.lineWidth = R*0.005; ctx.strokeStyle = SURF; ctx.stroke(); }
    let g = ctx.createRadialGradient(cx-R*.42, cy-R*.46, R*.05, cx, cy, R*1.05);
    g.addColorStop(0,"rgba(255,255,255,.20)"); g.addColorStop(.55,"rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    g = ctx.createRadialGradient(cx, cy, R*.62, cx, cy, R);
    g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,0,0,.30)");
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx,cy,R,0,7); ctx.strokeStyle = RULE; ctx.lineWidth = 2.2; ctx.stroke();

    if(arcs){
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if(RS.ground){
        ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,R,0,7); ctx.closePath(); ctx.clip();
        ctx.strokeStyle = rgba(ROU,.13); ctx.lineWidth = R*0.0028;
        for(let ri=0; ri<ROUTES.r.length; ri++){
          if(RS.mode === "worst" && !WORST.has(ri)) continue;
          const rt = ROUTES.r[ri], p = rt.p, n = p.length;
          let open = false; ctx.beginPath();
          for(let i=0;i<n;i++){ const q = pr(p[i][0], p[i][1], 1);
            if(q.c <= 0){ open = false; continue; }
            const X = cx+q.x*R, Y = cy-q.y*R;
            if(open) ctx.lineTo(X,Y); else { ctx.moveTo(X,Y); open = true; } }
          ctx.stroke(); }
        ctx.restore();
      }
      for(const pass of [0,1]){
        ctx.strokeStyle = pass ? rgba(EM,.90) : rgba(ROU,.34);
        ctx.lineWidth   = pass ? R*0.0055 : R*0.0042;
        for(let ri=0; ri<ROUTES.r.length; ri++){
          if(RS.mode === "worst" && !WORST.has(ri)) continue;
          const rt = ROUTES.r[ri], p = rt.p, s = rt.s, n = p.length;
          const hmax = (0.105 + 0.30*Math.min(1, rt.km/19000)) * RS.h;
          let open = false; ctx.beginPath();
          for(let i=0;i<n;i++){
            const t = i/(n-1), r = 1 + hmax*Math.sin(Math.PI*t);
            const q = pr(p[i][0], p[i][1], r);
            const bad = (i === 0) ? (s[1] === "0") : (s[i] === "0");
            if(!vis(q) || (pass ? !bad : bad)){ open = false; continue; }
            const X = cx+q.x*R, Y = cy-q.y*R;
            if(open) ctx.lineTo(X,Y); else { ctx.moveTo(X,Y); open = true; } }
          ctx.stroke(); } }
      for(let ri=0; ri<ROUTES.r.length; ri++){
        if(RS.mode === "worst" && !WORST.has(ri)) continue;
        const rt = ROUTES.r[ri], q = pr(rt.lon, rt.lat);
        if(q.c <= 0) continue;
        ctx.beginPath(); ctx.arc(cx+q.x*R, cy-q.y*R, R*0.0062, 0, 7);
        ctx.fillStyle = rt.a ? rgba(OK,.95) : rgba(EM,.95); ctx.fill(); }
      const hub = pr(55.364, 25.253);
      if(hub.c > 0){ ctx.beginPath(); ctx.arc(cx+hub.x*R, cy-hub.y*R, R*0.016, 0, 7);
        ctx.fillStyle = cssv("--ink"); ctx.fill(); ctx.lineWidth = R*0.005; ctx.strokeStyle = SURF; ctx.stroke(); }
    }
  }

  let drag = null;
  cv.addEventListener("pointerdown", e=>{ drag = {x:e.clientX, y:e.clientY, L, P}; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", e=>{ if(!drag) return;
    const k = 360/cv.getBoundingClientRect().width;
    L = drag.L - (e.clientX-drag.x)*k*0.85;
    P = Math.max(-82, Math.min(82, drag.P + (e.clientY-drag.y)*k*0.85)); drawIt(); });
  const stop = ()=> drag = null;
  cv.addEventListener("pointerup", stop); cv.addEventListener("pointercancel", stop);
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", drawIt);
  drawIt();
  return {draw:drawIt, set(l,p){ L=l; P=p; drawIt(); }};
}
const GLOBES = [makeGlobe("gA",58,22,0.455,false), makeGlobe("gB",-108,12,0.455,false), makeGlobe("gMain",22,28,0.415,true)];
const redrawGlobes = ()=> GLOBES.forEach(g=> g && g.draw());
document.querySelectorAll("[data-set]").forEach(b=> b.addEventListener("click", ()=>{
  RS.mode = b.dataset.set;
  document.querySelectorAll("[data-set]").forEach(x=>x.classList.toggle("on", x===b));
  GLOBES[2] && GLOBES[2].draw(); }));
document.querySelectorAll("[data-view]").forEach(b=> b.addEventListener("click", ()=>{
  const [l,p] = b.dataset.view.split(",").map(Number);
  document.querySelectorAll("[data-view]").forEach(x=>x.classList.toggle("on", x===b));
  GLOBES[2] && GLOBES[2].set(l,p); }));

const ISO2 = {"AGO":"AO","ARG":"AR","AUS":"AU","AUT":"AT","BEL":"BE","BGD":"BD","BHR":"BH","BRA":"BR","CAN":"CA","CHE":"CH","CHN":"CN","CIV":"CI","COL":"CO","CYP":"CY","CZE":"CZ","DEU":"DE","DNK":"DK","DZA":"DZ","EGY":"EG","ESP":"ES","ETH":"ET","FIN":"FI","FRA":"FR","GBR":"GB","GHA":"GH","GIN":"GN","GRC":"GR","HKG":"HK","HUN":"HU","IDN":"ID","IND":"IN","IRL":"IE","IRQ":"IQ","ITA":"IT","JOR":"JO","JPN":"JP","KEN":"KE","KHM":"KH","KOR":"KR","KWT":"KW","LBN":"LB","LKA":"LK","MAR":"MA","MDG":"MG","MDV":"MV","MEX":"MX","MLT":"MT","MUS":"MU","MYS":"MY","NGA":"NG","NLD":"NL","NOR":"NO","NZL":"NZ","OMN":"OM","PAK":"PK","PHL":"PH","POL":"PL","PRT":"PT","RUS":"RU","SAU":"SA","SEN":"SN","SGP":"SG","SWE":"SE","SYC":"SC","THA":"TH","TUN":"TN","TUR":"TR","TWN":"TW","TZA":"TZ","UGA":"UG","USA":"US","VNM":"VN","ZAF":"ZA","ZMB":"ZM","ZWE":"ZW","ARE":"AE"};
function flagOf(iso3){
  const a = ISO2[iso3]; if(!a) return "";
  return String.fromCodePoint(...[...a].map(c=>0x1F1E6 + c.charCodeAt(0) - 65));
}
/* coverage tiles + worst-route table */
(function(){
  const KM = ROUTES.km, TOT = +KM["0"] + +KM["1"] + +KM["2"];
  const ct = el("covTiles");
  if(ct) ct.innerHTML = `
    <div class="hl"><div class="k">Countries not authorised</div><div class="v" style="color:var(--em)">35 <small>of 76</small></div><div class="n">in the Emirates network</div></div>
    <div class="hl"><div class="k">Destinations not authorised</div><div class="v" style="color:var(--em)">65 <small>of 143</small></div><div class="n">45% of the network</div></div>
    <div class="hl"><div class="k">Route distance unserved</div><div class="v" style="color:var(--em)">${(KM["0"]/TOT*100).toFixed(0)}%</div><div class="n">${fmt(Math.round(KM["0"]/1000))}k of ${fmt(Math.round(TOT/1000))}k great-circle km</div></div>
    <div class="hl"><div class="k">Of overflown land</div><div class="v" style="color:var(--em)">${(KM["0"]/(+KM["0"]+ +KM["1"])*100).toFixed(0)}%</div><div class="n">crosses unauthorised territory</div></div>
    <div class="hl"><div class="k">Over international waters</div><div class="v" style="color:var(--ok)">${(KM["2"]/TOT*100).toFixed(0)}%</div><div class="n">authorised everywhere, no licence needed</div></div>`;
  const wr = el("worst");
  if(wr) wr.innerHTML = BYBAD.slice(0,16).map(o=>{
    const r = ROUTES.r[o.i];
    return `<tr><td><b><span class="fl">${flagOf("ARE")}</span>&nbsp;Dubai &mdash; <span class="fl">${flagOf(r.c)}</span>&nbsp;${r.n}</b></td><td class="n">${r.k}</td><td class="n">${fmt(r.km)} km</td>
      <td style="width:46%"><div class="track"><div class="fill" style="width:${(o.pc*100).toFixed(1)}%;background:var(--em)"></div></div></td>
      <td class="n" style="text-align:right">${(o.pc*100).toFixed(0)}%</td></tr>`;
  }).join("");
})();

/* ============================================================
   SECTION 14 — constellations
   ============================================================ */
const CON = [
  ["Starlink","SpaceX · United States","LEO 340–570 km","9,713","~15,000<br>authorised",
   "The incumbent. Roughly 2,000–2,500 aircraft flying across 46+ carriers, and the only dense laser mesh in orbit.","Incumbent","p-off",0],
  ["Eutelsat OneWeb","Eutelsat · France / UK","LEO 1,200 km, near-polar","648","+669 ordered",
   "800+ aircraft flying as of Aug 2026. Certified apertures from several vendors; genuinely polar; four distribution channels.","Yes — today","p-ok",0],
  ["SES — O3b mPOWER","SES · Luxembourg","MEO ~8,000 km, plus ~120 GEO","13 launched<br>10 operational","Complete",
   "~3,000 aircraft. Multi-orbit aperture type-certified Apr 2026. Uniquely holds contracted partner capacity for China and India.","Yes — mid-latitude","p-ok",0],
  ["Viasat + Inmarsat GX","Viasat · United States","GEO, LEO from 2028","3 ViaSat-3<br>~10 GX","—",
   "ViaSat-3 F3 entered service 31 Aug 2026. The only commercial polar Ka payloads in service. Multi-orbit aperture in airframer qualification.","Yes — GEO today","p-ok",0],
  ["Amazon Leo","Amazon · United States","LEO 590 / 610 / 630 km",'396<br><span style="color:var(--faint)">2 July 2026</span>',"3,232<br>by July 2029",
   "Aviation antenna unveiled Apr 2026 at 1 Gbps down / 400 Mbps up. Two airlines committed, from 2027 and 2028. No certification timeline published.","Probable — 2029","p-warn",0],
  ["Telesat Lightspeed","Telesat · Canada","LEO 1,000–1,325 km","0","225",
   "Pathfinders ~Dec 2026, global service Q1 2028. Reaches airlines only through a partner's aperture, so it inherits that programme's schedule.","Conditional — 2029/30","p-warn",0],
  ["Qianfan · Thousand Sails","SpaceSail · China","LEO ~1,160 km, polar","238","15,000<br>by 2030",
   "Airbus HBCplus managed service provider since Dec 2025; IFE integrator agreement Feb 2026; dual-aperture service from 2027, usable coverage nearer 2028.","Regional complement","p-warn",0],
  ["Guowang / SatNet","China SatNet · China (state)","LEO ~1,145–1,175 km","195","12,992<br>filed",
   "No commercial service, no aviation product, no terminal. ITU requires roughly half the fleet by 2032, which the current rate does not reach.","No","p-crit",0],
  ["IRIS²","European Union · SpaceRISE","LEO + MEO","0","348<br>+66 defence",
   "First launches 2029, sovereign and governmental users first. Commercial migration early next decade.","No — not this decade","p-crit",0],
  ["Rivada · AST · Rassvet · Jio · K-LEO","various","various","~45 total","—",
   "Respectively: no satellites and no funding; direct-to-device only, wrong capacity class and blocked by the fuselage; sanctioned and domestic-first; paper constellations.","No","p-crit",1]
];
const cr = el("conrows");
if(cr) cr.innerHTML = CON.map(r=>`<tr class="${r[8]?'dim':''}">
  <td><b>${r[0]}</b><div style="color:var(--muted);font-size:12px;margin-top:2px">${r[1]}</div></td>
  <td class="n" style="white-space:normal">${r[2]}</td>
  <td class="n" style="white-space:normal;max-width:120px">${r[3]}</td>
  <td class="n" style="white-space:normal;max-width:130px">${r[4]}</td>
  <td style="color:var(--ink2);font-size:13px">${r[5]}</td>
  <td><span class="pill ${r[7]}">${r[6]}</span></td></tr>`).join("");

const BARS = [
  ["Starlink","SpaceX", 9713, 17500, "15,000–20,000"],
  ["China combined","Qianfan + Guowang", 433, 6000, "4,000–8,000 est."],
  ["Amazon Leo","Amazon", 396, 3232, "3,232"],
  ["Eutelsat OneWeb","Eutelsat", 648, 1300, "~1,300"],
  ["Telesat Lightspeed","Telesat", 0, 225, "225"],
  ["IRIS²","European Union", 0, 175, "100–200 est."],
  ["SES MEO","O3b mPOWER → meoSphere", 13, 28, "28"]
];
const bc = el("bars");
if(bc) bc.innerHTML = BARS.map(b=>{
  const wN = Math.max(b[2]/18000*100, b[2]>0?0.35:0), wT = Math.max(b[3]/18000*100, b[3]>0?0.35:0);
  return `<div class="bar"><div class="nm">${b[0]}<span>${b[1]}</span></div>
    <div class="bl">
      <div class="bseg now" style="width:${wN}%"></div>
      <div class="blab now${wN>68?' inside':''}" style="left:${wN}%">${b[2].toLocaleString()}</div>
      <div class="bseg then" style="width:${wT}%"></div>
      <div class="blab then${wT>68?' inside':''}" style="left:${wT}%">${b[4]}</div>
    </div></div>`;
}).join("");
