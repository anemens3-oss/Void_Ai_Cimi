/* ============================================================
   VOID — animations.js
   Preloader, Lenis, GSAP/ScrollTrigger, reveal, parallax
   ============================================================ */

const Animations = (() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (max-width: 768px)").matches;
  const hasGSAP = () => typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  /* ===================== Preloader ===================== */
  function preloader(onDone) {
    const el = document.getElementById("preloader");
    const fill = document.getElementById("preloader-fill");
    const count = document.getElementById("preloader-count");
    const letters = el.querySelectorAll(".preloader__logo span");
    const tag = el.querySelector(".preloader__tag");

    if (prefersReduced || !hasGSAP()) {
      el.classList.add("is-done");
      el.style.display = "none";
      onDone();
      return;
    }

    const state = { p: 0 };
    const tl = gsap.timeline();

    tl.to(letters, { y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" })
      .to(tag, { opacity: 1, duration: 0.5 }, "-=0.3")
      .to(
        state,
        {
          p: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            fill.style.transform = `scaleX(${state.p / 100})`;
            count.textContent = String(Math.round(state.p)).padStart(2, "0");
          }
        },
        "-=0.4"
      )
      .to(letters, { y: "-110%", duration: 0.6, stagger: 0.05, ease: "power3.in" }, "+=0.15")
      .to([tag, el.querySelector(".preloader__bar"), count], { opacity: 0, duration: 0.35 }, "<")
      .to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          el.classList.add("is-done");
          el.style.display = "none";
        }
      })
      .add(onDone, "-=0.55");
  }

  /* ===================== Hero intro ===================== */
  function heroIntro() {
    if (!hasGSAP() || prefersReduced) {
      document.querySelectorAll("[data-hero-fade]").forEach((el) => (el.style.opacity = 1));
      document.getElementById("hero-img").style.transform = "none";
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to("#hero-img", { scale: 1, duration: 1.8, ease: "power2.out" }, 0)
      .to(".hero .split-inner", { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.25)
      .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.7);
  }

  /* Подготовка hero: прячем строки заголовка */
  function heroSetup() {
    if (!hasGSAP() || prefersReduced) return;
    gsap.set(".hero .split-inner", { yPercent: 110 });
    gsap.set("[data-hero-fade]", { y: 24 });
  }

  /* ===================== Lenis ===================== */
  function initLenis() {
    if (prefersReduced || isTouch || typeof Lenis === "undefined") return null;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    if (hasGSAP()) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => {
        lenis.raf(t);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
    return lenis;
  }

  /* ===================== Split text ===================== */
  function splitWords(el) {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(" ")
      .map(
        (w) =>
          `<span class="split-line" aria-hidden="true" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="split-inner">${w}</span></span>`
      )
      .join(" ");
  }

  /* ===================== Scroll reveals ===================== */
  function initReveals() {
    // [data-split] — заголовки по словам (GSAP)
    document.querySelectorAll("[data-split]").forEach((el) => {
      if (!hasGSAP() || prefersReduced) return;
      splitWords(el);
      gsap.fromTo(
        el.querySelectorAll(".split-inner"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });

    // [data-reveal] — IntersectionObserver (работает и без GSAP)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    if (!hasGSAP() || prefersReduced) return;

    // Hero: лёгкий отъезд контента при прокрутке
    gsap.to(".hero__content", {
      yPercent: -14,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Parallax: philosophy bg
    gsap.fromTo(
      ".philosophy__bg img",
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".philosophy", start: "top bottom", end: "bottom top", scrub: true }
      }
    );

    // Parallax на изображениях категорий
    if (!isTouch) {
      document.querySelectorAll(".category-card__media img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: img.closest(".category-card"), start: "top bottom", end: "bottom top", scrub: true }
          }
        );
      });
    }

    // Footer logo: появление
    gsap.from(".footer__logo", {
      yPercent: 35,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".footer", start: "top 80%" }
    });
  }

  /* ===================== Pinned editorial ===================== */
  const LOOKS = [
    { name: "Look 01 — Monochrome Layering", desc: "Heavy cotton, structured shoulders and a silhouette that refuses to whisper." },
    { name: "Look 02 — Tailored Ease", desc: "Sharp lines softened by fluid wool. Formality, rewritten for the street." },
    { name: "Look 03 — Quiet Utility", desc: "Functional pieces stripped of noise — every pocket, every seam, intentional." }
  ];

  function initEditorial() {
    const pin = document.getElementById("editorial-pin");
    const imgs = [...pin.querySelectorAll(".editorial__img")];
    const nameEl = document.getElementById("editorial-look-name");
    const descEl = document.getElementById("editorial-look-desc");
    const currentEl = document.getElementById("editorial-current");
    const fillEl = document.getElementById("editorial-counter-fill");

    if (!hasGSAP() || prefersReduced) return;

    let active = 0;
    const setLook = (i) => {
      if (i === active) return;
      active = i;
      imgs.forEach((img, k) => img.classList.toggle("is-active", k === i));
      currentEl.textContent = String(i + 1).padStart(2, "0");
      gsap.fromTo([nameEl, descEl], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
      nameEl.textContent = LOOKS[i].name;
      descEl.textContent = LOOKS[i].desc;
    };

    ScrollTrigger.create({
      trigger: ".editorial",
      start: "top top",
      end: "+=240%",
      pin,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        fillEl.style.transform = `scaleX(${p})`;
        setLook(Math.min(2, Math.floor(p * 3)));
        // Деликатный zoom активного кадра
        const img = imgs[active];
        gsap.set(img, { scale: 1 + p * 0.04 });
      }
    });
  }

  /* ===================== Hero mouse parallax ===================== */
  function initHeroParallax() {
    if (isTouch || prefersReduced || !hasGSAP()) return;
    const media = document.getElementById("hero-media");
    const content = document.querySelector(".hero__content");
    const xTo = gsap.quickTo(media, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(media, "y", { duration: 0.8, ease: "power3.out" });
    const cxTo = gsap.quickTo(content, "x", { duration: 1, ease: "power3.out" });
    document.querySelector(".hero").addEventListener("mousemove", (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 2;
      const dy = (e.clientY / window.innerHeight - 0.5) * 2;
      xTo(dx * 14);
      yTo(dy * 10);
      cxTo(dx * -8);
    });
  }

  /* ===================== Scroll progress ===================== */
  function initProgress() {
    const fill = document.getElementById("scroll-progress-fill");
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function init() {
    if (prefersReduced) document.documentElement.classList.add("reduced-motion");
    heroSetup();
    initLenis();
    initProgress();
    initReveals();
    initEditorial();
    initHeroParallax();
    if (hasGSAP()) window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  return { init, preloader, heroIntro };
})();
