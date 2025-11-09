Purpose: Data access layer (DAL) for Orkfia

This folder will host repository modules that wrap ORM access to the legacy MySQL schema.

Guidelines:
- Use Prisma (recommended) for type-safe access; no raw SQL strings in app code.
- Keep functions server-only and stateless.
- Return plain, serializable data objects. Avoid leaking ORM-specific types.
- Implement per-table repositories: usersRepo, statsRepo, buildsRepo, armysRepo, popsRepo, spellsRepo, goodsRepo, designsRepo, etc.
- Add caching where appropriate (Next.js unstable_cache / application cache).
