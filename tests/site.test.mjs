import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const load = (path) =>
    readFileSync(new URL("../" + path, import.meta.url), "utf8");

for (const page of ["index.html", "lifestory.html"]) {
    test(page + ": essentials, accessibility and progressive rendering", () => {
        const html = load(page);
        assert.match(html, /<html lang="en">/);
        assert.match(html, /<main\b/);
        assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
        assert.match(html, /rel="canonical"/);
        assert.match(html, /assets\/styles\.css/);
        assert.match(html, /assets\/site\.js/);
        assert.match(html, /aria-pressed="true"/);
        assert.match(html, /aria-pressed="false"/);
        assert.doesNotMatch(html, /id="loader"|id="page-transition"|<style>|<script>/);
    });
}

test("shared CSS honors reduced motion and forced colors", () => {
    const css = load("assets/styles.css");
    assert.match(css, /prefers-reduced-motion: reduce/);
    assert.match(css, /forced-colors: active/);
    assert.doesNotMatch(css, /#loader|#page-transition/);
});

test("JS avoids HTML injection, perpetual animation and storage crashes", () => {
    const js = load("assets/site.js");
    assert.doesNotMatch(js, /\.innerHTML\s*=/);
    assert.match(js, /document\.documentElement\.lang\s*=/);
    assert.match(js, /try\s*\{/);
    assert.match(js, /pointermove/);
    assert.doesNotMatch(js, /requestAnimationFrame\(updateSpotlight\)/);
});

test("featured work links to an existing product repository", () => {
    assert.match(load("index.html"), /https:\/\/github.com\/Brof14\/ByMeVPN_bot/);
});

test("Story avoids exposing a fixed daily commute", () => {
    const story = load("lifestory.html");
    assert.doesNotMatch(story, /40 minutes on a bus|40 минут на автобусе/);
});
