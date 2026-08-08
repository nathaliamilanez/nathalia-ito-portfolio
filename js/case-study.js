(function () {
  function setupCarousel(root) {
    if (!root) return;
    var slides = root.querySelectorAll(".cs-slide");
    var dots = root.querySelectorAll(".cs-dot");
    var prevBtn = root.querySelector(".cs-car-prev");
    var nextBtn = root.querySelector(".cs-car-next");
    var current = 0;

    function goTo(n) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = ((n % slides.length) + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); });
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(setupCarousel);
})();
