# 0006: Password reset before public sign-up; email verification deferred

Status: Accepted 2026-09-18

## Context

Sign-up was email plus password with no recovery. A merchant who forgot a password was locked out of their invoices with no path back except a support email. Email verification, the other common gate, adds friction at sign-up and only matters once the account can do something sensitive with the address (collect payments, send on behalf of a verified sender).

## Decision

- Password reset ships now: request by email, single-use token valid for one hour, stored hashed in the existing `VerificationToken` table, delivered through Resend. Without `RESEND_API_KEY` the request form still works and the token link is logged server-side so the owner can help manually.
- Email verification is deferred until collect online launches (decision 0002). Unverified accounts can create, send, and track invoices.
- Auth actions (sign-in, sign-up, reset request) are rate limited per IP and per email using a small Postgres counter table, because the deployment has no Redis and bcrypt at cost 12 is expensive enough to be a cheap denial-of-service lever.

## Reasons

- Lockout is a guaranteed support burden and a guaranteed churn event; verification friction is a maybe.
- Reusing `VerificationToken` avoids a new table and matches Auth.js conventions if an adapter is added later.
- Rate limiting belongs with reset because reset is the endpoint attackers use to enumerate accounts.

## Consequences

- Reset emails come from `RESEND_FROM`; that variable becomes required in production (see 0004).
- Reset responses never reveal whether an email exists.

## Revisit when

Collect online launches, at which point verification becomes a prerequisite for enabling it on an account.
