const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertPageBasics(relativePath) {
  const html = read(relativePath);
  assert.match(html, /<html[^>]+lang=["']en["']/);
  assert.match(html, /name=["']description["']/);
  assert.match(html, /<a[^>]+class=["'][^"']*skip-link/);
  assert.match(html, /aria-label=/);
}

test("home introduces Avocado Lab products and links to their pages", () => {
  const html = read("index.html");
  assert.match(html, /Easy MD/);
  assert.match(html, /Flow Squat/);
  assert.match(html, /Training Beat/);
  assert.match(html, /Optional workout recording/i);
  assert.match(html, /href=["']easy-md\/["']/);
  assert.match(html, /href=["']flow-squat\/["']/);
  assert.match(html, /href=["']training-beat\/["']/);
  assert.doesNotMatch(html, /Flow\s?Running|Flowing Running/i);
});

test("Training Beat product page presents planned features and pre-release status honestly", () => {
  const html = read("training-beat/index.html");
  assert.match(html, /Training Beat/);
  assert.match(html, /https:\/\/www\.avocado-lab\.com\/training-beat\//);
  assert.match(html, /iPhone \+ iPad/);
  assert.match(html, /iPhone &amp; iPad/);
  assert.match(html, /Pre-release/);
  assert.match(html, /Planned for v1\.0/);
  assert.match(html, /not yet available on the App Store or TestFlight/i);
  assert.match(html, /href=["']\.\.\/privacy\/training-beat\/["']/);
  assert.doesNotMatch(html, /apps\.apple\.com|testflight\.apple\.com/i);
});


test("former Training Beat privacy path redirects to the canonical page", () => {
  const html = read("privacy/training-tempo/index.html");
  assert.match(html, /url=\.\.\/training-beat\//i);
  assert.match(html, /https:\/\/www\.avocado-lab\.com\/privacy\/training-beat\//);
});

test("former Training Beat product path redirects to the canonical page", () => {
  const html = read("training-tempo/index.html");
  assert.match(html, /url=\.\.\/training-beat\//i);
  assert.match(html, /https:\/\/www\.avocado-lab\.com\/training-beat\//);
});

test("Easy MD has a detailed v1.3.1 product page", () => {
  const html = read("easy-md/index.html");
  assert.match(html, /Version 1\.3\.1/);
  assert.match(html, /speech controls/i);
  assert.match(html, /focus mode/i);
  assert.match(html, /folder history/i);
  assert.match(html, /filter/i);
  assert.match(html, /https:\/\/apps\.apple\.com\/app\/id6808278280/);
  assert.match(html, /href=["']\.\.\/privacy\/easy-md\/["']/);
});

test("Flow Squat page reflects the live version, in-review update, and App Store link", () => {
  const html = read("flow-squat/index.html");
  assert.match(html, /Flow Squat/);
  assert.match(html, /Available now · Version 1\.0\.1/i);
  assert.match(html, /Version 1\.0\.2 · In App Review/i);
  assert.match(html, /VALID/);
  assert.match(html, /NO REP/);
  assert.match(html, /on your device/i);
  assert.match(html, /Recording off by default/i);
  assert.match(html, /Photos add access only for optional recording/i);
  assert.doesNotMatch(html, /No recording|does not record video|No Photos library/i);
  assert.match(html, /href=["']\.\.\/privacy\/flow-squat\/["']/);
  assert.match(html, /https:\/\/apps\.apple\.com\/hk\/app\/flow-squat\/id6819667705/);
  assert.match(html, /not (?:an official|affiliated)/i);
});

test("Flow Squat privacy policy documents camera, optional recording and local session data", () => {
  const html = read("privacy/flow-squat/index.html");
  assert.match(html, /Privacy Policy for Flow Squat/);
  assert.match(html, /front camera/i);
  assert.match(html, /does not upload the live camera feed/i);
  assert.match(html, /Record Workout/i);
  assert.match(html, /Record Workout is off by default/i);
  assert.match(html, /In version 1\.0\.1, the video is saved to Photos automatically/i);
  assert.match(html, /Auto-Save Video to Photos is a separate setting in version 1\.0\.2, off by default/i);
  assert.match(html, /iOS share sheet/i);
  assert.match(html, /Avocado Lab does not receive, upload, or view your videos/i);
  assert.doesNotMatch(html, /saves it to your photo library when the set ends/i);
  assert.match(html, /training sessions/i);
  assert.match(html, /No account/i);
  assert.match(html, /No analytics/i);
  assert.match(html, /mailto:info@avocado-lab\.com/);
  assert.match(html, /https:\/\/www\.avocado-lab\.com\/privacy\/flow-squat\//);
});

test("the former Flow Squat product path redirects to the canonical product URL", () => {
  const html = read("products/flow-squat/index.html");
  assert.match(html, /url=\.\.\/\.\.\/flow-squat\//i);
  assert.match(html, /https:\/\/www\.avocado-lab\.com\/flow-squat\//);
});

test("Easy MD privacy page preserves current local-storage and advertising disclosures", () => {
  const html = read("privacy/easy-md/index.html");
  for (const disclosure of [
    "October 6, 2026",
    "display name",
    "Favorites",
    "ten most recently opened documents",
    "reading position",
    "launch preference",
    "line spacing",
    "background",
    "relative to the folder you authorized",
    "Photos Add-only permission",
    "not sent to Avocado Lab",
    "Google Mobile Ads",
    "If you decline tracking",
  ]) {
    assert.match(html, new RegExp(disclosure));
  }
});

test("Easy MD 1.3.1 product copy and 1.3.2 privacy disclosure remain distinct", () => {
  const product = read("easy-md/index.html");
  const policy = read("privacy/easy-md/index.html");
  assert.match(product, /Version 1\.3\.1/);
  assert.match(policy, /Starting with version 1\.3\.2, the free app shows banner advertisements in Favorites/);
  assert.match(policy, /If you allow tracking, Google may use the advertising identifier for tracking/);
  assert.match(policy, /If you decline tracking, eligible ads may still appear/);
});

test("every public page includes core metadata and accessibility affordances", () => {
  for (const page of [
    "index.html",
    "easy-md/index.html",
    "flow-squat/index.html",
    "training-beat/index.html",
    "privacy/flow-squat/index.html",
    "privacy/easy-md/index.html",
    "privacy/training-beat/index.html",
  ]) {
    assertPageBasics(page);
  }
});

test("all local assets and page links referenced by HTML exist", () => {
  const pages = [
    "index.html",
    "easy-md/index.html",
    "products/flow-squat/index.html",
    "flow-squat/index.html",
    "training-beat/index.html",
    "training-tempo/index.html",
    "privacy/easy-md/index.html",
    "privacy/flow-squat/index.html",
    "privacy/training-beat/index.html",
  ];

  for (const page of pages) {
    const html = read(page);
    const pageDirectory = path.dirname(path.join(root, page));
    const references = [...html.matchAll(/(?:src|href)=["'](?!https?:|mailto:|#)([^"']+)["']/g)]
      .map((match) => match[1].split(/[?#]/)[0])
      .filter(Boolean);

    for (const reference of references) {
      assert.ok(
        fs.existsSync(path.resolve(pageDirectory, reference)),
        `${page} references missing local asset or page: ${reference}`,
      );
    }
  }
});

test("site keeps real product artwork and uses shared responsive styles", () => {
  const home = read("index.html");
  const easyMD = read("easy-md/index.html");
  const flowSquat = read("flow-squat/index.html");
  const trainingBeat = read("training-beat/index.html");
  const css = read("assets/avocado-lab.css");
  const script = read("assets/site-easy-md.js");

  assert.match(home, /assets\/easy-md\/app-icon\.png/);
  assert.match(home, /assets\/flow-squat\/app-icon\.png/);
  assert.match(easyMD, /\.\.\/assets\/easy-md\/04-reading-notes\.png/);
  assert.match(flowSquat, /\.\.\/assets\/flow-squat\/app-icon\.png/);
  assert.match(trainingBeat, /tempo-visual/);
  assert.match(trainingBeat, /prefers-reduced-motion|assets\/avocado-lab\.css/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(script, /IntersectionObserver/);
});

test("the secondary Easy MD phone keeps its natural scale and gentle angle", () => {
  const css = read("assets/avocado-lab.css");
  assert.match(css, /\.phone-secondary\s*\{[^}]*width:\s*270px;[^}]*rotate\(-3deg\)/s);
  assert.match(css, /\.phone img\s*\{[^}]*height:\s*auto;/s);
});
