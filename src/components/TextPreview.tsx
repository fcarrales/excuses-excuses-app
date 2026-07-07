"use client";

interface TextPreviewProps {
  message: string;
  visible: boolean;
}

export default function TextPreview({ message, visible }: TextPreviewProps) {
  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        Text preview
      </p>
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-violet-600 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-sm">
          {message}
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-slate-400">
        How it might look in a text thread
      </p>
    </div>
  );
}
