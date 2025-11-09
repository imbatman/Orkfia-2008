Purpose: TypeScript ports of legacy gameplay helpers and constants

This folder will contain pure, side-effect-free modules that port logic from the PHP codebase:
- constants.ts — TS equivalents of constants.php
- formulas/* — functions migrated from inc/functions/* (e.g., income, housing, power, population)
- attacks/* — core calculations for attack types
- spells/* — spell effects and validations
- races/* — race modifiers and traits
- tick.ts — idempotent game tick logic (time advancement, auto events)

Testing strategy:
- Unit tests compare representative outputs with captured PHP fixtures to ensure parity.
- No direct DB calls. Accept plain data structures only.