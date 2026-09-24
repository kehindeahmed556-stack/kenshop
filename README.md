# Kenshop 🛍️

**An online marketplace for buying & selling new and used items.**

Built with React + Vite, Tailwind CSS, and Supabase (Auth, Postgres, Storage, Realtime).

---

## Features

- **Authentication** — Email/password + Google OAuth, persistent sessions, password reset
- **Listings** — Create, browse, filter, search, edit, delete; multi-photo upload
- **Browse & Search** — Filter by category, condition, price range, location, currency; sort options
- **Item detail** — Photo gallery, seller info, message seller, add to cart / buy now
- **Cart & Checkout** — Cart with quantity controls; mock checkout (Stripe-ready structure)
- **Orders** — Buyer purchase history + seller sales dashboard with status management
- **Messaging** — Real-time buyer-seller chat per listing (Supabase Realtime)
- **Profile** — Public profile page, avatar upload, bio, location
- **Settings** — Edit profile info & avatar
- **Multi-currency** — 20+ currencies with static exchange rates (swap for live API)
- **Dark mode** — Full light/dark theme toggle
- **i18n-ready** — All strings in `/src/locales/en.json`
- **Responsive** — Mobile, tablet, and desktop layouts
- **Accessibility** — Alt text, keyboard navigation, ARIA labels, color contrast

---

## Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- A [Supabase](https://supabase.com) project (free tier is fine)

### 2. Install dependencies

```bash
cd kenshop
npm install
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste & run `supabase/schema.sql`
3. Go to **Storage** → create two **public** buckets:
   - `listing-images`
   - `avatars`
4. In each bucket, add a storage policy:
   - **SELECT**: allow public access (`true`)
   - **INSERT**: `auth.uid() is not null`
   - **DELETE**: restrict to owner
5. Go to **Database → Replication** → enable `messages` table for Realtime
6. (Optional) Enable Google OAuth in **Authentication → Providers → Google**

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in Supabase → **Settings → API**.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
kenshop/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── auth/          # RequireAuth guard
│   │   ├── layout/        # Navbar, Footer, Layout
│   │   ├── listings/      # ListingCard, ListingGrid, ListingFilters, ListingForm
│   │   └── ui/            # Badge, EmptyState, Modal, Pagination, Spinner
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── CurrencyContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useListings.js
│   │   ├── useMessages.js
│   │   ├── useOrders.js
│   │   └── useProfile.js
│   ├── lib/
│   │   ├── constants.js   # Categories, conditions, countries
│   │   ├── currencies.js  # Exchange rates + formatPrice
│   │   └── supabase.js    # Supabase client
│   ├── locales/
│   │   └── en.json        # All UI strings (i18n)
│   ├── pages/             # One file per route
│   ├── App.jsx
│   ├── i18n.js
│   ├── index.css
│   └── main.jsx
├── supabase/
│   └── schema.sql         # Full DB schema + RLS policies
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Adding Stripe Payments

The checkout page is structured as a placeholder. To integrate Stripe:

1. `npm install @stripe/react-stripe-js @stripe/stripe-js`
2. Replace the mock card fields in `CheckoutPage.jsx` with Stripe's `<CardElement />`
3. Create a Supabase Edge Function to create a `PaymentIntent` and confirm it
4. Add `VITE_STRIPE_PUBLISHABLE_KEY` to your `.env`

---

## Adding Live Exchange Rates

In `src/lib/currencies.js`, replace `EXCHANGE_RATES` with a fetch from:
- [exchangerate.host](https://exchangerate.host) (free)
- [Open Exchange Rates](https://openexchangerates.org)

---

## Deployment

Works out of the box on **Vercel** or **Netlify**:

```bash
npm run build        # outputs to dist/
```

Set your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the platform's environment variables.

---

## License

MIT
