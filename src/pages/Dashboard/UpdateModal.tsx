import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

export default function UpdateModal({
  updateExpiryTarget,
  setUpdateExpiryTarget,
  updateIsPermanent,
  setUpdateIsPermanent,
  updateExpiresAt,
  setUpdateExpiresAt,
  handleUpdateExpiry,
  updateUrl,
}) {
  return (
    <Dialog
      open={!!updateExpiryTarget}
      onOpenChange={(open) => {
        if (!open) setUpdateExpiryTarget(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update expiry</DialogTitle>
          <DialogDescription>
            Change when this short link expires.
          </DialogDescription>
        </DialogHeader>

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

            <Switch
              checked={updateIsPermanent}
              onCheckedChange={setUpdateIsPermanent}
            />
          </div>

          {!updateIsPermanent && (
            <Popover>
              <PopoverTrigger className="w-full h-9 px-3 dark:text-zinc-50 flex items-center border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-left hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
                <CalendarIcon className="mr-2 h-4 w-4 text-zinc-500" />
                {updateExpiresAt
                  ? updateExpiresAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Select expiration date"}
              </PopoverTrigger>

              <PopoverContent className="z-50 pointer-events-auto w-auto p-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <DatePicker
                  mode="single"
                  selected={updateExpiresAt}
                  onSelect={setUpdateExpiresAt}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={() => setUpdateExpiryTarget(null)}
            className="text-xs h-8 px-4 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateExpiry}
            disabled={
              updateUrl.isPending || (!updateIsPermanent && !updateExpiresAt)
            }
            style={{
              cursor:
                updateUrl.isPending || (!updateIsPermanent && !updateExpiresAt)
                  ? "not-allowed"
                  : "pointer",
            }}
            className="text-xs h-8 px-4 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors"
          >
            {updateUrl.isPending ? "Updating..." : "Update expiry"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
