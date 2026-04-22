# Convirs - Website Template Documentation

## Overview
This is a **master template** for electrician websites. Business info lives in `config.json`.
Run `npm run setup` to regenerate all HTML from templates. Use `npm run init-electrician` to spin up a new client site from scratch.

---

## Demo Site (A+ Electrical)
- **Business Name:** A+ Electrical Service
- **Phone:** (385) 439-0465
- **Domain:** apluselectricut.com
- **Location:** Layton, UT 84041
- **Service Areas:** Ogden UT, Eagle Mountain UT, Salt Lake City UT
- **Hours:** Mon–Thu 9AM–5PM | Fri 9AM–3PM | Sat–Sun Closed
- **Brand Color:** Navy Blue #1a3a5c
- **Demo mode:** On (gold banner shown at top)

---

## File Structure
```
post-electric/               ← MASTER TEMPLATE — never deploy this directly
├── config.json              ← All business info lives here (edit this)
├── setup.js                 ← Regenerates HTML from templates
├── init-electrician.js      ← Creates new client project (interactive)
├── package.json             ← npm run setup | npm run init-electrician
│
├── _templates/              ← Source templates — edit here, never edit generated files
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── sitemap.xml
│   ├── css/
│   │   └── variables.css    ← Color token template (generates css/variables.css)
│   ├── services/            ← 6 service page templates
│   ├── projects/
│   │   ├── index.html
│   │   └── PROJECT-TEMPLATE.html
│   └── areas/
│       └── area-page.html   ← Single template generates N area pages
│
├── index.html               ← Generated (do not edit — edit _templates/ instead)
├── about.html
├── contact.html
├── sitemap.xml
├── vercel.json
│
├── areas/                   ← Generated area pages
│   ├── purdy.html
│   ├── pierce-city.html
│   └── aurora.html
├── services/
│   ├── residential-electric.html
│   ├── commercial-electric.html
│   ├── industrial-electric.html
│   ├── emergency-electrical.html
│   ├── ev-electrical.html
│   └── generators.html
├── projects/
│   ├── index.html
│   └── PROJECT-TEMPLATE.html
│
├── css/
│   ├── variables.css        ← Generated from _templates/css/variables.css (do not edit)
│   └── style.css
├── js/
│   ├── main.js              ← Nav, FAQ accordion, scroll reveal
│   └── demo-banner.js       ← Shows demo banner when DEMO=true in config
└── images/
    ├── logo.webp
    ├── favicon.svg
    ├── hero-bg.webp
    ├── about-team.webp
    └── og-image.jpg
```

---

## config.json Tokens
All `{{TOKEN}}` placeholders in `_templates/` are replaced by `setup.js`:

