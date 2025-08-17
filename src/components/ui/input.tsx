import * as React from "react";

import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        `flex h-12 w-full border-2 border-black bg-white px-4 py-2 text-sm font-medium
        placeholder:text-gray-400 focus:outline-none focus:shadow-[2px_2px_0px_rgba(0,0,0,1)]
        focus:bg-[#ffdefc]
        active:shadow-[2px_2px_0px_rgba(0,0,0,1)]
        disabled:cursor-not-allowed disabled:opacity-50
        file:border-0 file:bg-transparent file:text-sm file:font-medium rounded-md`,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
