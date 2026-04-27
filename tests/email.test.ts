import test from "node:test";
import assert from "node:assert/strict";

import { isValidEmail } from "../app/lib/email.ts";

test("isValidEmail accepts normal addresses", () => {
  assert.equal(isValidEmail("hi@cadenalabs.io"), true);
  assert.equal(isValidEmail("team.ops+alerts@sub.example.ca"), true);
});

test("isValidEmail rejects malformed addresses", () => {
  assert.equal(isValidEmail(""), false);
  assert.equal(isValidEmail("no-at-symbol.example.com"), false);
  assert.equal(isValidEmail("name@@example.com"), false);
  assert.equal(isValidEmail("name@example"), false);
  assert.equal(isValidEmail("name@-example.com"), false);
  assert.equal(isValidEmail("name@example..com"), false);
  assert.equal(isValidEmail("name example@cadenalabs.io"), false);
});

test("isValidEmail rejects oversized input", () => {
  const longLocal = "a".repeat(65);
  const oversized = "a".repeat(245) + "@example.com";

  assert.equal(isValidEmail(`${longLocal}@example.com`), false);
  assert.equal(isValidEmail(oversized), false);
});
