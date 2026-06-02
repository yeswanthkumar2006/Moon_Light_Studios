require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');
const { services, addOns } = require('./config/pricing');
const { locations, getTravelCharge } = require('./config/locations');
const { stillCategories, getStills } = require('./config/stills');
const store = require('./store');
const auth = require('./middleware/auth');

const app = express();
const rootDir = path.join(__dirname, '..');
const port = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 150 }));

app.use('/frontend', express.static(path.join(rootDir, 'frontend')));
app.use('/assets', express.static(path.join(rootDir, 'frontend', 'assets')));
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));

function assertValid(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, error: errors.array()[0].msg });
  }
  next();
}

function estimatePrice({ serviceType, packageType, city, addOnKeys = [], preferredTime }) {
  const service = services[serviceType];
  const selectedPackage = service?.packages?.[packageType];
  if (!service || !selectedPackage) return null;

  const location = locations.find((item) => item.city === city);
  const travelCharge = location ? getTravelCharge(location.travelKmFromBase) : 0;
  const addOnTotal = addOnKeys.reduce((sum, key) => sum + (addOns[key]?.price || 0), 0);
  const nightCharge = preferredTime === 'night' ? 999 : 0;
  const total = selectedPackage.price + travelCharge + addOnTotal + nightCharge;

  return {
    basePrice: selectedPackage.price,
    travelCharge,
    addOnTotal,
    nightCharge,
    total,
    location
  };
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, name: 'Moon Light Studios API', uptime: process.uptime() });
});

app.get('/api/services', (req, res) => {
  res.json({ success: true, data: { services, addOns } });
});

app.get('/api/locations', (req, res) => {
  res.json({ success: true, data: locations.map((location) => ({ ...location, travelCharge: getTravelCharge(location.travelKmFromBase) })) });
});

app.get('/api/stills', (req, res) => {
  const category = req.query.category;
  const stills = getStills();
  res.json({
    success: true,
    data: {
      categories: stillCategories.map(({ key, label, sourceQuery }) => ({ key, label, sourceQuery })),
      stills: category ? stills.filter((item) => item.category === category) : stills
    }
  });
});

app.post('/api/pricing/estimate', [
  body('serviceType').isString().notEmpty().withMessage('Choose a service.'),
  body('packageType').isString().notEmpty().withMessage('Choose a package.'),
  body('city').isString().notEmpty().withMessage('Choose an Andhra Pradesh city.')
], assertValid, (req, res) => {
  const estimate = estimatePrice(req.body);
  if (!estimate) return res.status(400).json({ success: false, error: 'Invalid service or package.' });
  res.json({ success: true, data: estimate });
});

app.post('/api/bookings', [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Please enter the client name.'),
  body('email').isEmail().withMessage('Please enter a valid email.'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Please enter a valid phone number.'),
  body('serviceType').isString().notEmpty().withMessage('Choose a service.'),
  body('packageType').isString().notEmpty().withMessage('Choose a package.'),
  body('city').isString().notEmpty().withMessage('Choose a city in Andhra Pradesh.'),
  body('preferredDate').isISO8601().withMessage('Choose a valid shoot date.')
], assertValid, async (req, res) => {
  const estimate = estimatePrice(req.body);
  if (!estimate) return res.status(400).json({ success: false, error: 'Invalid package selected.' });

  const bookings = await store.read('bookings', []);
  const booking = {
    id: `MLS-${nanoid(8).toUpperCase()}`,
    ...req.body,
    estimatedPrice: estimate.total,
    priceBreakdown: estimate,
    status: 'pending',
    source: 'website',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);
  await store.write('bookings', bookings);

  res.status(201).json({ success: true, message: 'Booking request received. We are available 24/7 and will call shortly.', data: booking });
});

app.post('/api/contact', [
  body('name').trim().isLength({ min: 2 }).withMessage('Please enter your name.'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Please enter a valid phone number.'),
  body('message').trim().isLength({ min: 5 }).withMessage('Please enter your message.')
], assertValid, async (req, res) => {
  const messages = await store.read('contacts', []);
  const message = { id: nanoid(10), ...req.body, isRead: false, createdAt: new Date().toISOString() };
  messages.unshift(message);
  await store.write('contacts', messages);
  res.status(201).json({ success: true, data: message });
});

app.get('/api/gallery', (req, res) => {
  const category = req.query.category;
  const gallery = [
    { title: 'Temple Wedding Story', category: 'wedding', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80' },
    { title: 'Beach Pre-Wedding', category: 'prewedding', imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80' },
    { title: 'Birthday Celebration', category: 'birthday', imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80' },
    { title: 'Personal Portfolio', category: 'personal', imageUrl: 'https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=900&q=80' },
    { title: 'Creator Reel Shoot', category: 'reel', imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80' },
    { title: 'Two Minute Quick Shoot', category: 'quickshoot', imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80' },
    { title: 'One Shot Portrait Finish', category: 'quickshoot', imageUrl: 'https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80' },
    { title: 'Luxury Album Edit', category: 'editing', imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80' },
    { title: 'Color Grade And Retouch', category: 'editing', imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80' }
  ];
  res.json({ success: true, data: category ? gallery.filter((item) => item.category === category) : gallery });
});

app.post('/api/admin/login', [
  body('email').isEmail().withMessage('Enter admin email.'),
  body('password').isString().notEmpty().withMessage('Enter password.')
], assertValid, (req, res) => {
  const email = process.env.ADMIN_EMAIL || 'admin@moonlightstudios.in';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe@123';

  if (req.body.email !== email || req.body.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
  }

  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '8h' });
  res.json({ success: true, data: { token, admin: { email, role: 'admin' } } });
});

app.get('/api/admin/bookings', auth, async (req, res) => {
  res.json({ success: true, data: await store.read('bookings', []) });
});

app.patch('/api/admin/bookings/:id/status', auth, async (req, res) => {
  const bookings = await store.read('bookings', []);
  const booking = bookings.find((item) => item.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
  booking.status = req.body.status || booking.status;
  booking.updatedAt = new Date().toISOString();
  await store.write('bookings', bookings);
  res.json({ success: true, data: booking });
});

app.get('/', (req, res) => res.sendFile(path.join(rootDir, 'index.html')));
app.get('/admin/login', (req, res) => res.sendFile(path.join(rootDir, 'frontend', 'pages', 'admin', 'login.html')));
app.get('/admin/dashboard', (req, res) => res.sendFile(path.join(rootDir, 'frontend', 'pages', 'admin', 'dashboard.html')));

app.use((req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ success: false, error: 'API route not found.' });
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Moon Light Studios running at http://localhost:${port}`);
});
