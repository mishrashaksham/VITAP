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

  // ── SCROLL ANIMATIONS (GSAP) ──
  const initGSAPAnimation = (el, type = 'fade-up') => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      if (type === 'fade-up') {
        gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      } else {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
      }
    }
  };

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  document.querySelectorAll('.fade-up').forEach(el => initGSAPAnimation(el, 'fade-up'));
  document.querySelectorAll('.fade-in').forEach(el => initGSAPAnimation(el, 'fade-in'));

  // ── 3D SCROLL ANIMATIONS ──
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.about-image img, .image-grid-item img').forEach(img => {
      gsap.fromTo(img, 
        { rotateX: 15, rotateY: -15, scale: 0.9 },
        {
          rotateX: 0, rotateY: 0, scale: 1,
          scrollTrigger: {
            trigger: img,
            start: "top 90%",
            end: "center center",
            scrub: 1
          }
        }
      );
    });

    // ── SCROLL GRADIENTS ──
    let bgLayer = document.querySelector('.bg-gradient-layer');
    if (!bgLayer) {
      bgLayer = document.createElement('div');
      bgLayer.className = 'bg-gradient-layer';
      document.body.prepend(bgLayer);
    }
    
    if (bgLayer) {
      const sections = gsap.utils.toArray('section');
      const colors = ['#0a0a0a', '#150508', '#0d0d0f', '#0a0a0a', '#120b00'];
      sections.forEach((sec, i) => {
        const color = colors[i % colors.length];
        ScrollTrigger.create({
          trigger: sec,
          start: "top center",
          end: "bottom center",
          onEnter: () => gsap.to(bgLayer, { backgroundColor: color, duration: 1.5, ease: "power2.out" }),
          onEnterBack: () => gsap.to(bgLayer, { backgroundColor: color, duration: 1.5, ease: "power2.out" })
        });
      });
    }
  }

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
    const mockEvents = [
      { title: "VITEEE 2026 Registration Open", date: "2026-05-15", category: "Admissions", description: "Register now for VIT Engineering Entrance Examination 2026. Last date to apply is May 15, 2026." },
      { title: "International Conference on AI & ML", date: "2026-06-10", category: "Conference", description: "3-day international conference on Artificial Intelligence and Machine Learning applications." },
      { title: "Gravitas 2026 — Technical Festival", date: "2026-09-20", category: "Festival", description: "Annual technical festival featuring hackathons, workshops, guest lectures, and competitions." }
    ];
    eventsContainer.innerHTML = mockEvents.map(ev => {
      const d = new Date(ev.date);
      const month = d.toLocaleString('en', { month: 'short' }).toUpperCase();
      const day = d.getDate();
      return `<div class="event-card fade-up">
        <div class="event-date"><div class="month">${month}</div><div class="day">${day}</div></div>
        <div class="event-info"><span class="event-cat">${ev.category}</span><h3>${ev.title}</h3><p>${ev.description}</p></div>
      </div>`;
    }).join('');
    eventsContainer.querySelectorAll('.fade-up').forEach(el => initGSAPAnimation(el, 'fade-up'));
  }

  // ── NEWSLETTER ──
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("Thank you! Your request has been submitted successfully (Static Demo).");
      nlForm.reset();
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

  // ── MAGNETIC CUSTOM CURSOR ──
  if (window.matchMedia("(pointer: fine)").matches && typeof gsap !== 'undefined') {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const xTo = gsap.quickTo(cursor, "left", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "top", { duration: 0.2, ease: "power3" });

    document.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    const updateCursorLinks = () => {
      // Magnetic pull for buttons
      document.querySelectorAll('.btn, .nav-cta, .card').forEach(el => {
        if (!el.dataset.magneticBound) {
          el.dataset.magneticBound = 'true';
          
          el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: "power2.out" });
            cursor.classList.add('link-hover');
            
            // Slight magnetic pull of cursor towards center
            xTo(e.clientX - x * 0.1);
            yTo(e.clientY - y * 0.1);
          });
          
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            cursor.classList.remove('link-hover');
          });
        }
      });

      // Normal hover for other links
      document.querySelectorAll('a:not(.btn):not(.nav-cta), button:not(.btn):not(.nav-cta)').forEach(el => {
        if (!el.dataset.cursorBound) {
          el.dataset.cursorBound = 'true';
          el.addEventListener('mouseenter', () => cursor.classList.add('link-hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
        }
      });
    };
    
    updateCursorLinks();
    
    const cursorObserver = new MutationObserver(() => updateCursorLinks());
    cursorObserver.observe(document.body, { childList: true, subtree: true });
  }
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
