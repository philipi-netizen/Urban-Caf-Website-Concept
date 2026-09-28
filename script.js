/* =========================================================
   URBAN CAFÉ — PREMIUM INTERACTION SYSTEM
   Vanilla JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     01. CORE ELEMENTS
  ======================================================= */

  const header = document.querySelector("[data-navbar]");
  const navbar = document.querySelector(".navbar");

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuClose = document.querySelector("[data-menu-close]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileNavigation = document.querySelector("[data-mobile-navigation]");

  const navLinks = document.querySelectorAll("[data-nav-link]");
  const sections = document.querySelectorAll("[data-section]");

  const revealElements = document.querySelectorAll(".reveal");
  const heroImage = document.querySelector("[data-parallax]");

  const whatsappLinks = document.querySelectorAll("[data-whatsapp]");

  if (!header || !navbar) {
    return;
  }


  /* =======================================================
     02. REDUCED MOTION / DEVICE CHECKS
  ======================================================= */

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const mobileQuery = window.matchMedia("(max-width: 1023px)");

  const prefersReducedMotion = () => reducedMotionQuery.matches;

  const canUseParallax = () => {
    return (
      !prefersReducedMotion() &&
      !mobileQuery.matches &&
      heroImage
    );
  };


  /* =======================================================
     03. NAVBAR SCROLL STATE
  ======================================================= */

  let lastScrollY = window.scrollY;
  let ticking = false;

  const navbarScrollThreshold = 30;
  const navbarHideThreshold = 90;

  const updateNavbar = () => {
    const currentScrollY = window.scrollY;

    /*
     * Compact navbar after leaving the top.
     */
    if (currentScrollY > navbarScrollThreshold) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    /*
     * Hide while scrolling down.
     * Reveal while scrolling up.
     */
    if (
      currentScrollY > navbarHideThreshold &&
      currentScrollY > lastScrollY + 4
    ) {
      header.classList.add("is-hidden");
    } else if (currentScrollY < lastScrollY - 4) {
      header.classList.remove("is-hidden");
    }

    /*
     * Always show the navbar at the very top.
     */
    if (currentScrollY <= navbarScrollThreshold) {
      header.classList.remove("is-hidden");
    }

    lastScrollY = Math.max(currentScrollY, 0);
    ticking = false;
  };

  const requestNavbarUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestNavbarUpdate, {
    passive: true
  });


  /* =======================================================
     04. MOBILE MENU
  ======================================================= */

  const setMenuState = (open) => {
    if (!mobileMenu || !menuToggle) {
      return;
    }

    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Close navigation menu" : "Open navigation menu"
    );

    document.body.classList.toggle("menu-open", open);

    /*
     * Keep focus behavior accessible.
     */
    if (open && menuClose) {
      window.requestAnimationFrame(() => {
        menuClose.focus();
      });
    } else {
      window.requestAnimationFrame(() => {
        menuToggle.focus();
      });
    }
  };

  const openMenu = () => {
    setMenuState(true);
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu?.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuClose?.addEventListener("click", closeMenu);


  /*
   * Close after selecting a mobile navigation link.
   */
  mobileNavigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });


  /*
   * Close if the user clicks the mobile-menu backdrop.
   */
  mobileMenu?.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      closeMenu();
    }
  });


  /*
   * Escape closes the mobile menu.
   */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (mobileMenu?.classList.contains("is-open")) {
        closeMenu();
      }
    }
  });


  /*
   * Keep menu state safe when resizing into desktop.
   */
  const handleViewportChange = () => {
    if (!mobileQuery.matches) {
      closeMenu();
    }
  };

  mobileQuery.addEventListener?.("change", handleViewportChange);


  /* =======================================================
     05. SMOOTH ANCHOR SCROLLING
  ======================================================= */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetID = link.getAttribute("href");

      if (!targetID || targetID === "#") {
        /*
         * The full menu is intentionally not built yet.
         */
        return;
      }

      const target = document.querySelector(targetID);

      if (!target) {
        return;
      }

      event.preventDefault();

      const navbarHeight = navbar.getBoundingClientRect().height;
      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight -
        18;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: prefersReducedMotion() ? "auto" : "smooth"
      });
    });
  });


  /* =======================================================
     06. ACTIVE NAVIGATION
     IntersectionObserver watches section visibility.
  ======================================================= */

  if ("IntersectionObserver" in window && sections.length) {

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionID = entry.target.id;

          navLinks.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.toggle(
              "is-active",
              href === `#${sectionID}`
            );
          });
        });
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* =======================================================
     07. REVEAL ANIMATIONS
  ======================================================= */

  if (
    "IntersectionObserver" in window &&
    revealElements.length &&
    !prefersReducedMotion()
  ) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target;

          element.classList.add("is-visible");

          /*
           * Stop observing after first reveal.
           */
          observer.unobserve(element);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {
    /*
     * Reduced-motion users should receive content immediately.
     */
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }


  /* =======================================================
     08. HERO PARALLAX
  ======================================================= */

  let parallaxFrame = null;

  const updateHeroParallax = () => {
    parallaxFrame = null;

    if (!canUseParallax()) {
      if (heroImage) {
        heroImage.style.transform = "";
      }

      return;
    }

    const scrollY = window.scrollY;

    /*
     * Keep the movement deliberately restrained.
     */
    const movement = Math.min(scrollY * 0.08, 55);

    heroImage.style.transform = `translate3d(0, ${movement}px, 0) scale(1.02)`;
  };

  const requestHeroParallax = () => {
    if (!canUseParallax()) {
      return;
    }

    if (!parallaxFrame) {
      parallaxFrame = window.requestAnimationFrame(
        updateHeroParallax
      );
    }
  };

  window.addEventListener("scroll", requestHeroParallax, {
    passive: true
  });


  /*
   * Reset parallax when the viewport/device state changes.
   */
  const handleMotionChange = () => {
    if (!canUseParallax() && heroImage) {
      heroImage.style.transform = "";
    }
  };

  reducedMotionQuery.addEventListener?.(
    "change",
    handleMotionChange
  );

  mobileQuery.addEventListener?.(
    "change",
    handleMotionChange
  );


  /* =======================================================
     09. CONTEXTUAL WHATSAPP LINKS
  ======================================================= */

  const whatsappNumber = "265998969594";

  const whatsappMessages = {
    general:
      "Hi Urban Café, I'd like to make an enquiry.",

    menu:
      "Hi Urban Café, I'd like to enquire about the menu.",

    visit:
      "Hi Urban Café, I'd like to enquire about visiting the café.",

    final:
      "Hi Urban Café, I'd like to make an enquiry.",

    floating:
      "Hi Urban Café, I'd like to make an enquiry."
  };

  const createWhatsAppURL = (message) => {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  };

  whatsappLinks.forEach((link) => {
    const context = link.dataset.whatsapp || "general";
    const message =
      whatsappMessages[context] ||
      whatsappMessages.general;

    link.href = createWhatsAppURL(message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });


  /* =======================================================
     10. CURRENT YEAR
  ======================================================= */

  const yearElement = document.querySelector(
    "[data-current-year]"
  );

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* =======================================================
     11. IMAGE SAFETY
  ======================================================= */

  /*
   * Prevent broken images from causing awkward layout behavior.
   * The HTML already provides width/height attributes.
   */
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.classList.add("image-load-error");
      },
      { once: true }
    );
  });


  /* =======================================================
     12. INITIAL STATE
  ======================================================= */

  updateNavbar();

});

