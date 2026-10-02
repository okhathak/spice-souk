// Lists every fight line a customer can speak, with the voice and the text the recording needs.
// It runs the game's OWN code (cOf, femaleOf, vClean, clipFor, the voice tables), read out of
// index.html, so the recorder and the game can never disagree about which file a line plays.
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
function grab(head){const i=html.indexOf(head);if(i<0)throw new Error('not found: '+head);
  let j=html.indexOf('{',i),d=0;for(;j<html.length;j++){const ch=html[j];if(ch==='{')d++;else if(ch==='}'){d--;if(!d)break}}
  return html.slice(i,j+1)}
const consts=['LOOK','LANG','GEN','UAE','VTXT','EDGE','EDGE_EN','FLAG'].map(n=>grab('const '+n+'=')+';').join('\n');
const ml=html.match(/const EDGE_ML=\[[^\]]*\];/)[0];
const fns=['function cOf(','function femaleOf(','function vClean(','function clipFor('].map(grab).join('\n');
const out=new Function(consts+'\n'+ml+'\n'+fns+`
  const want=new Map();const add=(who,t,g)=>{const c=clipFor(who,vClean('x '+t),g);if(c&&c.text)want.set(c.voice+'|'+c.text,c)};
  for(const who of Object.keys(LOOK)){const c=cOf(who);
    for(const k of ['claim','back','cross','calm'])for(const [t,g] of (LANG[c]||{})[k]||[])add(who,t,g);
    for(const [t,g] of (GEN.cross||[]).concat(UAE.cross||[]))add(who,t,g)}
  return [...want.values()].sort((a,b)=>(a.voice+a.text).localeCompare(b.voice+b.text));`)();
fs.mkdirSync(path.join(__dirname,'..','voices'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'..','voices','lines.json'),JSON.stringify(out,null,1)+'\n');
console.log(out.length+' lines across '+new Set(out.map(x=>x.voice)).size+' voices');
