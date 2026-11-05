import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('Cloudflare Pages route fallback configured',()=>assert.match(readFileSync('public/_redirects','utf8'),/\/\* \/index\.html 200/));
test('Admin HTML has content editor and media input',()=>{const html=readFileSync('public/admin/index.html','utf8');assert.match(html,/entryForm/);assert.match(html,/uploadMedia/)});
test('Production indexing remains blocked before approval',()=>assert.match(readFileSync('public/robots.txt','utf8'),/Disallow:\s*\//));
