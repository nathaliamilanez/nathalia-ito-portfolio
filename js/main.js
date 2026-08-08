(function () {
  var overlay = document.getElementById("pageOverlay");
  if (overlay) {
    var reduceMotionOverlay = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    overlay.addEventListener("transitionend", function () {
      overlay.style.display = "none";
    });

    var nameEl = overlay.querySelector(".page-overlay-name");
    var useFlicker = overlay.getAttribute("data-flicker") === "true";

    if (nameEl && useFlicker && !reduceMotionOverlay) {
      var fontVariants = [
        "Georgia, serif",
        "'Courier New', monospace",
        "'Times New Roman', serif",
        "Arial, sans-serif",
        "Georgia, serif",
        "'Courier New', monospace"
      ];
      var stepDelays = [75, 95, 120, 150, 190, 240];
      var originalFontFamily = nameEl.style.fontFamily;
      var step = 0;

      var runFlicker = function () {
        if (step >= fontVariants.length) {
          nameEl.style.fontFamily = originalFontFamily;
          setTimeout(function () {
            overlay.classList.add("is-hidden");
          }, 500);
          return;
        }
        nameEl.style.fontFamily = fontVariants[step];
        setTimeout(runFlicker, stepDelays[step]);
        step++;
      };

      runFlicker();
    } else {
      setTimeout(function () {
        overlay.classList.add("is-hidden");
      }, reduceMotionOverlay ? 300 : 800);
    }
  }

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
    { threshold: 0.01, rootMargin: "0px 0px 150px 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });

  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    var applyTheme = function (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      try { sessionStorage.setItem("theme", theme); } catch (e) {}
    };
    themeToggle.addEventListener("click", function (e) {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduceMotion) {
        applyTheme(next);
        return;
      }

      var rect = e.currentTarget.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      var xPct = (x / window.innerWidth) * 100;
      var yPct = (y / window.innerHeight) * 100;
      var endRadius =
        (Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) /
          (Math.hypot(window.innerWidth, window.innerHeight) / Math.SQRT2)) *
        100;

      var transition = document.startViewTransition(function () { applyTheme(next); });
      transition.ready
        .then(function () {
          document.documentElement.animate(
            {
              clipPath: [
                "circle(0% at " + xPct + "% " + yPct + "%)",
                "circle(" + endRadius + "% at " + xPct + "% " + yPct + "%)"
              ]
            },
            { duration: 600, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
          );
        })
        .catch(function () {});
      transition.finished.catch(function () {});
    });
  }

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
    var lockedScrollY = 0;
    var lockScroll = function () {
      lockedScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = -lockedScrollY + "px";
      document.body.style.width = "100%";
    };
    var unlockScroll = function () {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, lockedScrollY);
    };
    var closeNav = function () {
      if (!siteNav.classList.contains("is-open")) return;
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      unlockScroll();
    };
    var toggleNav = function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("nav-open", isOpen);
      if (isOpen) {
        lockScroll();
      } else {
        unlockScroll();
      }
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

  var emailLink = document.getElementById("emailLink");
  if (emailLink) {
    var copyTooltip = document.getElementById("copyTooltip");
    var hideTooltipTimer;
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      var email = emailLink.getAttribute("data-email");
      var showTooltip = function () {
        copyTooltip.classList.add("is-visible");
        clearTimeout(hideTooltipTimer);
        hideTooltipTimer = setTimeout(function () {
          copyTooltip.classList.remove("is-visible");
        }, 1400);
      };
      var fallbackCopy = function () {
        var temp = document.createElement("textarea");
        temp.value = email;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand("copy"); } catch (err) {}
        document.body.removeChild(temp);
        showTooltip();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showTooltip, fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }
})();
