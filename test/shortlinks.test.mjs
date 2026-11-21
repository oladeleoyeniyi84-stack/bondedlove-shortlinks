import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const config = JSON.parse(await readFile(new URL("vercel.json", root), "utf8"));
const html = await readFile(new URL("public/download/index.html", root), "utf8");

test("all store aliases lead to the private download-status page, not stores", () => {
  for (const path of ["/apple", "/a", "/google", "/g"]) {
    const route = config.routes.find(item => item.src === path);
    assert.equal(route?.status, 302);
    assert.equal(route?.headers?.Location, "/download");
  }
});
test("download page is noindexed and has no automatic redirect", () => {
  assert.match(html, /noindex, nofollow/);
  assert.doesNotMatch(html, /window\.location|location\.replace/);
});
test("placeholder app-store URLs are not published", () => {
  assert.doesNotMatch(JSON.stringify(config) + html, /id000000000|com\.bonded\.app|play\.google\.com\/store\/apps/);
});
test("official update URL only", () => {
  assert.match(html, /https:\/\/www\.elevate360official\.com\/apps\/bondedlove/);
});
