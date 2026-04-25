// ── NAVBAR ──
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── SCROLL ANIMATIONS ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));

  // ── ANIMATED COUNTERS ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased).toLocaleString();
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ── LOAD EVENTS ──
  const eventsContainer = document.getElementById('eventsContainer');
  if (eventsContainer) {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.events.length) {
          eventsContainer.innerHTML = data.events.map(ev => {
            const d = new Date(ev.date);
            const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
            const day = d.getDate();
            return `<div class="event-card fade-up">
              <div class="event-date"><div class="month">${month}</div><div class="day">${day}</div></div>
              <div class="event-info"><span class="event-cat">${ev.category}</span><h3>${ev.title}</h3><p>${ev.description}</p></div>
            </div>`;
          }).join('');
          eventsContainer.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
        }
      })
      .catch(() => { eventsContainer.innerHTML = '<p>Unable to load events.</p>'; });
  }

  // ── NEWSLETTER ──
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = nlForm.querySelector('input[type="email"]').value;
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
        });
        const data = await res.json();
        showToast(data.message, data.success ? 'success' : 'error');
        if (data.success) nlForm.reset();
      } catch { showToast('Network error. Please try again.', 'error'); }
    });
  }

  // ── TABS ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tab)?.classList.add('active');
    });
  });
});

// ── TOAST NOTIFICATION ──
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
