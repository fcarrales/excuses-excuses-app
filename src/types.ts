export type Tab =
  | "generator"
  | "people"
  | "packs"
  | "favorites"
  | "history"
  | "settings";

export type Situation =
  | "running-late"
  | "cancel"
  | "reschedule"
  | "apologize"
  | "dont-want-to-go"
  | "work"
  | "school"
  | "family"
  | "dating"
  | "improve";

export type Recipient =
  | "boss"
  | "coworker"
  | "teacher"
  | "friend"
  | "date"
  | "family"
  | "spouse"
  | "other";

export type Tone =
  | "casual"
  | "professional"
  | "funny"
  | "respectful"
  | "soft"
  | "direct"
  | "believable";

export type Language = "english" | "spanish" | "spanglish";

export type MessageStyle = "short" | "natural" | "professional";

export interface GeneratorInput {
  situation: Situation;
  recipient: Recipient;
  tone: Tone;
  language: Language;
  details?: string;
  variationSeed?: number;
  personName?: string;
  personNotes?: string;
  favoritePhrases?: string[];
  avoidPhrases?: string[];
}

export interface GeneratorPrefill {
  situation: Situation;
  recipient: Recipient;
  tone: Tone;
  language: Language;
  details?: string;
}

export interface GeneratedMessage {
  id: string;
  label: MessageStyle;
  message: string;
  situation: Situation;
  recipient: Recipient;
  tone: Tone;
  language: Language;
  details?: string;
  createdAt: number;
  isFavorite?: boolean;
}

export interface AppSettings {
  defaultLanguage: Language;
  defaultTone: Tone;
}

export interface HistoryEntry extends GeneratedMessage {
  isFavorite: boolean;
  coachScore?: number;
}

export interface StylePreset {
  id: string;
  name: string;
  tone: Tone;
  language: Language;
  description?: string;
  favoritePhrases?: string[];
  avoidPhrases?: string[];
  isDefault?: boolean;
}

export interface SavedPerson {
  id: string;
  name: string;
  relationship: Recipient;
  defaultTone: Tone;
  defaultLanguage: Language;
  notes?: string;
}

export type FavoriteFilter =
  | "all"
  | "work"
  | "school"
  | "family"
  | "dating"
  | "apologies"
  | "other";

export type HistoryFilter =
  | "all"
  | "today"
  | "older"
  | "favorites"
  | "english"
  | "spanish"
  | "spanglish";
