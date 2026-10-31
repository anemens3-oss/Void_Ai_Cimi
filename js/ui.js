/* ============================================================
   VOID — ui.js
   Рендер каталога, фильтры, корзина, поиск, меню, тосты
   ============================================================ */

const UI = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => `$${n}`;

  const filters = {
    cat: "all",
    size: "all",
    maxPrice: 500,
    sort: "featured",
    favOnly: false
  };

  /* ===================== Toasts ===================== */
  function showToast(message) {
    const box = $("#toasts");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12.5 9.5 18 20 6.5"/></svg><span></span>`;
    toast.querySelector("span").textContent = message;
    box.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  /* ===================== Product grid ===================== */
  function getVisibleProducts() {
    let list = [...CATALOG];
    if (filters.favOnly) list = list.filter((p) => Store.isFavorite(p.id));
    if (filters.cat !== "all") list = list.filter((p) => p.category === filters.cat);
    if (filters.size !== "all") list = list.filter((p) => p.sizes.includes(filters.size));
    list = list.filter((p) => p.price <= filters.maxPrice);
    switch (filters.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }

  function productCard(p) {
    const fav = Store.isFavorite(p.id);
    const sizes = p.sizes
      .map((s) => `<button class="product-card__size" data-add="${p.id}" data-size="${s}" aria-label="Add ${p.name} size ${s} to cart">${s}</button>`)
      .join("");
    return `
      <article class="product-card" data-card="${p.id}">
        <div class="product-card__media" data-open-product="${p.id}" role="link" tabindex="0" aria-label="View ${p.name}">
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          <img src="${p.imgAlt}" alt="" class="product-card__img--alt" loading="lazy" aria-hidden="true" />
          <button class="product-card__fav ${fav ? "is-active" : ""}" data-fav="${p.id}" aria-label="Toggle favorite" aria-pressed="${fav}">
            <svg viewBox="0 0 24 24"><path d="M12 20.5c-5.2-3.6-8.5-6.8-8.5-10.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.5 3.2c0 3.8-3.3 7-8.5 10.6Z"/></svg>
          </button>
          <div class="product-card__sizes">${sizes}</div>
        </div>
        <div class="product-card__info">
          <div>
            <h3 class="product-card__name" data-open-product="${p.id}">${p.name}</h3>
            <span class="product-card__cat">${CATEGORY_LABELS[p.category]}</span>
          </div>
          <span class="product-card__price">${money(p.price)}</span>
        </div>
      </article>`;
  }

  function renderGrid() {
    const grid = $("#product-grid");
    const list = getVisibleProducts();
    grid.innerHTML = list.map(productCard).join("");
    $("#shop-empty").hidden = list.length > 0;
    // Stagger-появление карточек
    if (window.gsap && !document.documentElement.classList.contains("reduced-motion")) {
      gsap.fromTo(
        "#product-grid .product-card",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", overwrite: true, clearProps: "transform" }
      );
    }
  }

  function bindGridEvents() {
    const grid = $("#product-grid");
    grid.addEventListener("click", (e) => {
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        const { add, size } = addBtn.dataset;
        Store.addToCart(add, size, 1);
        const p = CATALOG.find((x) => x.id === add);
        showToast(`${p.name} · ${size} — added to cart`);
        return;
      }
      const favBtn = e.target.closest("[data-fav]");
      if (favBtn) {
        const active = Store.toggleFavorite(favBtn.dataset.fav);
        favBtn.classList.toggle("is-active", active);
        favBtn.setAttribute("aria-pressed", String(active));
        showToast(active ? "Added to favorites" : "Removed from favorites");
        if (filters.favOnly) renderGrid();
        return;
      }
      const open = e.target.closest("[data-open-product]");
      if (open) location.hash = `#/product/${open.dataset.openProduct}`;
    });
    grid.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.matches("[data-open-product]")) {
        location.hash = `#/product/${e.target.dataset.openProduct}`;
      }
    });
  }

  /* ===================== Filters ===================== */
  function bindFilters() {
    $$("[data-filter-cat]").forEach((btn) =>
      btn.addEventListener("click", () => {
        $$("[data-filter-cat]").forEach((b) => b.classList.toggle("is-active", b === btn));
        filters.cat = btn.dataset.filterCat;
        filters.favOnly = false;
        renderGrid();
      })
    );
    $$("[data-filter-size]").forEach((btn) =>
      btn.addEventListener("click", () => {
        $$("[data-filter-size]").forEach((b) => b.classList.toggle("is-active", b === btn));
        filters.size = btn.dataset.filterSize;
        renderGrid();
      })
    );
    const range = $("#price-range");
    const output = $("#price-output");
    range.addEventListener("input", () => {
      filters.maxPrice = +range.value;
      output.textContent = money(+range.value);
      renderGrid();
    });
    $("#sort-select").addEventListener("change", (e) => {
      filters.sort = e.target.value;
      renderGrid();
    });
    $("#filters-reset").addEventListener("click", () => {
      filters.cat = "all";
      filters.size = "all";
      filters.maxPrice = 500;
      filters.sort = "featured";
      filters.favOnly = false;
      range.value = 500;
      output.textContent = "$500";
      $("#sort-select").value = "featured";
      $$("[data-filter-cat]").forEach((b) => b.classList.toggle("is-active", b.dataset.filterCat === "all"));
      $$("[data-filter-size]").forEach((b) => b.classList.toggle("is-active", b.dataset.filterSize === "all"));
      renderGrid();
    });
    // Карточки категорий задают фильтр и ведут к каталогу
    $$("[data-category-link]").forEach((link) =>
      link.addEventListener("click", () => {
        const cat = link.dataset.categoryLink;
        $$("[data-filter-cat]").forEach((b) => b.classList.toggle("is-active", b.dataset.filterCat === cat));
        filters.cat = cat;
        filters.favOnly = false;
        renderGrid();
      })
    );
    // Кнопка избранного в шапке — показывает избранное в каталоге
    $("#fav-open").addEventListener("click", () => {
      filters.favOnly = !filters.favOnly;
      renderGrid();
      scrollToSection("#shop");
      showToast(filters.favOnly ? "Showing favorites" : "Showing full collection");
    });
  }

  /* ===================== Cart ===================== */
  function renderCart() {
    const body = $("#cart-body");
    const cart = Store.getCart();
    const count = Store.cartCount();

    $("#cart-head-count").textContent = count ? `(${count})` : "";

    if (!cart.length) {
      body.innerHTML = `
        <div class="cart__empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/></svg>
          <p>Your cart is empty.</p>
          <p class="label">Fill it with something extraordinary</p>
        </div>`;
      $("#cart-foot").style.display = "none";
      return;
    }

    $("#cart-foot").style.display = "";
    body.innerHTML = cart
      .map((item) => {
        const p = CATALOG.find((x) => x.id === item.id);
        if (!p) return "";
        const sizes = p.sizes
          .map(
            (s) =>
              `<button class="cart-item__size ${s === item.size ? "is-active" : ""}" data-cart-size="${p.id}|${item.size}|${s}" aria-label="Change size to ${s}">${s}</button>`
          )
          .join("");
        return `
        <div class="cart-item">
          <div class="cart-item__media"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
          <div class="cart-item__info">
            <div class="cart-item__top">
              <h3 class="cart-item__name">${p.name}</h3>
              <button class="cart-item__remove" data-cart-remove="${p.id}|${item.size}" aria-label="Remove ${p.name}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5 5 19"/></svg>
              </button>
            </div>
            <p class="cart-item__meta">${CATEGORY_LABELS[p.category]}</p>
            <div class="cart-item__sizes">${sizes}</div>
            <div class="cart-item__controls">
              <div class="cart-item__qty">
                <button data-cart-qty="${p.id}|${item.size}|-1" aria-label="Decrease quantity">−</button>
                <span>${item.qty}</span>
                <button data-cart-qty="${p.id}|${item.size}|1" aria-label="Increase quantity">+</button>
              </div>
              <span class="cart-item__price">${money(p.price * item.qty)}</span>
            </div>
          </div>
        </div>`;
      })
      .join("");

    const subtotal = Store.cartSubtotal();
    const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 12;
    $("#cart-subtotal").textContent = money(subtotal);
    $("#cart-shipping").textContent = shipping === 0 ? "Free" : money(shipping);
    $("#cart-total").textContent = money(subtotal + shipping);
  }

  function bindCart() {
    $("#cart-open").addEventListener("click", openCart);
    $("#cart-close").addEventListener("click", closeCart);
    $("#overlay").addEventListener("click", closeCart);
    $("#checkout-btn").addEventListener("click", () => {
      if (!Store.getCart().length) return;
      Store.clearCart();
      showToast("Order placed — thank you");
      closeCart();
    });
    $("#cart-body").addEventListener("click", (e) => {
      const rm = e.target.closest("[data-cart-remove]");
      if (rm) {
        const [id, size] = rm.dataset.cartRemove.split("|");
        Store.removeFromCart(id, size);
        showToast("Removed from cart");
        return;
      }
      const qtyBtn = e.target.closest("[data-cart-qty]");
      if (qtyBtn) {
        const [id, size, delta] = qtyBtn.dataset.cartQty.split("|");
        const item = Store.getCart().find((i) => i.id === id && i.size === size);
        if (item) Store.setQty(id, size, item.qty + Number(delta));
        return;
      }
      const sizeBtn = e.target.closest("[data-cart-size]");
      if (sizeBtn) {
        const [id, oldSize, newSize] = sizeBtn.dataset.cartSize.split("|");
        if (oldSize !== newSize) Store.setSize(id, oldSize, newSize);
      }
    });
  }

  function openCart() {
    renderCart();
    $("#cart").classList.add("is-open");
    $("#cart").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("is-open");
    document.body.classList.add("no-scroll");
  }
  function closeCart() {
    $("#cart").classList.remove("is-open");
    $("#cart").setAttribute("aria-hidden", "true");
    $("#overlay").classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  /* ===================== Search ===================== */
  function bindSearch() {
    const overlay = $("#search-overlay");
    const input = $("#search-input");
    const results = $("#search-results");

    const close = () => {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    };
    $("#search-open").addEventListener("click", () => {
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      setTimeout(() => input.focus(), 60);
    });
    $("#search-close").addEventListener("click", close);

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        results.innerHTML = `<p class="search-overlay__hint">Type at least 2 characters to search the collection</p>`;
        return;
      }
      const found = CATALOG.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.includes(q) ||
          p.desc.toLowerCase().includes(q)
      );
      results.innerHTML = found.length
        ? found.map(productCard).join("")
        : `<p class="search-overlay__hint">No results for “${input.value.trim()}”</p>`;
    });

    results.addEventListener("click", (e) => {
      const open = e.target.closest("[data-open-product]");
      if (open) {
        close();
        location.hash = `#/product/${open.dataset.openProduct}`;
        return;
      }
      const favBtn = e.target.closest("[data-fav]");
      if (favBtn) {
        const active = Store.toggleFavorite(favBtn.dataset.fav);
        favBtn.classList.toggle("is-active", active);
        return;
      }
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        Store.addToCart(addBtn.dataset.add, addBtn.dataset.size, 1);
        showToast("Added to cart");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
        closeCart();
        closeMenu();
      }
    });
  }

  /* ===================== Mobile menu ===================== */
  function openMenu() {
    $("#mobile-menu").classList.add("is-open");
    $("#mobile-menu").setAttribute("aria-hidden", "false");
    $("#burger").classList.add("is-open");
    $("#burger").setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  function closeMenu() {
    $("#mobile-menu").classList.remove("is-open");
    $("#mobile-menu").setAttribute("aria-hidden", "true");
    $("#burger").classList.remove("is-open");
    $("#burger").setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  function bindMenu() {
    $("#burger").addEventListener("click", () => {
      $("#mobile-menu").classList.contains("is-open") ? closeMenu() : openMenu();
    });
  }

  /* ===================== Navigation / header ===================== */
  function scrollToSection(hash) {
    const target = $(hash);
    if (!target) return;
    if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  function bindNav() {
    $$("[data-navlink]").forEach((link) =>
      link.addEventListener("click", (e) => {
        const hash = link.getAttribute("href");
        if (!hash || !hash.startsWith("#") || hash.length < 2) return;
        e.preventDefault();
        closeMenu();
        scrollToSection(hash);
      })
    );

    // Info-ссылки футера
    $$("[data-info]").forEach((link) =>
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const msgs = {
          delivery: "Free worldwide delivery over $200 · 3–7 business days",
          returns: "30-day returns, no questions asked",
          privacy: "We never share your data. Ever."
        };
        showToast(msgs[link.dataset.info] || "VOID");
      })
    );

    // Состояние шапки при прокрутке
    let lastY = 0;
    const header = $("#header");
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-solid", y > 40);
      header.classList.toggle("is-hidden", y > 500 && y > lastY && !document.body.classList.contains("no-scroll"));
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ===================== Newsletter ===================== */
  function bindNewsletter() {
    const form = $("#newsletter-form");
    const email = $("#newsletter-email");
    const err = $("#newsletter-error");
    const ok = $("#newsletter-ok");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      err.hidden = valid;
      ok.hidden = !valid;
      if (valid) {
        showToast("Subscribed — welcome to the void");
        email.value = "";
      }
    });
  }

  /* ===================== Badges ===================== */
  function renderBadges() {
    const cartCount = Store.cartCount();
    const favCount = Store.getFavorites().length;
    const cartBadge = $("#cart-count");
    const favBadge = $("#fav-count");
    cartBadge.hidden = cartCount === 0;
    cartBadge.textContent = cartCount;
    favBadge.hidden = favCount === 0;
    favBadge.textContent = favCount;
  }

  function init() {
    renderGrid();
    renderBadges();
    bindGridEvents();
    bindFilters();
    bindCart();
    bindSearch();
    bindMenu();
    bindNav();
    bindNewsletter();
    Store.subscribe(() => {
      renderBadges();
      if ($("#cart").classList.contains("is-open")) renderCart();
    });
  }

  return { init, renderGrid, showToast, scrollToSection, openCart, closeCart };
})();
