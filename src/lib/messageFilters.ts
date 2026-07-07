import {
  getLanguageLabel,
  getRecipientLabel,
  getSituationLabel,
  getToneLabel,
} from "@/lib/messageTemplates";
import type {
  FavoriteFilter,
  HistoryEntry,
  HistoryFilter,
  Language,
  Situation,
} from "@/types";

const WORK_SITUATIONS: Situation[] = ["work", "running-late"];
const WORK_RECIPIENTS = ["boss", "coworker"];
const SCHOOL_SITUATIONS: Situation[] = ["school"];
const FAMILY_SITUATIONS: Situation[] = ["family"];
const DATING_SITUATIONS: Situation[] = ["dating"];
const APOLOGY_SITUATIONS: Situation[] = ["apologize", "reschedule"];

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function matchesFavoriteFilter(
  entry: HistoryEntry,
  filter: FavoriteFilter,
): boolean {
  if (filter === "all") return true;

  if (filter === "work") {
    return (
      WORK_SITUATIONS.includes(entry.situation) ||
      WORK_RECIPIENTS.includes(entry.recipient)
    );
  }
  if (filter === "school") {
    return (
      SCHOOL_SITUATIONS.includes(entry.situation) ||
      entry.recipient === "teacher"
    );
  }
  if (filter === "family") {
    return (
      FAMILY_SITUATIONS.includes(entry.situation) ||
      ["family", "spouse"].includes(entry.recipient)
    );
  }
  if (filter === "dating") {
    return (
      DATING_SITUATIONS.includes(entry.situation) ||
      entry.recipient === "date"
    );
  }
  if (filter === "apologies") {
    return APOLOGY_SITUATIONS.includes(entry.situation);
  }
  if (filter === "other") {
    const covered =
      WORK_SITUATIONS.includes(entry.situation) ||
      WORK_RECIPIENTS.includes(entry.recipient) ||
      SCHOOL_SITUATIONS.includes(entry.situation) ||
      entry.recipient === "teacher" ||
      FAMILY_SITUATIONS.includes(entry.situation) ||
      ["family", "spouse"].includes(entry.recipient) ||
      DATING_SITUATIONS.includes(entry.situation) ||
      entry.recipient === "date" ||
      APOLOGY_SITUATIONS.includes(entry.situation);
    return !covered;
  }
  return true;
}

export function matchesHistoryFilter(
  entry: HistoryEntry,
  filter: HistoryFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "today") return entry.createdAt >= startOfToday();
  if (filter === "older") return entry.createdAt < startOfToday();
  if (filter === "favorites") return entry.isFavorite;
  if (filter === "english") return entry.language === "english";
  if (filter === "spanish") return entry.language === "spanish";
  if (filter === "spanglish") return entry.language === "spanglish";
  return true;
}

export function matchesSearch(entry: HistoryEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    entry.message,
    entry.label,
    entry.language,
    entry.tone,
    entry.situation,
    entry.recipient,
    getSituationLabel(entry.situation),
    getRecipientLabel(entry.recipient),
    getToneLabel(entry.tone),
    getLanguageLabel(entry.language as Language),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(q);
}

export function filterFavorites(
  entries: HistoryEntry[],
  filter: FavoriteFilter,
  search: string,
): HistoryEntry[] {
  return entries
    .filter((e) => matchesFavoriteFilter(e, filter))
    .filter((e) => matchesSearch(e, search));
}

export function filterHistory(
  entries: HistoryEntry[],
  filter: HistoryFilter,
  search: string,
): HistoryEntry[] {
  return entries
    .filter((e) => matchesHistoryFilter(e, filter))
    .filter((e) => matchesSearch(e, search));
}

export const FAVORITE_FILTER_OPTIONS: { value: FavoriteFilter; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "work", label: "Work" },
    { value: "school", label: "School" },
    { value: "family", label: "Family" },
    { value: "dating", label: "Dating" },
    { value: "apologies", label: "Apologies" },
    { value: "other", label: "Other" },
  ];

export const HISTORY_FILTER_OPTIONS: { value: HistoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "older", label: "Older" },
  { value: "favorites", label: "Favorites" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "spanglish", label: "Spanglish" },
];
