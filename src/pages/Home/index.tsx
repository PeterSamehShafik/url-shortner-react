import { useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, Link2 } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/stores/auth.store";
import { useCreateUrl } from "@/hooks/useUrls";

export default function Home() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<any>(null);
  const { user } = useAuthStore();
  const createUrl = useCreateUrl();

  const onSubmit = () => {
    if (!url) return;
    createUrl.mutate(
      { originalUrl: url, customSlug: slug || undefined },
      {
        onSuccess: (data: any) => {
          setResult(data);
          setUrl("");
          setSlug("");
          toast.success("URL shortened");
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Failed to shorten URL"),
      },
    );
  };

  const copy = async () => {
    if (!result?.slug) return;
    await navigator.clipboard.writeText(
      `${import.meta.env.VITE_API_URL}/${result.slug}`,
    );
    toast.success("Copied to clipboard");
  };

  const canSubmit = !!url && !createUrl.isPending;

  return (
    <MainLayout>
      <div className="w-full max-w-2xl mx-auto px-4 pt-16 sm:pt-24 pb-16">
        {/* Hero */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Link2 size={14} className="text-zinc-400" />
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
              url shortener
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mb-2">
            Short links, fast redirects.
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {user
              ? "You're signed in — links are permanent and manageable from your dashboard."
              : "No account needed. Guest links expire in 7 days."}
          </p>
        </div>

        {/* Form */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="p-3 sm:p-4 space-y-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canSubmit && onSubmit()}
              placeholder="https://your-long-url.com"
              className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none"
            />
            {user && (
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canSubmit && onSubmit()}
                placeholder="Custom slug (optional)"
                className="w-full bg-transparent text-sm font-mono text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none border-t border-zinc-100 dark:border-zinc-800 pt-2"
              />
            )}
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-400 shrink-0">
              {user ? "Permanent link" : "Expires in 7 days"}
            </span>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              style={{ cursor: !url ? "not-allowed" : "pointer" }}
              className="text-xs font-medium px-4 h-7 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors shrink-0"
            >
              {createUrl.isPending ? "Shortening..." : "Shorten"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
              <span className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 truncate">
                {import.meta.env.VITE_API_URL}/{result.slug}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs px-2 sm:px-3 h-7 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Copy size={12} />
                  <span className="hidden sm:inline">Copy</span>
                </button>
                <a
                  href={`${import.meta.env.VITE_API_URL}/${result.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-2 sm:px-3 h-7 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ExternalLink size={12} />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </div>
            </div>
            {user && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
                <span className="text-xs text-zinc-400">
                  Manage from your dashboard
                </span>
                <a
                  href="/dashboard"
                  className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors shrink-0"
                >
                  Dashboard →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Guest CTA */}
        {!user && (
          <div className="mt-6 sm:mt-8 border border-zinc-100 dark:border-zinc-800 px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
            <p className="text-xs text-zinc-400">
              Want permanent links, custom slugs, and analytics?
            </p>
            <a
              href="/auth"
              className="text-xs font-medium text-zinc-900 dark:text-zinc-50 hover:underline shrink-0"
            >
              Create account →
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
