import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "src/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex h-5 w-9 shrink-0 rounded-full bg-gray-500 data-checked:bg-emerald-800 transition-all",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="block h-5 w-5 rounded-full bg-white transition-transform group-data-checked/switch:translate-x-4"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
