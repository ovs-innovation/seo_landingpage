import { mountCharacter } from "./character-3d.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function init() {
  if (reduced) return;

  const finaleCanvas = document.getElementById("finaleCharacterCanvas");
  if (finaleCanvas) {
    await mountCharacter(finaleCanvas, { scale: 0.5, yOffset: -0.82, xOffset: -0.2 });
  }

  const finaleSection = document.getElementById("finale");
  if (finaleSection && typeof IntersectionObserver !== "undefined") {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            document.getElementById("finale3dStage")?.classList.add("is-active");
            document.getElementById("siteHeader")?.classList.add("on-finale");
            window.dispatchEvent(new CustomEvent("finale-visible"));
          } else {
            document.getElementById("siteHeader")?.classList.remove("on-finale");
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(finaleSection);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
