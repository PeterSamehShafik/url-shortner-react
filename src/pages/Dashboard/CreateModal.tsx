import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateModal({
  createOpen,
  setCreateOpen,
  newUrl,
  setNewUrl,
  newSlug,
  setNewSlug,
  createUrl,
  handleCreate,
  isPermanent,
  setIsPermanent,
  expiresAt,
  setExpiresAt,
}) {
  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New link</DialogTitle>
          <DialogDescription>
            Paste a long URL to shorten it. Custom slugs are optional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://your-long-url.com"
            className="w-full h-9 px-3 text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
          />
          <input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="Custom slug (optional)"
            className="w-full h-9 px-3 text-sm font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
          />
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-900 dark:text-zinc-50">
                  Permanent link
                </p>
                <p className="text-xs text-zinc-400">
                  Turn off to choose an expiration date.
                </p>
              </div>

              <Switch checked={isPermanent} onCheckedChange={setIsPermanent} />
            </div>

            {!isPermanent && (
              <Popover>
                <PopoverTrigger className="w-full h-9 px-3 dark:text-zinc-50 flex items-center border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-left hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                  <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
                  {expiresAt
                    ? expiresAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Select expiration date"}
                </PopoverTrigger>

                <PopoverContent className="z-50 pointer-events-auto w-auto p-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => {
              setCreateOpen(false);
              setNewUrl("");
              setNewSlug("");
            }}
            className="text-xs h-8 px-4 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={
              createUrl.isPending || !newUrl || (!isPermanent && !expiresAt)
            }
            style={{
              cursor:
                !newUrl || createUrl.isPending || (!isPermanent && !expiresAt)
                  ? "not-allowed"
                  : "pointer",
            }}
            className="text-xs h-8 px-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors"
          >
            {createUrl.isPending ? "Creating..." : "Create link"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
