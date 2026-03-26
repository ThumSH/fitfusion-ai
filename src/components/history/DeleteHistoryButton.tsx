"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

type DeleteHistoryButtonProps = {
  id: string;
  type: "workout" | "meal";
};

export default function DeleteHistoryButton({ id, type }: DeleteHistoryButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete this ${type} history item? This cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/${type}-history/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Failed to delete ${type} history item.`);
      }

      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to delete ${type} history item.`;
      window.alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-400/25 bg-red-500/8 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-red-200 uppercase transition hover:border-red-400/45 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
      Delete
    </button>
  );
}
