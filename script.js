/**
 * ATELIER — REUSABLE EDITORIAL JAVASCRIPT ENGINE
 * Handles dual-theme toggle (Light/Dark/System), editorial drawer navigation,
 * capability accordions, gallery filter tabs, modal lightbox, client sign-in portal,
 * patron quote switcher, scroll indicators, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initEditorialDrawer();
  initActiveNavLink();
  initCapabilityAccordion();
  initGalleryFilters();
  initLightbox();
  initPatronSwitcher();
  initContactAndAuthTabs();
  initDynamicYear();
  initScrollReveal();
  initScrollProgressBar();
});

/* ==========================================================================
   1. THEME SELECTOR & DUAL PALETTE ENGINE (LIGHT, DARK, SYSTEM)
   ========================================================================== */
const THEME_ICONS = {
  light: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  system: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
};

function resolveActualTheme(preference) {
  if (preference === 'system') {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return preference === 'light' ? 'light' : 'dark';
}

function applyThemePreference(preference) {
  const actualTheme = resolveActualTheme(preference);
  document.documentElement.setAttribute('data-theme', actualTheme);
  document.documentElement.setAttribute('data-theme-preference', preference);
  localStorage.setItem('site-theme-preference', preference);
  localStorage.setItem('site-theme', actualTheme);

  // Update button trigger icons
  const btnIcons = document.querySelectorAll('.theme-btn-icon');
  btnIcons.forEach(span => {
    span.innerHTML = THEME_ICONS[preference] || THEME_ICONS[actualTheme] || THEME_ICONS.dark;
  });

  // Update active status in dropdown
  const dropdownItems = document.querySelectorAll('.theme-dropdown-item');
  dropdownItems.forEach(item => {
    if (item.getAttribute('data-theme-value') === preference) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function initThemeToggle() {
  const savedPref = localStorage.getItem('site-theme-preference') || localStorage.getItem('site-theme') || 'dark';
  applyThemePreference(savedPref);

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
      const currentPref = localStorage.getItem('site-theme-preference') || 'dark';
      if (currentPref === 'system') {
        applyThemePreference('system');
      }
    });
  }

  const selectors = document.querySelectorAll('.theme-selector');
  selectors.forEach(selector => {
    const toggleBtn = selector.querySelector('.theme-toggle-btn');
    const dropdown = selector.querySelector('.theme-dropdown');
    if (!toggleBtn || !dropdown) return;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');

      document.querySelectorAll('.theme-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.theme-selector')?.querySelector('.theme-toggle-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        dropdown.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    const items = dropdown.querySelectorAll('.theme-dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const chosen = item.getAttribute('data-theme-value');
        applyThemePreference(chosen);
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-selector')) {
      document.querySelectorAll('.theme-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.theme-selector')?.querySelector('.theme-toggle-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.theme-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.closest('.theme-selector')?.querySelector('.theme-toggle-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================================================
   2. STICKY HEADER ELEVATION
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.style.borderBottomColor = 'var(--border-medium)';
      header.style.boxShadow = 'var(--shadow-subtle)';
    } else {
      header.style.borderBottomColor = 'var(--border-hairline)';
      header.style.boxShadow = 'none';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================================================
   3. EDITORIAL SLIDE-OUT DRAWER NAVIGATION
   ========================================================================== */
function initEditorialDrawer() {
  const triggerBtn = document.getElementById('editorial-menu-trigger');
  const drawer = document.getElementById('editorial-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close-btn');

  if (!triggerBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    triggerBtn.setAttribute('aria-expanded', 'true');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    triggerBtn.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
      triggerBtn.focus();
    }
  });
}

/* ==========================================================================
   4. ACTIVE NAV LINK DETECTION
   ========================================================================== */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .drawer-nav-item .drawer-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      (currentPath === 'index.html' && (href === 'index.html' || href === '/'))
    ) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   5. EDITORIAL CAPABILITIES ACCORDION (NUMBERED ROWS)
   ========================================================================== */
function initCapabilityAccordion() {
  const items = document.querySelectorAll('.editorial-row-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.editorial-row-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      items.forEach(other => other.classList.remove('active'));

      if (!isAlreadyActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. SHOWCASE GALLERY FILTER BAR
   ========================================================================== */
function initGalleryFilters() {
  const buttons = document.querySelectorAll('.gallery-filter-btn');
  const plates = document.querySelectorAll('.gallery-plate[data-category]');

  if (!buttons.length || !plates.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      plates.forEach(plate => {
        const plateCat = plate.getAttribute('data-category');
        if (filterCategory === 'all' || plateCat === filterCategory) {
          plate.style.display = 'flex';
        } else {
          plate.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. MODAL LIGHTBOX / MONOGRAPH INSPECTOR
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-image');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const modalMeta = document.getElementById('lightbox-meta');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!modal) return;

  const openLightbox = (src, title, desc, meta) => {
    if (modalImg) modalImg.src = src;
    if (modalTitle) modalTitle.textContent = title || 'Curated Plate';
    if (modalDesc) modalDesc.textContent = desc || 'Editorial study from the Atelier archive.';
    if (modalMeta) modalMeta.textContent = meta || 'ARCHIVE MONOGRAPH';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const triggers = document.querySelectorAll('[data-lightbox-trigger]');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-image-src') || trigger.querySelector('img')?.src;
      const title = trigger.getAttribute('data-plate-title') || 'Archival Study';
      const desc = trigger.getAttribute('data-plate-desc') || 'Monograph study on space and material proportion.';
      const meta = trigger.getAttribute('data-plate-meta') || 'PLATE SPECIFICATION';
      if (src) {
        openLightbox(src, title, desc, meta);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   8. EDITORIAL PATRON / TESTIMONIAL QUOTE SWITCHER
   ========================================================================== */
const PATRON_DATA = [
  {
    quote: "“Working with Atelier felt like stepping into an architectural conversation rather than a software project. Every detail, from typographic cadence to material restraint, gave our studio an undeniable presence.”",
    author: "Elena Vasari",
    role: "Founding Partner, Vasari & Morales Architects · Milan",
    meta: "COMMISSION: MONOGRAPH & DIGITAL PAVILION"
  },
  {
    quote: "“Our guests don't just visit our dining room; they experience a complete narrative from the very first interaction. Atelier understood how to express quiet luxury without a single hollow gimmick.”",
    author: "Julien Mercier",
    role: "Head Sommelier & Patron, Maison L'Hiver · Bordeaux",
    meta: "COMMISSION: HOSPITALITY SANCTUM & CELLAR ARCHIVE"
  },
  {
    quote: "“In an era drowned in hyperactive SaaS dashboards, Atelier proved that poise, thoughtful whitespace, and architectural weight are the highest forms of credibility.”",
    author: "Sora Takahashi",
    role: "Creative Director, Studio Kura Objects · Kyoto",
    meta: "COMMISSION: OBJECT EDITIONS & SCULPTURAL IDENTITY"
  }
];

function initPatronSwitcher() {
  const buttons = document.querySelectorAll('.patron-selector-btn');
  const quoteEl = document.getElementById('patron-quote-pull');
  const authorEl = document.getElementById('patron-author');
  const roleEl = document.getElementById('patron-role');
  const metaEl = document.getElementById('patron-meta');

  if (!buttons.length || !quoteEl) return;

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = PATRON_DATA[index];
      if (data) {
        quoteEl.style.opacity = '0';
        setTimeout(() => {
          quoteEl.textContent = data.quote;
          if (authorEl) authorEl.textContent = data.author;
          if (roleEl) roleEl.textContent = data.role;
          if (metaEl) metaEl.textContent = data.meta;
          quoteEl.style.opacity = '1';
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   9. CONTACT INQUIRY & CLIENT SIGN-IN PORTAL TABS
   ========================================================================== */
function initContactAndAuthTabs() {
  const tabs = document.querySelectorAll('.portal-tab-btn');
  const inquirySection = document.getElementById('inquiry-panel');
  const signinSection = document.getElementById('signin-panel');

  if (tabs.length && inquirySection && signinSection) {
    const activateTab = (targetTab) => {
      tabs.forEach(t => t.classList.remove('active'));
      if (targetTab === 'signin') {
        const signinBtn = document.querySelector('[data-portal-tab="signin"]');
        if (signinBtn) signinBtn.classList.add('active');
        inquirySection.style.display = 'none';
        signinSection.style.display = 'block';
      } else {
        const inquiryBtn = document.querySelector('[data-portal-tab="inquiry"]');
        if (inquiryBtn) inquiryBtn.classList.add('active');
        inquirySection.style.display = 'block';
        signinSection.style.display = 'none';
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-portal-tab');
        activateTab(target);
      });
    });

    // Check URL hash (#signin or direct link)
    if (window.location.hash === '#signin') {
      activateTab('signin');
    }
  }

  // Inquiry Form Handler
  window.handleInquirySubmit = function(event, form) {
    if (event) event.preventDefault();
    const successBox = document.getElementById('inquiry-success-box');
    if (form && successBox) {
      form.style.display = 'none';
      successBox.style.display = 'block';
    }
  };

  window.resetInquiryForm = function() {
    const form = document.getElementById('inquiry-form');
    const successBox = document.getElementById('inquiry-success-box');
    if (form && successBox) {
      form.reset();
      form.style.display = 'block';
      successBox.style.display = 'none';
    }
  };

  // Client Sign-In Handler (Secondary & Primary Auth Portal)
  window.handleClientSignIn = function(event, form) {
    if (event) event.preventDefault();
    const emailInput = form?.querySelector('input[type="email"]');
    const emailVal = emailInput ? emailInput.value : 'client@atelier.example';
    const formContainer = document.getElementById('signin-form-wrapper');
    const sessionBanner = document.getElementById('signin-session-banner');
    const userDisplay = document.getElementById('authenticated-user-display');

    if (formContainer && sessionBanner) {
      formContainer.style.display = 'none';
      sessionBanner.style.display = 'block';
      if (userDisplay) {
        userDisplay.textContent = emailVal;
      }
      localStorage.setItem('atelier_client_session', JSON.stringify({
        authenticated: true,
        email: emailVal,
        signedInAt: new Date().toISOString()
      }));
    }
  };

  window.handleClientSignOut = function() {
    localStorage.removeItem('atelier_client_session');
    const formContainer = document.getElementById('signin-form-wrapper');
    const sessionBanner = document.getElementById('signin-session-banner');
    if (formContainer && sessionBanner) {
      formContainer.style.display = 'block';
      sessionBanner.style.display = 'none';
    }
  };

  // Restore authenticated state if present in storage
  const savedSession = localStorage.getItem('atelier_client_session');
  if (savedSession) {
    try {
      const parsed = JSON.parse(savedSession);
      if (parsed && parsed.authenticated) {
        const formContainer = document.getElementById('signin-form-wrapper');
        const sessionBanner = document.getElementById('signin-session-banner');
        const userDisplay = document.getElementById('authenticated-user-display');
        if (formContainer && sessionBanner) {
          formContainer.style.display = 'none';
          sessionBanner.style.display = 'block';
          if (userDisplay) userDisplay.textContent = parsed.email;
        }
      }
    } catch {
      // Ignore parse error
    }
  }
}

/* ==========================================================================
   10. DYNAMIC COPYRIGHT YEAR
   ========================================================================== */
function initDynamicYear() {
  const yearEls = document.querySelectorAll('.current-year, #current-year');
  const currentYear = new Date().getFullYear().toString();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
}

/* ==========================================================================
   11. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') return;

  const targets = document.querySelectorAll(
    '.section-header-editorial, .editorial-row-item, .gallery-plate, .featured-monograph-card, .editorial-quote-spread, .secondary-signin-portal, .immersive-cta-banner'
  );

  if (!targets.length) return;

  targets.forEach(el => {
    el.classList.add('reveal-init');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   12. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}
