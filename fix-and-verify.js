const fs = require('fs');

const RESULTS = { '1': { h: 2, a: 0 }, '2': { h: 2, a: 1 } };

// Tabla oficial (de tu imagen) — pts y exactos por nombre
const OFFICIAL = {
  'Jose Pedro Arteaga': { pts: 6, ex: 2 },
  'José Manuel Kaltwasser': { pts: 4, ex: 1 },
  'Francisco Bendicho': { pts: 4, ex: 1 },
  'Sofia Kaltwasser': { pts: 4, ex: 1 },
  'Patricia Viera': { pts: 4, ex: 1 },
  'José Tomás Kaltwasser': { pts: 4, ex: 1 },
  'Gonzalo Covarrubias Kaltwasser': { pts: 4, ex: 1 },
  'Cristián Kaltwasser Ortiz': { pts: 4, ex: 1 },
  'Anibal Monckeberg': { pts: 4, ex: 1 },
  'Andrea Ducci': { pts: 4, ex: 1 },
  'Elisa Kaltwasser': { pts: 3, ex: 1 },
  'Luis Corvalán V.': { pts: 0, ex: 0 },
  'Antonio Lobo A.': { pts: 0, ex: 0 },
  'Ramón Maiz': { pts: 0, ex: 0 },
};

function norm(s) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/\./g, '').trim();
}

function score(pred, r) {
  const ah = +r.h, aa = +r.a;
  if (+pred.ph === ah && +pred.pa === aa) return { p: 3, ex: 1 };
  const o = (a, b) => a === b ? 'D' : a > b ? 'H' : 'A';
  if (o(+pred.ph, +pred.pa) === o(ah, aa)) return { p: 1, ex: 0 };
  return { p: 0, ex: 0 };
}

function compute(p, results) {
  let pts = 0, ex = 0;
  [0, 1].forEach(i => {
    const r = results[String(i + 1)];
    const s = score(p.predictions[i], r);
    pts += s.p; ex += s.ex;
  });
  return { pts, ex };
}

const d = require('./polla-data.json');

console.log('Participantes con diferencia vs tabla oficial conocida:\n');
for (const [refName, target] of Object.entries(OFFICIAL)) {
  const p = d.participants.find(x => norm(x.name) === norm(refName));
  if (!p) { console.log('?', refName, 'no encontrado'); continue; }
  const calc = compute(p, RESULTS);
  if (calc.pts !== target.pts || calc.ex !== target.ex) {
    console.log('✗', p.name);
    console.log('   Oficial:', target.pts, 'pts', target.ex, 'ex');
    console.log('   App:    ', calc.pts, 'pts', calc.ex, 'ex');
    console.log('   M1 pred:', p.predictions[0]?.ph + '-' + p.predictions[0]?.pa);
    console.log('   M2 pred:', p.predictions[1]?.ph + '-' + p.predictions[1]?.pa);
  }
}
