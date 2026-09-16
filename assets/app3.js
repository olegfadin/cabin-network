/* ============================================================
   Diagrams
   ============================================================ */

/* ---- Figure 8 — the double-jeopardy window ---- */
(function(){
  const host = el("diagPhase"); if(!host) return;
  const W = 900, H = 380, mL = 64, mR = 24, mT = 24, mB = 72;
  const pw = W-mL-mR, ph = H-mT-mB;
  const yA = a => mT + ph - (a/40000)*ph;
  const xT = t => mL + t*pw;
  const prof = [[0,0],[.06,0],[.10,4000],[.15,12000],[.21,22000],[.28,33000],[.34,38000],
                [.70,38000],[.76,30000],[.82,20000],[.88,10000],[.93,2000],[.96,0],[1,0]];
  const path = prof.map((p,i)=>`${i?'L':'M'}${xT(p[0]).toFixed(1)} ${yA(p[1]).toFixed(1)}`).join(' ');
  const area = path + ` L${xT(1)} ${yA(0)} L${xT(0)} ${yA(0)} Z`;
  const phases = [[.03,'Taxi'],[.22,'Climb'],[.52,'Cruise'],[.84,'Descent'],[.97,'Taxi']];
  host.innerHTML = `
  <div class="dlab">Flight profile against <b>spectrum, uplink and authorisation</b></div>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Altitude profile showing constraints below 10,000 and 17,000 feet">
    <g font-family="Barlow,sans-serif">
      <rect x="${mL}" y="${yA(17000)}" width="${pw}" height="${yA(0)-yA(17000)}" fill="color-mix(in srgb,var(--warn) 11%,transparent)"/>
      <rect x="${mL}" y="${yA(10000)}" width="${pw}" height="${yA(0)-yA(10000)}" fill="color-mix(in srgb,var(--em) 13%,transparent)"/>
      <line x1="${mL}" y1="${yA(17000)}" x2="${W-mR}" y2="${yA(17000)}" stroke="var(--warn)" stroke-width="1.4" stroke-dasharray="6 4"/>
      <line x1="${mL}" y1="${yA(10000)}" x2="${W-mR}" y2="${yA(10000)}" stroke="var(--em)" stroke-width="1.6"/>
      <path d="${area}" fill="color-mix(in srgb,var(--dn) 10%,transparent)"/>
      <path d="${path}" fill="none" stroke="var(--dn)" stroke-width="2.4"/>
      ${[0,10000,17000,20000,30000,40000].map(a=>`
        <text x="${mL-10}" y="${yA(a)+4}" text-anchor="end" font-size="11" font-family="var(--fm)" fill="var(--muted)">${a?(a/1000)+'k':'0'}</text>`).join('')}
      <text x="${mL-10}" y="${mT-8}" text-anchor="end" font-size="10" font-family="var(--fm)" fill="var(--faint)">FEET</text>
      <line x1="${mL}" y1="${yA(0)}" x2="${W-mR}" y2="${yA(0)}" stroke="var(--rule)" stroke-width="1.5"/>
      ${phases.map(p=>`<text x="${xT(p[0])}" y="${yA(0)+20}" text-anchor="middle" font-size="12" fill="var(--muted)">${p[1]}</text>`).join('')}
      <text x="${xT(.50)}" y="${yA(10000)-9}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--em)">Below 10,000 ft — 6 GHz band legally unavailable</text>
      <text x="${xT(.50)}" y="${yA(17000)-9}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--warn)">Below ~17,000 ft — measured satellite uplink degrades</text>
      <g>
        <rect x="${xT(.08)}" y="${H-mB+34}" width="${xT(.32)-xT(.08)}" height="20" rx="3" fill="color-mix(in srgb,var(--crit) 16%,transparent)" stroke="var(--crit)"/>
        <text x="${xT(.20)}" y="${H-mB+48}" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--crit)">Most passengers connect here</text>
        <rect x="${xT(.74)}" y="${H-mB+34}" width="${xT(.96)-xT(.74)}" height="20" rx="3" fill="color-mix(in srgb,var(--crit) 16%,transparent)" stroke="var(--crit)"/>
        <text x="${xT(.85)}" y="${H-mB+48}" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--crit)">Last impression forms here</text>
      </g>
      <text x="${W-mR}" y="${mT-8}" text-anchor="end" font-size="12" fill="var(--muted)">On 65 of 143 destinations, add: no in-motion authorisation</text>
    </g>
  </svg>`;
})();

