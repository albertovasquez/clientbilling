/**
 * Server-side feature flags. Read on the server only.
 *
 * COLLECT_ONLINE: whether any collect-online UI beyond the CDG application and
 * quote links renders. Off until CDG confirms residuals and permission in
 * writing (decision 0002). Set COLLECT_ONLINE=on in the environment to enable.
 */
export const flags = {
  collectOnline: process.env.COLLECT_ONLINE === "on",
} as const;
