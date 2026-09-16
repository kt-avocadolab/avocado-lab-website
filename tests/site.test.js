const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("English single-page site exposes every primary navigation destination", () => {
  const html = read("index.html");
  for (const id of ["top", "easy-md", "features", "about", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  for (const href of ["#easy-md", "#features", "#about", "#contact"]) {
    assert.match(html, new RegExp(`href=["']${href}["']`));
  }
});

test("Easy MD replaces the former running product throughout the site", () => {
  const html = read("index.html");
  assert.match(html, /Easy MD/);
  assert.match(html, /Markdown/);
  assert.match(html, /iCloud Drive/);
  assert.doesNotMatch(html, /Flow\s?Running|Flowing Running|flowrunning/i);
});

test("product availability and support links are published", () => {
  const html = read("index.html");
  assert.match(html, /https:\/\/apps\.apple\.com\/app\/id6808278280/);
  assert.match(html, /href=["']privacy\/easy-md\/?["']/);
  assert.match(html, /https:\/\/bit\.ly\/4h5pbPp/);
  assert.match(html, /mailto:info@avocado-lab\.com/);
});

test("document includes essential metadata and accessibility affordances", () => {
  const html = read("index.html");
  assert.match(html, /<html[^>]+lang=["']en["']/);
  assert.match(html, /name=["']description["']/);
  assert.match(html, /property=["']og:title["']/);
  assert.match(html, /property=["']og:image["']/);
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

test("site uses real Easy MD product artwork and screenshots", () => {
  const html = read("index.html");
  const script = read("assets/site-easy-md.js");
  assert.match(html, /assets\/easy-md\/app-icon\.png/);
  assert.match(html, /assets\/easy-md\/01-onboarding\.png/);
  assert.match(html, /assets\/easy-md\/04-reading-notes\.png/);
  assert.doesNotMatch(html, /class=["'][^"']*screen-reel[^"']*reveal/);
  assert.match(script, /IntersectionObserver/);
});

test("styles include responsive and reduced-motion rules", () => {
  const css = read("assets/site-easy-md.css");
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
});

test("Easy MD assets use fresh URLs so the former site cannot survive browser cache", () => {
  const html = read("index.html");
  assert.match(html, /href=["']assets\/site-easy-md\.css["']/);
  assert.match(html, /src=["']assets\/site-easy-md\.js["']/);
  assert.doesNotMatch(html, /assets\/site\.(?:css|js)/);
});

test("the secondary Daily Notes phone keeps a near-natural scale and gentle angle", () => {
  const css = read("assets/site-easy-md.css");
  assert.match(
    css,
    /\.phone-secondary\s*\{[^}]*width:\s*270px;[^}]*transform:\s*rotate\(-3deg\);/s,
  );
  assert.match(css, /\.phone img\s*\{[^}]*height:\s*auto;/s);
});