/* ---- Figure 12 — eSIM flow ---- */
(function(){
  const host = el("diagEsim"); if(!host) return;
  const steps = [
    ["1","Offer","On <tspan font-style=\'italic\'>ice</tspan> or the portal,","two hours before landing","ok"],
    ["2","Choose","Plan matched to the","itinerary and cabin","ok"],
    ["3","Pay","Card or Skywards","balance","ok"],
    ["4","Download","Profile over cabin Wi-Fi —","kilobytes, not megabytes","ok"],
    ["5","Install","Lands on the handset.","Both platforms support it","ok"],
    ["6","Attach","Registers via the cabin","picocell — before landing","warn"]
  ];
  const W = 1240, H = 268, bw = 186, gap = (W - 40 - steps.length*bw)/(steps.length-1), y = 60;
  host.innerHTML = `
  <div class="dlab">Buying a destination eSIM <b>from the seat</b></div>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Six step eSIM purchase and activation flow">
    <defs><marker id="are" markerWidth="8" markerHeight="8" refX="5" refY="2.6" orient="auto">
      <path d="M0,0 L5,2.6 L0,5.2 z" fill="var(--rule)"/></marker></defs>
    <g font-family="Barlow,sans-serif">
      ${steps.map((s,i)=>{
        const x = 20 + i*(bw+gap);
        const col = s[4] === "warn" ? "var(--warn)" : "var(--ok)";
        return `<g>
          <rect x="${x}" y="${y}" width="${bw}" height="88" rx="4" fill="var(--surface)" stroke="${col}" stroke-width="1.4"/>
          <circle cx="${x+18}" cy="${y+19}" r="11" fill="${col}"/>
          <text x="${x+18}" y="${y+23}" text-anchor="middle" font-size="12" font-weight="700" fill="var(--surface)">${s[0]}</text>
          <text x="${x+36}" y="${y+24}" font-size="14" font-weight="600" fill="var(--ink)">${s[1]}</text>
          <text x="${x+12}" y="${y+50}" font-size="11" fill="var(--muted)">${s[2]}</text>
          <text x="${x+12}" y="${y+66}" font-size="11" fill="var(--muted)">${s[3]}</text>
        </g>${i < steps.length-1 ? `<line x1="${x+bw+3}" y1="${y+44}" x2="${x+bw+gap-5}" y2="${y+44}" stroke="var(--rule)" stroke-width="1.6" marker-end="url(#are)"/>` : ''}`;
      }).join('')}
      <text x="20" y="36" font-size="12.5" font-weight="600" fill="var(--ink)">Steps 1 to 5 work today over the cabin network, with no new standards and no new hardware.</text>
      <rect x="20" y="${y+104}" width="${W-40}" height="62" rx="4" fill="color-mix(in srgb,var(--warn) 9%,transparent)" stroke="var(--warn)" stroke-dasharray="5 4"/>
      <text x="36" y="${y+124}" font-size="12.5" font-weight="600" fill="var(--warn)">The precondition on step 6</text>
      <text x="36" y="${y+142}" font-size="12" fill="var(--ink2)">A profile from an unrelated operator will not register on the onboard picocell — it stays dormant and activates on landing.</text>
      <text x="36" y="${y+158}" font-size="12" fill="var(--ink2)">An Emirates MVNO profile, on a picocell configured to admit Emirates identities, registers in the cabin and is proven working before the passenger stands up.</text>
    </g>
  </svg>`;
})();

