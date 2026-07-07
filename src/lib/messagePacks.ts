import type { GeneratorPrefill, Situation, Tone } from "@/types";

export interface MessagePack {
  id: string;
  title: string;
  description: string;
  icon: string;
  situations: Situation[];
  recommendedTones: Tone[];
  sampleUseCase: string;
  prefill: GeneratorPrefill;
}

export const MESSAGE_PACKS: MessagePack[] = [
  {
    id: "work-bosses",
    title: "Work & Bosses",
    description: "Professional messages for bosses, managers, and workplace situations.",
    icon: "💼",
    situations: ["work", "running-late", "cancel", "apologize"],
    recommendedTones: ["professional", "respectful", "direct"],
    sampleUseCase: "Letting your boss know you'll be late or need to miss a meeting.",
    prefill: {
      situation: "work",
      recipient: "boss",
      tone: "professional",
      language: "english",
    },
  },
  {
    id: "school-teachers",
    title: "School & Teachers",
    description: "Respectful messages for teachers, professors, and school absences.",
    icon: "📚",
    situations: ["school", "apologize", "reschedule"],
    recommendedTones: ["respectful", "professional", "soft"],
    sampleUseCase: "Missing class or turning in work late with a respectful note.",
    prefill: {
      situation: "school",
      recipient: "teacher",
      tone: "respectful",
      language: "english",
    },
  },
  {
    id: "friends-family",
    title: "Friends & Family",
    description: "Warm, casual messages for the people closest to you.",
    icon: "🏠",
    situations: ["family", "cancel", "dont-want-to-go", "apologize"],
    recommendedTones: ["casual", "soft", "respectful"],
    sampleUseCase: "Canceling on family dinner or checking in with a loved one.",
    prefill: {
      situation: "family",
      recipient: "family",
      tone: "casual",
      language: "english",
    },
  },
  {
    id: "dating-awkward",
    title: "Dating & Awkward Replies",
    description: "Smooth messages for dates, crushes, and tricky social moments.",
    icon: "💬",
    situations: ["dating", "reschedule", "dont-want-to-go", "improve"],
    recommendedTones: ["casual", "soft", "funny"],
    sampleUseCase: "Following up after a date or gracefully bowing out of plans.",
    prefill: {
      situation: "dating",
      recipient: "date",
      tone: "casual",
      language: "english",
    },
  },
  {
    id: "apologies-reschedules",
    title: "Apologies & Reschedules",
    description: "Thoughtful ways to say sorry or move plans to another day.",
    icon: "🙏",
    situations: ["apologize", "reschedule", "cancel"],
    recommendedTones: ["respectful", "soft", "professional"],
    sampleUseCase: "Apologizing for a mistake or asking to reschedule a meeting.",
    prefill: {
      situation: "apologize",
      recipient: "friend",
      tone: "respectful",
      language: "english",
    },
  },
  {
    id: "soft-no",
    title: "Soft No Messages",
    description: "Gentle ways to decline without hurting feelings.",
    icon: "🌸",
    situations: ["dont-want-to-go", "cancel", "improve"],
    recommendedTones: ["soft", "casual", "respectful"],
    sampleUseCase: "Saying no to plans when you're tired but don't want to sound rude.",
    prefill: {
      situation: "dont-want-to-go",
      recipient: "friend",
      tone: "soft",
      language: "english",
      details: "I'm not feeling up to it but I don't want to sound rude",
    },
  },
];

export function getMessagePack(id: string): MessagePack | undefined {
  return MESSAGE_PACKS.find((p) => p.id === id);
}
