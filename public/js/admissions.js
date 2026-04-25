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

    setTimeout(() => {
      alert("Thank you! Your request has been submitted successfully (Static Demo).");
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
    }, 500);
  });
});
