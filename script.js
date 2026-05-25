/* VastoraTech — Lusion-style immersive interactions */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ——— Preloader ——— */
  const preloader = document.getElementById("preloader");
  const progressBar = document.getElementById("preloaderProgress");
  const progressPct = document.getElementById("preloaderPct");
  let loadProgress = 0;

  const progressInterval = setInterval(() => {
    loadProgress += Math.random() * 12 + 4;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(progressInterval);
      finishLoad();
    }
    if (progressBar) progressBar.style.width = `${loadProgress}%`;
    if (progressPct) progressPct.textContent = `${Math.floor(loadProgress)}%`;
  }, 80);

  function finishLoad() {
    document.body.classList.remove("is-loading");
    document.body.classList.add("loaded");
    setTimeout(() => {
      if (preloader) preloader.setAttribute("aria-hidden", "true");
    }, 900);
    initApp();
  }

  window.addEventListener("load", () => {
    if (loadProgress < 100) {
      loadProgress = 100;
      clearInterval(progressInterval);
      if (progressBar) progressBar.style.width = "100%";
      if (progressPct) progressPct.textContent = "100%";
      finishLoad();
    }
  });

  function initApp() {
    initLenis();
    initCursor();
    initScrollAnimations();
    initHorizontalDrag();
    initServiceFilters();
    initTilt();
    initMagnetic();
    initScrollButtons();
    initMenu();
    initHeader();
    initCounters();
    initForm();
  }

  if (document.body.classList.contains("loaded")) {
    initApp();
  }

  /* ——— Lenis smooth scroll ——— */
  let lenis;
  function initLenis() {
    if (prefersReducedMotion || typeof Lenis === "undefined") return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ——— Custom cursor ——— */
  function initCursor() {
    if (isTouch || prefersReducedMotion) return;

    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    });

    const hoverables = "a, button, [data-magnetic], .work-card, .service-card";
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });

    function tick() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ——— GSAP ScrollTrigger ——— */
  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll(".reveal-up").forEach((el) => el.classList.add("visible"));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    gsap.utils.toArray(".headline-clear").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });

    const contact = document.getElementById("contact");
    const ctaTitle = document.getElementById("ctaTitle");
    if (contact && ctaTitle) {
      gsap.from(ctaTitle, {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: contact, start: "top 80%" },
      });
    }
  }

  /* ——— Horizontal drag scroll ——— */
  function initHorizontalDrag() {
    document.querySelectorAll(".horizontal-wrap").forEach((wrap) => {
      let isDown = false;
      let startX;
      let scrollLeft;

      wrap.addEventListener("mousedown", (e) => {
        isDown = true;
        wrap.classList.add("is-dragging");
        startX = e.pageX - wrap.offsetLeft;
        scrollLeft = wrap.scrollLeft;
      });

      wrap.addEventListener("mouseleave", () => {
        isDown = false;
        wrap.classList.remove("is-dragging");
      });

      wrap.addEventListener("mouseup", () => {
        isDown = false;
        wrap.classList.remove("is-dragging");
      });

      wrap.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrap.offsetLeft;
        const walk = (x - startX) * 1.5;
        wrap.scrollLeft = scrollLeft - walk;
      });
    });
  }

  /* ——— Service filters ——— */
  function initServiceFilters() {
    const pills = document.querySelectorAll(".pill");
    const cards = document.querySelectorAll(".service-card");
    if (!pills.length) return;

    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const filter = pill.getAttribute("data-filter");

        cards.forEach((card) => {
          const cats = card.getAttribute("data-category") || "";
          const show = filter === "all" || cats.includes(filter);
          card.classList.toggle("hidden", !show);
        });
      });
    });
  }

  /* ——— 3D tilt on cards ——— */
  function initTilt() {
    if (isTouch || prefersReducedMotion) return;

    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ——— Magnetic elements ——— */
  function initMagnetic() {
    if (isTouch || prefersReducedMotion) return;

    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ——— Scroll to section ——— */
  function initScrollButtons() {
    document.querySelectorAll("[data-scroll]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-scroll");
        const target = document.getElementById(id);
        if (!target) return;
        if (lenis) lenis.scrollTo(target, { offset: -80 });
        else target.scrollIntoView({ behavior: "smooth" });
        closeMenu();
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: -80 });
          else target.scrollIntoView({ behavior: "smooth" });
          closeMenu();
        }
      });
    });
  }

  /* ——— Fullscreen menu ——— */
  const menuToggle = document.getElementById("menuToggle");
  const menuPanel = document.getElementById("menuPanel");

  function closeMenu() {
    menuPanel?.classList.remove("open");
    menuPanel?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function initMenu() {
    menuToggle?.addEventListener("click", () => {
      const open = menuPanel?.classList.toggle("open");
      menuPanel?.setAttribute("aria-hidden", open ? "false" : "true");
      if (!document.body.classList.contains("is-loading")) {
        document.body.style.overflow = open ? "hidden" : "";
      }
    });
  }

  /* ——— Header hide on scroll ——— */
  function initHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y > lastY && y > 200) header.classList.add("hidden");
      else header.classList.remove("hidden");
      lastY = y;
    };

    if (lenis) {
      lenis.on("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ——— Counters ——— */
  function initCounters() {
    const els = document.querySelectorAll("[data-count]");
    const animate = (el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const suffix = el.getAttribute("data-suffix") || "";
      if (isNaN(target)) return;

      if (typeof gsap !== "undefined") {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toLocaleString() + suffix;
          },
        });
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      els.forEach(animate);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.done) {
            entry.target.dataset.done = "1";
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    els.forEach((el) => obs.observe(el));
  }

  /* ——— Form → WhatsApp ——— */
  const WA_NUMBER = "918595658592";
  const GOAL_LABELS = {
    traffic: "More organic traffic",
    leads: "More leads & calls",
    local: "Local / Maps SEO",
    technical: "Technical SEO fixes",
  };

  function buildWhatsAppMessage(form) {
    const fd = new FormData(form);
    const lines = [
      "Hi VastoraTech,",
      "I'd like a free SEO audit / consultation.",
      "",
      `Name: ${(fd.get("name") || "").toString().trim()}`,
      `Email: ${(fd.get("email") || "").toString().trim()}`,
    ];
    const website = (fd.get("website") || "").toString().trim();
    if (website) lines.push(`Website: ${website}`);
    const phone = (fd.get("phone") || "").toString().trim();
    if (phone) lines.push(`Phone: ${phone}`);
    const goal = (fd.get("goal") || "").toString().trim();
    if (goal) lines.push(`Goal: ${GOAL_LABELS[goal] || goal}`);
    const message = (fd.get("message") || "").toString().trim();
    if (message) {
      lines.push("", "Message:", message);
    }
    return lines.join("\n");
  }

  function initForm() {
    const form = document.getElementById("leadForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = encodeURIComponent(buildWhatsAppMessage(form));
      window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");

      const btn = form.querySelector(".btn-contact-submit, .btn-lusion, .btn-submit, .btn-dark, .btn-primary");
      if (btn) {
        const origHtml = btn.innerHTML;
        btn.innerHTML = "<span>Opening WhatsApp…</span>";
        btn.disabled = true;
        form.reset();
        setTimeout(() => {
          btn.innerHTML = origHtml;
          btn.disabled = false;
        }, 3500);
      }
    });
  }
})();
