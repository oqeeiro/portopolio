(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intro overlay: short, skippable, and disabled when reduced motion is preferred.
  const introScreen = $('#introScreen');
  const finishIntro = () => {
    if (!introScreen) return;
    introScreen.classList.add('is-done');
    window.setTimeout(() => introScreen.remove(), 900);
  };
  if (prefersReducedMotion) finishIntro();
  else window.setTimeout(finishIntro, 1550);
  introScreen?.addEventListener('click', finishIntro);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && introScreen && !introScreen.classList.contains('is-done')) finishIntro();
  });

  // Mobile navigation.
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  $$('#navLinks a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }));

  // Theme toggle is remembered only for the current page session.
  const themeToggle = $('#themeToggle');
  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
      const light = theme === 'light';
      themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggle.title = light ? 'Switch to dark theme' : 'Switch to light theme';
      $('.theme-icon', themeToggle).textContent = light ? '☾' : '☼';
    }
    const metaTheme = $('meta[name="theme-color"]');
    if (metaTheme) metaTheme.content = theme === 'light' ? '#f0f0e9' : '#101211';
  };
  setTheme('dark');
  themeToggle?.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

  // Scroll reveal with a safe fallback when IntersectionObserver is unavailable.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Project filters.
  const projectFilters = $$('[data-project-filter]');
  const projectCards = $$('.project-card');
  projectFilters.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter;
    projectFilters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach((card) => card.classList.toggle('is-filtered-out', filter !== 'all' && card.dataset.category !== filter));
  }));

  // Project detail dialog. Project cards are explicitly marked as concept/learning work.
  const projectInfo = {
    lele: {
      number: 'PROJECT 01 / WEB DESIGN', title: 'Lele Barokah',
      description: 'A landing-page concept for a catfish farming business. The design direction uses a dark aquatic palette, clear content hierarchy, and simple calls to action to explain the business to a first-time visitor.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Responsive layout'], art: '.art-fish'
    },
    absen: {
      number: 'PROJECT 02 / WEB APP CONCEPT', title: 'Absen Digital',
      description: 'A student attendance-system learning project. The planned experience includes an admin login, searchable student records, attendance summaries, and CRUD workflows using Laravel and MySQL.',
      tags: ['Laravel', 'PHP', 'MySQL', 'CRUD', 'Search'], art: '.art-attendance'
    },
    runner: {
      number: 'PROJECT 03 / GAME LOGIC', title: 'Q-Runner',
      description: 'An obstacle-runner game concept focused on timing and survival rather than collecting coins. Planned hazards include ground spikes and flying obstacles, with more breathing room between hazards and gradually increasing speed.',
      tags: ['Game logic', 'Collision detection', 'Difficulty curve', 'Input handling'], art: '.art-runner'
    },
    calculator: {
      number: 'PROJECT 04 / BEGINNER BUILD', title: 'Python Calculator',
      description: 'A beginner calculator project intended to run as a desktop window. It is a practical way to learn event handling, numeric operations, basic validation, and the structure of a small desktop program.',
      tags: ['Python', 'Arithmetic logic', 'Desktop UI', 'Input validation'], art: '.art-calc'
    }
  };
  const projectDialog = $('#projectDialog');
  $$('.project-open').forEach((button) => button.addEventListener('click', () => {
    const info = projectInfo[button.dataset.project];
    if (!info || !projectDialog) return;
    $('#dialogProjectKicker').textContent = info.number;
    $('#projectDialogTitle').textContent = info.title;
    $('#projectDialogDescription').textContent = info.description;
    $('#dialogProjectTags').replaceChildren(...info.tags.map((tag) => {
      const span = document.createElement('span'); span.textContent = tag; return span;
    }));
    const originalArt = $(info.art, button);
    const artHost = $('#dialogProjectArt');
    artHost.replaceChildren();
    if (originalArt) {
      const artClone = originalArt.cloneNode(true);
      artClone.classList.add('project-art');
      artHost.appendChild(artClone);
    }
    if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
    else projectDialog.setAttribute('open', '');
  }));
  $('.dialog-close', projectDialog)?.addEventListener('click', (event) => {
    event.preventDefault(); projectDialog.close();
  });
  projectDialog?.addEventListener('click', (event) => {
    if (event.target === projectDialog) projectDialog.close();
  });

  // Certificate metadata in the same order as the certificate cards.
  const certificates = [
    { image: 'assets/certificates/cert-01.jpg', date: '06 OCT 2026', title: 'Dari Grogi Jadi Percaya Diri: Kuasai Panggung Public Speaking', org: 'Galeria Potensi Indonesia · Program Belajar Nasional Basic Public Speaking' },
    { image: 'assets/certificates/cert-02.jpg', date: '28 SEP 2026', title: 'Strategi Mengatasi Blank Saat Berbicara di Depan Umum', org: 'Galeria Potensi Indonesia · Webinar Nasional Public Speaking' },
    { image: 'assets/certificates/cert-03.jpg', date: '21 SEP 2026', title: 'Membangun Ketenangan dan Kepercayaan Diri dalam Public Speaking', org: 'Galeria Potensi Indonesia · Webinar Nasional Basic Public Speaking' },
    { image: 'assets/certificates/cert-04.jpg', date: '08 SEP 2026', title: 'Berbicara Spontan: Tetap Tenang, Percaya Diri dan Terarah', org: 'Galeria Potensi Indonesia · Webinar Nasional Public Speaking' },
    { image: 'assets/certificates/cert-05.jpg', date: '30 AUG 2026', title: 'Rahasia Bebas Blank Saat Public Speaking', org: 'Galeria Potensi Indonesia · Program Webinar Nasional Public Speaking' },
    { image: 'assets/certificates/cert-10.jpg', date: '19 AUG 2026', title: 'Seni Berbicara Spontan dalam Public Speaking', org: 'Galeria Potensi Indonesia · Webinar Nasional Public Speaking' },
    { image: 'assets/certificates/cert-07.jpg', date: '12 AUG 2026', title: 'Seni Berkomunikasi Agar Didengar, Dipahami dan Dipercaya — Contribution', org: 'Galeria Potensi Indonesia · Appreciation for contribution and outreach' },
    { image: 'assets/certificates/cert-08.jpg', date: '12 AUG 2026', title: 'Seni Berkomunikasi Agar Didengar, Dipahami dan Dipercaya', org: 'Galeria Potensi Indonesia · Webinar Nasional Public Speaking' },
    { image: 'assets/certificates/cert-06.jpg', date: '06 AUG 2026', title: 'Seni Merespons dengan Bijak untuk Membangun Komunikasi yang Nyaman', org: 'Galeria Potensi Indonesia · Webinar Nasional Basic Public Speaking' },
    { image: 'assets/certificates/cert-09.jpg', date: '23 MAY 2026', title: 'AI: Coding untuk Masa Depan Edukasi Digital', org: 'PT Talenta Prestasi Indonesia · Webinar AI' }
  ];
  const certFilters = $$('[data-cert-filter]');
  const certCards = $$('.certificate-card');
  certFilters.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.certFilter;
    certFilters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    certCards.forEach((card) => card.classList.toggle('is-filtered-out', filter !== 'all' && card.dataset.certCategory !== filter));
  }));

  const certDialog = $('#certificateDialog');
  let currentCert = 0;
  const renderCert = (index) => {
    currentCert = (index + certificates.length) % certificates.length;
    const cert = certificates[currentCert];
    $('#certDialogImage').src = cert.image;
    $('#certDialogImage').alt = `Certificate: ${cert.title}`;
    $('#certDialogDate').textContent = cert.date;
    $('#certDialogTitle').textContent = cert.title;
    $('#certDialogOrg').textContent = cert.org;
    $('#certDialogCount').textContent = `${String(currentCert + 1).padStart(2, '0')} / ${String(certificates.length).padStart(2, '0')}`;
  };
  certCards.forEach((card) => card.addEventListener('click', () => {
    renderCert(Number(card.dataset.cert));
    if (typeof certDialog.showModal === 'function') certDialog.showModal();
    else certDialog.setAttribute('open', '');
  }));
  $('#certPrev')?.addEventListener('click', () => renderCert(currentCert - 1));
  $('#certNext')?.addEventListener('click', () => renderCert(currentCert + 1));
  $('.cert-dialog-close', certDialog)?.addEventListener('click', (event) => {
    event.preventDefault(); certDialog.close();
  });
  certDialog?.addEventListener('click', (event) => {
    if (event.target === certDialog) certDialog.close();
  });
  certDialog?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') renderCert(currentCert + 1);
    if (event.key === 'ArrowLeft') renderCert(currentCert - 1);
  });

  // Copyable intro message gives the visitor a useful action without pretending a contact URL is configured.
  const toast = $('#toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2700);
  };
  $('#copyIntro')?.addEventListener('click', async () => {
    const message = 'Hi Qeeiro! I visited your portfolio and would like to connect about your projects.';
    try {
      await navigator.clipboard.writeText(message);
      showToast('Intro message copied. Paste it into your preferred chat app.');
    } catch {
      const temp = document.createElement('textarea');
      temp.value = message; temp.setAttribute('readonly', '');
      temp.style.position = 'absolute'; temp.style.left = '-9999px';
      document.body.appendChild(temp); temp.select();
      const copied = document.execCommand('copy'); temp.remove();
      showToast(copied ? 'Intro message copied.' : message);
    }
  });
})();
