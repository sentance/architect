document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".software__swiper", {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: false,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      680: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
});
