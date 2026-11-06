# Repair missing Cloudflare D1 tables

The admin's **Media table missing** response means its D1 `media_assets` table cannot be queried or written. A GitHub commit does **not** execute D1 migrations on the Cloudflare account.

## Production repair

1. In Cloudflare Dashboard, open **Workers & Pages → D1** and find the database bound to the Pages project under **Settings → Bindings** as variable `DB`. Check the **Production** environment and repeat for Preview if needed. Never run this against the wrong database.
2. In the bound database's **Console**, run the contents of `migrations/0006_repair_missing_tables.sql`. This uses `CREATE TABLE IF NOT EXISTS` and preserves existing rows. Alternatively, with a configured Wrangler CLI, run:

   `npx wrangler d1 execute YOUR_DATABASE_NAME --remote --file=./migrations/0006_repair_missing_tables.sql`

3. Check the `sections` schema with `PRAGMA table_info(sections);`. If `image_url` is missing, execute `migrations/0005_section_images.sql` once. **Do not** rerun the ALTER statement if that column already exists.
4. Verify with `SELECT name FROM sqlite_master WHERE type='table' AND name IN ('sections','site_settings','content_entries','enquiries','admin_login_limits','media_assets');`. Expect six rows. Verify `SELECT COUNT(*) FROM media_assets;` succeeds.
5. In `/admin/`, log in, upload a small JPEG/WebP, save a content entry and reload the page. Confirm the media URL works. Test all admin sections and check production logs for errors.

## Important

This repair creates missing tables but **does not** migrate data from a different D1 database or configure missing `DB` bindings. It does not alter existing table schemas, except for the separate, conditional `0005` step. Back up the database before any schema change. Never store confidential legal-client files in the public media library.
