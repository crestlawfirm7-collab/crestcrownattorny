# Production release gate — do not merge or deploy without owner approval
## Build and quality
- GitHub Actions npm install, source check, and Vite build green.
- Cloudflare Pages preview build verified for all deep links, mobile layout, 404, sitemap, metadata, headers and accessibility.
- Cloudflare Pages Functions work with D1 and R2 bindings; migrations 0001 and 0002 applied.
- Cloudflare Access protects /admin/*; admin JWT audience, issuer and two verified allowlisted email addresses configured.
- Confirm unauthorized API writes fail, authorized draft creation works, publishing appears on site, unpublishing removes content.
- Test file upload type and size validation and media delivery.
- Verify general enquiry works; apply Cloudflare WAF rate limits and bot protection, and test data handling.
## Legal and marketing
- Firm verifies exact office address, phone, email, logo, portraits, lawyer qualifications, practice descriptions.
- Legal counsel approves privacy, terms, disclaimers, cookie/analytics consent and data retention.
- Google Ads / Meta Ads campaigns, tags and conversions require separate account setup, consent design and test events. No tracking is active by default.
- Remove development robots block only on approved launch.
- Obtain explicit production merge and deployment approval.

## Enquiry anti-spam settings
Create a Cloudflare Turnstile widget for the approved Pages preview/production hostnames. Set Pages environment variable TURNSTILE_SITE_KEY (public) and encrypted TURNSTILE_SECRET_KEY (server only). The enquiry endpoint fails closed until the secret is set, and the form disables submission until a challenge succeeds. Add rate limiting in Cloudflare WAF, then test valid, invalid and expired tokens. Verify enquiry retention and data privacy before collecting personal data.
## Ads readiness
Google Ads and Meta Ads can link to website pages; conversion pixels and campaign management remain deliberately inactive until verified ad accounts, consent controls and privacy approval exist. Do not claim ads are running.
