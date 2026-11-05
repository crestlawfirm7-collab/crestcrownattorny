# CMS development scope and security
This feature branch adds Cloudflare D1-backed content entries (pages, practice areas, team profiles and posts), custom page sections, and enquiry storage. Admin endpoints require a verified Cloudflare Access JWT and allowlisted administrator email. Public content is escaped as text in the client, not interpreted as HTML.

## Required setup
Run both D1 migrations, configure DB binding, CF_ACCESS_TEAM_DOMAIN, CF_ACCESS_AUD and ADMIN_EMAILS, and restrict /admin/* with Cloudflare Access. Never expose enquiry GET publicly. Apply Cloudflare WAF rate limiting and Turnstile to the public enquiry endpoint before production use. Do not use the enquiry form to collect confidential legal case details. Implement retention and privacy policies before accepting live enquiries.

## Incomplete before production
R2 image upload with safe type/size validation, professional content approval, actual verified team portraits and contact details, site-wide SEO metadata and schema, consent-aware Google/Meta conversion tags, email notifications for enquiries, audit history, comprehensive tests and build verification. Cloudflare Pages deployment is NOT yet authorized.
