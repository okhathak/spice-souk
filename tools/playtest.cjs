// Run: python3 -m http.server 8123 --bind 127.0.0.1 (in the repo), then node tools/playtest.cjs [minutes] [width] [height]
// A "new player" robot: fresh save, plays like a reasonable person (one action every ~1.2s) for N game-minutes on a fake clock.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const MIN=+(process.argv[2]||15),W=+(process.argv[3]||390),H=+(process.argv[4]||844);
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:W,height:H}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.clock.install();await p.goto('http://127.0.0.1:8123/');await p.clock.runFor(800);
await p.evaluate(()=>{window.__ev={idle:{},walk:0,rush:0,critic:0,crate:0,fight:0,calm:0,lvl:[],built:[],stamps:0,jaddi:0,tips:[],sheets:{}};
  const _sj=jaddiSay;jaddiSay=(t,f)=>{const r=_sj(t,f);if(r!==false)__ev.jaddi++;return r};
  const _sf=startFight;startFight=()=>{const had=!!fight;_sf();if(!had&&fight)__ev.fight++};
  const _sr=startRush;startRush=()=>{__ev.rush++;_sr()};
  const _ca=crateArrives;crateArrives=()=>{__ev.crate++;_ca()};
  window.__step=()=>{const E=__ev,t0=Date.now();
    const vis=id=>$(id)&&!$(id).hidden;
    if(vis('intro')){$('startBtn').click();return 'start'}
    if(vis('reward')){$('rwBtn').click();return 'reward'}
    if(!$('crateGame').hidden){if(cg&&!cg.done){const k=cg.sh.indexOf(cg.q[cg.i]);cgShelf(Math.random()<.9?k:(k+1)%4)}return 'crate'}
    if(vis('crateIntro')){$('crateGo').click();return 'crateGo'}
    const open=[...document.querySelectorAll('.sheet')].filter(x=>!x.hidden);if(open.length){E.sheets[open[0].id]=(E.sheets[open[0].id]||0)+1;open[0].hidden=true;return 'closeSheet'}
    if(S.guide<3&&$('skipTut')&&!$('skipTut').hidden&&Math.random()<.02){}
    if(fight&&Math.random()<.5){calmFight();E.calm++;return 'calm'}
    const oe=document.querySelectorAll('#orders .order');
    const k=S.orders.findIndex(o=>o&&!o.happy&&!o.gone&&canServe(o));if(k>=0){if(S.orders[k].critic)E.critic++;serve(k,oe[k]);return 'serve'}
    if(builtN()>=8&&S.souk<STALLS.length-1){openStall();E.travel=(E.travel||[]).concat(Math.round((Date.now()-__t0)/1000));$('travelBtn').click();return 'travel'}
    const st=stall(),nx=st.steps[builtN()];if(nx&&S.coins>=nx.c){build();E.built.push(Math.round((Date.now()-__t0)/1000));return 'build'}
    const nc=SACK_UP[S.sackLv].cost;if(nc&&S.coins>=nc+((nx&&nx.c)||0)*0.5){S.coins-=nc;S.sackLv++;E.buyUp=(E.buyUp||0)+1;return 'buyUp'}
    const g=goals();if(g&&g.claimed!==today()&&g.list.every(x=>x.p>=x.goal)){openGoals();$('glClaim').click();return 'goals'}
    if(S.stars>=CHEST){openChest();return 'chest'}
    if(S.crates>0){openCrate();return 'crateOpen'}
    // merge: pairs, preferring ones whose result an order needs
    const need=new Set(S.orders.flatMap(o=>o&&!o.happy?o.n:[]));const byT={};S.cells.forEach((t,i)=>{if(t!=null&&t<MAX)(byT[t]=byT[t]||[]).push(i)});
    const pairs=Object.entries(byT).filter(([t,a])=>a.length>=2).map(([t,a])=>[+t,a]);
    const have=counts();
    const useful=pairs.find(([t])=>need.has(t+1)&&!(have[t+1]>= [...S.orders].filter(o=>o&&!o.happy).flatMap(o=>o.n).filter(x=>x===t+1).length));
    const pick=useful||(S.cells.every(v=>v!=null)?pairs[0]:null)||(Math.random()<.4?pairs.find(([t])=>!need.has(t)||(have[t]>3)):null);
    if(pick){sel=null;tapCell(pick[1][0]);tapCell(pick[1][1]);return 'merge'}
    const empty=S.cells.some(v=>v==null);
    if(S.energy>0&&empty){sack();return 'sack'}
    const why=S.energy<=0?'noEnergy':!empty?'boardFull':'nothing';E.idle[why]=(E.idle[why]||0)+1;return 'idle:'+why};
  window.__t0=Date.now();
  window.__snap=()=>({lvl:S.level,coins:S.coins,served:S.served,energy:S.energy,built:builtN(),souk:S.souk,stamps:S.stamps||0,walk:__ev.walk});
  const _wo=walkouts;walkouts=()=>{const before=S.orders.filter(o=>o&&o.gone).length;_wo();const after=S.orders.filter(o=>o&&o.gone).length;if(after>before)__ev.walk+=after-before};
});
const actions={};const timeline=[];
const steps=Math.round(MIN*60/1.2);
for(let i=0;i<steps;i++){await p.clock.runFor(1200);const a=await p.evaluate(()=>__step());const key=a.split(':')[0]==='idle'?a:a;actions[key]=(actions[key]||0)+1;
  if(i%Math.round(60/1.2)===0)timeline.push((Math.round(i*1.2/60))+'m '+JSON.stringify(await p.evaluate(()=>__snap())))}
const ev=await p.evaluate(()=>__ev);
console.log(timeline.join('\n'));console.log('actions',JSON.stringify(actions));console.log('events',JSON.stringify(ev));console.log('errors',errs.slice(0,5));
await p.screenshot({path:'playtest-end.png'});await b.close()})();
