'use strict';

/**
 * Utility: add Event on multiple elements
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem && elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else if (elem) {
    elem.addEventListener(type, callback);
  }
};

/**
 * Inject header and footer, return a Promise when done
 */
const injectHeaderFooter = () => {
  const headerPromise = fetch("header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });

  const footerPromise = fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });

  return Promise.all([headerPromise, footerPromise]);
};

/**
 * Navbar toggle
 */
const initNavbar = (overlay) => {
  const navbar = document.querySelector("[data-navbar]");
  const navTogglers = document.querySelectorAll("[data-nav-toggler]");
  const navbarLinks = document.querySelectorAll("[data-nav-link], [data-cta-link]");

  if (!navbar) return;

  const toggleNavbar = () => {
    navbar.classList.toggle("active");
    if (overlay) overlay.classList.toggle("active");
  };

  addEventOnElem(navTogglers, "click", toggleNavbar);

  const closeNavbar = () => {
    navbar.classList.remove("active");
    if (overlay) overlay.classList.remove("active");
  };

  addEventOnElem(navbarLinks, "click", closeNavbar);

  // Close navbar when overlay is clicked
  if (overlay) overlay.addEventListener("click", closeNavbar);
};

/**
 * Header & back-to-top button show when scroll down
 */
const initHeaderScroll = () => {
  const header = document.querySelector("[data-header]");
  const backTopBtn = document.querySelector("[data-back-top-btn]");

  if (!header) return;

  const headerActive = () => {
    if (window.scrollY > 80) {
      header.classList.add("active");
      if (backTopBtn) backTopBtn.classList.add("active");
    } else {
      header.classList.remove("active");
      if (backTopBtn) backTopBtn.classList.remove("active");
    }
  };

  addEventOnElem(window, "scroll", headerActive);
};

/**
 * Intersection Observer for fade-in animations
 */
const initFadeInObserver = () => {
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
};

/**
 * Hero Graphic Animation
 */
const initHeroAnimation = () => {
  const heroEl = document.querySelector('.hero-graphic');
  if (!heroEl) return;

  const heroObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroEl.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  heroObserver.observe(heroEl);
};

/**
 * Page transition: Fade In / Fade Out with fade-page class
 */
const initPageTransitions = () => {
  document.body.classList.add("fade-page");

  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });

  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");

      if (
        href &&
        !href.startsWith("http") &&
        !href.startsWith("#") &&
        !link.hasAttribute("target")
      ) {
        e.preventDefault();
        document.body.classList.remove("loaded");

        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });
};

/**
 * Initialize everything after header/footer is loaded
 */
injectHeaderFooter().then(() => {
  const overlay = document.querySelector(".overlay");
  initNavbar(overlay);
  initHeaderScroll();
  initFadeInObserver();
  initHeroAnimation();
  initPageTransitions();
});
