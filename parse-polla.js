const fs = require('fs');
const XLSX = require('xlsx');

const XLSX_FILE = 'CONSOLIDADO CARTILLAS POLLA 2026 (1).xlsx';

const TEAMS = [
  'Corea del Sur', 'Costa de Marfil', 'Rep. Checa', 'N. Zelanda', 'A. Saudita',
  'RD Congo', 'Uzbekistán', 'Sudáfrica', 'Marruecos', 'Australia', 'Alemania',
  'Holanda', 'Bélgica', 'Escocia', 'Paraguay', 'Portugal', 'Colombia', 'Croacia',
  'Inglaterra', 'Francia', 'Senegal', 'Noruega', 'Argelia', 'Jordania', 'Ecuador',
  'Curazao', 'Bosnia', 'Suiza', 'Brasil', 'Haití', 'Turquía', 'Túnez', 'Suecia',
  'Japón', 'Egipto', 'Irán', 'España', 'Uruguay', 'Cabo Verde', 'México', 'Canadá',
  'Catar', 'USA', 'Panamá', 'Ghana', 'Iraq', 'Argentina', 'Austria'
];

const ALIASES = {
  'José Manuel Kaltwasser': 'JMKO',
  'José Tomás Kaltwasser': 'JTKP',
};

const norm = s => String(s || '').normalize('NFD').replace(/\p{M}/gu, '').toUpperCase().trim();

const teamByNorm = Object.fromEntries(TEAMS.map(t => [norm(t), t]));

function normalizeTeam(raw) {
  const n = norm(raw);
  if (!n) return '';
  if (teamByNorm[n]) return teamByNorm[n];
  for (const [k, v] of Object.entries(teamByNorm)) {
    if (k.startsWith(n) || n.startsWith(k)) return v;
  }
  return String(raw).trim();
}

function makeShort(name) {
  if (ALIASES[name]) return ALIASES[name];
  const words = name.replace(/\./g, '').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 5).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().slice(0, 6);
}

function parseScore(v) {
  if (v === '' || v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function isMatchRow(r) {
  if (!r || !r[0] || !r[3]) return false;
  return parseScore(r[1]) !== null && parseScore(r[2]) !== null;
}

function isParticipantName(r) {
  if (!r || !r[0] || typeof r[1] === 'number') return false;
  const name = String(r[0]).trim();
  if (!name || name.length < 3) return false;
  if (/^(BASES|PARTICIPANTES|MONTO|RECAUDADO|Premios|Caso|Desempates|Número|Máximo)/i.test(name)) return false;
  if (name.includes('°') || name.includes('empate')) return false;
  return true;
}

function parseParticipantBlock(rows, startIdx, matches) {
  const name = String(rows[startIdx][0]).trim();
  const rawPreds = [];

  for (let m = 0; m < 72; m++) {
    const mr = rows[startIdx + 1 + m];
    if (!isMatchRow(mr)) {
      throw new Error(`${name}: fila de partido ${m + 1} inválida en índice ${startIdx + 1 + m}`);
    }
    rawPreds.push({
      home: normalizeTeam(mr[0]),
      ph: parseScore(mr[1]),
      pa: parseScore(mr[2]),
      away: normalizeTeam(mr[3])
    });
  }

  const champRow = rows[startIdx + 73] || [];
  const champion = normalizeTeam(champRow[0]);
  const runnerUp = normalizeTeam(champRow[2]);

  const predictions = matches.map((match, idx) => {
    const pred = rawPreds[idx];
    if (!pred) throw new Error(`${name}: falta partido ${idx + 1}`);
    const nh = norm(pred.home), na = norm(pred.away);
    const mh = norm(match.home), ma = norm(match.away);
    if (nh !== mh || na !== ma) {
      const byTeams = rawPreds.find(p => norm(p.home) === mh && norm(p.away) === ma);
      if (byTeams) {
        return { home: match.home, ph: byTeams.ph, pa: byTeams.pa, away: match.away };
      }
      throw new Error(
        `${name} M${match.id}: esperado ${match.home} vs ${match.away}, ` +
        `obtenido ${pred.home} vs ${pred.away} (fila ${idx + 1})`
      );
    }
    return { home: match.home, ph: pred.ph, pa: pred.pa, away: match.away };
  });

  return { name, champion, runnerUp, predictions };
}

function parseSheet(rows, matches) {
  const participants = [];
  for (let i = 0; i < rows.length; i++) {
    if (!isParticipantName(rows[i])) continue;
    const next = rows[i + 1];
    if (!isMatchRow(next)) continue;

    const block = parseParticipantBlock(rows, i, matches);
    participants.push(block);
    i += 73;
  }
  return participants;
}

function main() {
  if (!fs.existsSync(XLSX_FILE)) {
    console.error('No se encontró', XLSX_FILE);
    process.exit(1);
  }

  const baseData = JSON.parse(fs.readFileSync('polla-data.json', 'utf8'));
  const matches = baseData.matches;
  const wb = XLSX.readFile(XLSX_FILE);

  const participants = [];
  for (const sheetName of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: '' });
    const parsed = parseSheet(rows, matches);
    parsed.forEach(p => participants.push({
      id: participants.length + 1,
      name: p.name,
      short: makeShort(p.name),
      champion: p.champion,
      runnerUp: p.runnerUp,
      predictions: p.predictions
    }));
  }

  const output = {
    matches: baseData.matches,
    teams: baseData.teams,
    flagCodes: baseData.flagCodes,
    emojis: baseData.emojis,
    rules: baseData.rules,
    participants
  };

  fs.writeFileSync('polla-data.json', JSON.stringify(output));
  fs.writeFileSync('polla-data.js', 'const POLLA_DATA = ' + JSON.stringify(output) + ';\n');

  console.log('Fuente: Excel (.xlsx)');
  console.log('Total participantes:', participants.length);
  console.log('Con 72 pronósticos:', participants.filter(x => x.predictions.length === 72).length);

  const incomplete = participants.filter(x => x.predictions.length !== 72);
  if (incomplete.length) {
    incomplete.forEach(x => console.log(`  ⚠ ${x.name}: ${x.predictions.length} partidos`));
  }

  const jtkp = participants.find(x => x.short === 'JTKP');
  const jmko = participants.find(x => x.short === 'JMKO');
  if (jtkp) {
    console.log('\nJTKP M1-M2:', jtkp.predictions[0].ph + '-' + jtkp.predictions[0].pa,
      jtkp.predictions[1].ph + '-' + jtkp.predictions[1].pa);
  }
  if (jmko) {
    console.log('JMKO M1-M2:', jmko.predictions[0].ph + '-' + jmko.predictions[0].pa,
      jmko.predictions[1].ph + '-' + jmko.predictions[1].pa);
  }
}

main();
