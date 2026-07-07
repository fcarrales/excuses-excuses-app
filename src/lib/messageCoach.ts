import { detectRiskyContent } from "@/lib/safety";
import type { Language, Tone } from "@/types";

export interface CoachAnalysis {
  clarityScore: number;
  toneScore: number;
  riskScore: number;
  overallScore: number;
  shortFeedback: string;
  tips: string[];
}

const DRAMATIC_WORDS =
  /\b(absolutely|extremely|devastating|terrible|horrible|unfortunately|regret to inform|deeply sorry|sincerely apologize)\b/i;

const PROFESSIONAL_MARKERS =
  /\b(hello|good morning|i apologize|disculpe|buenos días|please accept|thank you for your)\b/i;

const SOFT_MARKERS =
  /\b(hope|okay|espero|if that's okay|no pressure|gentle|softly|hope está)\b/i;

const DIRECT_MARKERS =
  /\b(heads up|te aviso|won't be able|can't make|no puedo|need to cancel|running late)\b/i;

const CASUAL_MARKERS = /\b(hey|hi |sorry|gonna|wanna|perdón|oops|😅|rain check)\b/i;

function clamp(n: number): number {
  return Math.max(1, Math.min(100, Math.round(n)));
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function scoreClarity(message: string): { score: number; tips: string[] } {
  const words = wordCount(message);
  const tips: string[] = [];
  let score = 85;

  if (words < 5) {
    score -= 25;
    tips.push("A bit more context could help");
  } else if (words <= 25) {
    score += 10;
    tips.push("Keeps the message short");
  } else if (words <= 45) {
    score += 5;
  } else {
    score -= 20;
    tips.push("Try trimming extra detail");
  }

  if (DRAMATIC_WORDS.test(message)) {
    score -= 15;
    tips.push("Tone down dramatic wording");
  } else {
    tips.push("Does not over-explain");
  }

  if (message.length > 280) {
    score -= 10;
    tips.push("Shorter works better for texts");
  }

  return { score: clamp(score), tips };
}

function scoreToneMatch(
  message: string,
  tone: Tone,
): { score: number; tips: string[] } {
  const tips: string[] = [];
  let score = 70;

  const checks: Record<Tone, RegExp> = {
    professional: PROFESSIONAL_MARKERS,
    soft: SOFT_MARKERS,
    direct: DIRECT_MARKERS,
    casual: CASUAL_MARKERS,
    respectful: /\b(thank you|gracias|please|por favor|understanding|comprensión)\b/i,
    funny: /😅|😊|right\?|¿no\?|life happens|la vida/i,
    believable: /^(?!.*(absolutely|extremely|devastating))/i,
  };

  if (checks[tone]?.test(message)) {
    score += 20;
    tips.push("Tone matches the situation");
  } else {
    score -= 5;
    tips.push(`Could lean more ${tone}`);
  }

  if (tone === "professional" && /^hey\b/i.test(message)) {
    score -= 15;
    tips.push("Consider a more formal opener");
  }

  if (tone === "direct" && wordCount(message) > 35) {
    score -= 10;
    tips.push("Direct tone works best when brief");
  }

  if (tone === "soft" && !SOFT_MARKERS.test(message)) {
    score -= 8;
    tips.push("A softer opener could help");
  }

  return { score: clamp(score), tips: tips.slice(0, 2) };
}

function scoreRisk(message: string): { score: number; tips: string[] } {
  const tips: string[] = [];
  if (detectRiskyContent(message)) {
    return {
      score: 15,
      tips: ["Avoid language that sounds like fake proof"],
    };
  }
  tips.push("No risky or official-sounding language");
  return { score: 95, tips };
}

function buildFeedback(overall: number, language: Language): string {
  const en =
    overall >= 90
      ? "Clean and natural"
      : overall >= 75
        ? "Solid — minor tweaks possible"
        : overall >= 60
          ? "Good start — room to polish"
          : "Consider revising before sending";

  if (language === "spanish") {
    if (overall >= 90) return "Claro y natural";
    if (overall >= 75) return "Sólido — pequeños ajustes posibles";
    if (overall >= 60) return "Buen inicio — se puede pulir";
    return "Considera revisar antes de enviar";
  }
  if (language === "spanglish") {
    if (overall >= 90) return "Clean y natural";
    if (overall >= 75) return "Solid — minor tweaks possible";
    return en;
  }
  return en;
}

export function analyzeMessage(
  message: string,
  tone: Tone,
  language: Language,
): CoachAnalysis {
  const clarity = scoreClarity(message);
  const toneMatch = scoreToneMatch(message, tone);
  const risk = scoreRisk(message);

  const overallScore = clamp(
    clarity.score * 0.35 + toneMatch.score * 0.35 + risk.score * 0.3,
  );

  const tips = [...new Set([...clarity.tips, ...toneMatch.tips, ...risk.tips])].slice(
    0,
    3,
  );

  return {
    clarityScore: clarity.score,
    toneScore: toneMatch.score,
    riskScore: risk.score,
    overallScore,
    shortFeedback: buildFeedback(overallScore, language),
    tips,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600 bg-emerald-50";
  if (score >= 70) return "text-violet-600 bg-violet-50";
  if (score >= 50) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}
