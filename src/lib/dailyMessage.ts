import type { Language, Situation, Tone } from "@/types";

export interface DailyMessage {
  message: string;
  category: string;
  language: Language;
  tone: Tone;
  situation: Situation;
}

interface DailyTemplate {
  category: string;
  situation: Situation;
  tone: Tone;
  messages: Record<Language, string>;
}

const DAILY_TEMPLATES: DailyTemplate[] = [
  {
    category: "Reschedule",
    situation: "reschedule",
    tone: "respectful",
    messages: {
      english:
        "Hey — would it be possible to reschedule? Something came up and I'd love to find another time that works.",
      spanish:
        "Hola — ¿sería posible reprogramar? Surgió algo y me encantaría encontrar otro horario que nos funcione.",
      spanglish:
        "Hey — ¿possible to reschedule? Algo salió y me encantaría find otro time que works.",
    },
  },
  {
    category: "Soft no",
    situation: "dont-want-to-go",
    tone: "soft",
    messages: {
      english:
        "I hope this is okay — I'm not feeling up to going out tonight. Rain check soon?",
      spanish:
        "Espero que esté bien — no me provoca salir esta noche. ¿Lo dejamos para después?",
      spanglish:
        "Hope está bien — no me provoca salir tonight. ¿Rain check soon?",
    },
  },
  {
    category: "Running late",
    situation: "running-late",
    tone: "professional",
    messages: {
      english:
        "Hi — I'm running about 15 minutes late. On my way now. Sorry for the delay.",
      spanish:
        "Hola — voy con unos 15 minutos de retraso. Ya voy en camino. Disculpa la demora.",
      spanglish:
        "Hi — voy like 15 min late. On my way. Sorry por la demora.",
    },
  },
  {
    category: "Apology",
    situation: "apologize",
    tone: "respectful",
    messages: {
      english:
        "I want to apologize — I didn't handle that well. Thank you for understanding.",
      spanish:
        "Quiero disculparme — no lo manejé bien. Gracias por tu comprensión.",
      spanglish:
        "Quiero apologize — no lo handled bien. Thanks por entender.",
    },
  },
  {
    category: "Cancel plans",
    situation: "cancel",
    tone: "soft",
    messages: {
      english:
        "I'm sorry but I need to cancel today. Something came up — hope we can reschedule soon.",
      spanish:
        "Lo siento pero necesito cancelar hoy. Surgió algo — ojalá reprogramemos pronto.",
      spanglish:
        "Sorry pero necesito cancel hoy. Algo salió — hope reschedule pronto.",
    },
  },
  {
    category: "Check in",
    situation: "family",
    tone: "casual",
    messages: {
      english: "Hey — just wanted to check in and say I'm thinking of you. Hope you're doing well!",
      spanish:
        "Oye — solo quería saludar y decir que pienso en ti. ¡Espero que estés bien!",
      spanglish:
        "Hey — solo quería check in. Thinking of you. Hope estés bien!",
    },
  },
  {
    category: "Work update",
    situation: "work",
    tone: "professional",
    messages: {
      english:
        "Quick update — I need to step out for a personal matter. I'll be back online as soon as I can.",
      spanish:
        "Actualización rápida — necesito salir por un asunto personal. Vuelvo en cuanto pueda.",
      spanglish:
        "Quick update — necesito step out por personal matter. Back online ASAP.",
    },
  },
];

function dateSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function getDailyMessage(
  language: Language = "english",
  date: Date = new Date(),
): DailyMessage {
  const seed = dateSeed(date);
  const template = DAILY_TEMPLATES[seed % DAILY_TEMPLATES.length];
  return {
    message: template.messages[language],
    category: template.category,
    language,
    tone: template.tone,
    situation: template.situation,
  };
}

export function getDailyMessageStorageKey(date: Date = new Date()): string {
  return `daily-fav-${dateSeed(date)}`;
}
