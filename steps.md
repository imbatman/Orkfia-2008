# Orkfia Migration: PHP (_php) → Next.js (app)

This living document tracks the end‑to‑end migration from the legacy PHP application in `_php` to the Next.js app under `app/`. It is intentionally verbose and structured as actionable steps with status markers so that progress persists over time.

Legend:
- [x] ✓ Completed
- [>] * In progress / next up
- [ ] Not started

Last updated: 2025-11-09 13:46

---

## 0) Grounding and Goals

- [x] Establish goals: achieve feature parity, modernize stack (Next.js + shadcn/ui + Prisma), improve security, and preserve gameplay formulas. ✓
- [x] Capture legacy architecture and flows (routing, auth, data access, tick). Source: `context.md`. ✓
- [x] Decide migration strategy: incremental, starting with read‑only advisors, then mutations, then staff tools. ✓

Artifacts:
- Reference map and suggested folder mapping in `context.md` (lines ~246–303).

---

## 1) Repository Setup & Conventions

- [x] Confirm Next.js app directory exists and boots (baseline template). ✓
- [ ] Configure project conventions: Typescript strict, path aliases (`@/lib/*`), Prettier, ESLint, commit hooks.
- [ ] Install and configure Tailwind (if not already), and shadcn/ui baseline.

Acceptance:
- A `npm run lint` returns with no errors; base components render locally.

