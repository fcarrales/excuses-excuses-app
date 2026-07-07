import type { Recipient, Situation, Tone } from "@/types";

export interface QuickMode {
  id: string;
  label: string;
  icon: string;
  situation: Situation;
  recipient: Recipient;
  tone: Tone;
}

export const QUICK_MODES: QuickMode[] = [
  {
    id: "text-message",
    label: "Text message",
    icon: "💬",
    situation: "family",
    recipient: "friend",
    tone: "casual",
  },
  {
    id: "work-message",
    label: "Work message",
    icon: "💼",
    situation: "work",
    recipient: "boss",
    tone: "professional",
  },
  {
    id: "apology",
    label: "Apology",
    icon: "🙏",
    situation: "apologize",
    recipient: "friend",
    tone: "respectful",
  },
  {
    id: "cancel-plans",
    label: "Cancel plans",
    icon: "📅",
    situation: "cancel",
    recipient: "friend",
    tone: "soft",
  },
  {
    id: "running-late",
    label: "Running late",
    icon: "⏰",
    situation: "running-late",
    recipient: "friend",
    tone: "casual",
  },
  {
    id: "soft-no",
    label: "Soft no",
    icon: "🌸",
    situation: "dont-want-to-go",
    recipient: "friend",
    tone: "soft",
  },
  {
    id: "make-nicer",
    label: "Make it nicer",
    icon: "✨",
    situation: "improve",
    recipient: "friend",
    tone: "soft",
  },
  {
    id: "make-shorter",
    label: "Make it shorter",
    icon: "✂️",
    situation: "improve",
    recipient: "friend",
    tone: "direct",
  },
];
