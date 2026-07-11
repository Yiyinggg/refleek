// Regenerate data/materials.json from fabricsgalore.csv + all_fleek_products.json.
// Run: npm run build:materials

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      if (row.some((x) => x)) rows.push(row);
      row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const reclaimed = [
  { id: 'denim', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek Pakistan', name: 'Denim Panel Lot',
    swBg: '#3C4E67', swImg: 'repeating-linear-gradient(45deg,rgba(255,255,255,.09) 0 1px,transparent 1px 4px),repeating-linear-gradient(-45deg,rgba(0,0,0,.18) 0 1px,transparent 1px 4px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '120 panels' }, { k: 'Panel', v: '45×60cm' }, { k: 'Colour', v: 'Mixed indigo' }],
    best: 'Best for patchwork totes, cushions, jackets, appliqué.' },
  { id: 'shirt', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek India', name: 'Shirt Cotton Bundle',
    swBg: '#E8EDF2', swImg: 'repeating-linear-gradient(90deg,#4E6E9E 0 6px,#E8EDF2 6px 14px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '80 panels' }, { k: 'Panel', v: '40×55cm' }, { k: 'Colour', v: 'Blue stripe' }],
    best: 'Best for patchwork shirts, linings, scarves, accessories.' },
  { id: 'knit', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek Pakistan', name: 'Knit Bundle',
    swBg: '#B9B2A6', swImg: 'radial-gradient(rgba(0,0,0,.14) 1px,transparent 1.6px)', swSize: '6px 6px',
    specs: [{ k: 'Available', v: '25kg' }, { k: 'Type', v: 'Sorted knit' }, { k: 'Colour', v: 'Mixed neutral' }],
    best: 'Best for patchwork cushions, soft accessories, appliqué.' },
  { id: 'corduroy', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek India', name: 'Corduroy Panel Lot',
    swBg: '#6B4F3A', swImg: 'repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 2px,transparent 2px 8px),repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 1px,transparent 1px 8px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '95 panels' }, { k: 'Panel', v: '42×58cm' }, { k: 'Colour', v: 'Mixed earth' }],
    best: 'Best for patchwork jackets, bags, cushion panels, warm accessories.' },
  { id: 'fleece', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek Pakistan', name: 'Fleece Panel Lot',
    swBg: '#9A9E9C', swImg: 'radial-gradient(rgba(255,255,255,.2) 1.5px,transparent 2px),radial-gradient(rgba(0,0,0,.1) 1px,transparent 1.5px)', swSize: '5px 5px',
    specs: [{ k: 'Available', v: '60 panels' }, { k: 'Panel', v: '38×50cm' }, { k: 'Colour', v: 'Mixed grey' }],
    best: 'Best for warm linings, pouches, soft accessories, patchwork throws.' },
  { id: 'wool', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek UK', name: 'Wool Flannel Bundle',
    swBg: '#8B7D72', swImg: 'repeating-linear-gradient(45deg,rgba(255,255,255,.1) 0 3px,transparent 3px 6px),repeating-linear-gradient(-45deg,rgba(0,0,0,.08) 0 3px,transparent 3px 6px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '18kg' }, { k: 'Type', v: 'Sorted flannel' }, { k: 'Colour', v: 'Mixed plaid' }],
    best: 'Best for scarves, warm accessories, patchwork throws, lining panels.' },
  { id: 'sari', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek India', name: 'Sari Silk Bundle',
    swBg: '#B8864E', swImg: 'repeating-linear-gradient(45deg,rgba(255,220,150,.35) 0 2px,transparent 2px 8px),repeating-linear-gradient(-45deg,rgba(180,100,40,.25) 0 2px,transparent 2px 8px),linear-gradient(135deg,rgba(255,255,255,.15) 0%,transparent 50%)', swSize: 'auto',
    specs: [{ k: 'Available', v: '40 panels' }, { k: 'Panel', v: '90×120cm' }, { k: 'Colour', v: 'Mixed jewel' }],
    best: 'Best for scarves, bandanas, decorative cushions, statement accessories.' },
  { id: 'terry', stream: 'reclaimed', sourceLabel: 'Reclaimed · Fleek UK', name: 'Terry Cloth Bundle',
    swBg: '#C8CDD2', swImg: 'repeating-linear-gradient(0deg,rgba(255,255,255,.5) 0 2px,transparent 2px 5px),radial-gradient(rgba(100,110,120,.2) 1px,transparent 2px)', swSize: '4px 4px',
    specs: [{ k: 'Available', v: '30kg' }, { k: 'Type', v: 'Sorted terry' }, { k: 'Colour', v: 'Mixed pastel' }],
    best: 'Best for towels, spa textiles, bath accessories, absorbent home goods.' },
];

