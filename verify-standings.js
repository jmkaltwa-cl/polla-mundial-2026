const d = require('./polla-data.json');

const REFERENCE = [
  { rank: 1, name: 'José Pedro Arteaga', pts: 6, exactos: 2 },
  { rank: 2, name: 'José Manuel Kaltwasser', pts: 4, exactos: 1 },
  { rank: 3, name: 'Francisco Bendicho', pts: 4, exactos: 1 },
  { rank: 4, name: 'Sofía Kaltwasser', pts: 4, exactos: 1 },
  { rank: 5, name: 'Patricia Viera', pts: 4, exactos: 1 },
  { rank: 6, name: 'José Tomás Kaltwasser', pts: 4, exactos: 1 },
  { rank: 7, name: 'Gonzalo Covarrubias K.', pts: 4, exactos: 1 },
  { rank: 8, name: 'Cristián Kaltwasser R.', pts: 4, exactos: 1 },
  { rank: 9, name: 'Aníbal Monckeberg', pts: 4, exactos: 1 },
  { rank: 10, name: 'Andrea Ducci', pts: 4, exactos: 1 },
];

function normName(s) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

function findParticipant(refName) {
  const n = normName(refName);
  return d.participants.find(p => {
    const pn = normName(p.name);
    if (pn.includes(n) || n.includes(pn)) return true;
    const parts = n.split(' ');
    const last = parts[parts.length - 1];
    const first = parts[0];
    return pn.includes(first) && pn.includes(last);
  });
}

function outcome(a, b) {
  if (a === b) return 'D';
  return a > b ? 'H' : 'A';
}

function scoreMatch(pred, actual) {
  if (!pred || !actual) return { points: 0, exact: false };
  const ah = Number(actual.h), aa = Number(actual.a);
  if (Number(pred.ph) === ah && Number(pred.pa) === aa) return { points: 3, exact: true };
  if (outcome(Number(pred.ph), Number(pred.pa)) === outcome(ah, aa)) return { points: 1, exact: false };
  return { points: 0, exact: false };
}

function computeStandings(results) {
  return d.participants.map(p => {
    let pts = 0, exacts = 0;
    p.predictions.forEach((pred, idx) => {
      const res = results[String(idx + 1)];
      if (!res || res.h === '' || res.a === '') return;
      const sc = scoreMatch(pred, res);
      pts += sc.points;
      if (sc.exact) exacts++;
    });
    return { name: p.name, short: p.short, pts, exacts };
  }).sort((a, b) => b.pts - a.pts || b.exacts - a.exacts || a.name.localeCompare(b.name, 'es'));
}

function distribution(rows) {
  const dist = {};
  for (const r of rows) {
    const k = `${r.pts}|${r.exacts}`;
    dist[k] = (dist[k] || 0) + 1;
  }
  return dist;
}

const targetDist = {
  '6|2': 1,
  '4|1': 9,
  '3|1': 21,
  '2|0': 6,
  '1|0': 23,
  '0|0': 7,
};

function distScore(dist) {
  let score = 0;
  for (const [k, v] of Object.entries(targetDist)) {
    score += Math.abs((dist[k] || 0) - v);
  }
  return score;
}

// Buscar resultados de 2 primeros partidos que reproduzcan la distribución
const m1 = d.matches[0];
const m2 = d.matches[1];
let best = null;

for (let h1 = 0; h1 <= 4; h1++) {
  for (let a1 = 0; a1 <= 4; a1++) {
    for (let h2 = 0; h2 <= 4; h2++) {
      for (let a2 = 0; a2 <= 4; a2++) {
        const results = {
          '1': { h: h1, a: a1 },
          '2': { h: h2, a: a2 },
        };
        const rows = computeStandings(results);
        const dist = distribution(rows);
        const ds = distScore(dist);
        if (ds === 0) {
          best = { results, rows, dist };
          break;
        }
        if (!best || ds < best.ds) {
          best = { results, rows, dist, ds };
        }
      }
    }
  }
}

console.log('Mejor ajuste con partidos 1 y 2:');
console.log(`  M1 ${m1.home} ${best.results['1'].h}-${best.results['1'].a} ${m1.away}`);
console.log(`  M2 ${m2.home} ${best.results['2'].h}-${best.results['2'].a} ${m2.away}`);
console.log('  Distancia a distribución objetivo:', best.ds);
console.log('  Distribución:', best.dist);
console.log('\nTop 10 calculado vs referencia:');
const top10 = best.rows.slice(0, 10);
for (let i = 0; i < 10; i++) {
  const calc = top10[i];
  const ref = REFERENCE[i];
  const refP = findParticipant(ref.name);
  const match = refP && normName(refP.name).includes(normName(ref.name).split(' ')[0]);
  console.log(
    `${i + 1}. Calc: ${calc.name} (${calc.pts}p, ${calc.exacts}ex) | Ref: ${ref.name} (${ref.pts}p) ${refP ? '✓' : '?'} ${refP && calc.pts === ref.pts && calc.exacts === ref.exactos ? 'OK' : 'DIFF'}`
  );
}

// Probar también solo partido 1
const r1only = computeStandings({ '1': best.results['1'] });
console.log('\nSolo partido 1 - distribución:', distribution(r1only));
