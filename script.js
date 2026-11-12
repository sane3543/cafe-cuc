
(() => {
  "use strict";

  const VALID_STYLES = [
    "botanical",
    "minimal",
    "vintage"
  ];

  const VALID_LAYOUTS = [
    "flow",
    "categories",
    "sidebar"
  ];

  const STYLE_CLASSES = VALID_STYLES.map(
    style => `style-${style}`
  );

  const LAYOUT_CLASSES = VALID_LAYOUTS.map(
    layout => `layout-${layout}`
  );

  const body = document.body;

  const designButtons = document.querySelectorAll(
    ".design-switcher button[data-style]"
  );

  const layoutButtons = document.querySelectorAll(
    ".layout-switcher button[data-layout]"
  );

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  /* ----------------------------------------
     URLから設定を読み込む
  ---------------------------------------- */

  const params = new URLSearchParams(
    window.location.search
  );

  let currentStyle = VALID_STYLES.includes(
    params.get("style")
  )
    ? params.get("style")
    : "botanical";

  let currentLayout = VALID_LAYOUTS.includes(
    params.get("layout")
  )
    ? params.get("layout")
    : "flow";


  /* ----------------------------------------
     ページ移動用リンクを更新する
  ---------------------------------------- */

  function preserveSettingsOnLinks() {

    document.querySelectorAll("a[href]").forEach(link => {

      const rawHref = link.getAttribute("href");

      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      let url;

      try {
        url = new URL(rawHref, window.location.href);
      } catch {
        return;
      }

      // 外部サイトへのリンクは変更しない
      if (url.origin !== window.location.origin) {
        return;
      }

      // HTMLページ以外は変更しない
      if (!url.pathname.endsWith(".html")) {
        return;
      }

      // 現在のデザインと配置を両方引き継ぐ
      url.searchParams.set("style", currentStyle);
      url.searchParams.set("layout", currentLayout);

      link.href =
        url.pathname + url.search + url.hash;

    });
  }


  /* ----------------------------------------
     URLを更新する
     ★リンクも同時に更新する
  ---------------------------------------- */

  function updateURL() {

    const url = new URL(window.location.href);

    url.searchParams.set("style", currentStyle);
    url.searchParams.set("layout", currentLayout);

    window.history.replaceState(
      null,
      "",
      url.pathname + url.search + url.hash
    );

    // ★ここが今回の重要な修正
    preserveSettingsOnLinks();
  }


  /* ----------------------------------------
     デザイン切り替え
  ---------------------------------------- */

  function applyDesign(style) {

    if (!VALID_STYLES.includes(style)) {
      style = "botanical";
    }

    currentStyle = style;

    body.classList.remove(...STYLE_CLASSES);
    body.classList.add(`style-${style}`);

    designButtons.forEach(button => {

      const isSelected =
        button.dataset.style === style;

      button.setAttribute(
        "aria-pressed",
        String(isSelected)
      );

    });

    updateURL();
  }


  /* ----------------------------------------
     情報配置切り替え
  ---------------------------------------- */

  
  function applyLayout(layout) {

    if (!VALID_LAYOUTS.includes(layout)) {
      layout = "flow";
    }

    currentLayout = layout;

    body.classList.remove(...LAYOUT_CLASSES);
    body.classList.add(`layout-${layout}`);

    // 元の表示調整を復元
    body.style.setProperty("display", "block", "important");

    layoutButtons.forEach(button => {

      const isSelected =
        button.dataset.layout === layout;

      button.setAttribute(
        "aria-pressed",
        String(isSelected)
      );

    });

    updateURL();
  }



  /* ----------------------------------------
     デザインボタン
  ---------------------------------------- */

  designButtons.forEach(button => {

    button.addEventListener("click", () => {
      applyDesign(button.dataset.style);
    });

  });


  /* ----------------------------------------
     情報配置ボタン
  ---------------------------------------- */

  layoutButtons.forEach(button => {

    button.addEventListener("click", () => {
      applyLayout(button.dataset.layout);
    });

  });


  /* ----------------------------------------
     スマートフォン用ナビゲーション
  ---------------------------------------- */

  if (navToggle && siteNav) {

    navToggle.addEventListener("click", () => {

      const isOpen = siteNav.classList.toggle("open");

      navToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });

    siteNav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        siteNav.classList.remove("open");

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* ----------------------------------------
     初期設定
  ---------------------------------------- */

  // URLからデザインを復元
  applyDesign(currentStyle);

  // URLから配置を復元
  applyLayout(currentLayout);

  // 最後にページ移動用リンクを更新
  preserveSettingsOnLinks();

})();

/* =========================================
   スマホ用ハンバーガーメニュー
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  // メニューを開閉
  toggle.addEventListener("click", () => {

    const isOpen = nav.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", isOpen);

    toggle.setAttribute(
      "aria-label",
      isOpen ? "メニューを閉じる" : "メニューを開く"
    );

  });

  // リンクを押したら閉じる
  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("is-open");

      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "メニューを開く");

    });

  });

});
