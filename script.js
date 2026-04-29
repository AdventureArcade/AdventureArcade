// ---------- Custom cursor ----------
(function () {
  const ring = document.querySelector(".cursor");
  const dot = document.querySelector(".cursor-dot");
  if (!ring || !dot) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function frame() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    dotX += (mouseX - dotX) * 0.55;
    dotY += (mouseY - dotY) * 0.55;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    requestAnimationFrame(frame);
  }
  frame();

  const hoverables = "a, button, .card, .game-card, .btn";
  document.querySelectorAll(hoverables).forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
})();

// ---------- Reveal on scroll ----------
(function () {
  const targets = document.querySelectorAll(
    ".section-heading, .about-text, .stats, .card, .game-card, .contact-title, .contact-sub, .contact-mail, .socials"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => io.observe(el));
})();

// ---------- Stat counters ----------
(function () {
  const nums = document.querySelectorAll(".stat-num");
  if (!nums.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(target * ease(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  nums.forEach((n) => io.observe(n));
})();

// ---------- Parallax floats in hero ----------
(function () {
  const floats = document.querySelectorAll(".hero .float");
  if (!floats.length) return;

  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    floats.forEach((el, i) => {
      const depth = (i + 1) * 8;
      el.style.translate = `${x * depth}px ${y * depth}px`;
    });
  });
})();

// ---------- Per-section backdrop parallax ----------
(function () {
  const backdrops = Array.from(document.querySelectorAll(".section-backdrop"));
  if (!backdrops.length) return;

  let ticking = false;
  function update() {
    const vh = window.innerHeight;
    backdrops.forEach((bg) => {
      const section = bg.parentElement;
      const rect = section.getBoundingClientRect();
      // Skip work when the section is far from viewport
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const speed = parseFloat(bg.dataset.speed) || 0.35;
      // Anchor parallax to the moment the section first enters the viewport,
      // so the backdrop drifts down as the section scrolls past it (= slower than content).
      const progress = vh - rect.top;
      bg.style.transform = `translate3d(0, ${progress * speed}px, 0)`;
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update, { passive: true });
  update();
})();

// ---------- Year ----------
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
