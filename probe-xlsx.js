const XLSX = require('xlsx');
const wb = XLSX.readFile('CONSOLIDADO CARTILLAS POLLA 2026 (1).xlsx');

function isMatchRow(r) {
  return r && r[0] && r[3] && (typeof r[1] === 'number' || r[1] !== '') &&
    (typeof r[2] === 'number' || r[2] !== '');
}

let issues = 0;
wb.SheetNames.forEach(sheet => {
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0] || typeof r[1] !== 'number' && r[1] === '' && !r[3]) continue;
    if (r[0] && r[3] && (r[1] === '' || r[2] === '' || typeof r[1] === 'string' || typeof r[2] === 'string')) {
      if (typeof r[1] === 'number' && typeof r[2] === 'number') continue;
      if (r[1] !== '' && r[2] !== '' && !isNaN(+r[1]) && !isNaN(+r[2])) continue;
      console.log(`${sheet} R${i}:`, JSON.stringify(r));
      issues++;
    }
  }
});
console.log('Total celdas con score vacío:', issues);
