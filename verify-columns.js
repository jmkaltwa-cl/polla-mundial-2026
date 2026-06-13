const fs = require('fs');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync('CONSOLIDADO CARTILLAS POLLA 2026 (1).pdf')),
    useSystemFonts: true
  }).promise;

  const page = await doc.getPage(4);
  const items = (await page.getTextContent()).items;

  const names = items.filter(it => /Santiago|Andrés|José Tomás|Torretti|Sepúlveda|Kaltwasser/i.test(it.str));
  console.log('Nombres en página 4 (posición X):');
  names.forEach(n => console.log(`  x=${n.transform[4].toFixed(1)} y=${n.transform[5].toFixed(1)} "${n.str}"`));

  // Primer partido México - buscar scores con posición X
  const mex = items.filter(it => /México|Sudáfrica/.test(it.str) || /^\d+$/.test(it.str.trim()));
  console.log('\nPrimeras 20 piezas del partido México (x, str):');
  items.slice(0, 40).forEach(it => console.log(`  x=${it.transform[4].toFixed(0)} "${it.str}"`));
})();
