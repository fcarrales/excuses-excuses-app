"use client";

import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import {
  LANGUAGE_OPTIONS,
  RECIPIENT_OPTIONS,
  TONE_OPTIONS,
} from "@/lib/messageTemplates";
import {
  deletePerson,
  getSavedPeople,
  savePerson,
} from "@/lib/storage";
import type { Language, Recipient, SavedPerson, Tone } from "@/types";

const RELATIONSHIP_OPTIONS = RECIPIENT_OPTIONS;

interface PersonFormData {
  name: string;
  relationship: Recipient;
  defaultTone: Tone;
  defaultLanguage: Language;
  notes: string;
}

const EMPTY_FORM: PersonFormData = {
  name: "",
  relationship: "friend",
  defaultTone: "casual",
  defaultLanguage: "english",
  notes: "",
};

export default function PeoplePanel() {
  const [people, setPeople] = useState(() => getSavedPeople());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PersonFormData>(EMPTY_FORM);

  function refresh() {
    setPeople(getSavedPeople());
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(person: SavedPerson) {
    setEditingId(person.id);
    setForm({
      name: person.name,
      relationship: person.relationship,
      defaultTone: person.defaultTone,
      defaultLanguage: person.defaultLanguage,
      notes: person.notes ?? "",
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleSave() {
    const name = form.name.trim();
    if (!name) return;

    const person: SavedPerson = {
      id: editingId ?? `person-${Date.now()}`,
      name,
      relationship: form.relationship,
      defaultTone: form.defaultTone,
      defaultLanguage: form.defaultLanguage,
      notes: form.notes.trim() || undefined,
    };

    savePerson(person);
    refresh();
    handleCancel();
  }

  function handleDelete(id: string) {
    if (window.confirm("Delete this saved person?")) {
      deletePerson(id);
      refresh();
      if (editingId === id) handleCancel();
    }
  }

  if (showForm) {
    return (
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-violet-900">
          {editingId ? "Edit person" : "Add person"}
        </h2>
        <div className="space-y-4 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md shadow-violet-100/30">
          <div className="space-y-2">
            <label htmlFor="person-name" className="text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              id="person-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Larry"
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Relationship</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, relationship: opt.value })}
                  className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                    form.relationship === opt.value
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Default tone</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TONE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, defaultTone: opt.value })}
                  className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                    form.defaultTone === opt.value
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Default language</span>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, defaultLanguage: opt.value })}
                  className={`min-h-[44px] rounded-xl border px-2 py-2 text-xs font-medium transition-all ${
                    form.defaultLanguage === opt.value
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="person-notes" className="text-sm font-semibold text-slate-700">
              Notes (optional)
            </label>
            <textarea
              id="person-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Keep it respectful and short"
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="min-h-[44px] flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.name.trim()}
              className="min-h-[44px] flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-violet-900">
          Saved People {people.length > 0 && `(${people.length})`}
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="min-h-[44px] shrink-0 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-[0.98]"
        >
          + Add
        </button>
      </div>

      {people.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No saved people yet"
          description="Save people you message often — we'll remember their tone and style."
        />
      ) : (
        <div className="space-y-3">
          {people.map((person) => (
            <article
              key={person.id}
              className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{person.name}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {RELATIONSHIP_OPTIONS.find((r) => r.value === person.relationship)?.label}
                    {" · "}
                    {TONE_OPTIONS.find((t) => t.value === person.defaultTone)?.label}
                    {" · "}
                    {LANGUAGE_OPTIONS.find((l) => l.value === person.defaultLanguage)?.label}
                  </p>
                  {person.notes && (
                    <p className="mt-2 text-xs text-slate-500 italic">
                      &ldquo;{person.notes}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(person)}
                    className="min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(person.id)}
                    className="min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
