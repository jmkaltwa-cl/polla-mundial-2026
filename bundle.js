const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const data = fs.readFileSync('polla-data.js', 'utf8');
html = html.replace('<script src="polla-data.js"></script>', `<script>\n${data}\n</script>`);
fs.writeFileSync('polla-completa.html', html);
console.log('Creado polla-completa.html (' + (fs.statSync('polla-completa.html').size / 1024).toFixed(0) + ' KB)');
