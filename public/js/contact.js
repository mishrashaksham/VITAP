document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = {
      name: form.querySelector('#contactName').value.trim(),
      email: form.querySelector('#contactEmail').value.trim(),
      subject: form.querySelector('#contactSubject').value.trim(),
      message: form.querySelector('#contactMessage').value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      showToast(result.message || result.error, result.success ? 'success' : 'error');
      if (result.success) form.reset();
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
});
