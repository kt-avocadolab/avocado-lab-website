const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("single-page site exposes every primary navigation destination", () => {
  const html = read("index.html");
  for (const id of ["top", "flowrunning", "about", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  for (const href of ["#flowrunning", "#about", "#contact"]) {
    assert.match(html, new RegExp(`href=["']${href}["']`));
  }
});

test("beta and collaboration calls to action use the published contact address", () => {
  const html = read("index.html");
  const matches = html.match(/mailto:info@avocado-lab\.com/g) || [];
  assert.ok(matches.length >= 2, "expected at least two email calls to action");
  assert.doesNotMatch(html, /kt@avocado-lab\.com/);
});

test("product status is honest about MVP availability", () => {
  const html = read("index.html");
  assert.match(html, /iOS MVP/);
  assert.match(html, /內部測試/);
  assert.doesNotMatch(html, /立即下載|Download on the App Store/);
});

test("document includes essential metadata and accessibility affordances", () => {
  const html = read("index.html");
  assert.match(html, /<html[^>]+lang=["']zh-Hant["']/);
  assert.match(html, /name=["']description["']/);
  assert.match(html, /property=["']og:title["']/);
  assert.match(html, /<a[^>]+class=["'][^"']*skip-link/);
  assert.match(html, /aria-label=/);
  assert.match(html, /prefers-reduced-motion/);
});

test("all local assets referenced by HTML exist", () => {
  const html = read("index.html");
  const references = [...html.matchAll(/(?:src|href)=["'](?!https?:|mailto:|#)([^"']+)["']/g)]
    .map((match) => match[1].split("?")[0])
    .filter((reference) => !reference.startsWith("data:"));

  for (const reference of references) {
    assert.ok(fs.existsSync(path.join(root, reference)), `missing local asset: ${reference}`);
  }
});

test("site does not publish provisional app interface previews", () => {
  const html = read("index.html");
  const script = read("assets/site.js");
  assert.doesNotMatch(html, /class=["'][^"']*phone(?:\s|["'])/);
  assert.doesNotMatch(html, /data-preview|role=["']tab(?:list|panel)?["']/);
  assert.doesNotMatch(script, /previewTabs|selectPreview|data-preview/);
  assert.match(script, /IntersectionObserver/);
});

test("styles include responsive and reduced-motion rules", () => {
  const css = read("assets/site.css");
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
});