/* ---- Figure 16 — roadmap ---- */
(function(){
  const host = el("diagRoad"); if(!host) return;
  const W = 960, H = 330;
  const lanes = [
    {t:"First 90 days", s:"Measure and specify", c:"var(--dn)", x:20, w:290, items:[
      "Instrument a sub-fleet · 10–15 aircraft",
      "Specify the router — two WAN ports",
      "Fix the contract · no exclusivity",
      "Preserve provisioning on new deliveries",
      "Open the eSIM partner conversation"]},
    {t:"Months 4–12", s:"Build the layer", c:"var(--warn)", x:335, w:290, items:[
      "Router live on the sub-fleet",
      "Policy, Shaping and DNS in service",
      "Wi-Fi 6E trial with cabin sensors",
      "BLE / Zigbee crew and asset trial",
      "First supplier reconciliation on our data"]},
    {t:"Years 2–3", s:"Scale what worked", c:"var(--em)", x:650, w:290, items:[
      "Fleet rollout of the proven items only",
      "Caching decision, on measured evidence",
      "Second-bearer gate — section 15",
      "MVNO decision on a real revenue line",
      "Plan for a possible terminal refresh"]}
  ];
  host.innerHTML = `
  <div class="dlab">Sequencing — <b>each phase produces the evidence that justifies the next</b></div>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Three phase roadmap">
    <defs><marker id="arr" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 z" fill="var(--rule)"/></marker></defs>
    <g font-family="Barlow,sans-serif">
      ${lanes.map(l=>`
        <rect x="${l.x}" y="26" width="${l.w}" height="252" rx="5" fill="var(--surface)" stroke="var(--rule)"/>
        <rect x="${l.x}" y="26" width="${l.w}" height="4" rx="2" fill="${l.c}"/>
        <text x="${l.x+18}" y="${58}" font-size="10.5" font-family="var(--fm)" letter-spacing="1" fill="${l.c}">${l.t.toUpperCase()}</text>
        <text x="${l.x+18}" y="${82}" font-size="17" font-weight="600" fill="var(--ink)">${l.s}</text>
        ${l.items.map((it,i)=>`
          <circle cx="${l.x+24}" cy="${108+i*30}" r="3" fill="${l.c}"/>
          <text x="${l.x+38}" y="${112+i*30}" font-size="12.5" fill="var(--ink2)">${it}</text>`).join('')}
      `).join('')}
      <line x1="312" y1="152" x2="331" y2="152" stroke="var(--rule)" stroke-width="2" marker-end="url(#arr)"/>
      <line x1="627" y1="152" x2="646" y2="152" stroke="var(--rule)" stroke-width="2" marker-end="url(#arr)"/>
      <text x="${W/2}" y="304" text-anchor="middle" font-size="12.5" fill="var(--muted)">No hardware commitment is made before there is measured evidence to justify it</text>
    </g>
  </svg>`;
})();

