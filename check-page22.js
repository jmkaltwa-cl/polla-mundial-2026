const fs = require('fs');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const d = require('./polla-data.json');
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync('CONSOLIDADO CARTILLAS POLLA 2026 (1).pdf')),
    useSystemFonts: true
  }).promise;

  for (const pageNum of [21, 22]) {
    const page = await doc.getPage(pageNum);
    const items = (await page.getTextContent()).items;
    const names = items.filter(it => it.transform[5] > 500 && it.str.length > 5)
      .map(it => ({ str: it.str, x: it.transform[4].toFixed(0) }))
      .sort((a, b) => a.x - b.x);
    console.log('\nPDF page', pageNum, 'names (L→R):', names.map(n => n.str).join(' | '));
  }

  const r1 = { h: 2, a: 0 }, r2 = { h: 2, a: 1 };
  function sc(p, r) {
    const ah = +r.h, aa = +r.a;
    if (+p.ph === ah && +p.pa === aa) return 3;
    const o = (a, b) => a === b ? 'D' : a > b ? 'H' : 'A';
    return o(+p.ph, +p.pa) === o(ah, aa) ? 1 : 0;
  }

  ['María Kaltwasser', 'Elisa Kaltwasser', 'Sofia Kaltwasser', 'Maria Luisa Hurtado', 'Agustin lobo'].forEach(n => {
    const p = d.participants.find(x => x.name.toLowerCase().includes(n.toLowerCase().slice(0, 8)));
    if (!p) return;
    const pts = sc(p.predictions[0], r1) + sc(p.predictions[1], r2);
    console.log(p.name, 'M1', p.predictions[0].ph + '-' + p.predictions[0].pa, 'M2', p.predictions[1].ph + '-' + p.predictions[1].pa, '=>', pts, 'pts');
  });
})();
