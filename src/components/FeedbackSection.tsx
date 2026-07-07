"use client";

import { useState } from "react";
import { APP_VERSION } from "@/lib/appInfo";
import { getFeedbackEmail } from "@/lib/env";
import { copyToClipboard } from "@/lib/clipboard";
import Toast from "@/components/Toast";

function buildFeedbackTemplate(): string {
  const lines = [
    "Excuses, Excuses! — Feedback",
    `App version: ${APP_VERSION}`,
    `Date: ${new Date().toLocaleString()}`,
    `Browser: ${typeof navigator !== "undefined" ? navigator.userAgent : "unknown"}`,
    "",
    "What happened:",
    "",
    "",
    "What I expected:",
    "",
    "",
    "Steps to reproduce:",
    "1.",
    "2.",
    "3.",
  ];
  return lines.join("\n");
}

export default function FeedbackSection() {
  const [toast, setToast] = useState("");
  const feedbackEmail = getFeedbackEmail();

  async function handleCopyTemplate() {
    const ok = await copyToClipboard(buildFeedbackTemplate());
    setToast(
      ok
        ? "Feedback template copied — paste it into your email or notes"
        : "Could not copy — try again",
    );
  }

  function handleEmailDraft() {
    const subject = encodeURIComponent(
      `Excuses, Excuses! feedback (v${APP_VERSION})`,
    );
    const body = encodeURIComponent(buildFeedbackTemplate());
    window.location.href = `mailto:${feedbackEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <>
      <section className="space-y-3" aria-labelledby="feedback-heading">
        <h3
          id="feedback-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          Feedback
        </h3>
        <p className="text-sm text-slate-600">
          No data is sent automatically. Copy a template or open an email draft
          to <span className="font-medium">{feedbackEmail}</span>.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleCopyTemplate}
            className="min-h-[44px] flex-1 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
          >
            Copy feedback template
          </button>
          <button
            type="button"
            onClick={handleEmailDraft}
            className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.98]"
          >
            Open email draft
          </button>
        </div>
      </section>
      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </>
  );
}
