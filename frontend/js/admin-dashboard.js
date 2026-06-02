const token = localStorage.getItem('mls_admin_token');
const body = document.getElementById('bookingsBody');
const rupeesAdmin = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

if (!token) {
  window.location.href = '/admin/login';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('mls_admin_token');
  window.location.href = '/admin/login';
});

document.getElementById('refreshBtn').addEventListener('click', loadBookings);

function countByStatus(bookings, status) {
  return bookings.filter((booking) => booking.status === status).length;
}

function renderMetrics(bookings) {
  const metrics = [
    ['Total', bookings.length],
    ['Pending', countByStatus(bookings, 'pending')],
    ['Confirmed', countByStatus(bookings, 'confirmed')],
    ['Completed', countByStatus(bookings, 'completed')]
  ];

  document.getElementById('metricGrid').innerHTML = metrics.map(([label, value]) => `
    <article><span>${label}</span><strong>${value}</strong></article>
  `).join('');
}

function renderRows(bookings) {
  if (!bookings.length) {
    body.innerHTML = '<tr><td colspan="7">No bookings yet. Submit one from the website to test the flow.</td></tr>';
    return;
  }

  body.innerHTML = bookings.map((booking) => `
    <tr>
      <td>${booking.id}<small>${new Date(booking.createdAt).toLocaleString()}</small></td>
      <td>${booking.fullName}<small>${booking.phone}<br>${booking.email}</small></td>
      <td>${booking.serviceType}<small>${booking.packageType}</small></td>
      <td>${booking.city}<small>${booking.address || 'Address not added'}</small></td>
      <td>${new Date(booking.preferredDate).toLocaleDateString()}<small>${booking.preferredTime || ''}</small></td>
      <td>${rupeesAdmin.format(booking.estimatedPrice || 0)}</td>
      <td>
        <select class="status-select" data-id="${booking.id}">
          ${['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => `
            <option value="${status}" ${booking.status === status ? 'selected' : ''}>${status}</option>
          `).join('')}
        </select>
      </td>
    </tr>
  `).join('');

  body.querySelectorAll('.status-select').forEach((select) => {
    select.addEventListener('change', async () => {
      await API.updateBookingStatus(token, select.dataset.id, select.value);
      await loadBookings();
    });
  });
}

async function loadBookings() {
  try {
    const result = await API.adminBookings(token);
    renderMetrics(result.data);
    renderRows(result.data);
  } catch (error) {
    localStorage.removeItem('mls_admin_token');
    window.location.href = '/admin/login';
  }
}

loadBookings();
