# Codex Build Prompt For Moon Light Studios

Use this prompt in VS Code with Codex when you want to continue the project.

```text
You are building Moon Light Studios, a production-quality photography booking platform for my brother's business in Andhra Pradesh.

Current priority:
Make the website polished, reliable, and easy to operate for 24/7 photography bookings anywhere in Andhra Pradesh.

Business requirements:
- Brand name: Moon Light Studios.
- Tagline: Photography . Cinematics . Edits.
- Coverage: all over Andhra Pradesh, 24 hours, anywhere in AP.
- Services: wedding photography, pre-wedding shoots, birthday shoots, personal shoots, reel production, editing works, and custom projects.
- Pricing must be package-based and transparent.
- Pricing must include city/travel charges.
- Booking form must collect name, email, phone, alternate phone, service, package, city, preferred date, preferred time, venue/address, and project vision.
- Admin must be able to login, see bookings, and update booking status.
- Website must feel premium, emotional, trustworthy, fast, and mobile-first.
- Use real business language. Avoid fake hype. Make it useful for clients who want to call immediately.

Architecture requirements:
- Keep frontend and backend separated.
- Public files:
  - index.html
  - frontend/css/style.css
  - frontend/js/api.js
  - frontend/js/main.js
- Admin files:
  - frontend/pages/admin/login.html
  - frontend/pages/admin/dashboard.html
  - frontend/css/admin.css
  - frontend/js/admin-login.js
  - frontend/js/admin-dashboard.js
- Backend:
  - backend/server.js
  - backend/config/locations.js
  - backend/config/pricing.js
  - backend/middleware/auth.js
  - backend/store.js
- Do not break the current working JSON storage flow unless replacing it fully with MongoDB.
- Preserve the API contract used by the frontend.

Current API contract:
- GET /api/services
- GET /api/locations
- POST /api/pricing/estimate
- POST /api/bookings
- GET /api/gallery
- POST /api/admin/login
- GET /api/admin/bookings
- PATCH /api/admin/bookings/:id/status

Implementation style:
- Read existing files before editing.
- Keep UI responsive on mobile and desktop.
- Cards should be clean with small radius, not overly rounded.
- No decorative clutter.
- Make the first screen immediately communicate the brand and AP-wide 24/7 booking.
- Add validation and clear error/success messages.
- Prefer simple, maintainable code over large abstractions.

Next best upgrades:
1. Add MongoDB models for Booking, Contact, Gallery, User, Location, Service.
2. Add gallery manager with image upload.
3. Add email notifications with Nodemailer.
4. Add WhatsApp click-to-chat message generation from booking data.
5. Add Google Maps distance calculation for more accurate travel charges.
6. Add testimonials, FAQ, package comparison, and SEO metadata for AP city pages.
7. Add image optimization and replace demo images with original portfolio work.
8. Add production environment documentation for PM2, Nginx, SSL, and MongoDB Atlas.

Before finishing:
- Run npm install if dependencies are missing.
- Run npm run seed.
- Run npm start or npm run dev.
- Test public site, booking submission, admin login, bookings dashboard, and status update.
- Summarize changed files and any remaining setup required.
```
