import { toast } from "sonner";
import { useDeleteUrl } from "@/hooks/useUrls";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { type Url } from "@/types/api.types";

interface Props {
  deleteTarget: Url | null;
  setDeleteTarget: (url: Url | null) => void;
}

export default function ConfirmationModal({ deleteTarget, setDeleteTarget }: Props) {
  const deleteUrl = useDeleteUrl();

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteUrl.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Link deleted");
        setDeleteTarget(null);
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || "Failed to delete"),
    });
  };

  return (
    <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-mono text-zinc-700 dark:text-zinc-300">
              {deleteTarget?.slug}
            </span>
            ? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={() => setDeleteTarget(null)}
            className="text-xs h-8 px-4 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleteUrl.isPending}
            style={{ cursor: deleteUrl.isPending ? "not-allowed" : "pointer" }}
            className="text-xs h-8 px-4 bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
          >
            {deleteUrl.isPending ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}