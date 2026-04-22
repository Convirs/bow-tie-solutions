#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT          = __dirname;
const TEMPLATES_DIR = path.join(ROOT, '_templates');
const CONFIG_PATH   = path.join(ROOT, 'config.json');

// ── Load config ───────────────────────────────────────────────────────────────
if (!fs.existsSync(CONFIG_PATH)) {
  console.error('Error: config.json not found. Create one before running setup.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const areas  = Array.isArray(config.service_areas) ? config.service_areas : [];

// ── HSL color helpers (derive brand color variants from primary/accent) ────────
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return '#' + [r, g, b]
    .map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0'))
    .join('');
}

// Shift HSL lightness by delta (positive = lighter, negative = darker)
function shiftL(hex, delta) {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, Math.min(100, l + delta)));
}

// ── Build flat token map from all scalar config values ────────────────────────
const tokens = {};

for (const [key, val] of Object.entries(config)) {
  if (typeof val !== 'object') {
    tokens[`{{${key}}}`] = String(val);
  }
}

// ── Brand color tokens ────────────────────────────────────────────────────────
const primary = (config.COLOR_PRIMARY || '#1a3a5c').toLowerCase();
const accent  = (config.COLOR_ACCENT  || '#e8a020').toLowerCase();

tokens['{{COLOR_PRIMARY}}']       = primary;
tokens['{{COLOR_PRIMARY_DARK}}']  = shiftL(primary, -9);   // hover states & dark sections
tokens['{{COLOR_PRIMARY_LIGHT}}'] = shiftL(primary, +13);  // lighter accents
tokens['{{COLOR_ACCENT}}']        = accent;
tokens['{{COLOR_ACCENT_DARK}}']   = shiftL(accent, -9);    // CTA hover
tokens['{{COLOR_BG_ALT}}']        = shiftL(primary, +73);  // subtle section background tint
tokens['{{COLOR_BG_DARK}}']       = shiftL(primary, -9);   // dark section bg (= primary-dark)
tokens['{{COLOR_BG_FOOTER}}']     = shiftL(primary, -17);  // near-black footer

// ── Reviews HTML token ────────────────────────────────────────────────────────
const reviews = Array.isArray(config.reviews) ? config.reviews : [];
tokens['{{REVIEWS_HTML}}'] = reviews.map(r => `      <div class="testimonial-card" data-reveal>
        <div class="testimonial-card__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <blockquote class="testimonial-card__quote">"${r.text}"</blockquote>
        <cite class="testimonial-card__author">— ${r.author}</cite>
        <a href="${r.link}" class="testimonial-card__link" target="_blank" rel="noopener noreferrer">Read review</a>
      </div>`).join('\n');
tokens['{{REVIEWS_CTA_LINK}}'] = reviews.length ? reviews[0].link : '#';

// ── Build dynamic service-area HTML snippets ──────────────────────────────────
tokens['{{SERVICE_AREAS_NAV_HTML}}'] = areas
  .map(a => `<li role="menuitem"><a href="/areas/${a.slug}.html">${a.name}, ${a.state}</a></li>`)
  .join('\n          ');

tokens['{{SERVICE_AREAS_MOBILE_HTML}}'] = areas
  .map(a => `<a href="/areas/${a.slug}.html" class="mobile-nav__link mobile-nav__link--indent">${a.name}, ${a.state}</a>`)
  .join('\n  ');

tokens['{{SERVICE_AREAS_FOOTER_HTML}}'] = [
  `<a href="/index.html">${config.CITY}, ${config.STATE_ABBR}</a>`,
  ...areas.map(a => `<a href="/areas/${a.slug}.html">${a.name}, ${a.state}</a>`)
].join('\n        ');

tokens['{{SERVICE_AREAS_AREA_TAG_HTML}}'] = areas
  .map(a => `<a href="/areas/${a.slug}.html" class="area-tag">${a.name}, ${a.state}</a>`)
  .join('\n      ');

const today = new Date().toISOString().slice(0, 10);
tokens['{{AREA_SITEMAP_ENTRIES}}'] = areas
  .map(a => [
    '  <url>',
    `    <loc>https://${config.DOMAIN}/areas/${a.slug}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>0.7</priority>',
    '  </url>',
  ].join('\n'))
  .join('\n') + '\n';

// ── Token replacement ─────────────────────────────────────────────────────────
function applyTokens(content, extra) {
  const map = extra ? Object.assign({}, tokens, extra) : tokens;
  let result = content;
  for (const [token, value] of Object.entries(map)) {
    result = result.split(token).join(value);
  }
  return result;
}

// ── Directory helpers ─────────────────────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Process a directory of templates recursively ──────────────────────────────
function processDir(srcDir, outDir) {
  ensureDir(outDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const outPath = path.join(outDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'areas') continue; // handled by processAreaPages()
      processDir(srcPath, outPath);
    } else if (/\.(html|xml|css)$/.test(entry.name)) {
      const raw       = fs.readFileSync(srcPath, 'utf8');
      const processed = applyTokens(raw);
      fs.writeFileSync(outPath, processed, 'utf8');
      console.log('  \u2713 ' + path.relative(ROOT, outPath));
    }
  }
}

// ── Generate one area page per service_area entry ─────────────────────────────
function processAreaPages() {
  const templatePath = path.join(TEMPLATES_DIR, 'areas', 'area-page.html');
  if (!fs.existsSync(templatePath)) {
    console.warn('  \u26a0 _templates/areas/area-page.html not found \u2014 skipping area pages');
    return;
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  const outDir   = path.join(ROOT, 'areas');
  ensureDir(outDir);

  for (const area of areas) {
    const otherAreas = areas.filter(a => a.slug !== area.slug);
    const alsoLinks  = otherAreas
      .map(a => `<a href="/areas/${a.slug}.html" class="area-tag">${a.name}</a>`)
      .join('\n      ');

    const extra = {
      '{{AREA_NAME}}':          area.name,
      '{{AREA_STATE_ABBR}}':    area.state,
      '{{AREA_STATE_FULL}}':    area.state_full || config.STATE_FULL || area.state,
      '{{AREA_SLUG}}':          area.slug,
      '{{ALSO_SERVING_LINKS}}': alsoLinks,
      '{{AREA_MAP_EMBED_SRC}}': area.map_embed || '',
    };

    const processed = applyTokens(template, extra);
    const outPath   = path.join(outDir, `${area.slug}.html`);
    fs.writeFileSync(outPath, processed, 'utf8');
    console.log('  \u2713 areas/' + area.slug + '.html');
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log('\nBuilding site from templates...\n');

if (!fs.existsSync(TEMPLATES_DIR)) {
  console.error('Error: _templates/ directory not found.');
  process.exit(1);
}

processDir(TEMPLATES_DIR, ROOT);
processAreaPages();

console.log('\nDone. All pages generated.\n');
