# HungerBite Admin (POS) — Agent Conventions

**Always read and follow this file** when adding or changing code in **hungerBite-admin**, unless the user explicitly overrides something in the chat.

When the user suggests a convention, pattern, or rule that should apply going forward, **add it to this document** in the same PR/change set (keep sections concise).

Use this document when adding or changing code in **hungerBite-admin** (product name: **HungerBite** POS Admin). Follow patterns aligned with the customer app **hungerBite** unless this file says otherwise.

## App context

| Item | Value |
|------|--------|
| Framework | Next.js 16 (App Router) |
| Dev port | `3000` (`npm run dev` → `next dev --webpack`) |
| Path alias | `@/*` → `./src/*` |
| POS API / Socket | `NEXT_PUBLIC_POS_URL` / `NEXT_PUBLIC_POS_API_URL` (default `http://127.0.0.1:8082`) |
| Auth API | `NEXT_PUBLIC_AUTH_API_URL` (default `http://localhost:8080`) |
| Catalog API | `NEXT_PUBLIC_CATALOG_API_URL` (default falls back to order URL; catalog service `8083`) |
| Auth UI | Login sends `role: "staff"` via `POS_LOGIN_AUTH_ROLE` (no role field). New accounts use **`/onboarding`** (no separate signup page). |
| Related app | Customer ordering UI lives in **`hungerBite`** (port `3010`) — reuse its auth **layout** and shared UI patterns, not its customer-only flows |

---

## Project layout (`src/`)

```
src/
├── app/
│   ├── layout.tsx
│   ├── FirebaseInit.tsx
│   ├── (auth)/
│   │   ├── login/              # page.tsx + useHook.ts
│   │   └── onboarding/         # 2-step new-account flow (page.tsx + useHook.ts)
│   ├── (dashboard)/
│   │   └── page.tsx            # PosConsole
│   └── posConsole/
│       ├── index.tsx
│       └── useHook.ts
├── assets/
│   └── svgs.tsx                # SvgLogo (shared with hungerBite branding)
├── components/
│   └── auth/
│       └── AuthMarketingPanel.tsx   # left panel; used by (auth)/layout.tsx
├── shared/
│   ├── cards/CardWrapper.tsx
│   └── …
├── lib/
│   ├── apiConstant.ts
│   ├── axiosInstance.ts
│   └── apis.ts
├── utils/
│   ├── schema.ts
│   └── authSession.ts
└── middleware.ts
```

---

## Feature folder structure

1. **`page.tsx`** — route entry. **Do not** use `index.tsx` for routes under `app/`.
2. **`useHook.ts`** — Formik, React Query, socket handlers, API mutations.
3. **`index.tsx`** — feature UI for non-route modules (e.g. `posConsole`).

**Split rule:** If a page exceeds **~250 lines**, extract components.

**Typography (required):**

- Use **`@/shared/heading/Text.tsx`** and **`TextWithLinks`** for all visible copy.
- Form labels: `<label htmlFor="…"><Text as="span" …>…</Text></label>`.
- Do **not** use raw `<h1>`, `<p>`, or unstyled spans for UI text.

**Auth layout (`(auth)/layout.tsx`):**

- Split screen: **`AuthMarketingPanel`** (left, `bg-onboardingBg`, logo, headline, social proof) + white **main** (`max-w-lg`, centered form) for all auth routes.
- Pages only render the right-side form content (no duplicate logo/header on login/forgot-password/onboarding).
- Fields: uppercase label `Text`, `InputField` with icons, password show/hide toggle.
- Primary buttons: `!bg-brand-950`, `FiArrowRight` icon.
- **No** Google / social login on admin auth.
- Login: email + password; role hardcoded **`staff`**. Success → store **`temp_token`** → **`/select-outlet`**.
- **Select outlet** (`/select-outlet`): `GET /outlets` (catalog) using `temp_token` or `access_token` (change outlet); click outlet → `POST /auth/login-as-outlet/:outletId` → `GET /outlet/:id` for outlet **`status`** → store **`access_token`**, clear **`temp_token`**. If `status === 'open'` → **`/`**; else → **`/clock-in`**. Logout clears all tokens → **`/login`**.
- **Switching outlets only while clocked out.** A staffer may open **Manage outlet** (`/manage-outlets`) only when the current outlet is **not `open`**. Manage outlets: `GET /outlets`, **Add** `POST /create-outlet`, **Edit** `PATCH /outlet/:outletId` (body: `name`, `address`, `city`, `phone`) at `/manage-outlets/edit/[outletId]`, **Delete** `DELETE /outlet/:outletId`. Outlet image upload API is not wired yet.
- **Forgot password** (`/forgot-password`): email step → new + confirm password; role **`staff`** on API calls.
- **Onboarding** (`/onboarding`): **Step 1** → `POST /auth/signup` → store **`onboarding_temp_token`** (no session yet). **Step 2** → `POST /create-outlet` then `POST /auth/login-as-outlet/:outletId` using `onboarding_temp_token` → `GET /outlet/:id` → store **`access_token`**, remove **`onboarding_temp_token`**. Route by outlet **`status`** (`open` → home, else clock-in). Re-open app with `onboarding_temp_token` → resume step 2.
- **Clock-in** (`/clock-in`): shown when outlet **`status` is not `open`** (typically `closed`) from `GET /outlet/:id`. **Clock In** → `PATCH /outlet/:outletId/start` (sets `status: 'open'`) → **`/`**. **`isAcceptingOrders`** is separate (pause/resume orders via `/toggle` while the shift stays open). Gating uses live API data — not localStorage.

