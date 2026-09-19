/**
 * Who performed a billing mutation (decision 0025). organizationId is userId
 * until team roles introduce a real Organization.
 */

export type ActorType = "user" | "service_account" | "api_key" | "processor" | "system";

export type Actor = {
  type: ActorType;
  id: string;
  /** API key id when the call was authorized by a key. */
  authorizationId?: string | null;
};

export function userActor(userId: string): Actor {
  return { type: "user", id: userId };
}

export function apiKeyActor(keyId: string): Actor {
  return { type: "api_key", id: keyId, authorizationId: keyId };
}

export function systemActor(name = "cron"): Actor {
  return { type: "system", id: name };
}

export function serializeActor(actor: Actor) {
  return {
    type: actor.type,
    id: actor.id,
    authorizationId: actor.authorizationId ?? null,
  };
}
