const form = document.getElementById('loginForm');
const status = document.getElementById('loginStatus');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.classList.remove('error');
  status.textContent = 'Checking credentials...';

  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const result = await API.adminLogin(payload);
    localStorage.setItem('mls_admin_token', result.data.token);
    window.location.href = '/admin/dashboard';
  } catch (error) {
    status.classList.add('error');
    status.textContent = error.message;
  }
});
