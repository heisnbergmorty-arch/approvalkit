# Contributing

Thanks for poking around. ApprovalKit is built in public.

## Bug reports

Open an issue with:
1. What you tried
2. What you expected
3. What actually happened (screenshot or stack trace if possible)

## Feature requests

Check [the roadmap](/roadmap) first. If it's not there, open an issue tagged
`feature`. We move things up the queue based on:

- How many other agencies hit the same pain
- Whether it strengthens the wedge ("approval cycle is too slow") or dilutes it

Things we're unlikely to add:
- General-purpose project management (use ManyRequests)
- Time tracking (use Toggl/Harvest, integrate via webhook)
- Invoicing (use Stripe)

## Code style

- TypeScript strict mode, no `any` without comment
- Server Components by default; `"use client"` only where required
- Drizzle for all DB access, no raw SQL except in cron routes
- Tailwind utility classes, no custom CSS unless absolutely needed

## Running locally

See [DEPLOY.md](./DEPLOY.md#5-minute-deploy).

## Tests

```bash
npm test
```

Run the full lint + type check before opening a PR:

```bash
npm run lint
npx tsc --noEmit
```
