# Avocado Lab Website

Avocado Lab's English-language company website, featuring Easy MD for iPhone.

## Local preview

```bash
cd /Users/kennytsui/Avocadolab/Website
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Verification

```bash
npm test
node --check assets/site.js
```

The site uses plain HTML, CSS and a small amount of JavaScript. It is published through GitHub Pages with `www.avocado-lab.com` as its custom domain.

## Content notes

- Easy MD is a free, read-only Markdown reader for iPhone and is available on the App Store.
- Product copy and screenshots are based on the current App Store listing and product documentation.
- Support is handled through the published Easy MD support form and `info@avocado-lab.com`.
- The Easy MD privacy policy remains at `/privacy/easy-md/`.