/* ---- Figure 8 — the 2.4 GHz squeeze: band occupancy + piconet collisions ---- */
(function(){
  const host = el("diagBtBand"); if(!host) return;
  const W = 600, H = 320, mL = 26, mR = 26, plotW = W - mL - mR;
  const NCH = 79, F0 = 2402;
  const WIFI = [[1,2412],[6,2437],[11,2462]];
  const xf = f => mL + ((f - (F0-0.5)) / NCH) * plotW;
  const cw = plotW / NCH;

  const blocked = new Set();
  WIFI.forEach(([,c])=>{ for(let k=0;k<NCH;k++){ const f=F0+k; if(f>=c-11 && f<=c+11) blocked.add(k); } });
  const clean = NCH - blocked.size;

  const yTop = 118, chH = 46;
  const bars = Array.from({length:NCH}, (_,k)=>{
    const bad = blocked.has(k);
    return `<rect x="${(xf(F0+k)-cw/2).toFixed(2)}" y="${yTop}" width="${(cw*0.82).toFixed(2)}" height="${chH}"
      fill="${bad ? 'color-mix(in srgb,var(--crit) 55%,transparent)' : 'var(--ok)'}"/>`;
  }).join('');

  const wifiBoxes = WIFI.map(([n,c])=>{
    const x0 = xf(c-11), x1 = xf(c+11);
    return `<g>
      <rect x="${x0.toFixed(1)}" y="64" width="${(x1-x0).toFixed(1)}" height="${chH+54}" rx="3"
        fill="color-mix(in srgb,var(--dn) 10%,transparent)" stroke="var(--dn)" stroke-width="1.2"/>
      <text x="${((x0+x1)/2).toFixed(1)}" y="80" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--dn)">Wi-Fi ${n}</text>
      <text x="${((x0+x1)/2).toFixed(1)}" y="95" text-anchor="middle" font-size="10" font-family="var(--fm)" fill="var(--dn)">${c} MHz</text>
    </g>`;
  }).join('');

  host.innerHTML = `
  <div class="dlab">2.4 GHz band — <b>where Bluetooth is allowed to hop</b></div>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="The 79 Bluetooth channels against Wi-Fi channels 1, 6 and 11, showing only 11 channels clear of Wi-Fi">
    <g font-family="Barlow,sans-serif">
      <text x="${mL}" y="30" font-size="12.5" fill="var(--ink2)">Bluetooth hops across <tspan font-weight="600">79 channels of 1 MHz</tspan>, 1,600 times a second.</text>
      <text x="${mL}" y="48" font-size="12.5" fill="var(--ink2)">Three non-overlapping Wi-Fi channels sit on top of <tspan font-weight="600" fill="var(--crit)">68 of them</tspan>.</text>
      ${wifiBoxes}
      ${bars}
      <line x1="${mL}" y1="${yTop+chH+3}" x2="${W-mR}" y2="${yTop+chH+3}" stroke="var(--rule)" stroke-width="1.2"/>
      ${[2402,2420,2440,2460,2480].map(f=>`
        <text x="${xf(f).toFixed(1)}" y="${yTop+chH+19}" text-anchor="middle" font-size="10" font-family="var(--fm)" fill="var(--muted)">${f}</text>`).join('')}
      <text x="${W-mR}" y="${yTop+chH+34}" text-anchor="end" font-size="9.5" font-family="var(--fm)" letter-spacing="1" fill="var(--faint)">MHz</text>

      <g transform="translate(${mL},${yTop+chH+52})">
        <rect x="0" y="0" width="${plotW}" height="60" rx="4"
          fill="color-mix(in srgb,var(--crit) 9%,transparent)" stroke="var(--crit)" stroke-dasharray="5 4"/>
        <text x="16" y="23" font-size="13" font-weight="700" fill="var(--crit)">Only ${clean} of 79 channels are clear of Wi-Fi.</text>
        <text x="16" y="42" font-size="12" fill="var(--ink2)">The Bluetooth specification forbids hopping on fewer than <tspan font-weight="700">20</tspan>. Adaptive</text>
        <text x="16" y="56" font-size="12" fill="var(--ink2)">frequency hopping therefore <tspan font-weight="700">cannot</tspan> stay out of Wi-Fi's way — it is not allowed to.</text>
      </g>
      <g font-size="10.5" transform="translate(${mL},${H-8})">
        <rect x="0" y="-9" width="9" height="9" fill="var(--ok)"/>
        <text x="14" y="-1" fill="var(--muted)">clear of Wi-Fi</text>
        <rect x="96" y="-9" width="9" height="9" fill="color-mix(in srgb,var(--crit) 55%,transparent)"/>
        <text x="110" y="-1" fill="var(--muted)">overlapped by Wi-Fi 1, 6 or 11</text>
      </g>
    </g>
  </svg>`;
})();

