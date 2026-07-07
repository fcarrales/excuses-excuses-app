"use client";

import { useState } from "react";
import {
  APP_NAME,
  APP_TAGLINE,
  APP_VERSION,
} from "@/lib/appInfo";
import {
  APP_URL_PLACEHOLDER,
  getFeedbackEmail,
  getShareAppUrl,
  hasPublicAppUrl,
} from "@/lib/env";
import { canNativeShare, copyToClipboard } from "@/lib/clipboard";
import Toast from "@/components/Toast";

type CopyKey = "invite" | "pitch" | "instructions";

export default function ShareInviteSection() {
  const [toast, setToast] = useState("");

  const shareUrl = getShareAppUrl();
  const feedbackEmail = getFeedbackEmail();
  const hasUrl = hasPublicAppUrl();
  const linkLine = `Try it here: ${shareUrl}`;

  const betaInvite = `I'm testing a new app called ${APP_NAME} It helps you write respectful messages for awkward moments. Try generating messages, saving favorites, and testing Spanish or Spanglish.`;

  const appPitch = `${APP_NAME} — ${APP_TAGLINE}

A local message assistant for awkward social situations, work messages, and school messages. Get polished, ready-to-send texts in English, Spanish, or Spanglish. No account required — everything stays on your device.`;

  const testerInstructions = `Beta tester instructions for ${APP_NAME} (v${APP_VERSION})

1. Generate a few messages (try Spanish and Spanglish)
2. Save a favorite and add a saved person
3. Try a message pack and style preset
4. Export a backup before clearing any data
5. Test that risky requests (e.g. fake doctor note) are blocked
6. Install as a PWA if your browser supports it
7. Send feedback to ${feedbackEmail}

${linkLine}`;

  const copyItems: { key: CopyKey; label: string; text: string }[] = [
    { key: "invite", label: "Copy beta invite", text: `${betaInvite}\n\n${linkLine}` },
    { key: "pitch", label: "Copy app pitch", text: `${appPitch}\n\n${linkLine}` },
    { key: "instructions", label: "Copy tester instructions", text: testerInstructions },
  ];

  async function handleCopy(text: string, label: string) {
    const ok = await copyToClipboard(text);
    setToast(ok ? `${label} copied!` : "Could not copy — try selecting the text");
  }

  async function handleShare() {
    const text = `${betaInvite}\n\n${linkLine}`;
    if (canNativeShare()) {
      try {
        await navigator.share({ title: APP_NAME, text });
        setToast("Shared!");
        return;
      } catch {
        // fall through to copy
      }
    }
    await handleCopy(text, "Beta invite");
  }

  return (
    <section className="space-y-4" aria-labelledby="share-heading">
      <h3
        id="share-heading"
        className="text-xs font-bold uppercase tracking-wider text-violet-600"
      >
        Share the beta
      </h3>
      <p className="text-sm text-slate-600">
        Copy invite text to share with testers. No backend — you send the link
        yourself.
      </p>

      <div className="space-y-2">
        {copyItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => handleCopy(item.text, item.label)}
            className="min-h-[44px] w-full rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-left text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-100 active:scale-[0.98]"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleShare}
          className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          {canNativeShare() ? "Share beta invite" : "Copy beta invite (share)"}
        </button>
        <a
          href={`mailto:?subject=${encodeURIComponent(`${APP_NAME} beta invite`)}&body=${encodeURIComponent(`${betaInvite}\n\n${linkLine}`)}`}
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Email beta invite
        </a>
      </div>

      {!hasUrl && (
        <p className="text-xs text-amber-800">
          Set{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_APP_URL</code>{" "}
          to <strong>https://x-qs.app</strong> in Vercel or{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> before
          public sharing — until then, copies use {APP_URL_PLACEHOLDER}.
        </p>
      )}

      <Toast message={toast} visible={Boolean(toast)} onHide={() => setToast("")} />
    </section>
  );
}
