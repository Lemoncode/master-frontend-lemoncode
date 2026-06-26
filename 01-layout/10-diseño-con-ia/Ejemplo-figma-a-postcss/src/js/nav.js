// Header: menú móvil accesible, sombra al hacer scroll y enlace activo
// según la sección visible (scrollspy). JS vanilla, sin dependencias.

const DESKTOP_QUERY = '(min-width: 64rem)';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const toggle = nav.querySelector('[data-nav-toggle]');
  const menu = nav.querySelector('[data-nav-menu]');
  const links = Array.from(nav.querySelectorAll('[data-nav-link]'));
  const desktop = window.matchMedia(DESKTOP_QUERY);

  /* ---------------------------- Menú móvil ---------------------------- */
  const openMenu = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  };

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };

  const isOpen = () => nav.classList.contains('is-open');

  if (toggle && menu) {
    toggle.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

    // Cerrar al pulsar un enlace (navegación dentro de la misma página).
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    // Cerrar con Escape.
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // Al pasar a desktop, asegurar el menú reseteado.
    desktop.addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }

  /* ----------------------- Sombra al hacer scroll --------------------- */
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --------------------- Enlace activo (scrollspy) -------------------- */
  const byId = new Map();
  const sections = [];

  links.forEach((link) => {
    const id = link.getAttribute('href')?.replace('#', '');
    const section = id && document.getElementById(id);
    if (section) {
      byId.set(section, link);
      sections.push(section);
    }
  });

  const setActive = (link) => {
    links.forEach((el) => {
      const active = el === link;
      el.classList.toggle('nav__link--active', active);
      if (active) {
        el.setAttribute('aria-current', 'true');
      } else {
        el.removeAttribute('aria-current');
      }
    });
  };

  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(byId.get(entry.target));
        });
      },
      {
        // La sección se considera activa cuando cruza el tercio superior,
        // justo bajo el header sticky.
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
}
