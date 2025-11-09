### Orkfia 2008 — Project Context and Architecture Overview

This document explains how the PHP codebase is structured, how requests are routed and rendered, what the core classes and functions do, and how the game loop and gameplay logic are wired together. It also includes concrete guidance to migrate this PHP app to Next.js with shadcn/ui, mapping server-side behaviors, state, and UI.

---

### High-level Architecture

- Entrypoint and routing
    - The actual entrypoint is `main.php`. A `.htaccess` in the root sets `DirectoryIndex main.php index.php`.
    - `index.php` exists but is empty in this repo snapshot.
    - Requests are routed via query parameters:
        - `cat`: either `main` (public pages) or `game` (authenticated in-game UI and actions)
        - `page`: a page identifier, e.g. `advisors`, `build`, `invade`, etc.
    - `main.php` resolves these into function names and delegates rendering:
        - Constructs `include_{cat}_up`, `include_{cat}_down`, and `include_{page}_text` as callable function names.
        - Includes `inc/layout/layout.php` for layout functions and calls `include_page_layout()` to emit the `<head>` HTML and set globals (title, metadata).
        - Finally calls the dynamic page function `include_{page}_text()` if found inside `inc/pages/{page}.inc.php`.

- Layout and rendering
    - `inc/layout/layout.php` defines:
        - `include_page_layout()` which opens the HTML document and sets `<title>`, meta, favicon, etc.
        - `include_main_up()` / `include_main_down()` for public pages.
        - `include_game_up()` / `include_game_down()` for the in‑game interface (authenticated views, menus, and persistent HUD elements like game time and age info).
        - It also builds the nav/menu for both public and game contexts and includes CSS: theme skins and shared styles.
    - Pages are PHP modules under `inc/pages`, each exporting `include_{pagename}_text()` that prints page-specific HTML.

- Data access and configuration
    - `inc/functions/config.php` defines server-dependent constants, host URLs, email settings, and game tuning numbers (e.g. protection hours, starting land, alliance size caps).
    - `inc/on_load.php` defines `connectdb()` and chooses the database by `$_SERVER['SERVER_NAME']`. It uses `mysql_pconnect` and `mysql_*` calls (legacy extension) and hardcoded credentials.
    - `inc/functions/constants.php` defines hundreds of constants: table names (`TBL_*`) and column keys for arrays returned from DB queries (e.g., `HOUR_COUNTER`, `AGE_NUMBER`, `HOMES`, `UNIT1_T1`, etc.). These constants are used throughout the codebase, including in the classes.

- Domain classes
    - `inc/classes/clsUser.php` — The core user/tribe domain object (1426 lines). Responsibilities include:
        - Holding user id `_iUserId` and many cached slices of user state (arrays): preferences, ranking, registration info, design, game stats, online status, build, stat, user info, spells, goods, army, mercs, return timers, population, thievery, kills, alliance, strength, and race.
        - Lazy-loading: each `get_*` method fetches from DB once and caches in a private array field, then returns it.
        - Private helpers `get_tbl_data($tbl)`, `set_tbl_data($table, $field, $value)`, `set_tbl_row($table, $assoc)` that perform raw SQL using constants from `constants.php`.
        - Public API (representative, not exhaustive):
            - `get_user_infos()`, `get_stats()`, `get_builds()`, `get_armys()`, `get_army_mercs()`, `get_milreturns()`, `get_pops()`, `get_thievery()`, `get_spells()`, `get_goods()`, `get_designs()`, `get_preferences()`, etc.
            - `get_user_info(CONSTANT)` / `set_user_info(CONSTANT, value)`-style methods to read and update specific columns.
            - Quote/escaping helper `quote_smart` for SQL values.
            - A number of calculations related to user strength, offense/defense, etc., sometimes delegating to functions under `inc/functions`.
    - `inc/classes/clsAlliance.php` — Alliance aggregate with methods to get alliance state, members, rankings, and to update alliance-level fields.
    - `inc/classes/clsGame.php` — Game-wide state (428 lines):
        - Works with admin tables via `TBL_GAME`, `TBL_GAME_TIME`, `TBL_GAME_SWITCHES`, and `TBL_GAME_RECORDS`.
        - Methods include `get_game_times()` and indexed getters like `get_game_time(HOUR_COUNTER)`, `get_game_switch(GLOBAL_PAUSE)`, and `get_historys(year)`.
        - Provides `set_*` methods to update admin/game settings.
        - Contains the same private `get_tbl_data`, `set_tbl_data`, `set_tbl_row`, `quote_smart` patterns.
    - `inc/classes/clsAge.php` — Age configuration loader/keeper used to show the current age, limits, and display strings. Used by `include_game_up()` to show age counters and paused status.
    - `inc/classes/clsInputFilter.php` — XSS/HTML filtering for POSTed form data.
    - `inc/classes/clsBlock.php`, `count_visitors_class.php` — Utility/support classes (blocking multiple tribes, visitor counter).

