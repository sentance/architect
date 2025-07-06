document.addEventListener('DOMContentLoaded', () => {
  const lang = document.querySelector('.header__lang');
  const dropdown = lang.querySelector('.header__lang-dropdown');
  const icon = lang.querySelector('.header__lang-icon');

  lang.addEventListener('click', () => {
    dropdown.classList.toggle('active');
    lang.classList.toggle('open');
    icon.classList.toggle('rotated');
  });

  dropdown.querySelectorAll('.header__lang-item').forEach(item => {
    item.addEventListener('click', e => {
      lang.childNodes[0].nodeValue = e.target.textContent;
      dropdown.classList.remove('active');
      lang.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!lang.contains(e.target)) {
      dropdown.classList.remove('active');
      lang.classList.remove('open');
    }
  });

  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !expanded);
    burger.classList.toggle('open');
    nav.classList.toggle('active');
  });

  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
        lastScrollY = window.scrollY;
        ticking = false;
      });

      ticking = true;
    }
  });
});