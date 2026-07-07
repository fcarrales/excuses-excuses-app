/** Public env vars only — safe for client bundles. Never put secrets here. */

export const APP_URL_PLACEHOLDER = "[add app link here]";

const DEFAULT_FEEDBACK_EMAIL = "feedback@excuses-excuses.app";

/** Raw NEXT_PUBLIC_APP_URL value, or empty string if unset. */
export function getPublicAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() ?? "";
}

/** URL for share copy — uses placeholder when env is missing. */
export function getShareAppUrl(): string {
  const url = getPublicAppUrl();
  return url || APP_URL_PLACEHOLDER;
}

export function hasPublicAppUrl(): boolean {
  return Boolean(getPublicAppUrl());
}

/** Feedback email from env, with safe fallback. */
export function getFeedbackEmail(): string {
  const fromEnv = process.env.NEXT_PUBLIC_FEEDBACK_EMAIL?.trim();
  return fromEnv || DEFAULT_FEEDBACK_EMAIL;
}
