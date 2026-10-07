# Avocado Lab Website

Avocado Lab's English-language company website, featuring Easy MD and Flow Squat for iPhone.

## Local preview

```bash
cd /Users/kennytsui/Avocadolab/Website
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Verification

```bash
npm test
node --check assets/site-easy-md.js
```

The site uses plain HTML, CSS and a small amount of JavaScript. It is published through GitHub Pages with `www.avocado-lab.com` as its custom domain.

## Content notes

- The home page gives a concise introduction to both products.
- Easy MD 1.3.1 is a free, read-only Markdown reader for iPhone and is available on the App Store; its detailed page is at `/easy-md/`.
- Flow Squat is in development and is not yet on the App Store; its temporary product page is at `/products/flow-squat/`.
- Product copy and artwork are based on the current project documentation and release records.
- Support and general enquiries use `info@avocado-lab.com`.
- Privacy policies are published at `/privacy/easy-md/` and `/flow-squat/`. The former Flow Squat privacy path at `/privacy/flow-squat/` redirects to the app-compatible URL.
