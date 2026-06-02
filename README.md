# Moon Light Studios

Photography booking website for Andhra Pradesh-wide service coverage.

## What Is Included

- Public website with hero, services, AP locations, pricing calculator, gallery, and 24/7 booking form.
- Express backend with API routes for services, locations, estimates, bookings, gallery, contact, and admin login.
- Admin login and dashboard for viewing booking requests and changing status.
- Local JSON storage for the first working version, so the project can run before MongoDB is connected.

## Quick Start

```bash
npm install
Copy-Item backend/.env.example backend/.env
npm run seed
npm run dev
```

Open:

- Website: `http://localhost:5000`
- Admin login: `http://localhost:5000/admin/login`

Default demo admin:

- Email: `admin@moonlightstudios.in`
- Password: `ChangeMe@123`

Change these in `backend/.env` before sharing the site.

## Project Structure

```text
backend/
  config/       Andhra Pradesh locations and pricing data
  middleware/   Admin JWT middleware
  data/         Local JSON data created at runtime
  server.js     Express app and API routes
frontend/
  css/          Public and admin styles
  js/           Public and admin browser logic
  pages/admin/  Admin login and dashboard
index.html      Public website
PROMPT.md       Codex build prompt for the next production phase
```

## Next Production Upgrades

- Replace JSON storage with MongoDB models.
- Add file upload and gallery manager.
- Add email and WhatsApp notifications.
- Add Google Maps distance calculation.
- Add payment collection and invoice records.
- Replace demo Unsplash gallery images with original Moon Light Studios work.
- Add real licensed audio at `frontend/assets/audio/background-score.mp3`.
