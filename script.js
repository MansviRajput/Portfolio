const root = document.documentElement;
const navLinks = document.querySelectorAll('.nav-links a');
const navMenu = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');
const revealItems = document.querySelectorAll('.reveal');
const tiltCards = document.querySelectorAll('.tilt-card, .hero-panel');

const updateScrollProgress = () => {
  const scrollableHeight = document.body.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  root.style.setProperty('--scroll-progress', progress.toFixed(4));
};

const updatePointer = (event) => {
  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;
  root.style.setProperty('--mouse-x', x);
  root.style.setProperty('--mouse-y', y);
};

const closeMenu = () => {
  navMenu?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
};

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.querySelectorAll('.footer-links a').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');

    if (!href || href === '#') {
      event.preventDefault();
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.16,
  }
);

revealItems.forEach((item, index) => {
  item.style.setProperty('--delay', `${Math.min(index * 55, 260)}ms`);
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0,
  }
);

document.querySelectorAll('main section[id], footer[id]').forEach((section) => {
  sectionObserver.observe(section);
});

tiltCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 9;
    const rotateX = (0.5 - py) * 8;

    card.style.setProperty('--card-x', `${px * 100}%`);
    card.style.setProperty('--card-y', `${py * 100}%`);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
window.addEventListener('pointermove', updatePointer, { passive: true });

updateScrollProgress();
