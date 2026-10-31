/* ============================================================
   VOID — router.js
   Hash-роутинг и страница товара (#/product/:id)
   ============================================================ */

const Router = (() => {
  const view = () => document.getElementById("product-view");

  let currentId = null;

  function parseHash() {
    const m = location.hash.match(/^#\/product\/([\w-]+)$/);
    return m ? m[1] : null;
  }

  function gallery(p) {
    const imgs = [p.img, p.imgAlt];
    return `
      <div class="pv__gallery">
        <div class="pv__main"><img id="pv-main-img" src="${imgs[0]}" alt="${p.name}" /></div>
        <div class="pv__thumbs">
          ${imgs
            .map(
              (src, i) => `
            <button class="pv__thumb ${i === 0 ? "is-active" : ""}" data-thumb="${src}" aria-label="Photo ${i + 1}">
              <img src="${src}" alt="" loading="lazy" />
            </button>`
            )
            .join("")}
        </div>
      </div>`;
  }

  function render(p) {
    const fav = Store.isFavorite(p.id);
    view().innerHTML = `
      <button class="pv__close" id="pv-close" aria-label="Close product page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5 5 19"/></svg>
      </button>
      <div class="pv">
        ${gallery(p)}
        <div class="pv__info">
          <p class="label">${CATEGORY_LABELS[p.category]} — FW26</p>
          <h1 class="pv__name">${p.name}</h1>
          <p class="pv__price">$${p.price}</p>
          <p class="pv__desc">${p.desc}</p>

          <div class="pv__block">
            <div class="pv__block-head">
              <span class="label">Select size — required</span>
              <span class="pv__size-error" id="pv-size-error" hidden>Please select a size</span>
            </div>
            <div class="pv__sizes" role="radiogroup" aria-label="Sizes">
              ${p.sizes
                .map((s) => `<button class="pv__size" role="radio" aria-checked="false" data-size="${s}">${s}</button>`)
                .join("")}
            </div>
          </div>

          <div class="pv__block">
            <span class="label">Quantity</span>
            <div class="pv__qty">
              <button id="pv-qty-minus" aria-label="Decrease quantity">−</button>
              <span id="pv-qty">1</span>
              <button id="pv-qty-plus" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <div class="pv__actions">
            <button class="btn btn--light btn--full" id="pv-add"><span>Add to cart — $${p.price}</span></button>
            <button class="pv__fav ${fav ? "is-active" : ""}" id="pv-fav" aria-pressed="${fav}">
              <svg viewBox="0 0 24 24"><path d="M12 20.5c-5.2-3.6-8.5-6.8-8.5-10.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.5 3.2c0 3.8-3.3 7-8.5 10.6Z"/></svg>
              <span>${fav ? "In favorites" : "Add to favorites"}</span>
            </button>
          </div>

          <div class="pv__details">
            <div class="pv__detail">
              <button class="pv__detail-btn" aria-expanded="false">Delivery & returns
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
              </button>
              <div class="pv__detail-body"><p>Free worldwide delivery on orders over $200 (otherwise $12). Estimated 3–7 business days. 30-day free returns — items must be unworn with tags attached.</p></div>
            </div>
            <div class="pv__detail">
              <button class="pv__detail-btn" aria-expanded="false">Materials & care
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>
              </button>
              <div class="pv__detail-body"><p>Responsibly sourced fabrics, produced in limited runs. Machine wash cold, inside out. Do not tumble dry. Designed to age, not to wear out.</p></div>
            </div>
          </div>
        </div>
      </div>`;
    bind(p);
  }

  function bind(p) {
    const v = view();
    let selectedSize = null;
    let qty = 1;

    v.querySelector("#pv-close").addEventListener("click", close);

    v.querySelectorAll("[data-thumb]").forEach((btn) =>
      btn.addEventListener("click", () => {
        v.querySelectorAll(".pv__thumb").forEach((t) => t.classList.toggle("is-active", t === btn));
        const main = v.querySelector("#pv-main-img");
        main.style.opacity = "0";
        setTimeout(() => {
          main.src = btn.dataset.thumb;
          main.style.opacity = "1";
        }, 200);
      })
    );

    v.querySelectorAll(".pv__size").forEach((btn) =>
      btn.addEventListener("click", () => {
        selectedSize = btn.dataset.size;
        v.querySelectorAll(".pv__size").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-checked", String(b === btn));
        });
        v.querySelector("#pv-size-error").hidden = true;
      })
    );

    v.querySelector("#pv-qty-minus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      v.querySelector("#pv-qty").textContent = qty;
    });
    v.querySelector("#pv-qty-plus").addEventListener("click", () => {
      qty = Math.min(99, qty + 1);
      v.querySelector("#pv-qty").textContent = qty;
    });

    v.querySelector("#pv-add").addEventListener("click", () => {
      if (!selectedSize) {
        v.querySelector("#pv-size-error").hidden = false;
        v.querySelector(".pv__sizes").scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      Store.addToCart(p.id, selectedSize, qty);
      UI.showToast(`${p.name} · ${selectedSize} — added to cart`);
      UI.openCart();
    });

    v.querySelector("#pv-fav").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const active = Store.toggleFavorite(p.id);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.querySelector("span").textContent = active ? "In favorites" : "Add to favorites";
      UI.showToast(active ? "Added to favorites" : "Removed from favorites");
    });

    v.querySelectorAll(".pv__detail-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const detail = btn.closest(".pv__detail");
        const body = detail.querySelector(".pv__detail-body");
        const open = detail.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
        body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
      })
    );
  }

  function open(id) {
    const p = CATALOG.find((x) => x.id === id);
    if (!p) {
      history.replaceState(null, "", location.pathname);
      return;
    }
    currentId = id;
    render(p);
    view().classList.add("is-open");
    view().setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    if (window.__lenis) window.__lenis.stop();
    view().scrollTop = 0;
  }

  function close() {
    if (location.hash.startsWith("#/product/")) {
      history.back();
      return;
    }
    doClose();
  }

  function doClose() {
    currentId = null;
    view().classList.remove("is-open");
    view().setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (window.__lenis) window.__lenis.start();
  }

  function handleRoute() {
    const id = parseHash();
    if (id) open(id);
    else if (currentId) doClose();
  }

  function init() {
    window.addEventListener("hashchange", handleRoute);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && currentId) close();
    });
    handleRoute();
  }

  return { init, isOpen: () => currentId !== null };
})();
