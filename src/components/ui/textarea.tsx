import * as React from "react";

import { cn } from "@/lib/utils";
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `flex min-h-16 w-full border-2 border-black bg-white px-4 py-2 text-sm font-medium
        placeholder:text-gray-400 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)]
        focus:bg-[#ffdefc]
        active:shadow-[2px_2px_0px_rgba(0,0,0,1)]
        disabled:cursor-not-allowed disabled:opacity-50 rounded-md resize-vertical`,
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