---

### Request lifecycle (main.php)

Key steps in `main.php`:

1. Include core config: `inc/functions/config.php`.
2. Error reporting: based on `$_SERVER['SERVER_NAME']` it toggles error reporting (development vs live).
3. Parse routing: defaults to `$cat = 'main'`, `$page = 'main'`, then applies `$_GET['cat']`/`$_GET['page']`.
4. Output buffering: uses gzip (`ob_gzhandler`) only for `cat=main`, uncompressed buffer for `cat=game`.
5. Sanitize request URI and prevent malicious query strings containing `register[`, `userid`, `username`, or `password=` — immediately exits with a warning if detected.
6. If `$_SERVER['REQUEST_METHOD'] == 'POST'` then constructs `InputFilter` and sanitizes all `$_POST`:
    - `require('inc/classes/clsInputFilter.php');`
    - `$strictFilter->process($_POST)`.
7. Connect to DB: `include_once('inc/on_load.php'); connectdb();` → chooses DB by server name.
8. Load globals: constants, generic functions, and classes `clsUser`, `clsAlliance`.
9. Maintain game clock: creates `clsGame`, reads `admin_global_time`, updates the hour if needed, executes queued `auto_event`s whose `execution_hour` is due, and decrements/cleans `military_expeditions` durations. This “cron-like” code runs on page load; it assumes at least one request per hour.
10. Layout function pointers: sets `$page_up`, `$page_down`, `$page_text` to function names and calls `include_page_layout();`.
11. If `cat=game`:
    - Enforce auth: looks for cookies `userid` and `check` and validates a simple checksum `md5('t1r1p0d4' . $username)` against `check`. On failure, shows a “session_expired” page.
    - Instantiate `clsUser $objSrcUser` via `$GLOBALS['objSrcUser'] = new clsUser($userid);` and load key slices: `$arrSrcUsers = $objSrcUser->get_user_infos(); $arrSrcStats = $objSrcUser->get_stats();`
    - Re-check game switches: e.g., `LOGIN_STOPPER` can block logins for non-staff levels.
    - If alliance is 0, treat account as deleted and force logout.

12. Render in order: calls `$page_up()` (includes header, menu, HUD), then `$page_text()` (page body), finally appropriate `include_*_down()` (footer). The page function is dynamically resolved — see next section.

---

### Pages and the `inc/pages` pattern

- Each page module is a `*.inc.php` under `inc/pages` and exposes a function named `include_{page}_text()`.
    - Example: `inc/pages/advisors.inc.php` defines `function include_advisors_text()` and then switches on a `show` parameter (`population`, `resources`, `military`, etc.). It prints two-column layouts and calls many helper functions to construct tables of stats.
    - These helper functions come mostly from `inc/functions` (e.g., `get_housing_table`, `get_population_table`, `get_income_table`, `get_offence_table`, etc.), and often expect a `clsUser` instance passed by reference.

- Representative pages (non-exhaustive):
    - `advisors.inc.php`: dashboard-like advisor views (population, resources, military, economy, thievery, magic, buildings, etc.). Calls into `production.php`, `population.php`, `build.php`, `tribe.php`, and other helpers.
    - `build.inc.php`, `build2.inc.php`: infrastructure planning and the POST-back action handler.
    - `army.inc.php`, `army2.inc.php`: training/army management and its submission endpoint.
    - `thievery*`, `mystic*`, `invade*`: operations for ops/spells/attacks, often broken into view and action parts (`page` vs `page2`).
    - `register*.inc.php`, `login*.inc.php`: public account flows.
    - `alliance.inc.php`, `alliance_news.inc.php`: alliance pages with lists and detail views.
    - `rankings`, `history`: listing and annual statistics views.
    - `preferences`, `design`, `research`, `market`, `messages`, `forums`, etc.: broad coverage of gameplay and social features.
    - Staff-only: `resort_tools.inc.php` dynamically includes tools from `inc/staff/` by scanning files and building a menu. It uses `include_once("inc/staff/$tool.inc.php");` to run staff pages.

