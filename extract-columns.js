const fs = require('fs');

async function main() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync('CONSOLIDADO CARTILLAS POLLA 2026 (1).pdf'));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

  for (const pageNum of [3, 4, 5]) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items.map(it => it.str).join('|');
    const corea = text.match(/Corea[^|]{0,30}/g) || [];
    console.log('\nPage', pageNum, 'Corea snippets:', corea.slice(0, 15));
  }
}

main().catch(console.error);
