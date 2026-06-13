const fs = require('fs');

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const matches = JSON.parse(fs.readFileSync('polla-data.json')).matches;
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(fs.readFileSync('CONSOLIDADO CARTILLAS POLLA 2026 (1).pdf')),
    useSystemFonts: true
  }).promise;

  const page = await doc.getPage(4);
  const content = await page.getTextContent();
  const t = content.items.map(i => i.str).join(' ').replace(/\s+/g, ' ');

  function findAll(m) {
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(esc(m.home) + '\\s+(\\d+)\\s+(\\d+)\\s+' + esc(m.away), 'gi');
    const all = [];
    let match;
    while ((match = re.exec(t))) all.push(`${match[1]}-${match[2]}`);
    return all;
  }

  console.log('PDF página 4 — M2 Corea vs Rep:', findAll(matches[1]));
  console.log('PDF página 4 — M3 Rep vs Sudáfrica:', findAll(matches[2]));
  console.log('Orden nombres: [1] Santiago  [2] Andrés  [3] José Tomás');
  console.log('');
  console.log('JTKP extraído M2:', JSON.stringify(
    JSON.parse(fs.readFileSync('polla-data.json')).participants.find(p => p.short === 'JTKP').predictions[1]
  ));
})();