Notes:
- The repo already contains: `app/`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json` (shadcn config). Verify and tighten strict options.

---

## 2) Folder Mapping & Scaffolding

Following `context.md` suggestions:

- [x] Adopt mapping:
  - `app/(public)/*` — legacy `cat=main` pages. ✓
  - `app/(game)/*` — legacy `cat=game` pages. ✓
  - `app/api/*` — replaces `page2` and `inc/ops` action endpoints. ✓
  - `lib/game/*` — ports of legacy helpers from `inc/functions`, `inc/attacks`, `inc/spells`, `inc/races`. ✓
  - `lib/db/*` — DAL/repositories mapping to the old schema. ✓
  - `components/ui/*` — shadcn/ui customized components. ✓
- [x] Create empty scaffolding directories (`lib/game`, `lib/db`, `components/ui` if missing) and placeholder README files explaining purpose. ✓

Acceptance:
- Directories exist and are referenced via `@/lib/*` in `components.json`.

---

## 3) Database Strategy (MySQL)

- [ ] Choose ORM: Prisma (recommended for schema typing and migrations).
- [ ] Initialize Prisma: `npx prisma init`, configure `DATABASE_URL` for legacy DB.
- [ ] Introspect legacy schema: `npx prisma db pull` to generate `schema.prisma` and types.
- [ ] Establish repository/DAL modules in `lib/db/*` that wrap Prisma access; no SQL strings.
- [ ] Add read replicas or caching strategy if needed.

Acceptance:
- Type-safe access layer with repositories matching key tables (`users`, `stats`, `builds`, `armys`, `pops`, `spells`, `goods`, `designs`, etc.).

Notes:
- Do not mutate DB during read‑only porting — treat API as read-only until parity tests are in place.

---

## 4) Authentication & Authorization

- [ ] Replace legacy cookie (`userid`, `check=md5('t1r1p0d4'+username)`) with NextAuth.js or custom session using secure cookies.
- [ ] Implement credential provider mapping to existing users table, hashing strategy audit.
- [ ] Gate `app/(game)` routes with middleware and server-side auth checks.
- [ ] Model roles/permissions: user, resort head, staff/admin.

Acceptance:
- Visiting `/(game)` redirects to login when unauthenticated; session established securely when logged in.

Notes:
- Consider one-time migration for cookies to sessions (graceful switchover).

---

## 5) Layouts & Routing

- [ ] Implement shared shells:
  - `include_main_up/down()` → `app/(public)/layout.tsx` with header/nav. 
  - `include_game_up/down()` → `app/(game)/layout.tsx` with HUD fed by `clsGame` analog. 
- [ ] Port metadata/title logic from `include_page_layout()` to Next.js `metadata` exports.
- [ ] Implement error boundaries and not-found pages.

Acceptance:
- Public and game layouts render, with placeholder HUD pulling mock or DAL data.

---

## 6) Game Time & Scheduler

- [ ] Decouple game tick from page views. Implement scheduled job (serverless cron or worker) to:
  - Update `HOUR_COUNTER`/age.
  - Run `auto_event`s.
  - Decrement `military_expeditions`.
- [ ] Create idempotent tick function in `lib/game/tick.ts`.

Acceptance:
- Tick can be triggered manually in dev and by schedule in prod; repeat runs are idempotent.

---

## 7) Constants & Core Formulas (Parity)

- [ ] Port constants from `constants.php` to TS enums/objects in `lib/game/constants.ts`.
- [ ] Port generic helpers from `inc/functions/*` to TS (pure functions):
  - `calcUnitStr`, protection checks, income/housing/population tables, etc.
- [ ] Port subsets of attacks/spells/races as TS modules.
- [ ] Create Jest/Vitest unit tests that cross-check results vs a PHP harness or captured fixtures.

Acceptance:
- Tests pass and match representative PHP outputs for selected inputs.

---

## 8) Data Access Layer (DAL) & Loaders

- [ ] Create `lib/db/userRepo.ts`, `statsRepo.ts`, etc., returning typed domain objects.
- [ ] Implement server-only data loaders for SSR/Server Actions.
- [ ] Add caching with `unstable_cache` or app-level cache where appropriate.

Acceptance:
- Advisors pages can fetch all required data via DAL without direct SQL in components.

---

## 9) Read-only Pages: Advisors (First Port)

- [ ] Port advisors pages using shadcn/ui tables/cards:
  - Housing, population, income, offense, research, etc.
- [ ] Validate correctness by comparing to PHP output for sample users.

Acceptance:
- Advisors display parity within rounding tolerances; UX acceptable.

---

## 10) Mutations & API Routes

- [ ] Introduce `app/api/*` routes for build, army training, market, research, spells/ops:
  - Input validation with Zod.
  - Auth checks and CSRF protection.
  - Rate limiting (IP+user).
- [ ] Implement corresponding server actions where beneficial.
- [ ] Transactional updates via Prisma.

Acceptance:
- Each action has tests to ensure validation and state changes match legacy behavior.

---

## 11) Staff Tools & Admin

- [ ] Inventory dynamic includes under `_php/inc/staff/*`.
- [ ] Recreate capabilities with clear permission checks and auditable logs.

Acceptance:
- Staff tools available to authorized roles; actions logged.

---

## 12) Security & Compliance

- [ ] Harden headers (`next.config.ts`), CSP, and cookies.
- [ ] Secrets management via environment variables; no secrets in repo.
- [ ] SQL injection eliminated via ORM; validation everywhere.

Acceptance:
- Basic security scanner checks pass; manual review completed.

---

## 13) Observability

- [ ] Structured request logging.
- [ ] Error tracking (Sentry) and metrics for tick and key actions.

Acceptance:
- Dashboards show tick cadence and action rates; errors generate alerts.

---

## 14) QA & Testing

- [ ] Unit tests for formulas; integration tests for DAL and API; e2e for core flows.
- [ ] Fixture generation to compare PHP vs TS outputs.

Acceptance:
- CI green; parity thresholds met.

---

## 15) Deployment Plan

- [ ] Define environments (dev/staging/prod) and DB connectivity.
- [ ] Configure deploys (Vercel/Node host) with cron/scheduler.
- [ ] Rollback and feature flag strategy.

Acceptance:
- Blue/green or canary process documented; emergency rollback tested.

---

## 16) Cutover & Decommission

- [ ] Freeze PHP gameplay changes during final parity window.
- [ ] Migrate sessions; update DNS/links; communicate to users.
- [ ] Decommission `_php` after soak period.

Acceptance:
- Traffic serves Next.js; no regressions during soak.

---

## Running Progress Log

- 2025-11-09: Created this steps.md, recorded plan, and marked initial planning tasks as completed.
