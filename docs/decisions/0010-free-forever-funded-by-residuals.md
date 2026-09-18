# 0010: The invoice tool is free, funded by CDG residuals; no paid tier

Status: Accepted 2026-09-18

## Context

The brief asked whether the tool stays free forever or adds a paid tier for teams. Residuals are unconfirmed (affiliate-cdg diligence table), but the referral commission on applications exists today and the content site already earns.

## Decision

- No paid tier. Every invoicing feature is free for every account, including team roles and exports when they ship.
- The business earns from CDG referrals and, once confirmed, residuals on referred volume.
- The terms of service keep the 30-day notice promise if this ever changes.

## Reasons

- The customer we want is the one who becomes a CDG merchant. A paywall between them and the invoice tool reduces the number of merchants who reach the Collect moment.
- Free removes the comparison with Wave and Zoho on price and moves it to the merchant-account story, where we win.
- A paid tier would pull the roadmap toward features that justify a fee (team seats, integrations) instead of features that drive Collect.

## Consequences

- Costs must stay near zero: no third-party analytics, no paid email beyond Resend's tier, database sized for the load.
- If CDG declines residuals, this decision is reopened together with 0002 and 0001.

## Revisit when

CDG answers question 1, or monthly infrastructure cost exceeds referral income for two consecutive months.