- Interaction pattern
    - Display page (e.g., `build`) shows a form and tables, posts to `page2` (e.g., `build2`) using `method="post" action="main.php?cat=game&page=build2"`.
    - `main.php` disallows reloading form actions with GET for certain `page` values by redirecting to logout text if user tries to access action pages without POST.

---

### Functions and utilities (`inc/functions`)

This directory holds stateless or loosely stateful helpers that operate on `clsUser` and database state. Highlights:

- `config.php` — server/game configuration constants and host selection.
- `constants.php` — table names and column constants used throughout the app for consistent indexing on array results.
- `generic.php` — assorted helpers including core gameplay gates:
    - `calcUnitStr(&$objUser, $unit_off, $unit_def)` — calculates a unit’s strength, referencing science bonuses via `inc/functions/bonuses.php` and alliance science values.
    - `obj_check_protection(&$objUser, $strType)` — enforces newbie/protection hours logic for different contexts (`status`, `invade`), prints messages and exits with `include_game_down()` when blocked.
    - Many more utility display and validation helpers used by pages.
- `build.php` — building/infrastructure business logic: reading build queues, costs, completing buildings, calculating land distribution.
- `population.php` — population growth, housing capacity, citizen breakdowns.
- `production.php` — computes gold/wood/food outputs from land usage, race, science, and buildings.
- `bonuses.php` — research/science and other modifiers lookups.
- `tribe.php` — military offense/defense calculations, composite stats used on advisors and army pages.
- `ops.php` — shared logic for operations (thievery/magic) such as success chances, costs, effects.
- `register.php`, `reset_account.php` — account-related helpers (also used in pages).
- `update_events.php` — event/log/report creation functions; includes HTML-building strings for messages and reports posted to users.
- Many other single-purpose helpers that pages include on-demand (`require_once`/`include_once`).

These helper functions usually:
- Accept a `clsUser` object by reference (`&$objUser`) for current tribe context.
- Use constants for column keys when accessing the arrays returned by `clsUser` getters.
- Return HTML fragments or numeric/stat arrays that pages embed.

---

### Subsystems

- Attacks (`inc/attacks`): Implements attack types, formulas, and resolution. Pages like `invade.inc.php` call into this directory to resolve outcomes and update DB state (kills, land grabs, returns).

- Spells (`inc/spells`): Per-spell logic (e.g., `cyclops.php`). Tied to magic pages and `ops.php` for common calculations.

- Races (`inc/races`): Race-specific modifiers, unit definitions, and balance knobs used in unit training, production, and combat calculations.

- Ops (`inc/ops`): Contains action endpoints not modeled as `inc/pages` or shared ops logic beyond spells/attacks. Example: `inc/ops/sneak.php`.

- Staff (`inc/staff`): Admin/staff tools dynamically included from `resort_tools.inc.php`. Tools implement their own page-level functions inside the included file.

---

### Security, sessions, and request hardening

- Input filtering
    - On every POST, `main.php` sanitizes `$_POST` via `clsInputFilter`:
        - `require('inc/classes/clsInputFilter.php');`
        - `$strictFilter->process($_POST);`

- Basic URL tampering checks
    - Early in `main.php`, the request URI is scanned for suspicious substrings: `register[`, `userid`, `username`, `password=`. If found, the request is aborted with a warning.

- Cookies and auth
    - The app expects cookies: `userid` (numeric id) and `check` (MD5 of `'t1r1p0d4' . $username`). This is a weak checksum in modern terms; there’s no server-side session store beyond what’s implicitly in the DB and cookie verification.
    - If missing or invalid, it sets `page = 'session_expired'` and shows an informational page with links to login or register.

- Caching headers
    - For `cat=game`, disables caching by setting past `Expires`, ensuring fresh state per request.

