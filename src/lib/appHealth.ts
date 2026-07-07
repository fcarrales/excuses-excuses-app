import { APP_BUILD_STAGE, APP_VERSION, INTENDED_APP_URL } from "@/lib/appInfo";
import { getFeedbackEmail, hasCustomFeedbackEmail, hasPublicAppUrl } from "@/lib/env";

export interface AppHealth {
  version: string;
  stage: string;
  hasAppUrl: boolean;
  hasFeedbackEmail: boolean;
  feedbackEmail: string;
  intendedDomain: string;
  manifestPath: string;
  privacyPath: string;
  safetyPath: string;
  pwaReadyNotes: string;
  localOnly: true;
  backendRequired: false;
  apiRequired: false;
}

export function getAppHealth(): AppHealth {
  const hasAppUrl = hasPublicAppUrl();
  const hasFeedbackEmail = hasCustomFeedbackEmail();

  return {
    version: APP_VERSION,
    stage: APP_BUILD_STAGE,
    hasAppUrl,
    hasFeedbackEmail,
    feedbackEmail: getFeedbackEmail(),
    intendedDomain: INTENDED_APP_URL,
    manifestPath: "/manifest.webmanifest",
    privacyPath: "/privacy",
    safetyPath: "/safety",
    pwaReadyNotes: hasAppUrl
      ? "HTTPS URL set — PWA install works best on deployed HTTPS (not localhost)."
      : "Set NEXT_PUBLIC_APP_URL before public sharing. Install prompts vary by browser.",
    localOnly: true,
    backendRequired: false,
    apiRequired: false,
  };
}
