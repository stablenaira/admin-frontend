# Project Code Structure (snr-dashboard)

## High-Level Overview

- Framework: React 19 + Vite
- Routing: react-router-dom (BrowserRouter + nested routes)
- Styling: Tailwind CSS (via @tailwindcss/vite)
- State/Data: Zustand store + Axios for API calls
- UI: Radix Themes + custom UI primitives in `src/components/ui`

## Top-Level Layout

- `index.html`: Vite HTML entry (mounts `#root`)
- `vite.config.js`: Vite config with React + Tailwind plugins
- `package.json`: scripts (`dev`, `build`, `lint`, `preview`) and dependencies
- `public/`: static assets served as-is
- `src/`: application source code (components, pages, state, utilities)

## App Entry Points

- `src/main.jsx`: React root mount; renders `<App />` inside `<StrictMode />`
- `src/App.jsx`: Router composition and route table
  - Public routes:
    - `/login` → `src/pages/Login.jsx`
    - `/verify-otp` → `src/pages/VerifyOtp.jsx`
  - Protected routes (wrapped by layout):
    - Layout wrapper: `src/components/AppLayout.jsx` (sidebar + header + `<Outlet />`)
    - `/dashboard` → `src/components/workflowoverview.jsx` (note: not `src/pages/Dashboard.jsx`)
    - `/feature` → `src/components/featureBug.jsx`
    - `/bugs` → `src/components/bugReport.jsx`
    - `/mappings` → `src/components/mappings/Mapping.jsx`
    - `/users` → `src/components/Users.jsx`
    - `/settings` → `src/components/settings.jsx`
    - `/` redirects to `/dashboard`; unknown paths redirect to `/dashboard`
  - Notifications: `Toaster` mounted once at app root (`src/components/ui/sonner.jsx`)

## Source Tree Guide

### `src/pages/`

Route-level pages (not all are currently wired in `src/App.jsx`):
- `Dashboard.jsx`: dashboard UI with tabs and metric cards
- `Login.jsx`: login screen
- `VerifyOtp.jsx`: OTP verification screen

### `src/components/`

Feature components and layout:
- `AppLayout.jsx`: application shell (sidebar, header, route outlet)
- `workflowoverview.jsx`: “Dashboard” route content (current default)
- `featureBug.jsx`: feature intake flow (used at `/feature`)
- `bugReport.jsx`: bug report flow (used at `/bugs`)
- `Users.jsx`: users management view (used at `/users`)
- `settings.jsx`: settings screen (used at `/settings`)
- `mappings/`: mapping-related feature UI
  - `Mapping.jsx`: mappings page component (used at `/mappings`)
  - `mappingDrawer.jsx`, `mappingDetailsDrawer.jsx`, `pillselector.jsx`: supporting UI

### `src/components/ui/`

Reusable UI primitives (buttons, inputs, dialogs, tables, sidebar, etc.). These are imported throughout feature components and pages.

### `src/stores/`

- `apiStore.js`: Zustand store for API calls
  - Uses Axios with defaults from environment variables:
    - `VITE_API_URL` → `axios.defaults.baseURL`
    - `VITE_APP_KEY` → `axios.defaults.headers.common['x-api-key']`
  - Exposes `fetchData`, `postData`, `putData`, `deleteData`

### `src/utility/`

- `decimimalToPercentage.js`: shared helper utilities

### `src/assets/` and styles

- `src/assets/`: local images/icons used by the app
- `src/index.css` / `src/App.css`: global and app-level styles

## Running Locally

```bash
npm install
npm run dev
```

## Build & Preview

```bash
npm run build
npm run preview
```
