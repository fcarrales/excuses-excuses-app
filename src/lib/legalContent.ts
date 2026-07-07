import { APP_NAME } from "@/lib/appInfo";
import { getFeedbackEmail } from "@/lib/env";

export const PRIVACY_SUMMARY = {
  title: "Privacy",
  intro: `${APP_NAME} is built privacy-first. This beta runs entirely in your browser.`,
  points: [
    "No account required",
    "No backend in this beta — messages are generated locally on your device",
    "No ads",
    "No tracking or analytics in this beta",
    "No sale of personal data",
    "Saved people, favorites, history, settings, and style presets stay in this browser's localStorage",
    "Clearing browser storage or switching devices may delete saved content — use Export backup in Settings",
    "Import and export are controlled by you",
    `Feedback email (${getFeedbackEmail()}) is optional and only sent if you choose to email us`,
    "Future versions may add optional cloud features; the privacy policy would be updated first",
  ],
  disclaimer:
    "This in-app summary is not legal advice. See docs/PRIVACY_POLICY_DRAFT.md for a fuller draft.",
};

export const SAFETY_SUMMARY = {
  title: "Safety guidelines",
  intro: `${APP_NAME} helps you write respectful, ready-to-send messages — not fake proof or official documents.`,
  points: [
    "Use the app for respectful communication help",
    "The app refuses fake-proof or official-document style requests",
    "Not for impersonation, fraud, harassment, threats, or illegal activity",
    "Do not use it to create fake proof, receipts, doctor notes, screenshots, or official-looking records",
    "Serious work, school, medical, legal, or emergency matters should be handled honestly and directly",
    "If the situation is serious, be honest and contact the right person directly",
  ],
  disclaimer:
    "See docs/SAFETY_POLICY.md for the full safety policy draft.",
};
