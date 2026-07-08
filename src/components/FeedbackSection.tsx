"use client";

import { useEffect, useRef, useState } from "react";
import { APP_VERSION } from "@/lib/appInfo";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FeedbackSectionProps {
  scrollTrigger?: number;
}

export default function FeedbackSection({ scrollTrigger = 0 }: FeedbackSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (scrollTrigger > 0) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTrigger]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setStatus("error");
      setErrorMessage("Please enter a message.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          message: trimmedMessage,
        }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Could not send feedback. Please try again.");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error — check your connection and try again.");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="feedback-section"
      className="space-y-4"
      aria-labelledby="feedback-heading"
    >
      <div>
        <h3
          id="feedback-heading"
          className="text-xs font-bold uppercase tracking-wider text-violet-600"
        >
          Feedback
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Found a bug or have an idea? Send us a message — we read every one.
        </p>
      </div>

      {status === "success" ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900"
        >
          <p className="font-semibold">Thanks for your feedback!</p>
          <p className="mt-1 text-emerald-800">
            Your message was sent. We appreciate you helping improve the beta.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-3 min-h-[44px] rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98]"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="feedback-name" className="text-sm font-semibold text-slate-700">
              Name <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="feedback-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="Your name"
              disabled={status === "loading"}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="feedback-email" className="text-sm font-semibold text-slate-700">
              Email <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              disabled={status === "loading"}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 disabled:opacity-60"
            />
            <p className="text-xs text-slate-500">
              Add your email if you&apos;d like a reply.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="feedback-message" className="text-sm font-semibold text-slate-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="What happened? What did you expect? Device/browser helps too."
              disabled={status === "loading"}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 disabled:opacity-60"
            />
          </div>

          {status === "error" && errorMessage && (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="min-h-[48px] w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "loading" ? "Sending…" : "Send feedback"}
          </button>

          <p className="text-center text-[10px] text-slate-400">
            v{APP_VERSION} · Only your message is sent — not your saved app data
          </p>
        </form>
      )}
    </section>
  );
}
