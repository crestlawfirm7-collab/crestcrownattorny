# Crest Crown Attorneys — Website Product Requirements
Status: implementation specification; not a claim that features are built.
## Positioning
Nigeria-wide law firm welcoming international enquiries for Nigerian legal matters. Office location in Effurun, Delta State must not be presented as the geographic limit. Do not imply admission to practise foreign law or promise results.
## Navigation and routes
- / Home (index landing page)
- /about Firm profile, mission, vision, values, differentiators
- /practice-areas Practice-area directory
- /practice-areas/corporate-commercial-law
- /practice-areas/regulatory-compliance
- /practice-areas/property-real-estate
- /practice-areas/family-law
- /practice-areas/maritime-law
- /practice-areas/debt-recovery
- /practice-areas/litigation-dispute-resolution
- /practice-areas/foreign-investment-nigeria
- /team and /team/[slug] biographies with verified qualifications, photos and specialisms
- /insights and /insights/[slug] articles
- /careers
- /contact and /consultation
- /privacy-policy, /terms-of-use, /legal-disclaimer
- Custom 404 page, sitemap.xml, robots.txt
## Homepage
Accessible responsive navigation, logo, hero with nationwide/international-client positioning, consultation CTA, practice-area cards linking to individual pages, credibility section with verified facts only, team highlights, insights, office/contact details, footer with legal notices. No fabricated testimonials, awards or statistics.
## Content & legal review
Draft copy subject to firm approval. Profiles: Glory Toritseju Kunu (corporate practice/property; CAC accredited agent, NBA Warri; BL Nigerian Law School Abuja; LLB Ambrose Alli University), Eloho (verify full name, qualifications and regulatory specialisms), Ejeremedoghene Ejiroghene (family law; verify full bio). Obtain consent for photographs; do not publish unapproved bios. Verify regulatory terminology and service descriptions. Add editorial approval before publishing legal guidance.
## SEO, GEO & AEO
Unique title, meta description, canonical and H1 per route; meaningful internal linking; mobile performance; descriptive image alt text; XML sitemap and robots; Open Graph and Twitter metadata; Organization/LegalService/Person/Article/BreadcrumbList schema only where factually supported; FAQ sections where useful without misleading FAQ rich-result promises. Target Nigerian corporate and legal service searches plus diaspora/foreign investor questions; location-specific pages only for genuine service presence. Avoid keyword stuffing and unsupported rankings.
## International enquiries
Clear jurisdiction disclosure: Nigerian legal services; foreign legal representation only if independently verified. International-friendly form with country, enquiry type, optional timezone, consent and privacy notice. Avoid exposing submitted personal data in a public repository. Provide verified contact channels and office address.
## Admin/CMS
Authenticated role-based admin for two authorized users initially; content management for homepage, practice areas, staff, insights, media, contact details and SEO fields. Secure credential management, audit trail, draft/review/publish states, backups and image uploads. No hardcoded passwords.
## Accessibility & quality
WCAG 2.2 AA target, keyboard navigation, focus states, semantic headings, sufficient contrast, labelled forms, responsive layouts, no overlapping text, optimized images, lazy loading below fold, measured Core Web Vitals. Test mobile/tablet/desktop, broken links, forms, social previews, metadata, security headers and builds.
## Deployment & acceptance
Repository currently public and lacks complete website source. Preserve existing preview separately. Make repository private before importing licensed assets, portraits, client data or secrets. Feature branch -> review -> integration -> authorized production release; no automatic production deploy. Confirm domain, contact information, licensing statements and legal copy with firm. All routes must render, build must pass, and owner must approve before launch.
