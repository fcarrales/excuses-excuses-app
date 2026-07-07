"use client";

import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { LANGUAGE_OPTIONS, TONE_OPTIONS } from "@/lib/messageTemplates";
import {
  deleteStylePreset,
  getStylePresets,
  saveStylePreset,
  seedExampleStylePresets,
  setDefaultStylePreset,
} from "@/lib/storage";
import type { Language, StylePreset, Tone } from "@/types";

interface PresetForm {
  name: string;
  tone: Tone;
  language: Language;
  description: string;
  favoritePhrases: string;
  avoidPhrases: string;
}

const EMPTY_FORM: PresetForm = {
  name: "",
  tone: "casual",
  language: "english",
  description: "",
  favoritePhrases: "",
  avoidPhrases: "",
};

interface StylePresetsPanelProps {
  onChange?: () => void;
}

export default function StylePresetsPanel({ onChange }: StylePresetsPanelProps) {
  const [presets, setPresets] = useState(() => {
    seedExampleStylePresets();
    return getStylePresets();
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PresetForm>(EMPTY_FORM);

  function refresh() {
    setPresets(getStylePresets());
    onChange?.();
  }

  function parsePhrases(text: string): string[] | undefined {
    const list = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return list.length > 0 ? list : undefined;
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(preset: StylePreset) {
    setEditingId(preset.id);
    setForm({
      name: preset.name,
      tone: preset.tone,
      language: preset.language,
      description: preset.description ?? "",
      favoritePhrases: preset.favoritePhrases?.join(", ") ?? "",
      avoidPhrases: preset.avoidPhrases?.join(", ") ?? "",
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

    const preset: StylePreset = {
      id: editingId ?? `preset-${Date.now()}`,
      name,
      tone: form.tone,
      language: form.language,
      description: form.description.trim() || undefined,
      favoritePhrases: parsePhrases(form.favoritePhrases),
      avoidPhrases: parsePhrases(form.avoidPhrases),
      isDefault: editingId
        ? presets.find((p) => p.id === editingId)?.isDefault
        : presets.length === 0,
    };

    saveStylePreset(preset);
    refresh();
    handleCancel();
  }

  function handleDelete(id: string) {
    if (window.confirm("Delete this style preset?")) {
      deleteStylePreset(id);
      refresh();
      if (editingId === id) handleCancel();
    }
  }

  function handleSetDefault(id: string) {
    setDefaultStylePreset(id);
    refresh();
  }

  if (showForm) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">
          {editingId ? "Edit preset" : "New style preset"}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Preset name"
            className="min-h-[44px] w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            {TONE_OPTIONS.slice(0, 4).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm({ ...form, tone: t.value })}
                className={`min-h-[40px] rounded-lg border text-xs font-medium ${
                  form.tone === t.value
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {LANGUAGE_OPTIONS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setForm({ ...form, language: l.value })}
                className={`min-h-[40px] rounded-lg border text-xs font-medium ${
                  form.language === l.value
                    ? "border-violet-500 bg-violet-600 text-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            className="min-h-[44px] w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <input
            type="text"
            value={form.favoritePhrases}
            onChange={(e) => setForm({ ...form, favoritePhrases: e.target.value })}
            placeholder="Favorite phrases, comma-separated"
            className="min-h-[44px] w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <input
            type="text"
            value={form.avoidPhrases}
            onChange={(e) => setForm({ ...form, avoidPhrases: e.target.value })}
            placeholder="Avoid phrases, comma-separated"
            className="min-h-[44px] w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="min-h-[44px] flex-1 rounded-xl border border-slate-200 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.name.trim()}
              className="min-h-[44px] flex-1 rounded-xl bg-violet-600 text-sm font-semibold text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">My Style Presets</h3>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50"
        >
          + Add
        </button>
      </div>

      {presets.length === 0 ? (
        <EmptyState
          icon="🎨"
          title="No style presets"
          description="Create presets for your go-to tone and phrasing."
        />
      ) : (
        <div className="space-y-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{preset.name}</span>
                    {preset.isDefault && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {TONE_OPTIONS.find((t) => t.value === preset.tone)?.label}
                    {" · "}
                    {LANGUAGE_OPTIONS.find((l) => l.value === preset.language)?.label}
                  </p>
                  {preset.description && (
                    <p className="mt-1 text-xs text-slate-600">{preset.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {!preset.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(preset.id)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50"
                  >
                    Set default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(preset)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(preset.id)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
