import fs from "node:fs"; import vm from "node:vm";
const ctx={}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("public/assets/quiz.js","utf8")+";globalThis.QUIZ=QUIZ;",ctx);
const g=fs.readFileSync("public/assets/game.js","utf8");
const phasesSrc=g.slice(g.indexOf("const phases = ["), g.indexOf("];", g.indexOf("const phases = ["))+2);
vm.runInContext(phasesSrc+";globalThis.phases=phases;",ctx);
const {QUIZ,phases}=ctx; let ids=new Set(), problems=[];
phases.forEach((p,pi)=>p.stages.forEach((s,si)=>s[1].forEach((q,qi)=>{ const id=pi+"-"+si+"-"+qi; ids.add(id);
  const b=QUIZ[id]; if(!b){problems.push("missing "+id);return;}
  if(b.length!==5) problems.push(id+" has "+b.length);
  b.forEach((it,i)=>{ if(!(it.a>=0&&it.a<it.o.length)) problems.push(id+"#"+i+" bad answer idx");
    const texts=it.o.map(o=>o[0]); if(new Set(texts).size!==texts.length) problems.push(id+"#"+i+" duplicate options"); });
})));
Object.keys(QUIZ).forEach(k=>{ if(!ids.has(k)) problems.push("orphan "+k); });
// answer-position bias
const pos=[0,0,0,0]; Object.values(QUIZ).flat().forEach(it=>pos[it.a]++);
console.log("quests",ids.size,"problems",problems.length, problems.slice(0,20), "answer positions",pos);
