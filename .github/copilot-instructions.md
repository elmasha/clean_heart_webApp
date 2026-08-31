<!-- Copilot / AI agent instructions for the SwissLifeAfrica (MakaaziDashboard) repo -->
# Copilot Instructions

This project is a Nuxt 2 (Vue 2) single-page client app (SSR disabled). Use these notes to be productive when making code changes.

- **Big picture**: client-only Nuxt app (ssr: false). The app uses Firebase (auth, firestore, storage), Vuetify UI, Google Maps (vue2-google-maps), and several small plugins under `plugins/`.

- **Key files / entry points**:
  - `nuxt.config.js` — global config: plugins, modules (`@nuxtjs/firebase`, `@nuxtjs/vuetify`), `env` keys and server host/port.
  - `package.json` — dev/build/start scripts: `npm run dev`, `npm run build`, `npm run start`, `npm run generate`.
  - `pages/` — route-driven views (Nuxt auto-router). Important pages: `login.vue`, `accounts.vue`, `index.vue`, `shop.vue`, `checkout/*`.
  - `middleware/auth.js` — route protection using `app.$fire.auth.currentUser`. Middleware is enabled globally in `nuxt.config.js` (`router.middleware`).
  - `store/index.js` — Vuex root store. Nuxt Firebase is configured to call `ON_AUTH_STATE_CHANGED_MUTATION` on auth changes.
  - `plugins/` — client plugins; note `mapGoogle.client.js` is client-only (must end with `.client.js` for Nuxt conventions).

- **Architecture / flows to know**:
  - Authentication: configured in `nuxt.config.js` under `@nuxtjs/firebase` services → `auth.initialize.nAuthStateChangedMutation` points to `ON_AUTH_STATE_CHANGED_MUTATION` in `store/index.js`. Middleware checks `app.$fire.auth.currentUser`.
  - Maps: `plugins/mapGoogle.client.js` registers `vue2-google-maps` using `process.env.MAPS_API_KEY` (also set in `nuxt.config.js.env`). Custom map component `directionsRenderer.js` uses Google Maps `DirectionsService`.
  - Charts: `plugins/chart.js` exposes Chart.js via `Vue.prototype.$Chart` for components to use as `this.$Chart`.

- **Project-specific conventions**:
  - Client-only plugins must be named with `.client.js` and registered in `nuxt.config.js` `plugins` array.
  - Firebase auth mutation name is important: `ON_AUTH_STATE_CHANGED_MUTATION` — keep this exact name when wiring auth flows or testing auth behavior.
  - Pages are used as routes; protect routes by adding checks in `middleware/auth.js` (the file currently checks `/accounts` and has commented logic for `/`).
  - Components are auto-imported (`components: true` in `nuxt.config.js`). Prefer dropping components into `components/` and using them directly in templates.

- **Build / dev / debug commands**:
  - Install: `npm install`
  - Dev: `npm run dev` (hosts on `127.0.0.1:3000` per `nuxt.config.js` server settings)
  - Build: `npm run build` then `npm run start`
  - Static export: `npm run generate`

- **What to look for when editing**:
  - If you add a plugin that touches browser-only globals (window, google), make it a client plugin (`*.client.js`) and include it in `nuxt.config.js.plugins`.
  - When modifying auth-related code: ensure `ON_AUTH_STATE_CHANGED_MUTATION` still receives `{ authUser, claims }` shape and sets `state.user` accordingly.
  - `middleware/auth.js` uses `route.path` checks — prefer using named routes or `route.path.startsWith(...)` for more robust protection.

- **Integration / external deps**:
  - Firebase is configured in `nuxt.config.js` (api keys are present in the config). Services enabled: `auth`, `storage`, `firestore`.
  - Google Maps uses `vue2-google-maps` and expects a valid `MAPS_API_KEY` in env.

- **Examples**:
  - Accessing current user: `this.$fire.auth.currentUser` or `app.$fire.auth.currentUser` (used in `middleware/auth.js`).
  - Using Chart.js in a component: `this.$Chart` (provided by `plugins/chart.js`).
  - Adding a client plugin: create `plugins/my-plugin.client.js` and add `"@/plugins/my-plugin.client.js"` to `nuxt.config.js.plugins`.

- **Missing / not present**:
  - No test suite detected. No E2E or unit test config found in repo files.
  - No CI config or `.github` docs existed prior to this file—be conservative when changing CI-related build patterns.

If anything here is unclear or you want more detail (for example, specific auth flows, how uploads are wired, or explicit list of important components), tell me which area to expand and I will update this file.
