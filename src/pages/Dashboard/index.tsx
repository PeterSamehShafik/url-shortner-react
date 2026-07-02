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
  MoreHorizontal,
  Calendar,
  PauseCircle,
  PlayCircle,
  CalendarIcon,
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useUrls, useCreateUrl, useUpdateUrl } from "@/hooks/useUrls";

import { type Url } from "@/types/api.types";
import ConfirmationModal from "./ConfirmationModal";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";

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
  const updateUrl = useUpdateUrl();
  const [deleteTarget, setDeleteTarget] = useState<Url | null>(null);
  const [updateExpiryTarget, setUpdateExpiryTarget] = useState<Url | null>(
    null,
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>();
  const [isPermanent, setIsPermanent] = useState(true);
  const [updateExpiresAt, setUpdateExpiresAt] = useState<Date | null>();
  const [updateIsPermanent, setUpdateIsPermanent] = useState(true);

  const copy = async (slug: string) => {
    await navigator.clipboard.writeText(
      `${import.meta.env.VITE_API_URL}/${slug}`,
    );
    toast.success("Copied");
  };

  const handleCreate = () => {
    if (!newUrl) return toast.error("URL is required");
    createUrl.mutate(
      {
        originalUrl: newUrl,
        customSlug: newSlug || undefined,
        expiresAt: isPermanent ? null : expiresAt?.toISOString(),
      },
      {
        onSuccess: () => {
          toast.success("Link created");
          setCreateOpen(false);
          setNewUrl("");
          setNewSlug("");
          setExpiresAt(null);
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to create"),
      },
    );
  };

  const openUpdateExpiryModal = (url: Url) => {
    setUpdateExpiryTarget(url);
    setUpdateIsPermanent(!url.expiresAt);
    setUpdateExpiresAt(url.expiresAt ? new Date(url.expiresAt) : undefined);
  };

  const handleUpdateExpiry = () => {
    if (!updateExpiryTarget) return;

    updateUrl.mutate(
      {
        id: updateExpiryTarget.id,
        data: {
          expiresAt: updateIsPermanent ? null : updateExpiresAt?.toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Expiry updated");
          setUpdateExpiryTarget(null);
          setUpdateExpiresAt(undefined);
          setUpdateIsPermanent(true);
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to update"),
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-center h-7 w-7 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <MoreHorizontal size={14} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/dashboard/${url.id}/analytics`)
                        }
                      >
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Analytics
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          updateUrl.mutate(
                            {
                              id: url.id,
                              data: { isActive: !url.isActive },
                            },
                            {
                              onSuccess: () =>
                                toast.success(
                                  url.isActive
                                    ? "Link disabled"
                                    : "Link enabled",
                                ),
                              onError: (err: any) =>
                                toast.error(
                                  err?.response?.data?.message ||
                                    "Failed to update",
                                ),
                            },
                          );
                        }}
                      >
                        {url.isActive ? (
                          <>
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Disable
                          </>
                        ) : (
                          <>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Enable
                          </>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => openUpdateExpiryModal(url)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Update expiry
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => setDeleteTarget(url)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

      {/* Update Modal */}
      <UpdateModal
        updateExpiryTarget={updateExpiryTarget}
        setUpdateExpiryTarget={setUpdateExpiryTarget}
        updateIsPermanent={updateIsPermanent}
        setUpdateIsPermanent={setUpdateIsPermanent}
        updateExpiresAt={updateExpiresAt}
        setUpdateExpiresAt={setUpdateExpiresAt}
        handleUpdateExpiry={handleUpdateExpiry}
        updateUrl={updateUrl}
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
        isPermanent={isPermanent}
        setIsPermanent={setIsPermanent}
        expiresAt={expiresAt}
        setExpiresAt={setExpiresAt}
      />
    </MainLayout>
  );
}
