# Crest Crown Attorneys — Website Development

This repository is the dedicated development workspace for the Crest Crown Attorneys website.

**Current state:** Initial development configuration only. The complete site source, official logo and portraits are intentionally not included while the repository remains public.

## Workflow
- `main` — release baseline; never deploy automatically.
- `develop` — integration branch for reviewed features.
- `feature/*` — Codex and gStack task branches. Create pull requests into `develop`.

## Setup
1. Change repository visibility to **Private** in GitHub Settings → General → Danger Zone → Change repository visibility.
2. Follow `docs/GSTACK_CODEX_SETUP.md` to configure Codex and gStack locally.
3. Add the existing website project on a reviewed feature branch after confirming repository privacy and checking for secrets.
4. Run the PR checks; obtain Counsel's approval before any official production release.

## Project scope
Modern Nigerian law-firm website with Home, About, Our Team, practice-area pages, Legal Insights, consultation enquiry, contact and legal notices. Verified content, an authenticated CMS and legal-content approval are requirements for production.

**Current development preview:** https://crest-crown-attorneys-website-preview-kmw62k.v2.appdeploy.ai/

The preview is separate from this repository and **no automatic deployment is configured**.
