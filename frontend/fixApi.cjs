const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function replaceUrl(d) {
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      replaceUrl(p);
    } else if (p.endsWith('.jsx') || p.endsWith('.js')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('http://localhost:5000')) {
        content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}$1`');
        fs.writeFileSync(p, content);
        console.log('Updated', p);
      }
    }
  });
}

replaceUrl(dir);
console.log('Done replacing URLs');
