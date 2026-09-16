# Rename Pairkit

`Pairkit` is the product name. A search-and-replace is the start, not the whole job.

Keep the folder names `web/`, `mobile/`, `backend/`, and `core-modules/`.

## 1. Display name

Search for `Pairkit` in `*.md`, `*.json`, `*.ts`, `*.tsx`, and `*.yml`. Typical hits:

- Root `package.json` `name`
- `web/lib/seo.ts` (`SITE_NAME`, `SITE_TITLE`)
- `web/components/brand/pairkit-mark.tsx` and its imports
- `mobile/app.json` `expo.name` / `slug`
- Device names in `web/lib/workspace-sync/client.ts` and
  `mobile/src/features/workspace-sync/model/client.ts`

## 2. Package scope

`@pairkit/core` is the shared contracts package (folder stays `core-modules/`). Rename the scope in:

- `core-modules/package.json`
- every `package.json` that depends on it
- imports of `@pairkit/core`, `@pairkit/core/api`, `@pairkit/core/client`

Then `pnpm install` so the lockfile matches.

## 3. Native IDs

| Field                 | Current                  |
| --------------------- | ------------------------ |
| iOS bundle id         | `com.example.pairkit`    |
| Android applicationId | `com.example.pairkit`    |
| URL scheme            | `pairkit` (`pairkit://`) |
| Expo slug             | `pairkit`                |

Change these in `mobile/app.json`. After `eas init`, put the EAS `projectId` in `mobile/app.json` /
`mobile/eas.json` — it is omitted on purpose in the template.

## 4. Public URLs

- `NEXT_PUBLIC_SITE_URL` in `web/.env.example` (and production) — `https://example.com` today
- `EXPO_PUBLIC_API_URL` — see `scripts/print-lan-api-url.sh` for a phone on the same Wi-Fi

## 5. GitHub

If you used **Use this template**, this repo's branch ruleset is **not** copied. From the new repo:

```bash
./scripts/protect-main.sh
```

That requires `gh` with admin access. It blocks direct pushes to `main` until `verify` and `secrets`
are green on a PR.
