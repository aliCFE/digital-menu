# Digital Menu Platform

A digital restaurant menu with a customer-facing menu (cart, checkout, WhatsApp
ordering) and a full admin dashboard to manage categories, items, orders,
settings, appearance and a QR code — no code edits required to run a restaurant.

## Stack

- **Client**: React + Vite, React Router, plain CSS (CSS Modules + a CSS-variable
  token system for theming — no Tailwind).
- **Server**: Node.js + Express, JWT auth, a JSON file database (`lowdb`) that
  can be swapped for Postgres/MongoDB later without touching the routes' shape.

## Project structure

```
digital-menu/
  server/              Express API
    routes/            REST endpoints (auth, restaurants, categories, items, orders, upload)
    middleware/         JWT auth guard
    utils/seed.js       Seeds the demo/starter restaurant on first run
    data/db.json         The database file (auto-created)
    uploads/             Uploaded + seed images, served at /uploads
  client/
    src/
      components/menu/    Customer-facing menu UI
      components/admin/   Shared admin UI (sidebar fields, page header, etc.)
      components/common/  Shared UI (buttons, modal, icons, image upload...)
      pages/menu/          Customer menu page
      pages/admin/         Admin dashboard pages
      layouts/             MenuLayout (customer) and AdminLayout (sidebar)
      context/             Cart, Auth, Language, Toast
      services/            One file per API resource
      utils/                formatCurrency, whatsapp message builder, color/theme helpers
```

## Running locally

Requires Node.js 18+.

```bash
npm run install:all
npm run dev
```

This starts the API on **http://localhost:4000** and the client on
**http://localhost:5195** (proxied, so the client just calls `/api/...`).

On first run the server seeds one restaurant automatically — no manual step needed.

- Customer menu: `http://localhost:5195/r/tannour`
- Admin login: `http://localhost:5195/admin/login`
  - Username: `admin`
  - Password: `admin123`

Change the demo password from **Admin Profile** after logging in.

## Notes

- Routing supports both `/r/:slug` and `/menu/:slug` (the latter redirects to
  the former), matching the two URL patterns commonly used for QR menus.
- The app is Arabic-only (RTL) by design — there is no language toggle.
- Uploaded images are written to `server/uploads/` and served at `/uploads/...`;
  the 4 seed photos live in `server/uploads/seed/`.
- To point the client at a different API origin in production, set
  `CLIENT_ORIGIN` in `server/.env` (copy from `.env.example`) and adjust the
  Vite proxy / build accordingly.
