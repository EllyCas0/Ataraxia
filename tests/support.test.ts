import assert from "node:assert/strict";
import test from "node:test";
import { resolveSupportLinks } from "../lib/support";

test("shows nothing until a link is configured", () => {
  assert.deepEqual(resolveSupportLinks({}), { donateUrl: null, waitlistUrl: null });
  assert.deepEqual(resolveSupportLinks({ donate: "  ", waitlist: "", waitlistEmail: "" }), { donateUrl: null, waitlistUrl: null });
});

test("accepts https links and trims whitespace", () => {
  const links = resolveSupportLinks({ donate: " https://buy.stripe.com/test_123 ", waitlist: "https://tally.so/r/abc" });
  assert.equal(links.donateUrl, "https://buy.stripe.com/test_123");
  assert.equal(links.waitlistUrl, "https://tally.so/r/abc");
});

test("rejects non-https and malformed links", () => {
  const links = resolveSupportLinks({ donate: "javascript:alert(1)", waitlist: "http://insecure.example.com" });
  assert.equal(links.donateUrl, null);
  assert.equal(links.waitlistUrl, null);
  assert.equal(resolveSupportLinks({ donate: "not a url" }).donateUrl, null);
});

test("falls back to a prefilled mailto link for the waitlist", () => {
  const link = resolveSupportLinks({ waitlistEmail: "me@example.com" }).waitlistUrl;
  assert.ok(link?.startsWith("mailto:me@example.com?subject="));
  assert.equal(resolveSupportLinks({ waitlistEmail: "not-an-email" }).waitlistUrl, null);
});

test("a waitlist URL takes priority over the email fallback", () => {
  const links = resolveSupportLinks({ waitlist: "https://tally.so/r/abc", waitlistEmail: "me@example.com" });
  assert.equal(links.waitlistUrl, "https://tally.so/r/abc");
});
