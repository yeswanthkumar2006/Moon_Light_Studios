const API_BASE = ['127.0.0.1:5500', 'localhost:5500'].includes(window.location.host)
  ? 'http://localhost:5000'
  : '';

const API = {
  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : { error: 'Backend returned a webpage instead of JSON. Start the backend with npm start and use http://localhost:5000.' };
    if (!response.ok) throw new Error(data.error || 'Request failed');
    if (!contentType.includes('application/json')) throw new Error(data.error);
    return data;
  },

  getServices() {
    return this.request('/api/services');
  },

  getLocations() {
    return this.request('/api/locations');
  },

  getStills(category = '') {
    return this.request(`/api/stills${category ? `?category=${encodeURIComponent(category)}` : ''}`);
  },

  estimate(payload) {
    return this.request('/api/pricing/estimate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  createBooking(payload) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getGallery(category = '') {
    return this.request(`/api/gallery${category ? `?category=${encodeURIComponent(category)}` : ''}`);
  },

  adminLogin(payload) {
    return this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  adminBookings(token) {
    return this.request('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  updateBookingStatus(token, id, status) {
    return this.request(`/api/admin/bookings/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
  }
};

window.API = API;
