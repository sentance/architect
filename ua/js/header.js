document.addEventListener('DOMContentLoaded', () => {
  const lang = document.querySelector('.header__lang');
  const dropdown = lang.querySelector('.header__lang-dropdown');
  const icon = lang.querySelector('.header__lang-icon');

  // Detect current language from URL
  const path = window.location.pathname;
  let currentLang = 'EN'; // default is root

  if (path.startsWith('/de')) {
    currentLang = 'DE';
  } else if (path.startsWith('/ua')) {
    currentLang = 'UA';
  }

  // Set current language text in header
  lang.childNodes[0].nodeValue = currentLang + ' ';

  // --- 🔥 Rewrite all nav links according to currentLang ---
  const navLinks = document.querySelectorAll('.header__nav a.header__link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    // Skip anchors like #footer
    if (href.startsWith('#')) return;

    if (currentLang === 'DE' && !href.startsWith('/de/')) {
      link.setAttribute('href', '/de' + href);
    } else if (currentLang === 'UA' && !href.startsWith('/ua/')) {
      link.setAttribute('href', '/ua' + href);
    } else if (currentLang === 'EN') {
      // Remove /de or /ua prefix if exists
      link.setAttribute('href', href.replace(/^\/(de|ua)/, ''));
    }
  });
  // ---------------------------------------------------------

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

      // Preserve current path when switching
      let newPath = window.location.pathname;

      if (selectedLang === 'EN') {
        newPath = newPath.replace(/^\/(de|ua)/, '') || '/';
      } else if (selectedLang === 'DE') {
        newPath = newPath.replace(/^\/(ua|de)?/, '');
        if (!newPath.startsWith('/de')) newPath = '/de' + newPath;
      } else if (selectedLang === 'UA') {
        newPath = newPath.replace(/^\/(de|ua)?/, '');
        if (!newPath.startsWith('/ua')) newPath = '/ua' + newPath;
      }

      window.location.href = newPath;
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
