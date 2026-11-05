# Admin and advertising launch requirements
## Secure admin
The /admin/ interface creates, lists, publishes, unpublishes and deletes plain-text custom sections. Published sections are loaded from Cloudflare D1 by the public website. This is a functional starter CMS, not a complete content management suite.
1. Create a Cloudflare D1 database and bind it to the Pages project as `DB`.
2. Run `migrations/0001_content.sql` against that database.
3. Create a Cloudflare Zero Trust Access application protecting `yourdomain/admin/*` AND `yourdomain/api/*` (or separate rules for admin and API). **IMPORTANT:** public GET requests to `/api/sections` must remain publicly accessible, so configure Access policies at the edge only for `/admin/*` and authenticated admin actions, not the entire `/api/sections` route. The write API validates Access JWT independently.
4. Set Pages environment variables `CF_ACCESS_TEAM_DOMAIN` (example `yourteam.cloudflareaccess.com`), `CF_ACCESS_AUD` (Access application AUD tag), and `ADMIN_EMAILS` (comma-separated two verified authorized emails). Do not put secrets in Git.
5. Cloudflare Access policy must restrict /admin/* to approved emails. Server-side JWT verification separately restricts all writes.
6. Test unauthorized POST/PUT/DELETE => 401; authorized create draft => not publicly visible; publish => visible on selected page; unpublish => disappears.
7. Production review required for all published legal content.
## Advertising readiness
The website can receive traffic from Google Ads and Meta Ads via ordinary destination URLs. Actual ad accounts, payment methods, campaign creation, conversion tracking and consent handling are not configured here.
Before launching paid campaigns: verify domain ownership; choose approved landing pages and CTAs; configure Google Ads conversion tags or Meta Pixel via an appropriate consent-aware tag manager; publish an approved privacy/cookie notice; validate conversion events and test ad landing-page speed. Do not claim advertising campaigns are live.
## Limitations
No image upload, blog editing, full-page editing, audit trail or rich-text editing in this first CMS. Cloudflare Access, D1 and Pages bindings require account-level configuration before admin works.

## Browser authentication correction
The CMS API verifies the Cloudflare Access JWT from the browser's CF_Authorization cookie, or the Cf-Access-Jwt-Assertion header when present. Configure an Access application on /admin/* with the same team domain and AUD configured in Pages. Restrict its policy to approved administrators; the API separately verifies JWT and ADMIN_EMAILS. Confirm the Access cookie is sent to same-origin API requests in the deployed environment. Do not protect public GET /api/content and /api/sections behind Access.
