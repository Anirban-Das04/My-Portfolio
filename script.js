/**
 * ANIRBAN DAS — PORTFOLIO JAVASCRIPT
 * Features: Loader, Typed Text, Scroll Animations,
 *           Theme Toggle, Particles, Tilt, Counter, Nav
 */

'use strict';

/* ================================================
   1. LOADER
   ================================================ */
window.addEventListener('load', () => {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  // Hide loader after ~1.9s
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    // Trigger hero animations after load
    triggerHeroAnimations();
  }, 1900);
});

function triggerHeroAnimations() {
  const heroReveal = document.querySelectorAll('.hero-section .reveal');
  heroReveal.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 150);
  });
}

/* ================================================
   2. SCROLL PROGRESS BAR
   ================================================ */
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ================================================
   3. NAVBAR — Scroll + Active Link + Mobile Menu
   ================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.getElementById('hamburger');
const navLinksMenu = document.getElementById('nav-links');

// Scroll -> navbar background
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Active nav link based on scroll
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
  const scrollPos = window.scrollY + window.innerHeight / 2;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });

// Mobile menu toggle
let overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
  navLinksMenu.classList.add('open');
  hamburger.classList.add('active');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinksMenu.classList.remove('open');
  hamburger.classList.remove('active');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  if (navLinksMenu.classList.contains('open')) closeMenu();
  else openMenu();
});

overlay.addEventListener('click', closeMenu);

navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ================================================
   4. THEME TOGGLE — Dark / Light
   ================================================ */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const html        = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateThemeIcon(next);

  // Ripple flash effect
  themeToggle.style.transform = 'scale(1.2) rotate(30deg)';
  setTimeout(() => {
    themeToggle.style.transform = '';
  }, 300);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* ================================================
   5. TYPED TEXT EFFECT
   ================================================ */
const typedText = document.getElementById('typed-text');
const roles = [
  'BTech CSE Student',
  'Web Developer',
  'Data Enthusiast',
  'Problem Solver',
  'Python Programmer'
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
let typingTimeout;

function typeText() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // Typing forward
    typedText.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      // Pause at full word
      isDeleting = true;
      typingTimeout = setTimeout(typeText, 2000);
      return;
    }
  } else {
    // Deleting
    typedText.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      typingTimeout = setTimeout(typeText, 400);
      return;
    }
  }

  const speed = isDeleting ? 60 : 100;
  typingTimeout = setTimeout(typeText, speed);
}

// Start typing after loader
setTimeout(typeText, 2200);

/* ================================================
   6. SCROLL REVEAL ANIMATIONS
   ================================================ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Only animate once
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

revealEls.forEach(el => {
  // Skip hero reveals (handled separately)
  if (!el.closest('.hero-section')) {
    revealObserver.observe(el);
  }
});

/* ================================================
   7. COUNTER ANIMATION
   ================================================ */
const statNums = document.querySelectorAll('.stat-num[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'));
  const duration = 1500;
  const step     = 16;
  const increment = target / (duration / step);
  let current    = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

/* ================================================
   8. CARD TILT EFFECT
   ================================================ */
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    card.style.transition = 'transform 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

/* ================================================
   9. PARTICLES CANVAS
   ================================================ */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.alpha  = Math.random() * 0.5 + 0.1;
    this.hue    = Math.random() > 0.5 ? '108, 99, 255' : '255, 107, 107';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.hue}, ${this.alpha})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  animFrame = requestAnimationFrame(animateParticles);
}

// Start particles (defer a bit for performance)
setTimeout(animateParticles, 2000);

/* ================================================
   10. BACK TO TOP BUTTON
   ================================================ */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ================================================
   11. CONTACT FORM
   ================================================ */
const sendBtn  = document.getElementById('send-btn');
const formNote = document.getElementById('form-note');

sendBtn.addEventListener('click', () => {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Simple validation
  if (!name || !email || !message) {
    formNote.style.color = '#ff6b6b';
    formNote.textContent = '⚠ Please fill in all fields.';
    shakeElement(sendBtn);
    return;
  }

  if (!isValidEmail(email)) {
    formNote.style.color = '#ff6b6b';
    formNote.textContent = '⚠ Please enter a valid email address.';
    shakeElement(sendBtn);
    return;
  }

  // Simulate sending
  sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  sendBtn.disabled  = true;

  setTimeout(() => {
    sendBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    sendBtn.style.background = '#43e97b';
    formNote.style.color = '#43e97b';
    formNote.textContent = '✓ Thanks! I\'ll get back to you soon.';

    // Reset after 3s
    setTimeout(() => {
      sendBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      sendBtn.style.background = '';
      sendBtn.disabled = false;
      formNote.textContent = '';
      document.getElementById('name').value    = '';
      document.getElementById('email').value   = '';
      document.getElementById('message').value = '';
    }, 3000);
  }, 1500);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeElement(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 400);
}

// Add shake keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);

/* ================================================
   12. SMOOTH SCROLLING for Nav Links
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ================================================
   13. FORM INPUT — Floating Label Effect
   ================================================ */
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
  });
});
/* ================================================
   14. SKILL BARS — Animate on Scroll
   ================================================ */
const skillBars = document.querySelectorAll('.skill-bar-fill[data-width]');

const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const width = bar.getAttribute('data-width');
      // Small delay so user sees start of animation
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 200);
      skillBarObserver.unobserve(bar);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillBarObserver.observe(bar));

/* ================================================
   15. SKILLS MASONRY — Stagger Reveal
   ================================================ */
const skillsMasonry = document.querySelector('.skills-masonry');

if (skillsMasonry) {
  const masonryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        masonryObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  masonryObserver.observe(skillsMasonry);
}

/* ================================================
   16. MOUSE PARALLAX — Subtle depth on hero orbs
   ================================================ */
const heroSection = document.querySelector('.hero-section');
const orbs = document.querySelectorAll('.orb');

if (heroSection && window.innerWidth > 768) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.height / 2) / rect.height;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 12;
      orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    orbs.forEach(orb => { orb.style.transform = ''; });
  });
}

/* ================================================
   17. SKILL PILLS — Hover ripple glow
   ================================================ */
document.querySelectorAll('.skill-pill').forEach(pill => {
  pill.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.2s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ================================================
   18. SECTION ENTRY — Subtle scale + fade for headers
   ================================================ */
const sectionHeaders = document.querySelectorAll('.section-header');

const headerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'headerEntrance 0.7s cubic-bezier(0.4,0,0.2,1) forwards';
      headerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

sectionHeaders.forEach(h => headerObserver.observe(h));

// Inject header entrance keyframe
const headerStyle = document.createElement('style');
headerStyle.textContent = `
  @keyframes headerEntrance {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(headerStyle);
/* ================================================
   19. GLOBAL BACKGROUND — Mouse Parallax on Orbs
   ================================================ */
const globalOrbs = document.querySelectorAll('.global-orb');

if (window.innerWidth > 768 && globalOrbs.length) {
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function lerpGlobalOrbs() {
    currentX += (mouseX - currentX) * 0.04;
    currentY += (mouseY - currentY) * 0.04;

    globalOrbs.forEach((orb, i) => {
      const depth = (i + 1) * 18;
      orb.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`;
    });

    requestAnimationFrame(lerpGlobalOrbs);
  }

  lerpGlobalOrbs();
}

/* ================================================
   20. SECTION ENTRY — Glowing border pulse on cards
   ================================================ */
const allGlassCards = document.querySelectorAll('.glass-card');

const cardGlowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('card-entered');
      cardGlowObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

allGlassCards.forEach(card => cardGlowObserver.observe(card));