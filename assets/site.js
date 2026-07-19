document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll("[data-reveal]");
const previewTabs = [...document.querySelectorAll("[data-preview]")];
const previewPanels = [...document.querySelectorAll("[data-panel]")];
const previewCaption = document.querySelector("[data-preview-caption]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const captions = {
  today: "今天 · 跑完後立即看懂表現",
  training: "訓練 · 一眼掌握本週節奏",
  analysis: "教練分析 · 從數據找到下一步",
};

function selectPreview(tab, moveFocus = false) {
  const selected = tab.dataset.preview;

  previewTabs.forEach((candidate) => {
    const isSelected = candidate === tab;
    candidate.setAttribute("aria-selected", String(isSelected));
    candidate.tabIndex = isSelected ? 0 : -1;
  });

  previewPanels.forEach((panel) => {
    const isSelected = panel.dataset.panel === selected;
    panel.hidden = !isSelected;
  });

  if (previewCaption) previewCaption.textContent = captions[selected];
  if (moveFocus) tab.focus();
}

previewTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectPreview(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + previewTabs.length) % previewTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % previewTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = previewTabs.length - 1;
    selectPreview(previewTabs[nextIndex], true);
  });
});

if (previewTabs.length) selectPreview(previewTabs[0]);

if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -36px" });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function updateHeader() {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
