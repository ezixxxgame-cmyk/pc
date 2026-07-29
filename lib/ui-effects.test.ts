import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("site renders an accessible particle canvas above the footer", () => {
  assert.match(page, /className="site-particles"/);
  assert.match(page, /<canvas[^>]+site-particles[^>]+\/>\s*<header/);
  assert.match(page, /prefers-reduced-motion: reduce/);
  assert.match(styles, /\.site-particles\s*\{[\s\S]*?position:\s*fixed/);
  assert.match(styles, /\.site-footer::before/);
});

test("monitor has hardware details and a dedicated shiny submit style", () => {
  assert.match(page, /monitor-detail/);
  assert.match(page, /className="shiny-submit"/);
  assert.match(styles, /\.shiny-submit::before/);
});

test("mobile monitor keeps a landscape aspect ratio", () => {
  assert.match(
    styles,
    /@media \(max-width: 640px\)[\s\S]*?\.monitor-screen\s*\{[\s\S]*?aspect-ratio:\s*16\s*\/\s*10/,
  );
});

