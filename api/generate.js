// Vercel serverless function — proxies image generation to OpenRouter.
// The OPENROUTER_API_KEY env var stays server-side; the browser only talks to /api/generate.
// Without a key it returns a deterministic mock image so the workflow can be demoed offline.

const MODELS = [
  process.env.OPENROUTER_IMAGE_MODEL,
  'google/gemini-2.5-flash-image',
  'google/gemini-2.5-flash-image-preview',
].filter(Boolean);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { prompt, image, mode } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return res.status(200).json({ image: mockImage(prompt, mode), model: 'mock', mock: true });
  }

  const content = [{ type: 'text', text: prompt }];
  if (image) content.push({ type: 'image_url', image_url: { url: image } });

  let lastError = 'No model produced an image';
  for (const model of MODELS) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + key,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://refleek.vercel.app',
          'X-Title': 'ReFleek',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content }],
          modalities: ['image', 'text'],
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        lastError = (j.error && j.error.message) || 'OpenRouter HTTP ' + r.status;
        continue;
      }
      const img =
        j.choices &&
        j.choices[0] &&
        j.choices[0].message &&
        j.choices[0].message.images &&
        j.choices[0].message.images[0] &&
        j.choices[0].message.images[0].image_url &&
        j.choices[0].message.images[0].image_url.url;
      if (img) return res.status(200).json({ image: img, model });
      lastError = 'Model ' + model + ' returned no image';
    } catch (e) {
      lastError = String((e && e.message) || e);
    }
  }
  return res.status(502).json({ error: lastError });
};

// Deterministic placeholder artwork (SVG data URL) keyed off the prompt,
// so the demo flow works end-to-end before the API key is configured.
function mockImage(prompt, mode) {
  let h = 0;
  for (let i = 0; i < prompt.length; i++) h = (h * 31 + prompt.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const laser = /laser|monochrome|line art/i.test(prompt);
  const emb = /embroider/i.test(prompt);
  const c1 = laser ? '#5a4b32' : 'hsl(' + hue + ',38%,42%)';
  const c2 = laser ? '#d7cbb2' : 'hsl(' + ((hue + 40) % 360) + ',30%,72%)';
  let motifs = '';
  for (let i = 0; i < 9; i++) {
    const x = 90 + (i % 3) * 160, y = 90 + Math.floor(i / 3) * 160;
    const r = 28 + ((h >> (i % 8)) % 26);
    motifs += emb
      ? '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="' + c1 + '" stroke-width="5" stroke-dasharray="7 6"/>'
      : '<rect x="' + (x - r) + '" y="' + (y - r) + '" width="' + r * 2 + '" height="' + r * 2 + '" fill="none" stroke="' + c1 + '" stroke-width="' + (laser ? 3 : 8) + '" transform="rotate(' + ((h + i * 37) % 90) + ' ' + x + ' ' + y + ')"/>';
  }
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
    '<rect width="512" height="512" fill="' + c2 + '"/>' + motifs +
    '<text x="256" y="492" font-family="monospace" font-size="20" fill="' + c1 + '" text-anchor="middle">MOCK ' + (mode || 'pattern').toUpperCase() + ' — set OPENROUTER_API_KEY</text></svg>';
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}