See `(auth)/layout.tsx`, `(auth)/login/page.tsx`, `(auth)/onboarding/page.tsx`.

---

## API layer

- Direct browser calls to POS, auth, and catalog services. **No** Next.js API rewrites for backend traffic.
- **Cached axios clients** per `MicroService` in `lib/axiosInstance.ts` (same pattern as hungerBite).
- **Service routing** via `getServiceBaseUrl(MicroService.*)` in `lib/apiConstant.ts` — auth, POS (`8082`), catalog (`8083`).

```ts
await axiosInstance(MicroService.AUTH).post(AUTH_PATHS.login, payload);
await axiosInstance(MicroService.POS).get(API_PATHS.outletOrders(outletId));
await axiosInstance(MicroService.CATALOG).get(API_PATHS.menuItems(outletId));
```

- **All HTTP functions** in **`lib/apis.ts` only**.
- Path builders, env defaults, and `apiErrorMessage` in **`lib/apiConstant.ts`**.

### `lib/apis.ts` — API calls only (required)

Each function in **`lib/apis.ts`** must do **only**:

1. Call `axiosInstance(MicroService.*)` with the correct path.
2. **`return data`** from the response.

**Do not** put in `apis.ts`:

- Mapping API records into UI types (orders board, menu items, outlets, etc.).
- `Array.isArray` guards, column grouping, or default empty arrays.
- Helper functions such as `mapCatalog*`, `mapOrder*`, `mapOutlet*`, `String(…)`, or `Record<string, unknown>`.
- `_id` fallbacks — backend returns **`id`**; use **`id`** everywhere in types and UI.

Put transforms in the feature’s **`useHook.ts`** (`queryFn` / `mutationFn`), or a small feature util when shared by multiple routes in the same feature (e.g. `menu/utils/menuFormPayload.ts` for `catalogRecordToMenuItem`).

**Raw API shapes** in **`lib/types.ts`**: `OutletOrdersApiResponse`, `OutletOrderRecord`, `OrderItemLine`, `CatalogMenuItemRecord`, `CatalogOutlet`, etc. UI types (`Order`, `MenuItem`, `OutletOrdersBoard`, …) are what hooks expose to components.

**Keep mapping simple** — prefer using the API shape directly when it already matches the UI (e.g. POS orders board: `{ pending, preparing, ready, history }` arrays used as-is in `posConsole/useHook.ts`). Only map when the UI needs derived fields (`sku`, normalized status, etc.).

**Example — correct `apis.ts`:**

```ts
export async function getOutletOrders(outletId: string) {
  const { data } = await axiosInstance(MicroService.POS).get<OutletOrdersApiResponse>(
    API_PATHS.outletOrders(outletId),
  );
  return data;
}
```

**Example — correct `posConsole/useHook.ts`:**

```ts
queryFn: async () => {
  const data = await getOutletOrders(outletId);
  if (!data) return EMPTY_ORDERS_BOARD;
  return {
    pending: data.pending ?? [],
    preparing: data.preparing ?? [],
    ready: data.ready ?? [],
    history: data.history ?? [],
  };
},
```

### POS orders API

- **`GET /outlet/:outletId/orders`** returns **`{ pending, preparing, ready, history? }`** — each array contains orders with `id`, `status`, `outletId`, and populated **`items`** (`id`, `quantity`, `name`, `price`, …).
- Order cards use **`order.id`** (never `_id`). Line items use **`line.name`** for display.

---

