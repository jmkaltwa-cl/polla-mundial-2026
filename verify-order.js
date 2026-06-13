const fs = require('fs');
const TEAMS = [
  'Corea del Sur', 'Costa de Marfil', 'Rep. Checa', 'N. Zelanda', 'A. Saudita',
  'RD Congo', 'Uzbekistán', 'Sudáfrica', 'Marruecos', 'Australia', 'Alemania',
  'Holanda', 'Bélgica', 'Escocia', 'Paraguay', 'Portugal', 'Colombia', 'Croacia',
  'Inglaterra', 'Francia', 'Senegal', 'Noruega', 'Argelia', 'Jordania', 'Ecuador',
  'Curazao', 'Bosnia', 'Suiza', 'Brasil', 'Haití', 'Turquía', 'Túnez', 'Suecia',
  'Japón', 'Egipto', 'Irán', 'España', 'Uruguay', 'Cabo Verde', 'México', 'Canadá',
  'Catar', 'USA', 'Panamá', 'Ghana', 'Iraq', 'Argentina', 'Austria'
].sort((a, b) => b.length - a.length);

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const matches = JSON.parse(fs.readFileSync('polla-data.json')).matches;
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync('CONSOLIDADO CARTILLAS POLLA 2026 (1).pdf')),
    useSystemFonts: true
  }).promise;

  const page = await doc.getPage(4);
  const t = (await page.getTextContent()).items.map(i => i.str).join(' ').replace(/\s+/g, ' ');
  const clean = t.replace(/PT\s+O\s+PE/gi, ' ');

  // Extraer secuencia de partidos en orden de aparición (cada 3ra ocurrencia = col3)
  const found = [];
  let cursor = 0;
  const reList = TEAMS.flatMap(h => TEAMS.map(a => {
    if (h === a) return null;
    return { h, a, re: new RegExp(h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+(\\d+)\\s+(\\d+)\\s+' + a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) };
  })).filter(Boolean);

  while (found.length < 72 * 3 && cursor < clean.length) {
    let best = null;
    let bestIdx = Infinity;
    for (const { h, a, re } of reList) {
      const slice = clean.slice(cursor);
      const m = re.exec(slice);
      if (m && m.index < bestIdx) {
        bestIdx = m.index;
        best = { h, a, ph: +m[1], pa: +m[2], len: m.index + m[0].length };
      }
    }
    if (!best) break;
    found.push(best);
    cursor += best.len;
    const pad = /^\s*(?:0\s+0\s*)*/.exec(clean.slice(cursor));
    if (pad) cursor += pad[0].length;
  }

  const col3 = found.filter((_, i) => i % 3 === 2);
  console.log('Col3 (José Tomás) primeros 8 partidos en orden PDF:');
  col3.slice(0, 8).forEach((p, i) => {
    const off = matches[i];
    const ok = p.h === off.home && p.a === off.away;
    console.log(`  ${i + 1}. PDF ${p.h} ${p.ph}-${p.pa} ${p.a} | App ${off.home} vs ${off.away} ${ok ? 'OK' : 'DESFASE'}`);
  });
})();