(function(){
  const host = el("diagBtColl"); if(!host) return;
  const W = 600, H = 320, mL = 52, mR = 22, mT = 58, mB = 62;
  const pw = W-mL-mR, ph = H-mT-mB, NMAX = 520, D = 0.35;
  const xN = n => mL + (n/NMAX)*pw;
  const yP = p => mT + ph - p*ph;
  const curve = M => {
    let d = '';
    for(let n=1;n<=NMAX;n+=4){
      const p = 1 - Math.pow(1 - D/M, n-1);
      d += `${d?'L':'M'}${xN(n).toFixed(1)} ${yP(p).toFixed(1)}`;
    }
    return d;
  };
  const at = (M,n) => 1 - Math.pow(1 - D/M, n-1);
  host.innerHTML = `
  <div class="dlab">Bluetooth against <b>itself</b> — slot collisions as the cabin fills</div>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Probability that a Bluetooth slot collides with another link, rising with the number of concurrent links">
    <g font-family="Barlow,sans-serif">
      <text x="${mL}" y="24" font-size="12.5" fill="var(--ink2)">AFH lets Bluetooth dodge Wi-Fi. <tspan font-weight="600">It cannot dodge other Bluetooth.</tspan></text>
      <text x="${mL}" y="42" font-size="12.5" fill="var(--ink2)">Chance a given slot is contested by another link in the cabin:</text>
      ${[0,.25,.5,.75,1].map(p=>`
        <line x1="${mL}" y1="${yP(p)}" x2="${W-mR}" y2="${yP(p)}" stroke="var(--ruleSoft)" stroke-width="1"/>
        <text x="${mL-9}" y="${yP(p)+4}" text-anchor="end" font-size="10" font-family="var(--fm)" fill="var(--muted)">${(p*100).toFixed(0)}%</text>`).join('')}
      <path d="${curve(79)}" fill="none" stroke="var(--dn)" stroke-width="2.4"/>
      <path d="${curve(20)}" fill="none" stroke="var(--crit)" stroke-width="2.4"/>
      <line x1="${xN(500)}" y1="${mT-6}" x2="${xN(500)}" y2="${yP(0)}" stroke="var(--em)" stroke-width="1.4" stroke-dasharray="5 4"/>
      <circle cx="${xN(500)}" cy="${yP(at(79,500))}" r="4.2" fill="var(--dn)"/>
      <circle cx="${xN(500)}" cy="${yP(at(20,500))}" r="4.2" fill="var(--crit)"/>
      <text x="${xN(500)-11}" y="${yP(at(20,500))-9}" text-anchor="end" font-size="12" font-weight="700" fill="var(--crit)">${(at(20,500)*100).toFixed(0)}%</text>
      <text x="${xN(500)-11}" y="${yP(at(79,500))-9}" text-anchor="end" font-size="12" font-weight="700" fill="var(--dn)">${(at(79,500)*100).toFixed(0)}%</text>
      <text x="${xN(500)-12}" y="${yP(0.40)}" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--em)">A380 with every</text>
      <text x="${xN(500)-12}" y="${yP(0.40)+15}" text-anchor="end" font-size="11.5" font-weight="600" fill="var(--em)">seat paired</text>
      <line x1="${mL}" y1="${yP(0)}" x2="${W-mR}" y2="${yP(0)}" stroke="var(--rule)" stroke-width="1.4"/>
      ${[0,100,200,300,400,500].map(n=>`
        <text x="${xN(n).toFixed(1)}" y="${yP(0)+18}" text-anchor="middle" font-size="10" font-family="var(--fm)" fill="var(--muted)">${n}</text>`).join('')}
      <text x="${mL+pw/2}" y="${yP(0)+34}" text-anchor="middle" font-size="11.5" fill="var(--muted)">Concurrent Bluetooth audio links in the cabin</text>
      <g font-size="11" transform="translate(${mL+pw*0.30},${mT+ph-58})">
        <line x1="0" y1="-4" x2="18" y2="-4" stroke="var(--dn)" stroke-width="2.4"/>
        <text x="24" y="0" fill="var(--dn)">all 79 channels available</text>
        <line x1="0" y1="14" x2="18" y2="14" stroke="var(--crit)" stroke-width="2.4"/>
        <text x="24" y="18" fill="var(--crit)">squeezed to the 20-channel floor</text>
      </g>
      <text x="${W-mR}" y="${H-8}" text-anchor="end" font-size="9.5" font-family="var(--fm)" fill="var(--faint)">ASSUMES 35% TRANSMIT DUTY CYCLE PER LINK</text>
    </g>
  </svg>`;
})();
