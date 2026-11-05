# Cloudflare Pages — GitHub deployment runbook
**Status:** configuration documented; no Cloudflare project or production deployment has been created by this change.

## GitHub repository
`ifeoluwamorakinyojames-gif/Crest-law-firm-`
Feature branch: `feature/website-requirements-national-international`
Draft PR #6 into `main`. Do not merge until the owner approves.

## Cloudflare Pages setup (owner action)
1. In Cloudflare dashboard open Workers & Pages → Create → Pages → Connect to Git.
2. Authorize the correct GitHub account and select this repository.
3. Select **main** as the production branch. Keep production deployment disabled or do not complete the project creation until the owner explicitly approves going live.
4. Framework preset: Vite. Build command: `npm run build`. Build output directory: `dist`. Root directory: repository root. Node version: 22 (set environment variable `NODE_VERSION=22` if needed).
5. Use Cloudflare preview deployments for reviewed pull requests / nonproduction branches. Note that a public preview is still publicly reachable; avoid unapproved client content.
6. Configure an approved custom domain only after DNS ownership is confirmed.
7. Verify all routes, links, mobile layouts, contact actions, SEO metadata, 404 behavior and headers on preview before production release.

## Important caveats
- `public/_redirects` routes client-side paths back to index.html; actual pages are rendered by `src/main.js`. Cloudflare Pages copies files in `public` to `dist` when Vite builds.
- `public/robots.txt` currently blocks crawling intentionally. Remove the block only with explicit approval after final metadata and domain checks.
- There is no functional consultation form or authenticated admin yet. Do not claim either works.
- Do not put Cloudflare API tokens, passwords, case information or client records in GitHub.
- Confirm verified phone, email, office address, logo, team photos and legally approved practice descriptions before launch.
- GitHub Actions build check is separate from Cloudflare deployment; both should be reviewed.
