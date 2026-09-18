# 0020: Security hardening after the first review

Status: Accepted 2026-09-18

## Context

A security review of auth, authorization, public endpoints, API keys, cron, rate limits, email abuse, and the PCI boundary found no auth bypass, no cross-tenant access, and no card-data exposure. It listed fourteen items, mostly abuse resistance and operational footguns. This decision records what changed and the product calls made along the way.

## Decision

- Sessions carry a version. `User.sessionVersion` is embedded in the JWT at sign-in; a password reset increments it, and every session re-reads it at most once a minute and is refused on mismatch. A stolen cookie dies within a minute of a reset.
- The rate limiter is one atomic statement (insert or increment with window reset in the same upsert) and fails closed on database errors, so concurrent requests cannot all slip through the same window.
- Public PDF rendering is limited per address and per invoice and answers 304 to a matching ETag. The browser event sink and the view beacon are limited per address. Card-intent records one invoice event per invoice; repeats are counted in analytics only.
- Drafts are private. A public invoice link or PDF returns 404 for anyone but the signed-in owner until the invoice is sent or marked as sent. The invoice page says so next to the link. Void stays hidden from everyone.
- Addresses listed in `ADMIN_EMAILS` cannot self-register. The owner creates the account first, then sets the variable. Sign-in compares against a real bcrypt hash even when the email is unknown, so a miss takes as long as a wrong password.
- Cron bearer checks are constant time. The reset link is never logged in production; in development it still prints so the owner can help by hand.
- Logo URLs must be https, at save and at render. Post markdown is rendered with sanitization on; the posts are first-party but a bad commit or a future CMS should not be able to inject script.

## Not done yet

- A full Content Security Policy. Inline scripts and image sources need an inventory first; the existing frame-ancestors, nosniff, frame options, referrer, and permissions headers stay.
- Email verification at sign-up (decision 0006 still defers it). Brand impersonation through unverified accounts remains an accepted risk for now.

## Consequences

- A merchant who copied a draft link and shared it early will hear that it does not open; sending or marking as sent fixes it.
- Sign-in reads the user row once a minute per session. Negligible on Neon.

## Revisit when

A second review, a real abuse incident, or the CSP inventory is done.
