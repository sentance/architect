document.addEventListener('DOMContentLoaded', () => {
  const langEl = document.querySelector('.header__lang');
  const dropdown = langEl?.querySelector('.header__lang-dropdown');
  const icon = langEl?.querySelector('.header__lang-icon');

  // --- determine current language from pathname ---
  const path = window.location.pathname || '/';
  let currentLang = 'EN'; // default
  if (path === '/de' || path.startsWith('/de/')) currentLang = 'DE';
  else if (path === '/ua' || path.startsWith('/ua/')) currentLang = 'UA';
  else currentLang = 'EN';

  // show language in header (text node is firstChild in your markup)
  if (langEl && langEl.firstChild && langEl.firstChild.nodeType === Node.TEXT_NODE) {
    langEl.firstChild.nodeValue = currentLang + ' ';
  }

  // --- helper to decide whether to change an href ---
  function shouldSkipHref(href) {
    if (!href || typeof href !== 'string') return true;
    // external, protocol-relative, mailto, tel, javascript, anchor
    return /^(mailto:|tel:|javascript:|#|\/\/|https?:)/i.test(href);
  }

  // --- rewrite logic for one href string ---
  function rewriteHrefForLang(href, lang) {
    if (shouldSkipHref(href)) return href;
    // Only handle absolute-path links (start with '/'). Leave relative links alone.
    if (!href.startsWith('/')) return href;

    // Remove any existing language prefix (/en, /de, /ua) if present
    // handle cases like /de, /de/, /de/about, /de?x=1
    let stripped = href.replace(/^\/(en|de|ua)(?=\/|$|\?)/i, '');
    if (stripped === '') stripped = '/';
    if (!stripped.startsWith('/')) stripped = '/' + stripped;

    if (lang === 'EN') {
      // EN is root — return stripped path
      return stripped;
    } else {
      const langPrefix = '/' + lang.toLowerCase();
      // if stripped === '/' -> produce '/de/' (or '/ua/')
      if (stripped === '/') return langPrefix + '/';
      // avoid double slashes if stripped begins with '/?'
      if (stripped.startsWith('/?')) return langPrefix + stripped.replace(/^\//, '');
      return langPrefix + stripped;
    }
  }

  // --- rewrite anchors, forms and onclicks inside a given root node ---
  function rewriteLinksInside(root = document) {
    // anchors
    root.querySelectorAll('a[href]').forEach(a => {
      const old = a.getAttribute('href');
      const n = rewriteHrefForLang(old, currentLang);
      if (n !== old) a.setAttribute('href', n);
    });

    // forms (action)
    root.querySelectorAll('form[action]').forEach(f => {
      const old = f.getAttribute('action');
      const n = rewriteHrefForLang(old, currentLang);
      if (n !== old) f.setAttribute('action', n);
    });

    // inline onclicks that set window.location.href = '/...'
    root.querySelectorAll('[onclick]').forEach(el => {
      const onclick = el.getAttribute('onclick');
      if (!onclick) return;
      // replace patterns like: window.location.href = '/path' or "...", single/double quotes
      const newOnclick = onclick.replace(/window\.location\.href\s*=\s*(['"])(\/[^'"]*)\1/gi, (m, quote, p1) => {
        const newHref = rewriteHrefForLang(p1, currentLang);
        return `window.location.href=${quote}${newHref}${quote}`;
      });
      if (newOnclick !== onclick) el.setAttribute('onclick', newOnclick);
    });

    // data-href (common custom attr)
    root.querySelectorAll('[data-href]').forEach(el => {
      const old = el.getAttribute('data-href');
      const n = rewriteHrefForLang(old, currentLang);
      if (n !== old) el.setAttribute('data-href', n);
    });
  }

  // rewrite everything on initial load
  rewriteLinksInside(document);

  // --- observe DOM for dynamically added nodes and rewrite links there too ---
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== Node.ELEMENT_NODE) continue;
        // rewrite anchors inside the newly added subtree
        rewriteLinksInside(n);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // --- language dropdown behaviour & switch (keeps current path when switching) ---
  if (langEl) {
    langEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!dropdown) return;
      dropdown.classList.toggle('active');
      langEl.classList.toggle('open');
      icon?.classList.toggle('rotated');
    });

    dropdown?.querySelectorAll('.header__lang-item').forEach(item => {
      item.addEventListener('click', e => {
        const selected = e.target.textContent.trim();
        // close UI quickly
        dropdown.classList.remove('active');
        langEl.classList.remove('open');
        icon?.classList.remove('rotated');

        // If same language, do nothing
        if (selected === currentLang) return;

        // Build new path that preserves the current page path (swap prefix)
        let newPath = window.location.pathname + window.location.search + window.location.hash;

        // remove existing prefix (if any)
        newPath = newPath.replace(/^\/(en|de|ua)(?=\/|$|\?)/i, '');
        if (!newPath.startsWith('/')) newPath = '/' + (newPath === '' ? '' : newPath.replace(/^\//, ''));

        if (selected === 'EN') {
          // EN is root
          if (newPath === '') newPath = '/';
        } else {
          // add prefix like /de or /ua
          newPath = '/' + selected.toLowerCase() + (newPath === '/' ? '/' : newPath);
        }

        // redirect to new path
        window.location.href = newPath;
      });
    });
  }

  // close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!langEl?.contains(e.target)) {
      dropdown?.classList.remove('active');
      langEl?.classList.remove('open');
      icon?.classList.remove('rotated');
    }
  });

  // --- burger & header scroll (kept from your original script) ---
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if (burger) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
      burger.classList.toggle('open');
      nav?.classList.toggle('active');
    });
  }

  const header = document.querySelector('.header');
  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > lastScrollY && window.scrollY > 100) header.classList.add('header--hidden');
          else header.classList.remove('header--hidden');
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
});
