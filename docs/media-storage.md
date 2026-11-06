# Same-domain media storage
Uploaded images are persisted in the Cloudflare D1 database bound to `env.DB` (table `media_assets`) and served through `/api/media/:id` on the **same hostname as the site**. The admin returns a relative URL; it works both on the pages.dev preview domain and on the connected custom domain. The uploaded bytes are not written into the Git repository or Cloudflare Pages' read-only static assets.

## Production setup
1. In Cloudflare Pages project settings, bind the production D1 database as `DB`. Ensure the preview environment has its own appropriate binding if needed.
2. Apply `migrations/0001_content.sql`, `0002_content_entities.sql`, `0003_admin_login.sql`, `0004_media_assets.sql`, and `0005_section_images.sql` **only as applicable**. Check which migrations have already been applied; do not re-run non-idempotent ALTER TABLE migrations.
3. Deploy the latest main commit and log into `/admin/`. Upload an image, select a content field, save/publish, then open its `/api/media/<id>` URL on the same domain in a separate browser.
4. Confirm that a page reload and a new deployment retain the image, and that blog, lawyer, practice area, section and homepage images display.
5. Configure D1 backups and monitor database size. D1 is suitable for small compressed website images, not a large photo archive. For a growing media library, migrate the storage backend to an R2 bucket while retaining the same `/api/media/:id` public URLs.

Uploads require an authenticated admin session and a same-origin POST. Allowed types: JPEG/PNG/WebP; max 900 KB. The browser compresses large images to WebP before upload. Images are public when their URL is known; do not upload confidential client documents.
