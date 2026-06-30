import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Copy,
  Trash2,
  BarChart2,
  ExternalLink,
  Plus,
  Link2,
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { useUrls, useCreateUrl } from "@/hooks/useUrls";

import { type Url } from "@/types/api.types";
import ConfirmationModal from "./ConfirmationModal";
import CreateModal from "./CreateModal";

function isExpired(url: Url) {
  if (!url.expiresAt) return false;
  return new Date(url.expiresAt) < new Date();
}

function formatDate(date: string | null) {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: urls, isLoading } = useUrls();

  const createUrl = useCreateUrl();
  const [deleteTarget, setDeleteTarget] = useState<Url | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const copy = async (slug: string) => {
    await navigator.clipboard.writeText(
      `${import.meta.env.VITE_API_URL}/${slug}`,
    );
    toast.success("Copied");
  };

  const handleCreate = () => {
    if (!newUrl) return toast.error("URL is required");
    createUrl.mutate(
      { originalUrl: newUrl, customSlug: newSlug || undefined },
      {
        onSuccess: () => {
          toast.success("Link created");
          setCreateOpen(false);
          setNewUrl("");
          setNewSlug("");
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to create"),
      },
    );
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Your links
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {urls?.length ?? 0} total
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium h-8 px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <Plus size={12} />
            New link
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-px">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 lg:h-14 bg-zinc-100 dark:bg-zinc-900 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && urls?.length === 0 && (
          <div className="border border-zinc-200 dark:border-zinc-800 py-16 flex flex-col items-center gap-3">
            <Link2 size={20} className="text-zinc-300 dark:text-zinc-700" />
            <p className="text-sm text-zinc-400">No links yet</p>
            <button
              onClick={() => setCreateOpen(true)}
              className="text-xs font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
            >
              Create your first link →
            </button>
          </div>
        )}

        {/* Table */}
        {!isLoading && urls && urls.length > 0 && (
          <div className="border border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="hidden lg:grid lg:grid-cols-[0.5fr_2fr_100px_300px] gap-4 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-xs text-zinc-400 font-medium">Slug</span>
              <span className="text-xs text-zinc-400 font-medium">
                Original URL
              </span>
              <span className="text-xs text-zinc-400 font-medium">Expires</span>
              <span className="text-xs text-zinc-400 font-medium text-center">
                Actions
              </span>
            </div>

            {/* Rows */}
            {urls.map((url) => (
              <div
                key={url.id}
                className="flex flex-col lg:grid lg:grid-cols-[0.5fr_2fr_100px_300px] gap-3 lg:gap-4 px-4 py-4 lg:py-3 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 items-start lg:items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
              >
                {/* Slug */}
                <div className="flex items-center gap-2 w-full min-w-0">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${isExpired(url) ? "bg-zinc-300 dark:bg-zinc-700" : "bg-blue-500"}`}
                  />
                  <span className="font-mono text-xs text-zinc-900 dark:text-zinc-50 truncate">
                    {url.slug}
                  </span>
                </div>

                {/* Original URL */}
                <span className="text-xs text-zinc-400 truncate w-full lg:w-auto">
                  {url.originalUrl}
                </span>

                {/* Expiry */}
                <span
                  className={`text-xs mt-1 lg:mt-0 ${isExpired(url) ? "text-red-500 dark:text-red-400" : "text-zinc-400"}`}
                >
                  {formatDate(url.expiresAt)}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-start lg:justify-end flex-wrap w-full lg:w-auto mt-2 lg:mt-0">
                  <button
                    onClick={() => copy(url.slug)}
                    className="flex items-center gap-1 text-xs h-7 px-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Copy size={11} />
                    Copy
                  </button>
                  <a
                    href={`${import.meta.env.VITE_API_URL}/${url.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs h-7 px-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ExternalLink size={11} />
                    Open
                  </a>
                  <button
                    onClick={() => navigate(`/dashboard/${url.id}/analytics`)}
                    className="flex items-center gap-1 text-xs h-7 px-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <BarChart2 size={11} />
                    Stats
                  </button>
                  <button
                    onClick={() => setDeleteTarget(url)}
                    className="flex items-center gap-1 text-xs h-7 px-2 text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 size={11} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete link modal */}
      <ConfirmationModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
      />

      {/* Create link modal */}
      <CreateModal
        createOpen={createOpen}
        setCreateOpen={setCreateOpen}
        newUrl={newUrl}
        setNewUrl={setNewUrl}
        newSlug={newSlug}
        setNewSlug={setNewSlug}
        createUrl={createUrl}
        handleCreate={handleCreate}
      />
    </MainLayout>
  );
}
