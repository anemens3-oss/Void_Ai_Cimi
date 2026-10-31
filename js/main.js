/* ============================================================
   VOID — main.js
   Инициализация приложения
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  UI.init();
  Router.init();
  Animations.init();

  // Preloader → hero intro
  Animations.preloader(() => {
    Animations.heroIntro();
  });
});