- CSRF and method safety
    - There is no global CSRF token. Some “action pages” enforce POST by checking `$_SERVER['REQUEST_METHOD']` and will include logout text if accessed via GET.

---

### Game clock, auto events, and pseudo-cron

- `main.php` constructs a `clsGame` and checks `admin_global_time`.
- If the `CURRENT_HOUR` differs from `date('H')`, it increments `HOUR_COUNTER` (unless globally paused) and updates `CURRENT_HOUR`.
- It then selects all rows from `auto_event` where `execution_hour <= HOUR_COUNTER`, executes each event’s SQL in `query`, and deletes the event row.
- It decrements `military_expeditions.duration_hours` by 1 and deletes rows with `duration_hours = 0`.

This “tick” system piggybacks on traffic; it assumes someone visits at least once per hour.

---

### Data model idioms

- Legacy MySQL API: `mysql_*` functions throughout (no PDO/MySQLi), manual escaping via `mysql_real_escape_string` wrappers.
- Constants as column keys: The code avoids string literals for columns by using constants imported from `constants.php`. Many array results are accessed like `$arr[HOUR_COUNTER]` rather than `$arr['hour_counter']`.
- Row caching on objects: `clsUser`/`clsGame` cache the last-read table rows; getters load on first access and reuse the arrays during a request.

---

### Important files and what they do

- Root
    - `main.php` — top-level router, auth gate, game tick, and layout invocation.
    - `index.php` — empty placeholder in this snapshot; `.htaccess` routes to `main.php` anyway.
    - `orkfiaJS.php` — client-side script referenced by layout; adds clock and UI helpers.
    - `redirect.php` — simple redirector (not examined here; typically used to offload or rename routes).

- Layout
    - `inc/layout/layout.php` — Everything HTML shell: head, styles, menus, headers, footers. Defines `include_main_*` and `include_game_*` which pages rely on.

- Classes
    - `inc/classes/clsUser.php` — user/tribe aggregate with many getters/setters and logic.
    - `inc/classes/clsGame.php` — game admin state, switches, times, records.
    - `inc/classes/clsAlliance.php` — alliance state and operations.
    - `inc/classes/clsAge.php` — age config and displays.
    - `inc/classes/clsInputFilter.php` — form data sanitizer.

- Functions
    - `inc/functions/config.php` — environment config and game knobs.
    - `inc/functions/constants.php` — schema constants.
    - `inc/functions/generic.php` — global helpers (protection checks, calculations, messages, etc.).
    - `inc/functions/build.php`, `population.php`, `production.php` — economy/infra core mechanics.
    - `inc/functions/ops.php`, plus directories `inc/attacks`, `inc/spells`, `inc/races` — combat/ops systems.
    - `inc/functions/update_events.php` — news/report/event creation, a hub for messaging users with HTML snippets.

- Pages (examples)
    - `inc/pages/advisors.inc.php` — Advisor dashboard with many tables. Uses helpers like `get_housing_table`, `get_population_table`, `get_income_table`, `get_offence_table`, etc., taking `$objSrcUser`.
    - `inc/pages/build.inc.php` / `build2.inc.php` — Construction view and submission handler.
    - `inc/pages/army*.inc.php` — Training management.
    - `inc/pages/register*.inc.php` — Sign-up flow with email validation.
    - `inc/pages/resort_tools.inc.php` — Staff tools loader.

---

### Control flow examples

- Page rendering flow for a game page (e.g., `advisors`):
    1. `main.php?cat=game&page=advisors`
    2. `main.php` sets `$page_up = 'include_game_up'`, `$page_text = 'include_advisors_text'`, `$page_down = 'include_game_down'`.
    3. Auth cookies checked; `clsUser` instantiated; game switches validated.
    4. `include_game_up()` prints header/HUD/menu based on `clsGame` and `clsAge`.
    5. `include_advisors_text()` prints body. It uses `$_GET['show']` to decide which advisor tab to render and calls into helpers.
    6. `include_game_down()` closes wrappers and flushes output.

