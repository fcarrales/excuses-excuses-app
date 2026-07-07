import { pickVariation } from "@/lib/messageVariations";
import type {
  GeneratedMessage,
  GeneratorInput,
  Language,
  MessageStyle,
  Recipient,
  Situation,
  Tone,
} from "@/types";

export const SITUATION_OPTIONS: { value: Situation; label: string }[] = [
  { value: "running-late", label: "I'm running late" },
  { value: "cancel", label: "I need to cancel" },
  { value: "reschedule", label: "I need to reschedule" },
  { value: "apologize", label: "I need to apologize" },
  { value: "dont-want-to-go", label: "I don't want to go" },
  { value: "work", label: "Work excuse" },
  { value: "school", label: "School excuse" },
  { value: "family", label: "Family message" },
  { value: "dating", label: "Dating message" },
  { value: "improve", label: "Make my message sound better" },
];

export const RECIPIENT_OPTIONS: { value: Recipient; label: string }[] = [
  { value: "boss", label: "Boss" },
  { value: "coworker", label: "Coworker" },
  { value: "teacher", label: "Teacher" },
  { value: "friend", label: "Friend" },
  { value: "date", label: "Date" },
  { value: "family", label: "Family" },
  { value: "spouse", label: "Spouse" },
  { value: "other", label: "Other" },
];

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "funny", label: "Funny" },
  { value: "respectful", label: "Respectful" },
  { value: "soft", label: "Soft" },
  { value: "direct", label: "Direct" },
  { value: "believable", label: "Believable" },
];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "spanglish", label: "Spanglish" },
];

type LangText = Record<Language, string>;

interface TemplateTriple {
  short: LangText;
  natural: LangText;
  professional: LangText;
}

type RecipientGroup = "formal" | "work" | "social" | "family" | "neutral";

function recipientGroup(recipient: Recipient): RecipientGroup {
  if (recipient === "boss" || recipient === "teacher") return "formal";
  if (recipient === "coworker") return "work";
  if (recipient === "friend" || recipient === "date") return "social";
  if (recipient === "family" || recipient === "spouse") return "family";
  return "neutral";
}

function greeting(
  recipient: Recipient,
  language: Language,
  tone: Tone,
  personName?: string,
): string {
  const formal = recipientGroup(recipient) === "formal";
  const family = recipientGroup(recipient) === "family";
  const name = personName?.trim();

  if (name) {
    if (language === "spanish") {
      if (formal) return tone === "professional" ? `Buenos días, ${name}` : `Hola, ${name}`;
      return `Hola ${name}`;
    }
    if (language === "spanglish") {
      if (formal) return `Hi ${name}`;
      return `Hey ${name}`;
    }
    if (formal) return tone === "professional" ? `Hello ${name}` : `Hi ${name}`;
    return `Hey ${name}`;
  }

  if (language === "spanish") {
    if (formal) return tone === "professional" ? "Buenos días" : "Hola";
    if (family) return "Hola";
    return "Hey";
  }
  if (language === "spanglish") {
    if (formal) return "Hi";
    if (family) return "Hey";
    return "Hey";
  }
  if (formal) return tone === "professional" ? "Hello" : "Hi";
  if (family) return "Hey";
  return "Hey";
}

function weaveDetails(base: string, details: string | undefined, language: Language): string {
  if (!details?.trim()) return base;
  const trimmed = details.trim().replace(/\s+/g, " ");
  const punct = trimmed.match(/[.!?]$/) ? "" : ".";

  if (language === "spanish") {
    const connectors = ["", " La cosa es que ", " Solo para que sepas: "];
    const connector = connectors[trimmed.length % connectors.length];
    return `${base}${connector}${trimmed}${punct}`;
  }
  if (language === "spanglish") {
    return `${base} Btw: ${trimmed}${punct}`;
  }
  const connectors = ["", " Just so you know — ", " Quick note: "];
  const connector = connectors[trimmed.length % connectors.length];
  return `${base}${connector}${trimmed}${punct}`;
}

function applyPersonNotes(
  message: string,
  notes: string | undefined,
  language: Language,
): string {
  if (!notes?.trim()) return message;
  const lower = notes.toLowerCase();
  let msg = message;

  if (
    lower.includes("short") ||
    lower.includes("brief") ||
    lower.includes("corto")
  ) {
    const match = msg.match(/^[^.!?]+[.!?]?/);
    msg = match ? match[0] : msg;
    if (!msg.match(/[.!?]$/)) msg += ".";
  }

  if (lower.includes("respectful") || lower.includes("respetuoso")) {
    const closings: Record<Language, string> = {
      english: " Thank you for understanding.",
      spanish: " Gracias por tu comprensión.",
      spanglish: " Thanks por entender.",
    };
    if (
      !msg.includes("Thank") &&
      !msg.includes("Gracias") &&
      !msg.includes("Thanks")
    ) {
      msg = msg.replace(/[.!?]?$/, ".") + closings[language];
    }
  }

  return msg;
}

function lowercaseFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function applyTone(message: string, tone: Tone, language: Language): string {
  let msg = message;

  if (tone === "casual") {
    if (language === "english") {
      msg = msg
        .replace(/\bI would like to\b/gi, "I wanna")
        .replace(/\bI wanted to let you know\b/gi, "Just so you know")
        .replace(/\bapproximately\b/gi, "about")
        .replace(/\bPlease accept my\b/gi, "Sorry — my")
        .replace(/\bI regret\b/gi, "Sorry");
    } else if (language === "spanish") {
      msg = msg
        .replace(/\bQuería avisarte\b/gi, "Te cuento")
        .replace(/\bMe gustaría\b/gi, "Quiero")
        .replace(/\bLamento informarte\b/gi, "Perdón, pero");
    } else {
      msg = msg
        .replace(/\bI would like to\b/gi, "I wanna")
        .replace(/\bQuería avisarte\b/gi, "Te cuento");
    }
    return msg;
  }

  if (tone === "professional") {
    if (language === "english") {
      msg = msg
        .replace(/^Hey/g, "Hello")
        .replace(/^Hi —/g, "Hello —")
        .replace(/\bwanna\b/gi, "would like to")
        .replace(/\babout\b/gi, "approximately")
        .replace(/\bSorry\b/g, "I apologize");
    } else if (language === "spanish") {
      msg = msg
        .replace(/^Hey/g, "Hola")
        .replace(/^Hola —/g, "Buenos días —")
        .replace(/\bPerdón\b/g, "Disculpe");
    } else {
      msg = msg.replace(/^Hey/g, "Hi");
    }
    return msg;
  }

  if (tone === "funny") {
    const suffixes: Record<Language, string> = {
      english: " (Classic me, right? 😅)",
      spanish: " (Típico, ¿no? 😅)",
      spanglish: " (Classic me, ¿no? 😅)",
    };
    if (!msg.includes("😅") && !msg.includes("right?")) {
      msg = msg.replace(/\.$/, "") + suffixes[language];
    }
    return msg;
  }

  if (tone === "respectful") {
    const closings: Record<Language, string> = {
      english: " Thank you for understanding.",
      spanish: " Gracias por tu comprensión.",
      spanglish: " Thanks por entender.",
    };
    if (!msg.includes("Thank") && !msg.includes("Gracias") && !msg.includes("Thanks")) {
      msg = msg.replace(/[.!?]?$/, ".") + closings[language];
    }
    return msg;
  }

  if (tone === "soft") {
    const prefixes: Record<Language, string> = {
      english: "I hope this is okay — ",
      spanish: "Espero que esté bien — ",
      spanglish: "Hope está bien — ",
    };
    const body = msg.replace(/^(Hey|Hi|Hello|Hola)[,.]? —?\s*/i, "");
    return prefixes[language] + lowercaseFirst(body);
  }

  if (tone === "direct") {
    if (language === "english") {
      msg = msg
        .replace(/\bI wanted to let you know\b/gi, "Heads up")
        .replace(/\bI would like to\b/gi, "I need to")
        .replace(/\bJust a heads up — /gi, "")
        .replace(/\bI hope this is okay — /gi, "");
    } else if (language === "spanish") {
      msg = msg
        .replace(/\bQuería avisarte\b/gi, "Te aviso")
        .replace(/\bMe gustaría\b/gi, "Necesito");
    } else {
      msg = msg
        .replace(/\bI wanted to let you know\b/gi, "Heads up")
        .replace(/\bQuería avisarte\b/gi, "Te aviso");
    }
    return msg;
  }

  if (tone === "believable") {
    if (language === "english") {
      msg = msg
        .replace(/\bapproximately\b/gi, "about")
        .replace(/Classic me, right\? 😅/g, "")
        .replace(/\(Life happens, right\?\)/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    }
    return msg;
  }

  return msg;
}

const TEMPLATES: Record<Situation, Record<RecipientGroup, TemplateTriple>> = {
  "running-late": {
    formal: {
      short: {
        english: "Running about 15 minutes late. On my way now.",
        spanish: "Voy con unos 15 minutos de retraso. Ya voy en camino.",
        spanglish: "Voy like 15 min late. Already on my way.",
      },
      natural: {
        english: "I'm running about 15 minutes behind schedule. I'm on my way and should arrive shortly. Sorry for the delay.",
        spanish: "Voy con unos 15 minutos de retraso. Ya estoy en camino y debería llegar pronto. Disculpa la demora.",
        spanglish: "I'm running like 15 min behind. Ya voy en camino y llego pronto. Sorry por la demora.",
      },
      professional: {
        english: "I wanted to let you know I'm running approximately 15 minutes late. I apologize for any inconvenience and am en route.",
        spanish: "Quería avisarte que voy con aproximadamente 15 minutos de retraso. Disculpa las molestias; ya estoy en camino.",
        spanglish: "Quería let you know I'm running like 15 min late. Sorry por las molestias — ya voy en camino.",
      },
    },
    work: {
      short: {
        english: "Running late — be there in ~15 min!",
        spanish: "Voy tarde — llego en unos 15 min.",
        spanglish: "Running late — llego en like 15 min!",
      },
      natural: {
        english: "Hey, just a heads up — I'm running about 15 minutes late. On my way now, sorry!",
        spanish: "Oye, solo te aviso — voy con unos 15 minutos de retraso. Ya voy, ¡perdón!",
        spanglish: "Hey, heads up — voy like 15 min late. On my way, sorry!",
      },
      professional: {
        english: "Quick update: I'm running about 15 minutes behind. I should be there shortly. Thanks for your patience.",
        spanish: "Actualización rápida: voy con unos 15 minutos de retraso. Llego en breve. Gracias por la paciencia.",
        spanglish: "Quick update: voy like 15 min behind. Llego en breve. Thanks por la paciencia.",
      },
    },
    social: {
      short: {
        english: "Running late! Be there in like 15 min 😅",
        spanish: "¡Voy tarde! Llego en unos 15 min 😅",
        spanglish: "Running late! Llego en like 15 min 😅",
      },
      natural: {
        english: "Hey! I'm running about 15 minutes behind — still coming though! Sorry to keep you waiting.",
        spanish: "¡Hey! Voy con unos 15 minutos de retraso — ¡pero voy! Perdón por hacerte esperar.",
        spanglish: "Hey! Voy like 15 min behind — pero sí voy! Sorry por hacerte wait.",
      },
      professional: {
        english: "Hi — I'm running about 15 minutes late but I'm on my way. Sorry for the wait!",
        spanish: "Hola — voy con unos 15 minutos de retraso pero ya voy en camino. ¡Perdón por la espera!",
        spanglish: "Hi — voy like 15 min late pero on my way. Sorry por la wait!",
      },
    },
    family: {
      short: {
        english: "Running late! Be there soon.",
        spanish: "¡Voy tarde! Llego pronto.",
        spanglish: "Running late! Llego pronto.",
      },
      natural: {
        english: "Hey, I'm running a bit behind — should be there in about 15 minutes. Sorry!",
        spanish: "Oye, voy un poco tarde — llego en unos 15 minutos. ¡Perdón!",
        spanglish: "Hey, voy un poco late — llego en like 15 min. Sorry!",
      },
      professional: {
        english: "Just letting you know I'm running about 15 minutes late. I'll be there as soon as I can.",
        spanish: "Solo te aviso que voy con unos 15 minutos de retraso. Llego lo antes que pueda.",
        spanglish: "Just letting you know voy like 15 min late. Llego lo antes que pueda.",
      },
    },
    neutral: {
      short: {
        english: "Running about 15 min late. On my way.",
        spanish: "Voy con unos 15 min de retraso. En camino.",
        spanglish: "Running like 15 min late. On my way.",
      },
      natural: {
        english: "Hi — I'm running about 15 minutes late. I'm on my way and should be there soon.",
        spanish: "Hola — voy con unos 15 minutos de retraso. Ya voy en camino y llego pronto.",
        spanglish: "Hi — voy like 15 min late. On my way y llego pronto.",
      },
      professional: {
        english: "I wanted to let you know I'm running approximately 15 minutes late. I apologize for the delay.",
        spanish: "Quería avisarte que voy con aproximadamente 15 minutos de retraso. Disculpa la demora.",
        spanglish: "Quería let you know voy like 15 min late. Sorry por la demora.",
      },
    },
  },
  cancel: {
    formal: {
      short: {
        english: "I need to cancel today. I apologize for the inconvenience.",
        spanish: "Necesito cancelar hoy. Disculpa las molestias.",
        spanglish: "Necesito cancel today. Sorry por las molestias.",
      },
      natural: {
        english: "I'm sorry, but I need to cancel today. Something came up unexpectedly. I hope we can reschedule soon.",
        spanish: "Lo siento, pero necesito cancelar hoy. Surgió algo inesperado. Espero que podamos reprogramar pronto.",
        spanglish: "Sorry, pero necesito cancel hoy. Algo salió unexpected. Hope podamos reschedule pronto.",
      },
      professional: {
        english: "I regret to inform you that I need to cancel today due to an unforeseen matter. I apologize for any inconvenience and am happy to reschedule at your convenience.",
        spanish: "Lamento informarte que necesito cancelar hoy por un asunto imprevisto. Disculpa las molestias y con gusto reprogramamos cuando te convenga.",
        spanglish: "Lamento informarte que necesito cancel hoy por un asunto imprevisto. Sorry por las molestias — happy to reschedule cuando te convenga.",
      },
    },
    work: {
      short: {
        english: "Can't make it today — need to cancel. Sorry!",
        spanish: "No puedo hoy — necesito cancelar. ¡Perdón!",
        spanglish: "Can't make it today — necesito cancel. Sorry!",
      },
      natural: {
        english: "Hey, something came up and I need to cancel today. Really sorry about this — can we find another time?",
        spanish: "Oye, surgió algo y necesito cancelar hoy. De verdad lo siento — ¿podemos buscar otro día?",
        spanglish: "Hey, algo salió y necesito cancel hoy. Really sorry — ¿podemos find otro día?",
      },
      professional: {
        english: "I need to cancel today's plans due to a conflict that came up. I apologize for the short notice and am available to reschedule.",
        spanish: "Necesito cancelar los planes de hoy por un conflicto que surgió. Disculpa el aviso de último momento; estoy disponible para reprogramar.",
        spanglish: "Necesito cancel los planes de hoy por un conflict que salió. Sorry por el short notice — available to reschedule.",
      },
    },
    social: {
      short: {
        english: "So sorry — can't make it today 😔",
        spanish: "Perdón — no puedo hoy 😔",
        spanglish: "So sorry — no puedo today 😔",
      },
      natural: {
        english: "Hey, I'm really sorry but I can't make it today. Something came up last minute. Rain check?",
        spanish: "Oye, de verdad lo siento pero no puedo hoy. Surgió algo de último momento. ¿Lo dejamos para después?",
        spanglish: "Hey, really sorry pero no puedo today. Algo salió last minute. ¿Rain check?",
      },
      professional: {
        english: "Hi — I unfortunately need to cancel today. I apologize for the late notice and would love to reschedule when you're free.",
        spanish: "Hola — lamentablemente necesito cancelar hoy. Perdón por el aviso tardío; me encantaría reprogramar cuando estés libre.",
        spanglish: "Hi — unfortunately necesito cancel hoy. Sorry por el late notice — me encantaría reschedule cuando estés free.",
      },
    },
    family: {
      short: {
        english: "Can't make it today, sorry!",
        spanish: "No puedo hoy, ¡perdón!",
        spanglish: "No puedo today, sorry!",
      },
      natural: {
        english: "Hey, I'm sorry but I can't make it today. Something came up — hope you understand!",
        spanish: "Oye, perdón pero no puedo hoy. Surgió algo — ¡espero que entiendas!",
        spanglish: "Hey, sorry pero no puedo today. Algo salió — hope entiendas!",
      },
      professional: {
        english: "I wanted to let you know I won't be able to make it today. I'm sorry for the inconvenience and hope we can plan something soon.",
        spanish: "Quería avisarte que no podré hoy. Perdón por las molestias; ojalá planeemos algo pronto.",
        spanglish: "Quería let you know no podré today. Sorry por las molestias — ojalá planeemos algo pronto.",
      },
    },
    neutral: {
      short: {
        english: "I need to cancel. Sorry for the inconvenience.",
        spanish: "Necesito cancelar. Disculpa las molestias.",
        spanglish: "Necesito cancel. Sorry por las molestias.",
      },
      natural: {
        english: "Hi — I'm sorry, but I need to cancel. Something unexpected came up. Hope we can reschedule.",
        spanish: "Hola — lo siento, pero necesito cancelar. Surgió algo inesperado. Espero que podamos reprogramar.",
        spanglish: "Hi — sorry, pero necesito cancel. Algo unexpected salió. Hope podamos reschedule.",
      },
      professional: {
        english: "I regret that I need to cancel due to an unforeseen circumstance. I apologize for any inconvenience caused.",
        spanish: "Lamento tener que cancelar por una circunstancia imprevista. Disculpa las molestias.",
        spanglish: "Lamento tener que cancel por una circunstancia imprevista. Sorry por las molestias.",
      },
    },
  },
  reschedule: {
    formal: {
      short: {
        english: "Can we reschedule? Please let me know what works for you.",
        spanish: "¿Podemos reprogramar? Avísame qué te funciona.",
        spanglish: "¿Podemos reschedule? Let me know qué te works.",
      },
      natural: {
        english: "Would it be possible to reschedule? I have a conflict and want to find a time that works better for both of us.",
        spanish: "¿Sería posible reprogramar? Tengo un conflicto y quiero encontrar un horario que nos funcione a los dos.",
        spanglish: "¿Would be possible to reschedule? Tengo un conflict y quiero find un time que nos works.",
      },
      professional: {
        english: "I would like to request rescheduling our meeting due to a scheduling conflict. Please let me know your availability and I will accommodate accordingly.",
        spanish: "Me gustaría solicitar reprogramar nuestra reunión por un conflicto de horario. Avísame tu disponibilidad y me adapto.",
        spanglish: "Me gustaría request reschedule nuestra meeting por un scheduling conflict. Avísame tu availability y me adapto.",
      },
    },
    work: {
      short: {
        english: "Can we move this to another day?",
        spanish: "¿Podemos moverlo a otro día?",
        spanglish: "¿Podemos move esto a otro día?",
      },
      natural: {
        english: "Hey, any chance we can reschedule? Something came up and I want to make sure we still connect.",
        spanish: "Oye, ¿hay chance de reprogramar? Surgió algo y quiero asegurarme de que nos veamos.",
        spanglish: "Hey, ¿any chance podemos reschedule? Algo salió y quiero make sure nos conectamos.",
      },
      professional: {
        english: "I need to reschedule due to a conflict. I'm flexible this week — what times work best for you?",
        spanish: "Necesito reprogramar por un conflicto. Soy flexible esta semana — ¿qué horarios te funcionan?",
        spanglish: "Necesito reschedule por un conflict. Flexible this week — ¿qué times te work?",
      },
    },
    social: {
      short: {
        english: "Can we rain check? 🙏",
        spanish: "¿Lo dejamos para después? 🙏",
        spanglish: "¿Rain check? 🙏",
      },
      natural: {
        english: "Hey! Can we reschedule? Something came up on my end — would love to find another time that works!",
        spanish: "¡Hey! ¿Podemos reprogramar? Surgió algo — me encantaría encontrar otro día que nos funcione.",
        spanglish: "Hey! ¿Podemos reschedule? Algo salió — would love find otro time que works!",
      },
      professional: {
        english: "Hi — would you be open to rescheduling? I have a conflict but really want to make this happen. Let me know what works for you.",
        spanish: "Hola — ¿te parece reprogramar? Tengo un conflicto pero de verdad quiero que pase. Avísame qué te funciona.",
        spanglish: "Hi — ¿open to reschedule? Tengo conflict pero really quiero que pase. Let me know qué works.",
      },
    },
    family: {
      short: {
        english: "Can we do this another day?",
        spanish: "¿Lo hacemos otro día?",
        spanglish: "¿Lo hacemos otro día?",
      },
      natural: {
        english: "Hey, can we reschedule? Something came up but I still want to see you — what day works?",
        spanish: "Oye, ¿podemos reprogramar? Surgió algo pero igual quiero verte — ¿qué día te funciona?",
        spanglish: "Hey, ¿podemos reschedule? Algo salió pero still quiero verte — ¿qué day works?",
      },
      professional: {
        english: "I need to move our plans to another day. I'm sorry for the change — let me know when you're available.",
        spanish: "Necesito mover nuestros planes a otro día. Perdón por el cambio — avísame cuándo estás disponible.",
        spanglish: "Necesito move nuestros planes a otro día. Sorry por el change — avísame cuándo estás available.",
      },
    },
    neutral: {
      short: {
        english: "Can we reschedule? Let me know what works.",
        spanish: "¿Podemos reprogramar? Avísame qué te funciona.",
        spanglish: "¿Podemos reschedule? Let me know qué works.",
      },
      natural: {
        english: "Hi — would it be possible to reschedule? I have a conflict and want to find a better time.",
        spanish: "Hola — ¿sería posible reprogramar? Tengo un conflicto y quiero encontrar un mejor horario.",
        spanglish: "Hi — ¿possible to reschedule? Tengo conflict y quiero find mejor time.",
      },
      professional: {
        english: "I would like to reschedule due to a scheduling conflict. Please share your availability and I will adjust accordingly.",
        spanish: "Me gustaría reprogramar por un conflicto de horario. Comparte tu disponibilidad y me adapto.",
        spanglish: "Me gustaría reschedule por scheduling conflict. Share tu availability y me adapto.",
      },
    },
  },
  apologize: {
    formal: {
      short: {
        english: "I sincerely apologize. It won't happen again.",
        spanish: "Me disculpo sinceramente. No volverá a pasar.",
        spanglish: "Sincerely apologize. No va a happen again.",
      },
      natural: {
        english: "I want to sincerely apologize for what happened. I take full responsibility and I'm committed to doing better.",
        spanish: "Quiero disculparme sinceramente por lo que pasó. Asumo toda la responsabilidad y me comprometo a mejorar.",
        spanglish: "Quiero apologize sincerely por lo que pasó. Asumo full responsibility y committed a doing better.",
      },
      professional: {
        english: "Please accept my sincere apology for the oversight. I understand the impact and am taking steps to ensure this does not happen again.",
        spanish: "Por favor acepta mis sinceras disculpas por el descuido. Entiendo el impacto y estoy tomando medidas para que no vuelva a ocurrir.",
        spanglish: "Please accept mis sincere disculpas por el oversight. Entiendo el impact y taking steps para que no happen again.",
      },
    },
    work: {
      short: {
        english: "Sorry about that — my bad.",
        spanish: "Perdón por eso — fue mi culpa.",
        spanglish: "Sorry about eso — my bad.",
      },
      natural: {
        english: "Hey, I owe you an apology. I messed up and I'm sorry. I'll make sure it doesn't happen again.",
        spanish: "Oye, te debo una disculpa. La regué y lo siento. Me aseguraré de que no vuelva a pasar.",
        spanglish: "Hey, te debo una apology. La regué y sorry. Me aseguro no happen again.",
      },
      professional: {
        english: "I apologize for the mistake on my end. I understand the inconvenience and am taking steps to prevent this going forward.",
        spanish: "Me disculpo por el error de mi parte. Entiendo las molestias y estoy tomando medidas para evitarlo en adelante.",
        spanglish: "Apologize por el mistake de mi parte. Entiendo las molestias y taking steps para prevent esto going forward.",
      },
    },
    social: {
      short: {
        english: "I'm really sorry 😔",
        spanish: "De verdad lo siento 😔",
        spanglish: "Really sorry 😔",
      },
      natural: {
        english: "Hey, I've been thinking about it and I really want to apologize. I didn't handle that well and I'm sorry.",
        spanish: "Oye, lo he pensado y de verdad quiero disculparme. No lo manejé bien y lo siento.",
        spanglish: "Hey, lo he pensado y really quiero apologize. No lo handled bien y sorry.",
      },
      professional: {
        english: "I want to apologize sincerely. I know I hurt your feelings and that wasn't fair. I hope we can move past this.",
        spanish: "Quiero disculparme sinceramente. Sé que te lastimé y no estuvo bien. Espero que podamos superarlo.",
        spanglish: "Quiero apologize sincerely. Sé que hurt tus feelings y no estuvo fair. Hope podamos move past esto.",
      },
    },
    family: {
      short: {
        english: "I'm sorry. I love you.",
        spanish: "Lo siento. Te quiero.",
        spanglish: "Sorry. Te quiero.",
      },
      natural: {
        english: "Hey, I'm really sorry about what happened. I didn't mean to upset you and I hope we can talk about it.",
        spanish: "Oye, de verdad lo siento por lo que pasó. No quise molestarte y espero que podamos hablar.",
        spanglish: "Hey, really sorry por lo que pasó. No quise upset you y hope podamos talk.",
      },
      professional: {
        english: "I want to apologize from the heart. I know I was wrong and I value our relationship too much to let this come between us.",
        spanish: "Quiero disculparme de corazón. Sé que estuve mal y valoro demasiado nuestra relación para dejar que esto nos separe.",
        spanglish: "Quiero apologize de corazón. Sé que estuve wrong y valoro too much nuestra relationship para let esto come between us.",
      },
    },
    neutral: {
      short: {
        english: "I'm sorry. That was my fault.",
        spanish: "Lo siento. Fue mi culpa.",
        spanglish: "Sorry. Fue my fault.",
      },
      natural: {
        english: "I want to apologize sincerely. I know I made a mistake and I'm truly sorry for any hurt I caused.",
        spanish: "Quiero disculparme sinceramente. Sé que cometí un error y de verdad lamento cualquier daño que haya causado.",
        spanglish: "Quiero apologize sincerely. Sé que made a mistake y truly sorry por any hurt que caused.",
      },
      professional: {
        english: "Please accept my apology. I recognize my error and am committed to making things right.",
        spanish: "Por favor acepta mis disculpas. Reconozco mi error y me comprometo a enmendar las cosas.",
        spanglish: "Please accept mi apology. Reconozco mi error y committed a making things right.",
      },
    },
  },
  "dont-want-to-go": {
    formal: {
      short: {
        english: "I won't be able to attend. Thank you for understanding.",
        spanish: "No podré asistir. Gracias por tu comprensión.",
        spanglish: "No podré attend. Thanks por entender.",
      },
      natural: {
        english: "I wanted to let you know I won't be able to make it. I'm not feeling up to it right now, but I appreciate the invite.",
        spanish: "Quería avisarte que no podré ir. No me siento con ánimos ahora, pero agradezco la invitación.",
        spanglish: "Quería let you know no podré make it. No me siento con energy ahora, pero appreciate la invite.",
      },
      professional: {
        english: "I regret that I will not be able to attend. I hope to join a future occasion. Thank you for your understanding.",
        spanish: "Lamento no poder asistir. Espero unirme en una ocasión futura. Gracias por tu comprensión.",
        spanglish: "Lamento no poder attend. Hope join una future occasion. Thanks por entender.",
      },
    },
    work: {
      short: {
        english: "Gonna sit this one out — thanks though!",
        spanish: "Me voy a quedar fuera de esta — ¡pero gracias!",
        spanglish: "Gonna sit this one out — thanks though!",
      },
      natural: {
        english: "Hey, I think I'm gonna pass on this one. Not really feeling it tonight but thanks for thinking of me!",
        spanish: "Oye, creo que voy a pasar de esta. No me provoca esta noche, ¡pero gracias por pensar en mí!",
        spanglish: "Hey, creo que voy a pass de esta. No me provoca tonight, ¡pero thanks por think of me!",
      },
      professional: {
        english: "I appreciate the invite but I'm going to have to pass this time. Hope you all have a great time!",
        spanish: "Agradezco la invitación pero esta vez voy a tener que pasar. ¡Que la pasen bien!",
        spanglish: "Appreciate la invite pero this time voy a have to pass. Hope la pasen great!",
      },
    },
    social: {
      short: {
        english: "Can't make it tonight — need a night in 🛋️",
        spanish: "No puedo esta noche — necesito quedarme en casa 🛋️",
        spanglish: "No puedo tonight — need a night in 🛋️",
      },
      natural: {
        english: "Hey, I'm gonna have to bail tonight. I'm pretty wiped and need to recharge. Rain check soon?",
        spanish: "Oye, voy a tener que cancelar esta noche. Estoy muy cansado/a y necesito recargar. ¿Lo dejamos para después?",
        spanglish: "Hey, voy a have to bail tonight. Pretty wiped y need recharge. ¿Rain check soon?",
      },
      professional: {
        english: "Hi — I won't be able to make it tonight. I'm not feeling up to going out but I'd love to catch up another time.",
        spanish: "Hola — no podré esta noche. No me siento con ánimos de salir pero me encantaría vernos otro día.",
        spanglish: "Hi — no podré tonight. No me siento con energy de salir pero would love catch up otro time.",
      },
    },
    family: {
      short: {
        english: "Gonna skip this time — love you!",
        spanish: "Esta vez me lo salto — ¡te quiero!",
        spanglish: "Gonna skip this time — love you!",
      },
      natural: {
        english: "Hey, I think I'm gonna sit this one out. I'm pretty tired and need some downtime. Love you!",
        spanish: "Oye, creo que me voy a quedar fuera de esta. Estoy bastante cansado/a y necesito descansar. ¡Te quiero!",
        spanglish: "Hey, creo que me voy a sit this one out. Pretty tired y need downtime. Love you!",
      },
      professional: {
        english: "I wanted to let you know I won't be able to make it this time. I need to rest but I hope we can plan something soon.",
        spanish: "Quería avisarte que no podré esta vez. Necesito descansar pero espero que planeemos algo pronto.",
        spanglish: "Quería let you know no podré this time. Need rest pero hope planeemos algo pronto.",
      },
    },
    neutral: {
      short: {
        english: "Can't make it — thanks for understanding.",
        spanish: "No puedo — gracias por entender.",
        spanglish: "Can't make it — thanks por entender.",
      },
      natural: {
        english: "Hi — I won't be able to make it. I'm not feeling up to it right now. Hope that's okay.",
        spanish: "Hola — no podré ir. No me siento con ánimos ahora. Espero que esté bien.",
        spanglish: "Hi — no podré make it. No me siento con energy ahora. Hope está bien.",
      },
      professional: {
        english: "I regret that I won't be able to attend. I appreciate the invitation and hope to join another time.",
        spanish: "Lamento no poder asistir. Agradezco la invitación y espero unirme otra vez.",
        spanglish: "Lamento no poder attend. Appreciate la invitation y hope join otra time.",
      },
    },
  },
  work: {
    formal: {
      short: {
        english: "I need to step out for a personal matter. Back as soon as I can.",
        spanish: "Necesito salir por un asunto personal. Vuelvo lo antes posible.",
        spanglish: "Necesito step out por un personal matter. Back lo antes posible.",
      },
      natural: {
        english: "I have a personal matter I need to take care of today. I'll be back as soon as possible and will catch up on anything I miss.",
        spanish: "Tengo un asunto personal que atender hoy. Vuelvo lo antes posible y me pongo al día con lo que me pierda.",
        spanglish: "Tengo un personal matter que atender hoy. Back ASAP y catch up con lo que me pierda.",
      },
      professional: {
        english: "I need to attend to a personal matter today. I will be unavailable for a portion of the day but will ensure all responsibilities are covered upon my return.",
        spanish: "Necesito atender un asunto personal hoy. Estaré no disponible parte del día pero me aseguraré de cubrir mis responsabilidades al regresar.",
        spanglish: "Necesito attend a personal matter hoy. Unavailable parte del día pero me aseguro cover mis responsibilities al regresar.",
      },
    },
    work: {
      short: {
        english: "Taking a personal day — will be back tomorrow!",
        spanish: "Tomo un día personal — ¡vuelvo mañana!",
        spanglish: "Taking un personal day — back tomorrow!",
      },
      natural: {
        english: "Hey, I need to take a personal day today. I'll be offline but reachable by text if anything urgent comes up.",
        spanish: "Oye, necesito tomar un día personal hoy. Estaré offline pero disponible por mensaje si surge algo urgente.",
        spanglish: "Hey, necesito take un personal day hoy. Offline pero reachable por text si algo urgent.",
      },
      professional: {
        english: "I will be out today for a personal matter. I've delegated my urgent tasks and will follow up on everything first thing tomorrow.",
        spanish: "Estaré fuera hoy por un asunto personal. Delegué mis tareas urgentes y haré seguimiento mañana a primera hora.",
        spanglish: "Out hoy por personal matter. Delegué urgent tasks y follow up mañana first thing.",
      },
    },
    social: {
      short: {
        english: "Work thing came up — can't hang tonight.",
        spanish: "Surgió algo del trabajo — no puedo salir esta noche.",
        spanglish: "Work thing salió — can't hang tonight.",
      },
      natural: {
        english: "Hey, something came up at work and I can't make it tonight. Sorry — hopefully this week works better!",
        spanish: "Oye, surgió algo en el trabajo y no puedo esta noche. Perdón — ¡ojalá esta semana funcione mejor!",
        spanglish: "Hey, algo salió at work y no puedo tonight. Sorry — hopefully this week works better!",
      },
      professional: {
        english: "I have a work commitment that came up unexpectedly. I won't be able to make it tonight but would love to reschedule.",
        spanish: "Tengo un compromiso de trabajo que surgió de imprevisto. No podré esta noche pero me encantaría reprogramar.",
        spanglish: "Tengo work commitment que salió unexpected. No podré tonight pero would love reschedule.",
      },
    },
    family: {
      short: {
        english: "Stuck at work late — sorry!",
        spanish: "Atrapado/a en el trabajo — ¡perdón!",
        spanglish: "Stuck at work late — sorry!",
      },
      natural: {
        english: "Hey, I'm stuck at work and running late. I'll be home as soon as I can — sorry!",
        spanish: "Oye, estoy atrapado/a en el trabajo y voy tarde. Llego a casa lo antes que pueda — ¡perdón!",
        spanglish: "Hey, stuck at work y running late. Home ASAP — sorry!",
      },
      professional: {
        english: "I need to stay late at work tonight. I'll keep you posted on when I'm heading home.",
        spanish: "Necesito quedarme tarde en el trabajo esta noche. Te aviso cuando salga para casa.",
        spanglish: "Need stay late at work tonight. Te aviso cuando heading home.",
      },
    },
    neutral: {
      short: {
        english: "Work conflict today — unavailable for a bit.",
        spanish: "Conflicto de trabajo hoy — no disponible un rato.",
        spanglish: "Work conflict hoy — unavailable un rato.",
      },
      natural: {
        english: "I have a work matter I need to handle today. I'll be tied up for a while but will update you when I'm free.",
        spanish: "Tengo un asunto de trabajo que atender hoy. Estaré ocupado/a un rato pero te aviso cuando esté libre.",
        spanglish: "Tengo work matter hoy. Tied up un rato pero update cuando esté free.",
      },
      professional: {
        english: "I am handling a work-related matter today and will be temporarily unavailable. I will provide an update as soon as possible.",
        spanish: "Estoy atendiendo un asunto de trabajo hoy y estaré temporalmente no disponible. Daré una actualización lo antes posible.",
        spanglish: "Handling work matter hoy — temporarily unavailable. Update ASAP.",
      },
    },
  },
  school: {
    formal: {
      short: {
        english: "I won't be in class today. I'll catch up on the material.",
        spanish: "No estaré en clase hoy. Me pondré al día con el material.",
        spanglish: "No estaré in class hoy. Catch up con el material.",
      },
      natural: {
        english: "I wanted to let you know I won't be in class today. I'm not feeling well but will make sure to catch up on everything I miss.",
        spanish: "Quería avisarte que no estaré en clase hoy. No me siento bien pero me aseguraré de ponerme al día con todo.",
        spanglish: "Quería let you know no estaré in class hoy. No me siento bien pero catch up con todo.",
      },
      professional: {
        english: "I will be absent from class today due to illness. I will review the material covered and submit any missed assignments promptly.",
        spanish: "Estaré ausente de clase hoy por enfermedad. Revisaré el material cubierto y entregaré las tareas pendientes a tiempo.",
        spanglish: "Absent de class hoy por illness. Review el material y submit missed assignments on time.",
      },
    },
    work: {
      short: {
        english: "Missing class today — will get notes from a friend.",
        spanish: "Falto a clase hoy — pido apuntes a un amigo.",
        spanglish: "Missing class hoy — get notes de un friend.",
      },
      natural: {
        english: "Hey, I can't make it to class today. I'll get the notes from someone and turn in anything that's due.",
        spanish: "Oye, no puedo ir a clase hoy. Pido los apuntes a alguien y entrego lo que toque.",
        spanglish: "Hey, can't make it to class hoy. Get notes de alguien y turn in lo que toque.",
      },
      professional: {
        english: "I will be absent from class today. I plan to obtain notes from a classmate and complete any assignments by the deadline.",
        spanish: "Estaré ausente de clase hoy. Planeo obtener apuntes de un compañero y completar las tareas antes del plazo.",
        spanglish: "Absent de class hoy. Plan get notes de classmate y complete assignments on time.",
      },
    },
    social: {
      short: {
        english: "Skipping class today 😬",
        spanish: "Me salto clase hoy 😬",
        spanglish: "Skipping class hoy 😬",
      },
      natural: {
        english: "Hey, I'm not gonna make it to class today. Can you send me the notes? I'll owe you one!",
        spanish: "Oye, no voy a poder ir a clase hoy. ¿Me mandas los apuntes? ¡Te debo una!",
        spanglish: "Hey, no voy a make it to class hoy. ¿Me mandas notes? Te debo una!",
      },
      professional: {
        english: "Hi — I won't be able to attend class today. Could you share any notes or materials? I'll make it up.",
        spanish: "Hola — no podré asistir a clase hoy. ¿Podrías compartir apuntes o material? Lo compensaré.",
        spanglish: "Hi — no podré attend class hoy. ¿Share notes o material? Lo make up.",
      },
    },
    family: {
      short: {
        english: "Staying home from school today.",
        spanish: "Me quedo en casa de la escuela hoy.",
        spanglish: "Staying home de school hoy.",
      },
      natural: {
        english: "Hey, I'm staying home from school today. Not feeling great. I'll rest up and catch up on homework.",
        spanish: "Oye, me quedo en casa de la escuela hoy. No me siento bien. Descansaré y me pondré al día con la tarea.",
        spanglish: "Hey, staying home de school hoy. Not feeling great. Rest up y catch up homework.",
      },
      professional: {
        english: "I need to stay home from school today. I'm not feeling well but will work on assignments from home.",
        spanish: "Necesito quedarme en casa de la escuela hoy. No me siento bien pero trabajaré en las tareas desde casa.",
        spanglish: "Need stay home de school hoy. Not feeling well pero work on assignments from home.",
      },
    },
    neutral: {
      short: {
        english: "Absent from class today.",
        spanish: "Ausente de clase hoy.",
        spanglish: "Absent de class hoy.",
      },
      natural: {
        english: "I won't be able to attend class today. I'll make sure to catch up on any material I miss.",
        spanish: "No podré asistir a clase hoy. Me aseguraré de ponerme al día con el material.",
        spanglish: "No podré attend class hoy. Catch up con material que me pierda.",
      },
      professional: {
        english: "I will be absent from class today. I will review the covered material and complete any required work.",
        spanish: "Estaré ausente de clase hoy. Revisaré el material cubierto y completaré el trabajo requerido.",
        spanglish: "Absent de class hoy. Review material y complete required work.",
      },
    },
  },
  family: {
    formal: {
      short: {
        english: "Thinking of you. Hope you're doing well.",
        spanish: "Pensando en ti. Espero que estés bien.",
        spanglish: "Thinking of you. Hope estés bien.",
      },
      natural: {
        english: "Hey, just wanted to check in and say I'm thinking of you. Hope everything's going well on your end.",
        spanish: "Oye, solo quería saludar y decir que pienso en ti. Espero que todo vaya bien por allá.",
        spanglish: "Hey, solo quería check in y say thinking of you. Hope todo va bien por allá.",
      },
      professional: {
        english: "I wanted to reach out and let you know I'm thinking of you. Please let me know if there's anything I can do.",
        spanish: "Quería comunicarme y decirte que pienso en ti. Avísame si hay algo en lo que pueda ayudar.",
        spanglish: "Quería reach out y let you know thinking of you. Avísame si hay algo en lo que pueda help.",
      },
    },
    work: {
      short: {
        english: "Miss you! Call me when you can.",
        spanish: "¡Te extraño! Llámame cuando puedas.",
        spanglish: "Miss you! Call me cuando puedas.",
      },
      natural: {
        english: "Hey, just thinking about you! Life's been busy but I miss you. Let's catch up soon.",
        spanish: "Oye, ¡pensando en ti! La vida ha estado ocupada pero te extraño. Retomemos pronto.",
        spanglish: "Hey, thinking about you! Life busy pero miss you. Catch up soon.",
      },
      professional: {
        english: "I wanted to check in — it's been a while since we talked. I'd love to catch up when you have time.",
        spanish: "Quería saludar — hace tiempo que no hablamos. Me encantaría ponernos al día cuando tengas tiempo.",
        spanglish: "Quería check in — hace tiempo no talk. Would love catch up cuando tengas time.",
      },
    },
    social: {
      short: {
        english: "Love you! 💕",
        spanish: "¡Te quiero! 💕",
        spanglish: "Love you! 💕",
      },
      natural: {
        english: "Hey fam! Just wanted to say love you and hope you're having a good day.",
        spanish: "¡Hey familia! Solo quería decir que te quiero y espero que tengas un buen día.",
        spanglish: "Hey fam! Solo quería say love you y hope buen día.",
      },
      professional: {
        english: "Hi — I hope you're doing well. I wanted to reach out and let you know I'm thinking of you.",
        spanish: "Hola — espero que estés bien. Quería comunicarme y decirte que pienso en ti.",
        spanglish: "Hi — hope estés bien. Quería reach out y say thinking of you.",
      },
    },
    family: {
      short: {
        english: "Love you! Talk soon.",
        spanish: "¡Te quiero! Hablamos pronto.",
        spanglish: "Love you! Talk soon.",
      },
      natural: {
        english: "Hey, just wanted to say I love you and I'm grateful for you. Hope we can talk soon!",
        spanish: "Oye, solo quería decir que te quiero y te agradezco. ¡Ojalá hablemos pronto!",
        spanglish: "Hey, solo quería say love you y grateful for you. Hope talk soon!",
      },
      professional: {
        english: "I wanted to take a moment to tell you how much you mean to me. I hope you're doing well and I'd love to connect soon.",
        spanish: "Quería tomarme un momento para decirte cuánto significas para mí. Espero que estés bien y me encantaría conectar pronto.",
        spanglish: "Quería take a moment para say cuánto significas. Hope estés bien y would love connect soon.",
      },
    },
    neutral: {
      short: {
        english: "Thinking of you today.",
        spanish: "Pensando en ti hoy.",
        spanglish: "Thinking of you today.",
      },
      natural: {
        english: "Hi — just wanted to reach out and say I'm thinking of you. Hope you're having a good day.",
        spanish: "Hola — solo quería comunicarme y decir que pienso en ti. Espero que tengas un buen día.",
        spanglish: "Hi — solo quería reach out y say thinking of you. Hope buen día.",
      },
      professional: {
        english: "I wanted to check in and let you know you're on my mind. Please reach out if you need anything.",
        spanish: "Quería saludar y decirte que estás en mis pensamientos. Escríbeme si necesitas algo.",
        spanglish: "Quería check in y say estás on my mind. Reach out si necesitas algo.",
      },
    },
  },
  dating: {
    formal: {
      short: {
        english: "I enjoyed our time together. Would love to see you again.",
        spanish: "Disfruté nuestro tiempo juntos. Me encantaría verte de nuevo.",
        spanglish: "Enjoyed nuestro time juntos. Would love verte again.",
      },
      natural: {
        english: "I had a really nice time with you. I'd love to do it again sometime — let me know when you're free!",
        spanish: "La pasé muy bien contigo. Me encantaría repetirlo — ¡avísame cuando estés libre!",
        spanglish: "La pasé really nice contigo. Would love do it again — avísame cuando estés free!",
      },
      professional: {
        english: "Thank you for a wonderful evening. I genuinely enjoyed our conversation and would welcome the opportunity to see you again.",
        spanish: "Gracias por una noche maravillosa. Disfruté de verdad nuestra conversación y me encantaría verte otra vez.",
        spanglish: "Thanks por wonderful evening. Genuinely enjoyed nuestra conversation y welcome opportunity verte again.",
      },
    },
    work: {
      short: {
        english: "Had fun! Let's do it again 😊",
        spanish: "¡Me divertí! Repetimos 😊",
        spanglish: "Had fun! Repetimos 😊",
      },
      natural: {
        english: "Hey, I had a great time tonight! Would love to hang out again — what are you up to this weekend?",
        spanish: "Oye, ¡la pasé genial esta noche! Me encantaría salir otra vez — ¿qué haces este fin de semana?",
        spanglish: "Hey, great time tonight! Would love hang out again — ¿qué haces this weekend?",
      },
      professional: {
        english: "I really enjoyed getting to know you. I'd love to plan another date if you're interested.",
        spanish: "De verdad disfruté conocerte. Me encantaría planear otra cita si te interesa.",
        spanglish: "Really enjoyed getting to know you. Would love plan otra date si te interesa.",
      },
    },
    social: {
      short: {
        english: "Last night was fun 😊",
        spanish: "Anoche estuvo divertido 😊",
        spanglish: "Last night was fun 😊",
      },
      natural: {
        english: "Hey! I had a really good time last night. You're easy to talk to — would love to see you again!",
        spanish: "¡Hey! La pasé muy bien anoche. Es fácil hablar contigo — ¡me encantaría verte de nuevo!",
        spanglish: "Hey! Really good time last night. Easy to talk contigo — would love verte again!",
      },
      professional: {
        english: "I wanted to say I had a lovely time. I'd really like to see you again — let me know what works for you.",
        spanish: "Quería decir que la pasé encantador/a. Me gustaría verte de nuevo — avísame qué te funciona.",
        spanglish: "Quería say lovely time. Would like verte again — avísame qué works.",
      },
    },
    family: {
      short: {
        english: "Can't wait to see you again 💕",
        spanish: "No puedo esperar a verte de nuevo 💕",
        spanglish: "Can't wait verte again 💕",
      },
      natural: {
        english: "Hey babe, still thinking about last night. Can't wait to see you again!",
        spanish: "Oye amor, sigo pensando en anoche. ¡No puedo esperar a verte de nuevo!",
        spanglish: "Hey babe, still thinking about last night. Can't wait verte again!",
      },
      professional: {
        english: "I've been thinking about our time together and I'd love to plan something soon. When are you free?",
        spanish: "He estado pensando en nuestro tiempo juntos y me encantaría planear algo pronto. ¿Cuándo estás libre?",
        spanglish: "Been thinking about nuestro time juntos — would love plan algo pronto. ¿Cuándo estás free?",
      },
    },
    neutral: {
      short: {
        english: "Had a great time! Let's do it again.",
        spanish: "¡La pasé genial! Repetimos.",
        spanglish: "Great time! Repetimos.",
      },
      natural: {
        english: "Hi — I had a really nice time. I'd love to see you again. Let me know when you're free!",
        spanish: "Hola — la pasé muy bien. Me encantaría verte de nuevo. ¡Avísame cuando estés libre!",
        spanglish: "Hi — really nice time. Would love verte again. Avísame cuando estés free!",
      },
      professional: {
        english: "Thank you for a wonderful time. I would enjoy the opportunity to see you again at your convenience.",
        spanish: "Gracias por un momento maravilloso. Disfrutaría verte otra vez cuando te convenga.",
        spanglish: "Thanks por wonderful time. Would enjoy verte again cuando te convenga.",
      },
    },
  },
  improve: {
    formal: {
      short: {
        english: "I wanted to follow up on my earlier message. Please let me know if you have any questions.",
        spanish: "Quería dar seguimiento a mi mensaje anterior. Avísame si tienes preguntas.",
        spanglish: "Quería follow up a mi mensaje anterior. Avísame si tienes questions.",
      },
      natural: {
        english: "I wanted to reach out with a clearer message. I hope this comes across the way I intended.",
        spanish: "Quería comunicarme con un mensaje más claro. Espero que se entienda como lo pretendía.",
        spanglish: "Quería reach out con mensaje más clear. Hope se entienda como lo intended.",
      },
      professional: {
        english: "I would like to restate my message more clearly. I appreciate your time and attention to this matter.",
        spanish: "Me gustaría reformular mi mensaje con más claridad. Agradezco tu tiempo y atención a este asunto.",
        spanglish: "Me gustaría restate mi mensaje más clearly. Appreciate tu time y attention a este matter.",
      },
    },
    work: {
      short: {
        english: "Quick follow-up on my last message!",
        spanish: "¡Seguimiento rápido a mi último mensaje!",
        spanglish: "Quick follow-up a mi last message!",
      },
      natural: {
        english: "Hey, wanted to rephrase that — hope this version sounds better and makes more sense!",
        spanish: "Oye, quería reformularlo — ¡ojalá esta versión suene mejor y tenga más sentido!",
        spanglish: "Hey, quería rephrase eso — hope this version sounds better y makes more sense!",
      },
      professional: {
        english: "I'd like to clarify my previous message. I hope this version communicates my point more effectively.",
        spanish: "Me gustaría aclarar mi mensaje anterior. Espero que esta versión comunique mejor mi punto.",
        spanglish: "Me gustaría clarify mi previous message. Hope this version communicates mi point better.",
      },
    },
    social: {
      short: {
        english: "Let me say that better 😅",
        spanish: "Déjame decirlo mejor 😅",
        spanglish: "Let me say eso better 😅",
      },
      natural: {
        english: "Okay, let me try that again — I think this sounds more like what I actually meant!",
        spanish: "Bueno, déjame intentarlo otra vez — ¡creo que esto suena más a lo que quería decir!",
        spanglish: "Okay, let me try again — creo esto sounds more like lo que actually meant!",
      },
      professional: {
        english: "I wanted to rewrite that in a way that sounds more natural. Hope this is closer to what I meant!",
        spanish: "Quería reescribirlo de forma que suene más natural. ¡Ojalá esto se acerque más a lo que quería decir!",
        spanglish: "Quería rewrite eso más natural. Hope esto closer a lo que meant!",
      },
    },
    family: {
      short: {
        english: "What I meant was…",
        spanish: "Lo que quise decir fue…",
        spanglish: "What I meant was…",
      },
      natural: {
        english: "Hey, let me say that in a better way. I didn't want it to come out wrong.",
        spanish: "Oye, déjame decirlo de mejor forma. No quería que sonara mal.",
        spanglish: "Hey, let me say eso better. No quería que sound wrong.",
      },
      professional: {
        english: "I want to express this more thoughtfully. I hope this version better reflects what I feel.",
        spanish: "Quiero expresarlo con más cuidado. Espero que esta versión refleje mejor lo que siento.",
        spanglish: "Quiero express esto more thoughtfully. Hope this version reflects better lo que feel.",
      },
    },
    neutral: {
      short: {
        english: "Here's a better way to say it.",
        spanish: "Aquí va una mejor forma de decirlo.",
        spanglish: "Here's mejor way to say it.",
      },
      natural: {
        english: "Let me rephrase that — I think this version sounds more natural and gets my point across better.",
        spanish: "Déjame reformularlo — creo que esta versión suena más natural y comunica mejor mi punto.",
        spanglish: "Let me rephrase — creo this version sounds more natural y gets mi point across better.",
      },
      professional: {
        english: "I would like to present this message in a clearer, more polished form. I hope this better conveys my intent.",
        spanish: "Me gustaría presentar este mensaje de forma más clara y pulida. Espero que esto comunique mejor mi intención.",
        spanglish: "Me gustaría present this message más clear y polished. Hope esto conveys better mi intent.",
      },
    },
  },
};

function cleanUserText(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/^["']|["']$/g, "");
}

function ensurePeriod(text: string): string {
  return text.match(/[.!?]$/) ? text : `${text}.`;
}

function buildImproveMessages(
  details: string,
  recipient: Recipient,
  tone: Tone,
  language: Language,
  personName?: string,
): Record<MessageStyle, string> {
  const core = cleanUserText(details);
  const greet = greeting(recipient, language, tone, personName);
  const lower = lowercaseFirst(core);

  if (language === "spanish") {
    return {
      short: applyTone(ensurePeriod(`${greet} — ${core}`), tone, language),
      natural: applyTone(
        ensurePeriod(`${greet}. Quería decirte que ${lower}`),
        tone,
        language,
      ),
      professional: applyTone(
        ensurePeriod(`${greet}. Permíteme expresarlo así: ${core}`),
        tone,
        language,
      ),
    };
  }

  if (language === "spanglish") {
    return {
      short: applyTone(ensurePeriod(`${greet} — ${core}`), tone, language),
      natural: applyTone(
        ensurePeriod(`${greet}. Quería decirte que ${lower}`),
        tone,
        language,
      ),
      professional: applyTone(
        ensurePeriod(`${greet}. Let me put it this way: ${core}`),
        tone,
        language,
      ),
    };
  }

  return {
    short: applyTone(ensurePeriod(`${greet} — ${core}`), tone, language),
    natural: applyTone(
      ensurePeriod(`${greet}. Just wanted to say: ${lower}`),
      tone,
      language,
    ),
    professional: applyTone(
      ensurePeriod(`${greet}. To be clear: ${core}`),
      tone,
      language,
    ),
  };
}

export function requiresImproveInput(situation: Situation, details?: string): boolean {
  return situation === "improve" && !details?.trim();
}

function buildMessage(
  style: MessageStyle,
  input: GeneratorInput,
): string {
  const {
    situation,
    recipient,
    tone,
    language,
    details,
    variationSeed = 0,
    personName,
    personNotes,
  } = input;
  const group = recipientGroup(recipient);
  const greet = greeting(recipient, language, tone, personName);

  if (situation === "improve" && details?.trim()) {
    const improved = buildImproveMessages(details, recipient, tone, language, personName)[style];
    return applyPersonNotes(improved, personNotes, language);
  }

  const variation = variationSeed > 0
    ? pickVariation(situation, style, language, variationSeed)
    : null;

  const template = variation ?? TEMPLATES[situation][group][style][language];
  const separator = group === "formal" || group === "neutral" ? " —" : ",";
  const withGreeting = variation
    ? `${greet}${separator} ${template}`
    : `${greet}${separator} ${lowercaseFirst(template)}`;
  const withDetails = weaveDetails(withGreeting, details, language);
  const toned = applyTone(withDetails, tone, language);
  return applyPersonNotes(toned, personNotes, language);
}

const STYLE_LABELS: Record<MessageStyle, string> = {
  short: "Short",
  natural: "Natural",
  professional: "Professional",
};

export function generateMessages(input: GeneratorInput): GeneratedMessage[] {
  const styles: MessageStyle[] = ["short", "natural", "professional"];
  const now = Date.now();

  return styles.map((style, index) => ({
    id: `${now}-${index}`,
    label: style,
    message: buildMessage(style, input),
    situation: input.situation,
    recipient: input.recipient,
    tone: input.tone,
    language: input.language,
    details: input.details,
    createdAt: now + index,
    isFavorite: false,
  }));
}

export function getStyleLabel(style: MessageStyle): string {
  return STYLE_LABELS[style];
}

export function getSituationLabel(situation: Situation): string {
  return SITUATION_OPTIONS.find((s) => s.value === situation)?.label ?? situation;
}

export function getRecipientLabel(recipient: Recipient): string {
  return RECIPIENT_OPTIONS.find((r) => r.value === recipient)?.label ?? recipient;
}

export function getToneLabel(tone: Tone): string {
  return TONE_OPTIONS.find((t) => t.value === tone)?.label ?? tone;
}

export function getLanguageLabel(language: Language): string {
  return LANGUAGE_OPTIONS.find((l) => l.value === language)?.label ?? language;
}
