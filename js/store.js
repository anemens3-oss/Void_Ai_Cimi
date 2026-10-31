/* ============================================================
   VOID — store.js
   Корзина и избранное (localStorage)
   ============================================================ */

const Store = (() => {
  const CART_KEY = "void_cart";
  const FAV_KEY = "void_favorites";

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  let cart = read(CART_KEY, []);        // [{id, size, qty}]
  let favorites = read(FAV_KEY, []);    // [id]

  const listeners = new Set();
  const notify = () => {
    write(CART_KEY, cart);
    write(FAV_KEY, favorites);
    listeners.forEach((fn) => fn());
  };

  const lineTotal = (item) => {
    const p = CATALOG.find((p) => p.id === item.id);
    return p ? p.price * item.qty : 0;
  };

  return {
    subscribe: (fn) => listeners.add(fn),

    /* ---- Cart ---- */
    getCart: () => cart,
    cartCount: () => cart.reduce((sum, i) => sum + i.qty, 0),
    cartSubtotal: () => cart.reduce((sum, i) => sum + lineTotal(i), 0),

    addToCart(id, size, qty = 1) {
      const existing = cart.find((i) => i.id === id && i.size === size);
      if (existing) existing.qty += qty;
      else cart.push({ id, size, qty });
      notify();
    },
    removeFromCart(id, size) {
      cart = cart.filter((i) => !(i.id === id && i.size === size));
      notify();
    },
    setQty(id, size, qty) {
      const item = cart.find((i) => i.id === id && i.size === size);
      if (!item) return;
      item.qty = Math.max(1, Math.min(99, qty));
      notify();
    },
    setSize(id, oldSize, newSize) {
      const item = cart.find((i) => i.id === id && i.size === oldSize);
      if (!item) return;
      const dup = cart.find((i) => i.id === id && i.size === newSize);
      if (dup) {
        dup.qty += item.qty;
        cart = cart.filter((i) => i !== item);
      } else {
        item.size = newSize;
      }
      notify();
    },
    clearCart() {
      cart = [];
      notify();
    },

    /* ---- Favorites ---- */
    getFavorites: () => favorites,
    isFavorite: (id) => favorites.includes(id),
    toggleFavorite(id) {
      if (favorites.includes(id)) favorites = favorites.filter((f) => f !== id);
      else favorites.push(id);
      notify();
      return favorites.includes(id);
    }
  };
})();