| Token | Description | Demo Value |
|---|---|---|
| `{{BUSINESS_NAME}}` | Business name | Convirs Electric |
| `{{PHONE_DISPLAY}}` | Phone (formatted) | (417) 319-4950 |
| `{{PHONE_TEL}}` | Phone digits only | 4173194950 |
| `{{CITY}}` | Primary city | Monett |
| `{{STATE_ABBR}}` | State abbreviation | MO |
| `{{STATE_FULL}}` | State full name | Missouri |
| `{{ZIP}}` | ZIP code | 65708 |
| `{{DOMAIN}}` | Domain without https:// | demo-eletrical.vercel.app |
| `{{HOURS_WEEKDAY}}` | Weekday hours | Mon–Fri 8AM–5PM |
| `{{HOURS_FRIDAY}}` | Friday hours | (empty) |
| `{{GHL_FORM_URL}}` | GoHighLevel form embed URL | (empty) |
| `{{DEMO}}` | Show demo banner (true/false) | true |
| `{{DEMO_CONTACT_URL}}` | Demo banner link URL | https://tge.convirs.com/... |
| `{{DEMO_CONTACT_TEXT}}` | Demo banner link text | Want a site like this? |
| `{{COLOR_PRIMARY}}` | Brand primary color hex | #1a3a5c |
| `{{COLOR_ACCENT}}` | CTA/accent color hex | #E8A020 |
| `{{MAP_EMBED_SRC}}` | Homepage Google Maps embed src URL | (Monett embed) |
| `{{REVIEWS_HTML}}` | Generated from `reviews[]` array — 3 testimonial cards | (generated) |
| `{{REVIEWS_CTA_LINK}}` | "Read More Reviews" button link (first review's link) | (generated) |

**Derived color tokens** (computed automatically from `COLOR_PRIMARY` and `COLOR_ACCENT`):

| Token | Description |
|---|---|
| `{{COLOR_PRIMARY_DARK}}` | Primary −9% lightness (hover/dark sections) |
| `{{COLOR_PRIMARY_LIGHT}}` | Primary +13% lightness (accents) |
| `{{COLOR_ACCENT_DARK}}` | Accent −9% lightness (CTA hover) |
| `{{COLOR_BG_ALT}}` | Primary +73% lightness (subtle section tint) |
| `{{COLOR_BG_DARK}}` | Same as COLOR_PRIMARY_DARK |
| `{{COLOR_BG_FOOTER}}` | Primary −17% lightness (near-black footer) |

**`reviews` array** — each entry: `{ "text": "...", "author": "First Name", "link": "https://..." }`

Service areas are defined as a JSON array in `config.json` and generate:
- `{{SERVICE_AREAS_NAV_HTML}}` — desktop nav dropdown items
- `{{SERVICE_AREAS_MOBILE_HTML}}` — mobile nav links
- `{{SERVICE_AREAS_FOOTER_HTML}}` — footer area links
- `{{SERVICE_AREAS_AREA_TAG_HTML}}` — homepage area tag chips
- `{{AREA_SITEMAP_ENTRIES}}` — sitemap.xml URL entries
- Individual area pages (`areas/{slug}.html`) from `_templates/areas/area-page.html`

Per-area tokens (used in `areas/area-page.html`):
- `{{AREA_MAP_EMBED_SRC}}` — from `map_embed` field on each service area object

---

## Workflow: Update This Demo Site

1. Edit `config.json` (change business name, phone, hours, etc.)
2. Run: `npm run setup`
3. Commit and push — Vercel auto-deploys

**To edit page content:** Edit files in `_templates/`, then run `npm run setup`.
**Never edit generated HTML files directly** — changes will be overwritten next time setup runs.

---

## Workflow: Create a New Client Site

### Prerequisites (one-time setup)
```bash
# GitHub CLI
brew install gh
gh auth login
# → Select: GitHub.com → HTTPS → Login with browser → sign in as Convirs

# Vercel CLI (if not already installed)
npm i -g vercel
vercel login
```

### Create a new client
```bash
# From this master template folder:
npm run init-electrician
```

The script will prompt for:
- Business name, phone, city, state, ZIP, domain
- Hours (weekday + Friday)
- GHL form URL (optional)
- Demo mode on/off
- Up to 4 service areas (name + slug)
- Brand colors: primary hex + accent hex
- 3 customer reviews (text, first name, link) × 3
- Homepage Google Maps embed src URL
- Per-area Google Maps embed src URL (one per service area)
- GitHub repo name
- Output folder path

Then automatically:
1. Creates the client folder with all 14+ HTML pages
2. Inits git + commits
3. Creates `github.com/Convirs/{repo-name}`
4. Deploys to Vercel

### Re-customize an existing client site
```bash
cd /path/to/client-folder
# Edit config.json with new values
npm run setup
git add . && git commit -m "Update business info" && git push
# Vercel auto-deploys on push
```

---

## Adding Project Pages

1. Copy `_templates/projects/PROJECT-TEMPLATE.html` to `projects/your-project-slug.html`
2. Replace all `[[PROJECT_...]]` placeholders with real content:
   - `[[PROJECT_SERVICE]]` — type of service (e.g., "Panel Upgrade")
   - `[[PROJECT_CITY]]` — where the job was done
   - `[[PROJECT_SUBTEXT]]` — one-line summary
   - `[[PROJECT_SLUG]]` — URL slug for this page
   - `[[PROJECT_SERVICE_TYPE]]` — service category
   - `[[PROJECT_DESCRIPTION]]` — short description for schema
   - `[[PROJECT_AREA]]` — neighborhood/area
   - `[[PROJECT_SCOPE]]` — scope of work
   - `[[PROJECT_DATE]]` — "Month Year" completed
   - `[[PROJECT_BEFORE_IMG]]` / `[[PROJECT_AFTER_IMG]]` — image filenames
   - `[[PROJECT_HEADING]]` — h2 for the write-up
   - `[[PROJECT_P1]]`, `[[PROJECT_P2]]`, `[[PROJECT_P3]]` — body paragraphs
   - `[[PROJECT_SERVICE_PAGE]]` — service page filename (e.g., residential-electric)
   - `[[PROJECT_MAP_EMBED]]` — Google Maps embed src params
3. Add a project card to `projects/index.html`
4. Add the URL to `sitemap.xml`

---

## Adding the GHL Form

1. Open `_templates/contact.html`
2. Find the `<!-- GHL FORM PLACEHOLDER -->` comment
3. Replace the placeholder `<div>` with:
   ```html
   <iframe src="{{GHL_FORM_URL}}"
     width="100%" height="700" frameborder="0"
     style="border:none; width:100%; min-height:700px;">
   </iframe>
   ```
4. Set `GHL_FORM_URL` in `config.json`
5. Run `npm run setup`

---

## Color Palette
Set `COLOR_PRIMARY` and `COLOR_ACCENT` in `config.json`. All other color variants are derived automatically by `setup.js` using HSL lightness shifts.

- `COLOR_PRIMARY` — main brand color (e.g. `#1a3a5c` navy blue)
- `COLOR_ACCENT` — CTA/button color (e.g. `#E8A020` gold)

Derived variants (do not set manually):
- Primary Dark: primary −9% L
- Primary Light: primary +13% L
- Accent Dark: accent −9% L
- BG Alt: primary +73% L (subtle section tint)
- BG Dark: primary −9% L (dark sections)
- BG Footer: primary −17% L (near-black)

**To change colors:** Edit `COLOR_PRIMARY` / `COLOR_ACCENT` in `config.json`, then run `npm run setup`.
**Do not edit** `css/variables.css` directly — it is a generated file overwritten by `npm run setup`.
The source template is `_templates/css/variables.css`.

---

## Images Needed (per client)
- `logo.webp` — Company logo (200×200px, transparent background)
- `favicon.svg` — Browser tab icon
- `hero-bg.webp` — Homepage hero background (1920×1080px)
- `about-team.webp` — Team/owner photo (portrait orientation)
- `og-image.jpg` — Social share image (1200×630px)
