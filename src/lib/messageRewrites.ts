import type { Language } from "@/types";

export type RewriteAction =
  | "shorter"
  | "nicer"
  | "professional"
  | "casual"
  | "softer"
  | "direct";

export const REWRITE_ACTIONS: { id: RewriteAction; label: string }[] = [
  { id: "shorter", label: "Make shorter" },
  { id: "nicer", label: "Make nicer" },
  { id: "professional", label: "More professional" },
  { id: "casual", label: "More casual" },
  { id: "softer", label: "Softer" },
  { id: "direct", label: "More direct" },
];

function firstSentence(msg: string): string {
  const match = msg.match(/^[^.!?]+[.!?]?/);
  let result = match ? match[0].trim() : msg.trim();
  if (!result.match(/[.!?]$/)) result += ".";
  return result;
}

function stripFiller(msg: string): string {
  return msg
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s*—[^—.!?]*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function rewriteShorter(msg: string): string {
  return firstSentence(stripFiller(msg));
}

function rewriteNicer(msg: string, lang: Language): string {
  const prefixes: Record<Language, string> = {
    english: "I hope this is okay — ",
    spanish: "Espero que esté bien — ",
    spanglish: "Hope está bien — ",
  };
  const body = msg.replace(/^(hey|hi|hello|hola)[,.]?\s*/i, "");
  const lower = body.charAt(0).toLowerCase() + body.slice(1);
  if (/hope|espero/i.test(msg)) return msg;
  return prefixes[lang] + lower;
}

function rewriteProfessional(msg: string, lang: Language): string {
  let result = msg
    .replace(/^Hey/gi, "Hello")
    .replace(/^Hi —/gi, "Hello —")
    .replace(/\bwanna\b/gi, "would like to")
    .replace(/\babout\b/gi, "approximately")
    .replace(/\bSorry\b/g, "I apologize");

  if (lang === "spanish") {
    result = result
      .replace(/^Hey/gi, "Hola")
      .replace(/\bPerdón\b/g, "Disculpe");
  }
  if (!/thank you|gracias|thanks/i.test(result)) {
    const closings: Record<Language, string> = {
      english: " Thank you.",
      spanish: " Gracias.",
      spanglish: " Thanks.",
    };
    result = result.replace(/[.!?]?$/, ".") + closings[lang];
  }
  return result;
}

function rewriteCasual(msg: string, lang: Language): string {
  let result = msg
    .replace(/^Hello/gi, "Hey")
    .replace(/^Good morning/gi, "Hey")
    .replace(/\bI would like to\b/gi, "I wanna")
    .replace(/\bapproximately\b/gi, "about")
    .replace(/\bI apologize\b/gi, "Sorry")
    .replace(/\bDisculpe\b/gi, "Perdón");

  if (lang === "spanish") {
    result = result.replace(/^Buenos días/gi, "Hey");
  }
  return result;
}

function rewriteSofter(msg: string, lang: Language): string {
  const prefixes: Record<Language, string> = {
    english: "No pressure — ",
    spanish: "Sin presión — ",
    spanglish: "No pressure — ",
  };
  if (/no pressure|sin presión|hope está/i.test(msg)) return msg;
  const body = msg.replace(/^(hey|hi|hello|hola)[,.]?\s*/i, "");
  return prefixes[lang] + body.charAt(0).toLowerCase() + body.slice(1);
}

function rewriteDirect(msg: string, lang: Language): string {
  let result = firstSentence(msg);
  result = result
    .replace(/\bI wanted to let you know\b/gi, "Heads up")
    .replace(/\bJust wanted to say\b/gi, "")
    .replace(/\bI hope this is okay — /gi, "")
    .replace(/\bEspero que esté bien — /gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (lang === "spanish") {
    result = result.replace(/\bQuería avisarte\b/gi, "Te aviso");
  }
  return result;
}

export function rewriteMessage(
  message: string,
  action: RewriteAction,
  language: Language,
): string {
  const handlers: Record<RewriteAction, (m: string, l: Language) => string> = {
    shorter: (m) => rewriteShorter(m),
    nicer: rewriteNicer,
    professional: rewriteProfessional,
    casual: rewriteCasual,
    softer: rewriteSofter,
    direct: rewriteDirect,
  };
  return handlers[action](message, language);
}

export function applyAvoidPhrases(
  message: string,
  avoidPhrases?: string[],
): string {
  if (!avoidPhrases?.length) return message;
  let result = message;
  for (const phrase of avoidPhrases) {
    if (!phrase.trim()) continue;
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "gi"), "").replace(/\s+/g, " ").trim();
  }
  return result;
}

export function applyFavoritePhrase(
  message: string,
  favoritePhrases: string[] | undefined,
  language: Language,
): string {
  if (!favoritePhrases?.length) return message;
  const phrase = favoritePhrases[0]?.trim();
  if (!phrase || message.toLowerCase().includes(phrase.toLowerCase())) {
    return message;
  }
  const connectors: Record<Language, string> = {
    english: " ",
    spanish: " ",
    spanglish: " ",
  };
  const punct = message.match(/[.!?]$/) ? "" : ".";
  return `${message}${punct}${connectors[language]}${phrase}`;
}