const canonicalDeadstock = [
  { id: 'linen', stream: 'new', sourceLabel: 'New Deadstock · Pakistan', name: 'Natural Linen Blend',
    swBg: '#D7CBB2', swImg: 'repeating-linear-gradient(0deg,rgba(255,255,255,.4) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(120,105,80,.28) 0 1px,transparent 1px 3px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '42m' }, { k: 'Width', v: '150cm' }, { k: 'Colour', v: 'Natural beige' }],
    best: 'Best for tablecloths, napkins, aprons, cushion covers.' },
  { id: 'twill', stream: 'new', sourceLabel: 'New Deadstock · India', name: 'Cotton Twill',
    swBg: '#3B3B39', swImg: 'repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 2px,transparent 2px 5px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '60m' }, { k: 'Width', v: '160cm' }, { k: 'Colour', v: 'Charcoal' }],
    best: 'Best for aprons, totes, workwear panels, cushion covers.' },
  { id: 'hemp', stream: 'new', sourceLabel: 'New Deadstock · Turkey', name: 'Hemp Canvas Roll',
    swBg: '#C4B89A', swImg: 'repeating-linear-gradient(0deg,rgba(90,75,55,.22) 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,rgba(90,75,55,.18) 0 1px,transparent 1px 4px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '38m' }, { k: 'Width', v: '140cm' }, { k: 'Colour', v: 'Natural oat' }],
    best: 'Best for totes, aprons, upholstery panels, heavy-duty accessories.' },
  { id: 'poplin', stream: 'new', sourceLabel: 'New Deadstock · Portugal', name: 'Organic Cotton Poplin',
    swBg: '#F2F0E8', swImg: 'repeating-linear-gradient(0deg,rgba(180,175,165,.35) 0 1px,transparent 1px 2px),repeating-linear-gradient(90deg,rgba(180,175,165,.35) 0 1px,transparent 1px 2px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '55m' }, { k: 'Width', v: '150cm' }, { k: 'Colour', v: 'Off-white' }],
    best: 'Best for shirts, linings, bandanas, lightweight home textiles.' },
  { id: 'canvas', stream: 'new', sourceLabel: 'New Deadstock · UK', name: 'Recycled Cotton Canvas',
    swBg: '#D9D2C4', swImg: 'repeating-linear-gradient(45deg,rgba(120,110,95,.15) 0 1px,transparent 1px 5px),repeating-linear-gradient(-45deg,rgba(120,110,95,.12) 0 1px,transparent 1px 5px)', swSize: 'auto',
    specs: [{ k: 'Available', v: '70m' }, { k: 'Width', v: '155cm' }, { k: 'Colour', v: 'Unbleached natural' }],
    best: 'Best for tote bags, workwear, heavy aprons, structured accessories.' },
];

const csv = fs.readFileSync(path.join(ROOT, 'data/fabricsgalore.csv'), 'utf8');
const rows = parseCSV(csv).slice(1);
const deadstock = rows.map((r, i) => ({
  id: 'fg-' + i,
  stream: 'new',
  sourceLabel: 'New Deadstock · Fabrics Galore UK',
  name: (r[4] || 'Deadstock fabric').replace(/^Deadstock /i, '').slice(0, 72),
  swBg: '#D7CBB2',
  swImg: 'url(' + (r[2] || '') + ')',
  swSize: 'cover',
  specs: [{ k: 'Price', v: r[6] || '—' }, { k: 'Label', v: r[1] || '—' }, { k: 'Source', v: 'fabricsgalore.co.uk' }],
  best: ((r[5] || '').replace(/^Fabric Composition - /i, '').slice(0, 90) || 'Deadstock fabric remnant.') + '…',
  productUrl: r[0] || '',
}));

const fleek = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/all_fleek_products.json'), 'utf8'));
const fleekMats = fleek.slice(0, 6).map((p, i) => {
  const img = (p.images || []).find((u) => u && !/fleekLogoBlack/i.test(u)) || (p.images || [])[1] || '';
  return {
    id: 'fleek-' + i,
    stream: 'reclaimed',
    sourceLabel: 'Reclaimed · Fleek',
    name: (p.name || 'Fleek bundle').replace(/^CR\d+\s*/i, '').slice(0, 72),
    swBg: '#8B7D72',
    swImg: img ? 'url(' + img + ')' : 'repeating-linear-gradient(45deg,rgba(255,255,255,.1) 0 3px,transparent 3px 6px)',
    swSize: img ? 'cover' : 'auto',
    specs: [{ k: 'Quantity', v: p.quantity || '—' }, { k: 'Grade', v: p.grade || '—' }, { k: 'Source', v: 'joinfleek.com' }],
    best: ((p.description || '').slice(0, 90) || 'Reclaimed vintage bundle from Fleek.') + '…',
    productUrl: p.url || '',
  };
});

const out = { deadstock: canonicalDeadstock.concat(deadstock), reclaimed: reclaimed.concat(fleekMats) };
fs.writeFileSync(path.join(ROOT, 'data/materials.json'), JSON.stringify(out));
console.log('materials.json →', out.deadstock.length, 'deadstock,', out.reclaimed.length, 'reclaimed');