## React Query

- **`useQuery` / `useMutation` in each feature’s `useHook.ts` only**.
- Do **not** add `hooks/api/*` wrappers.
- Query keys: `utils/queryKeys.ts`.

---

## Forms (Formik + Yup)

- `utils/schema.ts`: `loginSchema`, `onboardingAccountSchema`, `onboardingOutletSchema`, initial values.
- `formikFieldError` for field errors.
- Login always uses role **`staff`** — not shown in the UI.

---

## Auth

Storage keys (cookie + localStorage): **`access_token`** (final session), **`onboarding_temp_token`** (onboarding step 1 done), **`temp_token`** (login done, outlet not picked). No other onboarding/login flags.

- Public: `/login`, `/forgot-password`, `/onboarding` step 1 (no tokens).
- **`onboarding_temp_token`** (no `access_token`) → only `/onboarding` (step 2).
- **`temp_token`** (no `access_token`) → only `/select-outlet`.
- No token → `/login` (except onboarding step 1).
- **`access_token`** without `outletId` in JWT → `/select-outlet`.
- **`access_token`** with outlet → client fetches `GET /outlet/:id`; `status !== 'open'` → `/clock-in`, `open` → `/`.
- Auth/onboarding/select-outlet with session → `/` (dashboard re-checks outlet API).
- Axios Bearer: `access_token` ?? `onboarding_temp_token` ?? `temp_token` (`getBearerToken()`).
- `utils/authSession.ts` for token persistence; `clearAuthSession()` wipes all auth tokens.
- Do **not** show debug env URLs on auth screens.

---

## Realtime (POS console)

- Socket URL from `POS_SOCKET_URL` in `apiConstant.ts`.
- Socket + REST logic in **`posConsole/useHook.ts`**.

---

## Root layout & hydration

- Client providers inside **`<body>`** only.

---

## Styling

- `src/styles/globals.css` (Tailwind v4).
- **Light UI** — `html { color-scheme: light; }`; brand tokens match hungerBite (`--brand-50` … `--brand-950`).
- Inputs/selects: `text-gray-900`, `placeholder:text-gray-400`, `border-gray-200`, `bg-white` on auth forms.
- Do not import missing CSS from `globals.css`.

---

## Shared UI

Prefer:

- `shared/cards/CardWrapper.tsx`
- `shared/buttons/Button.tsx`
- `shared/input/InputField.tsx`, `Dropdown.tsx`
- `shared/heading/Text.tsx`, `TextWithLinks.tsx`
- `shared/ToastMessage.tsx`
- `assets/svgs.tsx` — `SvgLogo`

---

## Code quality

- Smallest correct change; match hungerBite naming/style where applicable.
- No drive-by refactors; no noise comments.
- Tests only when requested or clearly valuable.
- **No over-optimized data layers** — avoid redundant mapper helpers, `String()` on every field, and type-predicate filter chains when a direct assign or `?? []` is enough (see API layer above).

### UI overlay state (modals, dropdowns, drawers)

When a component can show **only one** of several overlays at a time (account menu, confirm modals, etc.), **do not** use a separate `useState<boolean>` per overlay.

Use **one** state holding the active overlay id (or `null` when closed):

```ts
type NavOverlay = "menu" | "stopOrders" | "endDay" | "logout";

const [activeOverlay, setActiveOverlay] = useState<NavOverlay | null>(null);
const closeOverlay = () => setActiveOverlay(null);

// open
setActiveOverlay("stopOrders");

// toggle menu
setActiveOverlay((v) => (v === "menu" ? null : "menu"));

// render
{activeOverlay === "menu" ? <AccountMenu … /> : null}
<ConfirmationModal isOpen={activeOverlay === "logout"} close={closeOverlay} … />
```

Use **mutation `isPending`** (or similar) for loading spinners — not another boolean tied to the same flow.

See `components/dashboardNav/index.tsx`.

---

## Git

- Do **not** commit unless the user explicitly asks.

---

## Quick checklist (new feature)

- [ ] Route: `page.tsx` + `useHook.ts`
- [ ] APIs in `lib/apis.ts` only (`return data`; no mappers in `apis.ts`)
- [ ] Transforms in `useHook.ts`; backend fields use `id` not `_id`
- [ ] Yup in `utils/schema.ts` if form-based
- [ ] React Query in `useHook.ts`
- [ ] Onboarding vs login redirect rules when touching auth
- [ ] `Text` / `TextWithLinks` for copy
- [ ] Auth screens: HungerBite login layout; **no Google sign-in**
