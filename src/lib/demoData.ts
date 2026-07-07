import type { HistoryEntry, SavedPerson, StylePreset } from "@/types";

export const DEMO_ID_PREFIX = "demo-";

export const DEMO_PEOPLE: SavedPerson[] = [
  {
    id: "demo-person-larry",
    name: "Larry",
    relationship: "boss",
    defaultTone: "professional",
    defaultLanguage: "english",
    notes: "Keep it respectful and short",
  },
  {
    id: "demo-person-mia",
    name: "Mia",
    relationship: "friend",
    defaultTone: "casual",
    defaultLanguage: "english",
    notes: "Warm and casual",
  },
];

export const DEMO_PRESETS: StylePreset[] = [
  {
    id: "demo-preset-quick-text",
    name: "Quick text replies",
    tone: "casual",
    language: "english",
    description: "Short friendly texts",
    favoritePhrases: ["Let me know!"],
    avoidPhrases: [],
  },
  {
    id: "demo-preset-respectful-es",
    name: "Respetuoso en español",
    tone: "respectful",
    language: "spanish",
    description: "Mensajes cortos y respetuosos",
    favoritePhrases: ["Gracias por entender."],
    avoidPhrases: [],
  },
];

const now = Date.now();

export const DEMO_FAVORITES: HistoryEntry[] = [
  {
    id: "demo-fav-1",
    label: "short",
    message:
      "Hi — running about 10 min late. On my way now. Sorry for the delay!",
    situation: "running-late",
    recipient: "boss",
    tone: "professional",
    language: "english",
    createdAt: now - 86400000,
    isFavorite: true,
    coachScore: 88,
  },
  {
    id: "demo-fav-2",
    label: "natural",
    message:
      "Hey — I'm sorry but I need to cancel tonight. Something came up. Rain check soon?",
    situation: "cancel",
    recipient: "friend",
    tone: "soft",
    language: "english",
    createdAt: now - 172800000,
    isFavorite: true,
    coachScore: 90,
  },
  {
    id: "demo-fav-3",
    label: "natural",
    message:
      "Hola — voy como 15 min tarde. Ya voy, ¡perdón!",
    situation: "running-late",
    recipient: "friend",
    tone: "casual",
    language: "spanish",
    createdAt: now - 259200000,
    isFavorite: true,
    coachScore: 86,
  },
];

export const DEMO_HISTORY: HistoryEntry[] = [
  ...DEMO_FAVORITES,
  {
    id: "demo-history-4",
    label: "professional",
    message:
      "Hello — would it be possible to reschedule our meeting? I have a conflict and would appreciate another time.",
    situation: "reschedule",
    recipient: "coworker",
    tone: "professional",
    language: "english",
    createdAt: now - 345600000,
    isFavorite: false,
    coachScore: 91,
  },
];

export function isDemoId(id: string): boolean {
  return id.startsWith(DEMO_ID_PREFIX);
}
