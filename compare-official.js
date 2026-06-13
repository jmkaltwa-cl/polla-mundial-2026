const d = require('./polla-data.json');

const RESULTS = { '1': { h: 2, a: 0 }, '2': { h: 2, a: 1 } };

const OFFICIAL = [
  { pos: 1, name: 'José Pedro Arteaga', pts: 6, ex: 2 },
  { pos: 2, name: 'José Manuel Kaltwasser', pts: 4, ex: 1 },
  { pos: 3, name: 'Francisco Bendicho', pts: 4, ex: 1 },
  { pos: 4, name: 'Sofía Kaltwasser', pts: 4, ex: 1 },
  { pos: 5, name: 'Patricia Viera', pts: 4, ex: 1 },
  { pos: 6, name: 'José Tomás Kaltwasser', pts: 4, ex: 1 },
  { pos: 7, name: 'Gonzalo Covarrubias K.', pts: 4, ex: 1 },
  { pos: 8, name: 'Cristián Kaltwasser R.', pts: 4, ex: 1 },
  { pos: 9, name: 'Aníbal Monckeberg', pts: 4, ex: 1 },
  { pos: 10, name: 'Andrea Ducci', pts: 4, ex: 1 },
  { pos: 11, name: 'Trini Maiz', pts: 3, ex: 1 },
  { pos: 12, name: 'Paco Cervantes S.', pts: 3, ex: 1 },
  { pos: 13, name: 'Nicolás Hasenberg K.', pts: 3, ex: 1 },
  { pos: 14, name: 'Martín Kaltwasser A.', pts: 3, ex: 1 },
  { pos: 15, name: 'María Kaltwasser', pts: 3, ex: 1 },
  { pos: 16, name: 'María Jesús Sepúlveda', pts: 3, ex: 1 },
  { pos: 17, name: 'Juan Eyzaguirre', pts: 3, ex: 1 },
  { pos: 18, name: 'Juan Carlos Jofré', pts: 3, ex: 1 },
  { pos: 19, name: 'José A. Cervantes', pts: 3, ex: 1 },
  { pos: 20, name: 'Jorge Andújar', pts: 3, ex: 1 },
  { pos: 21, name: 'Javier Marcos', pts: 3, ex: 1 },
  { pos: 22, name: 'Francisco Cervantes F.', pts: 3, ex: 1 },
  { pos: 23, name: 'Fendi Diez', pts: 3, ex: 1 },
  { pos: 24, name: 'Felipe Maiz', pts: 3, ex: 1 },
  { pos: 25, name: 'Felipe Ananias', pts: 3, ex: 1 },
  { pos: 26, name: 'Eugenio Palacios P.', pts: 3, ex: 1 },
  { pos: 27, name: 'Arturo Pérez', pts: 3, ex: 1 },
  { pos: 28, name: 'Andrés Sepúlveda S.', pts: 3, ex: 1 },
  { pos: 29, name: 'Agustín Cervantes', pts: 3, ex: 1 },
  { pos: 30, name: 'Elisa Kaltwasser', pts: 3, ex: 1 },
  { pos: 31, name: 'Daniela Chamorro', pts: 3, ex: 1 },
  { pos: 32, name: 'Martín Kaltwasser H.', pts: 2, ex: 0 },
  { pos: 33, name: 'Juan Pablo Covarrubias K.', pts: 2, ex: 0 },
  { pos: 34, name: 'Diego Cervantes S.', pts: 2, ex: 0 },
  { pos: 35, name: 'Bea Bendek', pts: 2, ex: 0 },
  { pos: 36, name: 'Antonio Torretti', pts: 2, ex: 0 },
  { pos: 37, name: 'Antonio Monckeberg', pts: 2, ex: 0 },
  { pos: 38, name: 'Santiago Torretti S.', pts: 1, ex: 0 },
  { pos: 39, name: 'Raimundo Arteaga', pts: 1, ex: 0 },
  { pos: 40, name: 'Rafa Quintana', pts: 1, ex: 0 },
  { pos: 41, name: 'Paco Cervantes K.', pts: 1, ex: 0 },
  { pos: 42, name: 'Nicolás Kaltwasser A.', pts: 1, ex: 0 },
  { pos: 43, name: 'Nicolás Alarcón R.', pts: 1, ex: 0 },
  { pos: 44, name: 'Matías Palavicino Solari', pts: 1, ex: 0 },
  { pos: 45, name: 'Mario Espinoza', pts: 1, ex: 0 },
  { pos: 46, name: 'María Paz Sepúlveda', pts: 1, ex: 0 },
  { pos: 47, name: 'Josefina Kaltwasser', pts: 1, ex: 0 },
  { pos: 48, name: 'José Arteaga', pts: 1, ex: 0 },
  { pos: 49, name: 'Jorge Bendek', pts: 1, ex: 0 },
  { pos: 50, name: 'Javier Kaltwasser A.', pts: 1, ex: 0 },
  { pos: 51, name: 'Isabel Simonetti', pts: 1, ex: 0 },
  { pos: 52, name: 'Icha Astaburuaga', pts: 1, ex: 0 },
  { pos: 53, name: 'Francisco Hasenberg K.', pts: 1, ex: 0 },
  { pos: 54, name: 'Francisco Hasenberg D.', pts: 1, ex: 0 },
  { pos: 55, name: 'Cristián Kaltwasser O.', pts: 1, ex: 0 },
  { pos: 56, name: 'Antonia Samsó', pts: 1, ex: 0 },
  { pos: 57, name: 'Andrés Sepúlveda E.', pts: 1, ex: 0 },
  { pos: 58, name: 'Andrés Maiz', pts: 1, ex: 0 },
  { pos: 59, name: 'Agustín Lobo', pts: 1, ex: 0 },
  { pos: 60, name: 'María Luisa Hurtado', pts: 1, ex: 0 },
  { pos: 61, name: 'Ramón Maiz', pts: 0, ex: 0 },
  { pos: 62, name: 'Nicolás Kaltwasser Q.', pts: 0, ex: 0 },
  { pos: 63, name: 'Luis Corvalan', pts: 0, ex: 0 },
  { pos: 64, name: 'Francisco Eterovic', pts: 0, ex: 0 },
  { pos: 65, name: 'Eugenio Palacios L.', pts: 0, ex: 0 },
  { pos: 66, name: 'Coti Cervantes', pts: 0, ex: 0 },
  { pos: 67, name: 'Antonio Lobo A.', pts: 0, ex: 0 },
];

