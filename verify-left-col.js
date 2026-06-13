const fs = require('fs');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync('CONSOLIDADO CARTILLAS POLLA 2026 (1).pdf')),
    useSystemFonts: true
  }).promise;

  const page = await doc.getPage(4);
  const items = (await page.getTextContent()).items;

  const coreaItems = items.filter(it => it.str.includes('Corea'));
  console.log('Todas las piezas "Corea" en página 4:');
  coreaItems.slice(0, 9).forEach(it => {
    const neighbors = items.filter(n =>
      Math.abs(n.transform[5] - it.transform[5]) < 3 &&
      n.transform[4] >= it.transform[4] && n.transform[4] < it.transform[4] + 120
    ).sort((a, b) => a.transform[4] - b.transform[4]).map(n => n.str.trim()).filter(Boolean);
    console.log(`  x=${it.transform[4].toFixed(0)} y=${it.transform[5].toFixed(0)}: ${neighbors.join(' ')}`);
  });
})();
