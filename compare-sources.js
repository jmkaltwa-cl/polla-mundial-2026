const fs = require('fs');
const d = require('./polla-data.json');

const RESULTS = { '1': { h: 2, a: 0 }, '2': { h: 2, a: 1 } };
function score(pred, r) {
  const ah = +r.h, aa = +r.a;
  if (+pred.ph === ah && +pred.pa === aa) return { p: 3, ex: 1 };
  const o = (a, b) => a === b ? 'D' : a > b ? 'H' : 'A';
  if (o(+pred.ph, +pred.pa) === o(ah, aa)) return { p: 1, ex: 0 };
  return { p: 0, ex: 0 };
}

const rows = d.participants.map(p => {
  let pts = 0, ex = 0;
  [0, 1].forEach(i => { const s = score(p.predictions[i], RESULTS[String(i + 1)]); pts += s.p; ex += s.ex; });
  return { name: p.name, pts, ex };
}).sort((a, b) => b.pts - a.pts || b.ex - a.ex || a.name.localeCompare(b.name, 'es'));

console.log('Ranking completo (M1 2-0, M2 2-1):\n');
rows.forEach((r, i) => console.log(`${String(i + 1).padStart(2)}. ${r.pts}pts ${r.ex}ex — ${r.name}`));

const dist = {};
rows.forEach(r => { const k = `${r.pts}|${r.ex}`; dist[k] = (dist[k] || 0) + 1; });
console.log('\nDistribución:', dist);
