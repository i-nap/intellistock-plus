import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-lg border border-[#E4E1D8] bg-white px-3 py-1 text-sm text-[#171717] shadow-xs transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#DFFF3F]/50 focus:border-[#DFFF3F]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