- Submitting a form (e.g., `build2`):
    1. Page `build` renders a form posting to `main.php?cat=game&page=build2`.
    2. On `POST`, `main.php` sanitizes `$_POST` via `clsInputFilter`.
    3. As `page == 'build2'` and method is POST, it dispatches to `include_build2_text()` which reads `$_POST` and calls `inc/functions/build.php` to apply changes and update DB.

---

### Notable algorithms and logic patterns

- Unit strength calculation: `calcUnitStr($objUser, $unit_off, $unit_def)` weighs offense/defense with science modifiers, applies a mix of quartering and fractional bonuses, and chooses the higher between offense-weighted and defense-weighted derived strengths.
- Protection gates: `obj_check_protection($objUser, $strType)` enforces newbie protection windows by rendering informative messages and aborting flows (e.g., prevents invasion before protection hours lapse).
- Game time progression and auto events: As described above, this is implemented as DB updates on request rather than a scheduler, and includes “auto event” query execution.

---

### Migration to Next.js + shadcn/ui: mapping and guidance

This section maps legacy PHP constructs to modern Next.js patterns and flags migration risks.

- Routing
    - Legacy: `main.php?cat=main|game&page={slug}` plus sub-actions (`page2`) and `show` tabs.
    - Next.js App Router mapping:
        - Public routes: `/`, `/about`, `/register`, `/login`, `/credits`, etc. Map from `cat=main` pages.
        - Authenticated game routes: `/game/advisors`, `/game/build`, `/game/army`, `/game/invade`, `/game/mystic`, `/game/thievery`, `/game/alliance`, `/game/research`, `/game/market`, etc.
        - Form action routes: Use server actions or dedicated API routes (e.g., `POST /api/build` instead of `build2`). Maintain idempotency and CSRF protection.
        - For tabbed pages like advisors with `show=...`, use URL segments like `/game/advisors/(population|resources|military)` or a `?show=` query param handled client-side.

- Layouts
    - Legacy `include_main_up/down` and `include_game_up/down` become two Next.js layouts:
        - `app/(public)/layout.tsx` — public shell (header/footer), dynamic meta, link to CSS.
        - `app/(game)/layout.tsx` — in-game shell with top HUD: time, age, top alliance, menu. Fetch global state server-side.
    - Use shadcn/ui components for layout structure: `PageHeader`, `Navbar` with `NavigationMenu`, `Card`, `Table`, `Tabs`, etc.

- State and data fetching
    - Replace cookie-hash auth with proper auth (e.g., NextAuth or custom session/JWT stored HttpOnly cookie). A middleware can guard `/game/*` routes.
    - Server data loaders should replace `clsUser` caching by implementing repository/services that aggregate the same slices:
        - A `getUserContext(userId)` service that returns: user info, stats, build, army, goods, spells, research, alliance, etc., similar to `clsUser` getters.
        - A `getGameContext()` service for game-wide switches, times, age, and records (replacing `clsGame`).
    - Database access: either
        - Keep MySQL and migrate tables to modern schema with Prisma or Drizzle; or
        - Implement a thin DAL using MySQL2.
    - Replace pseudo-cron with a real scheduler:
        - Use a background worker/cron (e.g., serverless cron, GitHub Actions hitting an endpoint, or hosted scheduler) that calls a `POST /api/cron/tick` to advance `HOUR_COUNTER`, execute `auto_event`s, and update expeditions.

- Form handling and mutations
    - Convert `page2` endpoints to either server actions in Next.js forms or POST to `/api/...` routes.
    - Add CSRF tokens, input schema validation (zod) and comprehensive sanitization.

- UI
    - shadcn/ui components:
        - Advisors tables → `Table` with `Card` wrappers, `Tabs` for `show=`.
        - Menus → `NavigationMenu` or `Sidebar` pattern.
        - Forms → `Form`, `Input`, `Select`, `Button` with `react-hook-form`.
        - Feedback → `Alert`, `Toast` for result messages.

- Security upgrades
    - Replace weak cookie checksum with sessions/JWT and password hashing (Argon2/bcrypt).
    - Add CSRF protection and rate limiting for action endpoints.
    - Parameterize all SQL via an ORM or parameterized queries; never build SQL strings.

- Game mechanics parity
    - Port the pure formula logic from `inc/functions/*`, `inc/attacks`, `inc/spells`, `inc/races` to TypeScript modules under `lib/game/*`.
    - Keep constant sets (`constants.php`) as TypeScript constant objects/enums to avoid magic strings.
    - Build integration tests to assert that TypeScript calculations match the PHP results for representative inputs.

