# SNR Dashboard (StableNaira Treasury Console)

A React + Vite dashboard for monitoring StableNaira treasury metrics, pools, reserves/risk, supply controls (mint/burn), merchants, governance, and activity. It is built component-first with clean, minimal styling and mock API layers so you can integrate real backend APIs later without changing the UI structure.

## Tech Stack

- React 19 + Vite
- Routing: react-router-dom
- Styling: Tailwind CSS
- State: Zustand
- UI utilities: Radix Themes, Sonner (toasts)
- Icons: lucide-react

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start the dev server

```bash
npm run dev
```

Vite will print the local URL (commonly `http://localhost:5173` or `http://localhost:5174` if 5173 is already in use).

### 3) Build and preview

```bash
npm run build
npm run preview
```

## What This Project Is About

This app is a treasury operations console for StableNaira (SNR). It is designed to:

- Provide a clean, production-ready UI foundation for treasury analytics
- Keep each major section as its own page so the app doesn’t feel like one long scroll
- Simulate backend calls (loading, errors, parameters) to make integration easy

## Pages & Routes

All sidebar menu items map to a dedicated route:

- `/dashboard` — Overview (circulating supply, weekly volume, KPIs)
- `/pools` — Pools
- `/reserves` — Collateral mix, chain distribution, risk & alerts
- `/controls` — Mint & Burn (supply controls)
- `/governance` — Governance queue
- `/activity` — Activity feed
- `/merchants` — Merchants
- `/settings` — Profile + Admin management + 2FA toggle

Auth flow pages:

- `/login` — Email entry (no password)
- `/verify-email` — Email OTP verification
- `/verify-otp` — TOTP verification (admins only, when 2FA is enabled)

## Authentication Flow (Simulated)

The current flow matches the intended backend flow, but uses a mock service so the UI is ready before APIs exist:

1. User enters email
2. App requests an email verification code (simulated)
3. User enters the 6-digit email code
4. If the user is an admin and 2FA is enabled → user must enter TOTP
5. App receives a mock JWT/session and unlocks the protected routes

### Test codes

- Email OTP: `111111`
- Admin TOTP: `123456`

### Admin rule (mock)

- A user is treated as admin if:
  - Their email is in the admins list (managed in Settings), or
  - The email local-part matches a simple heuristic like `admin@...`, `admin+...@...`, `...admin...@...`

### Persistence (localStorage)

The app stores a mock session and some user settings locally:

- `snr_session` — mock JWT + user object
- `snr_admins` — list of admin emails
- `snr_user_settings` — per-email settings (display name, 2FA enabled)

## Data Layer (Mock APIs)

Treasury pages load their data through Promise-based mock fetchers that behave like real API calls (delay, parameters, AbortController support):

- `src/services/treasuryMockApi.js` — overview, pools, reserves/risk, controls, merchants, governance, activity
- `src/services/authMockApi.js` — email login + email OTP + admin TOTP

When backend APIs are ready, replace the internals of these services (or swap them for real API clients) while keeping the same return shapes.

## Environment Variables (for real API integration)

The Axios + Zustand API store reads:

- `VITE_API_URL` — base URL for API requests
- `VITE_APP_KEY` — added as `x-api-key` header

These are used in `src/stores/apiStore.js`.

## Project Structure (high level)

- `src/pages/` — route pages (Overview, Pools, Reserves, Merchants, Settings, Auth pages)
- `src/components/treasury/` — reusable treasury UI components (cards/panels, charts, sections, layout)
- `src/services/` — mock API services
- `src/stores/` — Zustand stores (auth + API)
- `src/auth/` — session + admin/settings persistence helpers

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
