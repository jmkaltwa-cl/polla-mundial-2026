const fs = require('fs');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const matches = require('./polla-data.json').matches;
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync('CONSOLIDADO CARTILLAS POLLA 2026 (1).pdf')),
    useSystemFonts: true
  }).promise;

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  for (const pageNum of [21, 22, 23]) {
    const items = (await doc.getPage(pageNum).getTextContent()).items;
    const text = items.map(it => it.str).join(' ').replace(/\s+/g, ' ');
    console.log('\n======== PDF', pageNum, '========');
    for (const m of matches.slice(0, 3)) {
      const re = new RegExp(esc(m.home) + '\\s+(\\d+)\\s+(\\d+)\\s+' + esc(m.away), 'gi');
      const found = [];
      let x;
      while ((x = re.exec(text))) found.push(x[1] + '-' + x[2]);
      console.log(`M${m.id} ${m.home} vs ${m.away}:`, found.join(' | '));
    }
    const names = items.filter(it => it.transform[5] > 500 && it.str.length > 4)
      .sort((a, b) => a.transform[4] - b.transform[4])
      .map(it => `[x${it.transform[4].toFixed(0)}] ${it.str}`);
    console.log('Nombres:', names.join(' | '));
  }
})();
