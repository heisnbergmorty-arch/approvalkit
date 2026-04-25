# ApprovalKit Figma Plugin

Push selected frames from Figma straight into an ApprovalKit project — no
download/upload dance.

## Status: scaffold

This is a v0 spec + manifest. Wire up `code.ts` to call your ApprovalKit
install's `/api/figma/push` endpoint with selected frames as PNGs.

## Files

- `manifest.json` — Figma plugin manifest
- `code.ts` — runs in Figma's sandbox; exports selected frames as PNG, posts to ApprovalKit
- `ui.html` — small UI to choose which project + ApprovalKit instance to push to
- `README.md` — this file

## Build

Install Figma's plugin tooling (`@figma/plugin-typings`), then:

```bash
npm install
npm run build
```

Then in Figma: Plugins → Development → Import plugin from manifest.

## Endpoint contract (server-side)

Implement `POST /api/figma/push` in your ApprovalKit install:

```json
{
  "projectId": "uuid",
  "groupKey": "logo-concepts",
  "frames": [
    { "label": "Concept A", "pngBase64": "..." }
  ]
}
```

Authenticate with a Personal Access Token (sha256-stored) issued from the
agency settings page.
