
/* ========================================
   Cafe CUC 共通JavaScript
   ・デザイン切り替え：A / B / C
   ・情報配置切り替え：3パターン
   ・スマートフォン用ナビゲーション
   ・ページ間で設定を引き継ぐ
======================================== */

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
    "[data-layout]"
  );

  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  /* URLから設定を読み込む */
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
     URLを更新する
     ページを再読み込みしない
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

    // 配置切り替え後もページ全体を表示する
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


  /* デザインボタン */
  designButtons.forEach(button => {
    button.addEventListener("click", () => {
      applyDesign(button.dataset.style);
    });
  });


  /* 情報配置ボタン */
  layoutButtons.forEach(button => {
    button.addEventListener("click", () => {
      applyLayout(button.dataset.layout);
    });
  });


  /* ----------------------------------------
     ページ内リンクに設定を引き継ぐ
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

      if (url.origin !== window.location.origin) {
        return;
      }

      if (!url.pathname.endsWith(".html")) {
        return;
      }

      url.searchParams.set("style", currentStyle);
      url.searchParams.set("layout", currentLayout);

      link.href =
        url.pathname + url.search + url.hash;
    });
  }


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

  // URLの設定を復元
  applyDesign(currentStyle);
  applyLayout(currentLayout);

  // ページ間の設定引き継ぎ
  preserveSettingsOnLinks();

})();
