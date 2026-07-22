(function () {
  var revealEls = document.querySelectorAll(".reveal");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });

  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (window.scrollY > 8) {
      header.style.borderBottomColor = "rgba(255, 255, 255, 0.16)";
    } else {
      header.style.borderBottomColor = "rgba(255, 255, 255, 0.08)";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var creature = document.getElementById("creature");
  var pupilL = document.getElementById("pupilL");
  var pupilR = document.getElementById("pupilR");
  if (creature && pupilL && pupilR) {
    document.addEventListener("mousemove", function (e) {
      var rect = creature.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      var dist = 8.5;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist;
      pupilL.setAttribute("cx", 339.5 + dx);
      pupilL.setAttribute("cy", 294.5 + dy);
      pupilR.setAttribute("cx", 431 + dx);
      pupilR.setAttribute("cy", 293.5 + dy);
    });
  }

  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    var closeNav = function () {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };
    var toggleNav = function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("nav-open", isOpen);
    };
    navToggle.addEventListener("click", toggleNav);
    siteNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 809) closeNav();
    });
  }

  var backToTop = document.getElementById("backToTop");
  var scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (creature) creature.addEventListener("click", scrollToTop);
  if (backToTop) backToTop.addEventListener("click", scrollToTop);
})();