- Suggested folder mapping in Next.js
    - `app/(public)/*` — legacy `cat=main` pages.
    - `app/(game)/*` — legacy `cat=game` pages.
    - `app/api/*` — replaces `page2` and `inc/ops` action endpoints.
    - `lib/game/*` — ports of legacy helpers from `inc/functions`, `inc/attacks`, `inc/spells`, `inc/races`.
    - `lib/db/*` — DAL/repositories mapping to the old schema.
    - `components/ui/*` — shadcn/ui customized components.

- Stepwise migration strategy
    1. Freeze PHP gameplay changes to stabilize parity.
    2. Extract DB schema and constants; generate types.
    3. Port read-only advisors pages first (they are heavily display-oriented but good to validate data access).
    4. Port mutation flows one by one (build, army training, market, research), introducing API routes with input validation and authorization.
    5. Implement the scheduler for time tick and auto events.
    6. Sunset legacy cookies, move users to new auth.

---

### Risks and caveats

- The game tick depends on page views; migrating should decouple time from traffic.
- The legacy DB uses `mysql_*` and manual escaping; expect SQL concatenation in many places. A careful audit is needed to prevent subtle logic or security bugs during porting.
- A lot of output HTML is assembled inside functions returning strings or echoing directly; when porting, separate data from presentation and write unit tests for the core calculations.
- Some modules (e.g., staff tools, certain ops/spells) dynamically include files. Inventory all includes and replicate capability‑based access control.

---

### Quick reference of notable functions and methods

- Routing/layout
    - `include_page_layout()` → prints HTML head with correct title/metadata.
    - `include_main_up()` / `include_main_down()` → public shell.
    - `include_game_up()` / `include_game_down()` → in‑game shell, pulls `clsGame`, `clsAge` data for HUD.

- `main.php` lifecycle hooks
    - Game time update: `clsGame->get_game_times()`, compare `CURRENT_HOUR`, then update `HOUR_COUNTER`, run `auto_event`s, decrement `military_expeditions`.
    - Auth: cookie `userid` + `check` MD5 matched with `md5('t1r1p0d4' . $username)`.

- `clsUser` (representative methods)
    - `get_user_infos()` → returns the `users` table row as an assoc array, cached.
    - `get_stats()` → returns the `stats` row for current user.
    - `get_builds()`, `get_armys()`, `get_pops()`, `get_spells()`, `get_goods()`, `get_designs()`.
    - `set_tbl_data($table, $field, $value)` and `set_tbl_row($table, $assoc)` for updates.

- `inc/functions/generic.php`
    - `calcUnitStr(&$objUser, $unit_off, $unit_def)` → composite unit strength.
    - `obj_check_protection(&$objUser, $strType)` → protection messaging and gating.

- Advisors (`inc/pages/advisors.inc.php`)
    - Uses helpers like `get_housing_table($objUser)`, `get_population_table($objUser)`, `get_income_table($objUser)`, `get_offence_table($objUser)`, `get_research_table($objUser)`, etc., which originate from `inc/functions/*` modules.

---

### Summary: How it works

- Requests land in `main.php`, which sets up environment, sanitizes inputs, connects to the DB, advances the game clock if needed, and dynamically chooses layout and page renderers.
- For `cat=game`, authentication is enforced via cookies before rendering. A global `clsUser` is instantiated and cached in `$GLOBALS['objSrcUser']` so pages and helpers can access tribe state.
- Pages under `inc/pages` compose HTML by calling domain helpers in `inc/functions` and sometimes by directly performing SQL through `clsUser` methods.
- The layout functions wrap content with a consistent shell, add style and script, and draw menus.
- Subsystems like attacks, spells, and races are composed by including specialized modules with clear entry points per action.
- State is primarily in MySQL tables; classes cache rows during a request. There is no ORM or framework—just procedural PHP with a handful of classes.

This map should provide sufficient context to design a faithful Next.js + shadcn/ui port: you can mirror routing, centralize data loaders and mutations, move formulas into pure TypeScript modules, and upgrade security and scheduling while preserving gameplay formulas and results.