const ALIASES = {
  'gonzalo covarrubias k': 'gonzalo covarrubias kaltwasser',
  'cristian kaltwasser r': 'cristian kaltwasser rivera',
  'cristian kaltwasser o': 'cristian kaltwasser ortiz',
  'martin kaltwasser a': 'martin kaltwasser anguita',
  'martin kaltwasser h': 'martin kaltwasser hurtado',
  'juan pablo covarrubias k': 'juan pablo covarrubias',
  'felipe ananias': 'pipe ananias',
  'mario espinoza': 'mario espinoza cerda',
  'jorge bendek': 'jorge bendek a',
  'luis corvalan': 'luis corvalan v',
  'agustin lobo': 'agustin lobo',
  'sofia kaltwasser': 'sofia kaltwasser',
  'anibal monckeberg': 'anibal monckeberg',
  'jose pedro arteaga': 'jose pedro arteaga',
};

function norm(s) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

function canon(name) {
  const n = norm(name);
  return ALIASES[n] || n;
}

function score(pred, r) {
  const ah = +r.h, aa = +r.a;
  if (+pred.ph === ah && +pred.pa === aa) return { p: 3, ex: 1 };
  const o = (a, b) => a === b ? 'D' : a > b ? 'H' : 'A';
  if (o(+pred.ph, +pred.pa) === o(ah, aa)) return { p: 1, ex: 0 };
  return { p: 0, ex: 0 };
}

function compute(p) {
  let pts = 0, ex = 0;
  [0, 1].forEach(i => {
    const s = score(p.predictions[i], RESULTS[String(i + 1)]);
    pts += s.p; ex += s.ex;
  });
  return { pts, ex };
}

const byCanon = new Map();
d.participants.forEach(p => byCanon.set(canon(p.name), { ...p, calc: compute(p) }));

let ok = 0, fail = 0, missing = 0;
const failures = [];

console.log('Comparación participante por participante (M1 2-0, M2 2-1):\n');
console.log('Pos | Oficial (pts/ex) | App (pts/ex) | Estado | Nombre');
console.log('----|------------------|--------------|--------|-------');

for (const ref of OFFICIAL) {
  const key = canon(ref.name);
  const app = byCanon.get(key);
  if (!app) {
    missing++;
    console.log(`${String(ref.pos).padStart(3)} | ${ref.pts}/${ref.ex}`.padEnd(17) + ` | ???          | ? NO ENCONTRADO | ${ref.name}`);
    continue;
  }
  const match = app.calc.pts === ref.pts && app.calc.ex === ref.ex;
  if (match) ok++;
  else {
    fail++;
    failures.push({ ref, app });
  }
  const status = match ? '✓' : '✗';
  console.log(
    `${String(ref.pos).padStart(3)} | ${String(ref.pts).padStart(2)}/${ref.ex}`.padEnd(17) +
    ` | ${String(app.calc.pts).padStart(2)}/${app.calc.ex}`.padEnd(13) +
    ` | ${status}      | ${ref.name}`
  );
}

console.log(`\nResumen: ${ok} coinciden, ${fail} difieren, ${missing} no encontrados de ${OFFICIAL.length}`);

if (failures.length) {
  console.log('\nDetalle diferencias:');
  failures.forEach(({ ref, app }) => {
    console.log(`  ${ref.name}: oficial ${ref.pts}/${ref.ex} → app ${app.calc.pts}/${app.calc.ex} (${app.name})`);
    console.log(`    M1: ${app.predictions[0].ph}-${app.predictions[0].pa}  M2: ${app.predictions[1].ph}-${app.predictions[1].pa}`);
  });
}

// Ranking position comparison
const appRanked = d.participants.map(p => ({ name: p.name, ...compute(p) }))
  .sort((a, b) => b.pts - a.pts || b.ex - a.ex || a.name.localeCompare(b.name, 'es'));

let posMatch = 0;
console.log('\nPosición en ranking (mismo pts/ex puede variar orden):');
for (const ref of OFFICIAL) {
  const key = canon(ref.name);
  const appIdx = appRanked.findIndex(p => canon(p.name) === key);
  const appPos = appIdx + 1;
  const app = byCanon.get(key);
  if (app && app.calc.pts === ref.pts && app.calc.ex === ref.ex) {
    if (appPos === ref.pos) posMatch++;
  }
}
console.log(`Posición exacta coincide en ${posMatch}/${OFFICIAL.length} (el orden dentro del mismo puntaje puede variar)`);
