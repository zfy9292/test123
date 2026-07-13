const body = document.body;
const langButton = document.querySelector('.lang-switch');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.getElementById('year');
const progress = document.querySelector('.scroll-progress');
const toTop = document.querySelector('.to-top');
const toast = document.querySelector('.toast');
const cursorGlow = document.querySelector('.cursor-glow');

if (year) {
  year.textContent = new Date().getFullYear();
}

function applyLanguage(lang) {
  body.classList.remove('lang-zh', 'lang-en');
  body.classList.add(`lang-${lang}`);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  if (langButton) {
    langButton.textContent = lang === 'zh' ? 'EN' : '中文';
  }
  localStorage.setItem('preferred-language', lang);
}

const savedLanguage = localStorage.getItem('preferred-language') || 'zh';
applyLanguage(savedLanguage);

if (langButton) {
  langButton.addEventListener('click', () => {
    const nextLanguage = body.classList.contains('lang-zh') ? 'en' : 'zh';
    applyLanguage(nextLanguage);
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    body.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progress) {
    progress.style.width = `${percent}%`;
  }
  if (toTop) {
    toTop.classList.toggle('show', scrollTop > 460);
  }
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

if (toTop) {
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -70px 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle('active', anchor.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach((section) => activeObserver.observe(section));

const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((0.5 - y / rect.height)) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

const magneticItems = document.querySelectorAll('.magnetic');
magneticItems.forEach((item) => {
  item.addEventListener('mousemove', (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.06}px, ${y * 0.08}px)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

if (cursorGlow) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.transform = `translate3d(${event.clientX - 120}px, ${event.clientY - 120}px, 0)`;
  }, { passive: true });
}

const copyButton = document.querySelector('.copy-email');
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 1800);
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast(body.classList.contains('lang-zh') ? '邮箱已复制' : 'Email copied');
    } catch (error) {
      showToast(email);
    }
  });
}
