# 0007: First-party event table for measurement; no third-party analytics

Status: Accepted 2026-09-18

## Context

The owner declined Plausible on 2026-09-17 and no other analytics is loaded. Every tracking call in the codebase (affiliate clicks, calculator completions, invoice interest) pushed to a `window.dataLayer` that nothing consumed. The partner one-pager promised to measure interest before asking CDG for engineering time, and the app now has a Postgres database.

## Decision

- Events are stored first-party in an `Event` table: name, path, optional user id, a small JSON payload, IP-derived country only, no cookies, no fingerprinting.
- The browser posts to `POST /api/events`. Server-side events (sign-up, invoice created, sent, viewed, paid) are written directly from actions and routes.
- A funnel page at `/app/admin/funnel`, visible only to emails listed in `ADMIN_EMAILS`, shows counts for the last 7 and 30 days: sign-ups, first invoices, invoices sent, invoices viewed, CDG clicks by position, calculator completions.
- The `dataLayer` push and the DOM `CustomEvent` remain for anyone who later wants a tag manager, but they are not the source of truth.

## Reasons

- The owner does not want a third-party analytics vendor. A table and a page cost an afternoon and answer the questions that matter.
- Storing only what the funnel needs keeps the privacy page short and true.
- Page views are not needed to make the next three decisions; conversions are.

## Consequences

- No pageview analytics, no referrer reports, no session replay. Search Console covers search traffic.
- The events table grows without bound; a monthly cleanup of rows older than 180 days is noted in the ops checklist.

## Revisit when

Someone needs attribution across sessions, or the funnel page needs more than counts. That is the point to add a proper tool, not before.
