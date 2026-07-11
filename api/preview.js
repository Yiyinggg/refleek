// Product photorealistic preview — Render node (Nº07).
// Accepts { prompt, image? } and always generates a product render.
// Shares the OpenRouter proxy in api/generate.js; without a key returns mock output.

const generate = require('./generate.js');

module.exports = async (req, res) => {
  if (req.body && typeof req.body === 'object') {
    req.body.mode = 'render';
  } else {
    req.body = { mode: 'render' };
  }
  return generate(req, res);
};
