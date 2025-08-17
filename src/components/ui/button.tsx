import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-md font-bold font-ps transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-2 border-black focus-visible:ring-0 focus-visible:outline-none transition-transform ease-linear duration-[70ms] uppercase",
  {
    variants: {
      variant: {
        default: `bg-[#A6FAFF] text-black hover:bg-[#79F7FF] shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  active:shadow-[0_0_0px_rgba(0,0,0,1)]
                  hover:shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  hover:translate-x-px hover:translate-y-px  active:bg-[#00E1EF] active:translate-[3px]`,
        destructive: `bg-red-200 text-black hover:bg-red-300 shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  active:shadow-[0_0_0px_rgba(0,0,0,1)]
                  hover:shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  hover:translate-x-px hover:translate-y-px active:bg-[#FF3838] active:translate-[3px]`,
        outline: `bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  active:shadow-[0_0_0px_rgba(0,0,0,1)]
                  hover:shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  hover:translate-x-px hover:translate-y-px active:bg-gray-200 active:translate-[3px]`,
        secondary: `bg-[#FFA6F6] text-black hover:bg-[#fa8cef] shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  active:shadow-[0_0_0px_rgba(0,0,0,1)]
                  hover:shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  hover:translate-x-px hover:translate-y-px active:bg-[#f774ea] active:translate-[3px]`,
        ghost: `bg-[#B8FF9F] text-black border-0 hover:bg-[#9dfc7c] shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  active:shadow-[0_0_0px_rgba(0,0,0,1)]
                  hover:shadow-[1px_1px_0px_rgba(0,0,0,1)]
                  hover:translate-x-px hover:translate-y-px active:bg-[#7df752] active:translate-[3px]`,
        link: "bg-transparent text-black border-0 underline-offset-4 hover:underline hover:translate-x-0.5 hover:translate-y-0.5",
      },
      size: {
        default: "h-12 px-4 py-2.5 has-[>svg]:px-3",
        tiny: "h-8 gap-1.5 px-2 py-2 has-[>svg]:px-2",
        sm: "h-10 gap-1.5 px-3 py-2 has-[>svg]:px-2.5",
        lg: "h-14 px-6 py-3 has-[>svg]:px-5",
        icon: "w-10 h-10 p-0",
      },
      radius: {
        none: "rounded-none",
        default: "rounded-sm",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  radius,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, radius, className }))} {...props} />;
}

export { Button, buttonVariants };
