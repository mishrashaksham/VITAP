document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admissionForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    const data = {
      name: form.querySelector('#admName').value.trim(),
      email: form.querySelector('#admEmail').value.trim(),
      phone: form.querySelector('#admPhone').value.trim(),
      program: form.querySelector('#admProgram').value,
      message: form.querySelector('#admMessage').value.trim()
    };

    try {
      const res = await fetch('/api/admissions/inquiry', {
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
