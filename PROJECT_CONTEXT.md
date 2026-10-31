# PROJECT CONTEXT — VOID

## Цель проекта
Премиальный интернет-магазин одежды VOID (premium streetwear / minimalist luxury).
Визуально дорогой fashion-experience: кинематографичный hero, scroll-анимации, полноценный e-commerce.

## Стек
- HTML5, CSS3, Vanilla JS (ES6+), без фреймворков и сборки.
- GSAP 3 + ScrollTrigger (CDN) — scroll-анимации, pinned-секции.
- Lenis (CDN) — плавная прокрутка (отключается при prefers-reduced-motion и на мобильных).
- Google Fonts: Syne (display), Inter (body).
- Изображения: Unsplash CDN (`images.unsplash.com`).
- Запуск: `python -m http.server 8000` → http://localhost:8000 (или любой статик-сервер).

## Структура
- `index.html` — единственная страница (SPA, hash-роутинг `#/product/:id` для страницы товара).
- `css/base.css` — токены, reset, типографика.
- `css/components.css` — header, кнопки, карточки, drawer, overlays, toast.
- `css/sections.css` — hero, categories, editorial, newsletter, footer.
- `css/responsive.css` — адаптив 1440/1024/768/390/360.
- `js/data.js` — каталог (16 товаров).
- `js/store.js` — корзина/избранное (localStorage).
- `js/ui.js` — меню, корзина, поиск, фильтры, тосты, рендер карточек.
- `js/animations.js` — preloader, GSAP/ScrollTrigger, parallax, reveal.
- `js/router.js` — hash-роутинг, страница товара.
- `js/main.js` — инициализация.

## Дизайн-система
- Цвета: Deep Black `#080808`, Charcoal `#171717`, Off White `#F3F1ED`, Gray `#929292`.
- Типографика: Syne 700/800 для заголовков, Inter 400/500 для текста.
- Без скруглений карточек, без градиентов, строгая сетка.

## Реализовано
- (заполняется по ходу работы)

## Известные ограничения
- Зависимость от CDN (GSAP/Lenis/fonts/Unsplash) — офлайн сайт работает с деградацией.
- Нет реального бэкенда/оплаты — корзина в localStorage.

## Следующие задачи
- (заполняется по ходу работы)
