document.addEventListener('DOMContentLoaded', () => {
  const lang = document.querySelector('.header__lang');
  const dropdown = lang.querySelector('.header__lang-dropdown');
  const icon = lang.querySelector('.header__lang-icon');

  // Detect current language from URL
  const path = window.location.pathname;
  let currentLang = 'EN'; // default

  if (path.startsWith('/de')) {
    currentLang = 'DE';
  } else if (path.startsWith('/ua')) {
    currentLang = 'UA';
  } else {
    currentLang = 'EN'; // root or /en is default English
  }

  // Set current language text in header
  lang.childNodes[0].nodeValue = currentLang + ' ';

  lang.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    lang.classList.toggle('open');
    icon.classList.toggle('rotated');
  });

  dropdown.querySelectorAll('.header__lang-item').forEach(item => {
    item.addEventListener('click', e => {
      const selectedLang = e.target.textContent.trim();

      // Change visible text
      lang.childNodes[0].nodeValue = selectedLang + ' ';

      // Close dropdown
      dropdown.classList.remove('active');
      lang.classList.remove('open');
      icon.classList.remove('rotated');

      // Redirect to correct language folder
      if (selectedLang === 'EN') {
        window.location.href = '/';
      } else if (selectedLang === 'DE') {
        window.location.href = '/de/';
      } else if (selectedLang === 'UA') {
        window.location.href = '/ua/';
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!lang.contains(e.target)) {
      dropdown.classList.remove('active');
      lang.classList.remove('open');
      icon.classList.remove('rotated');
    }
  });

  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if (burger) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
      burger.classList.toggle('open');
      nav.classList.toggle('active');
    });
  }

  const header = document.querySelector('.header');
  if (header) {
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
  }
});
