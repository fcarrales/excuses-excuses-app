export type Tab = "generator" | "favorites" | "history" | "settings";

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
}
