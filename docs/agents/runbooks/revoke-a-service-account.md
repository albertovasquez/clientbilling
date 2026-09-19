# Runbook: revoke a service account

Purpose: stop an agent identity from acting on an account, and know what it did before you stopped it (decisions 0026, 0027). An agent may run this; revoking is a tightening, not a loosening.

Preconditions: the owner is signed in, or an agent is acting with the owner's consent. Settings, API keys lists the service accounts and the keys bound to each.

## Stop it

1. Settings, API keys, find the service account, Revoke. This sets `revokedAt`; nothing is deleted.
2. **Every key bound to it stops immediately.** `authenticateApiRequest` loads the service account with the key and returns `401 API key is bound to a revoked service account` when it is revoked (`src/lib/api-keys.ts`). There is no cache and no grace period, so the next request fails. You do not have to revoke the keys separately to stop the bleeding.
3. Revoke the bound keys too if the keys themselves are suspect rather than the identity. A key outlives its binding: revoking the service account leaves the key row valid, so re-binding it later would make it live again.

## Find out what it did

4. Open any invoice it touched and read Billing activity. A service-account actor renders as `service_account` with the account id.
5. For the whole picture, query `BillingEvent` for `actorType = 'service_account'` and `actorId = <id>`. Every material mutation appends one, so this is the complete list, not a sample. `authorizationId` on each event names the key that carried the request, which separates two keys sharing one identity.
6. Nothing rolls back automatically. An invoice it created stays created; a payment it recorded stays recorded. Void an invoice through the app or the API if it should not stand, which appends its own event with the human as actor.

## Verify

7. A request with a bound key returns `401` naming the revoked service account.
8. The service account shows a revoked date in Settings, and no longer appears in the bind dropdown when creating a key.

Stop and ask: deleting rather than revoking (the append-only record in `docs/decisions/0025` depends on those rows), reversing any invoice or payment the account created, and revoking anything on an account that is not the one you were asked to act on.
