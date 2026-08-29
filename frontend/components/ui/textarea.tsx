import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[#E4E1D8] bg-white px-3 py-2 text-sm text-[#171717] shadow-xs transition-colors",
          "placeholder:text-[#AAAA9F]",
          "focus:outline-none focus:ring-2 focus:ring-[#DFFF3F]/50 focus:border-[#DFFF3F]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
