# 0002: Collect online is gated on written CDG answers; no connect-existing until then

Status: Accepted 2026-09-18

## Context

The partner one-pager (`docs/partners/cdg-clientbilling-quantum-one-pager.md`) asks CDG five questions. Two of them decide whether the collect path is worth building at all: whether agent 470 earns residuals when a referred merchant processes through Quantum from our invoice UI (question 1), and whether that integration is permitted under the agent agreement (question 2). Neither has a written answer. Meanwhile the app let a merchant "connect existing Quantum" (a label and a reference only) and then showed their payers "online card pay is coming soon", and public pages said payments "run on Quantum hosted pay".

## Decision

- No further engineering on the collect path until questions 1 and 2 are answered yes in writing. The answer is recorded in `docs/partners/` when it arrives.
- The "Connect existing Quantum" form is removed. The `quantumConnected` fields stay in the schema, unused, so the migration is not reversed.
- Public and in-app copy describes collect online as planned, not as running. The CDG application and quote links stay, because they are true today and are the referral path.
- A single server-side flag, `COLLECT_ONLINE` in `src/lib/flags.ts`, controls whether any collect UI beyond the CDG links renders. It defaults to off.

## Reasons

- A merchant who applies to CDG because of "collect online", gets approved, "connects", and still cannot collect will complain to CDG. That is the one outcome that can damage the referral relationship the whole site depends on.
- Claims that run ahead of the agreement are a compliance risk for a referral agent.
- Building hosted-pay integration against an unconfirmed method (Interactive, Web Order Form, or ILF) risks throwing the work away.

## Consequences

- The invoice tool ships as create, send, track, and mark paid. That is honest and still useful.
- When CDG answers, the flag flips in one place and the collect panel gets the real pay link.

## Revisit when

CDG confirms questions 1 and 2, or declines. If they decline, decision 0001 should be reopened too, because the invoice tool then has no revenue path.
