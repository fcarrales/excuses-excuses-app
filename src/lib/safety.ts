import type { Language } from "@/types";

const RISKY_PATTERNS: RegExp[] = [
  /fake\s+doctor\s+note/i,
  /\bdoctor\s+note\b/i,
  /fake\s+receipt/i,
  /fake\s+proof/i,
  /fake\s+document/i,
  /fake\s+screenshot/i,
  /fake\s+emergency\s+proof/i,
  /fake\s+excuse\s+proof/i,
  /\balibi\b/i,
  /lie\s+to\s+my\s+boss/i,
  /lie\s+to\s+my\s+teacher/i,
  /make\s+it\s+look\s+official/i,
  /forge/i,
  /counterfeit/i,
  /fake\s+note/i,
  /fake\s+letter/i,
  /fake\s+certificate/i,
  /official\s+document/i,
  /cover\s+story/i,
];

export interface SafetyResponse {
  blocked: true;
  warning: string;
  safeExample: string;
}

export function detectRiskyContent(text: string): boolean {
  const normalized = text.trim();
  if (!normalized) return false;
  return RISKY_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function getSafetyResponse(language: Language): SafetyResponse {
  const messages: Record<Language, { warning: string; safeExample: string }> = {
    english: {
      warning:
        "I can help you write a respectful message, but I cannot help create fake proof or official-looking documents.",
      safeExample:
        "I'm sorry for the short notice, but I won't be able to make it today. I'll follow up as soon as I can.",
    },
    spanish: {
      warning:
        "Puedo ayudarte a escribir un mensaje respetuoso, pero no puedo ayudar a crear pruebas falsas ni documentos con apariencia oficial.",
      safeExample:
        "Perdón por el aviso de último momento, pero no podré ir hoy. Te aviso en cuanto pueda.",
    },
    spanglish: {
      warning:
        "Puedo help you write un mensaje respetuoso, pero no puedo help create fake proof o documentos que look official.",
      safeExample:
        "Sorry por el short notice, pero no podré make it today. Te aviso ASAP.",
    },
  };

  return { blocked: true, ...messages[language] };
}
