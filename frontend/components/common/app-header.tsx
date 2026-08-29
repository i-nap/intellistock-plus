"use client";

import { usePathname } from "next/navigation";
import { Menu, Package2 } from "lucide-react";
import { NotificationBell } from "./notification-bell";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/products": "Products",
  "/suppliers": "Suppliers",
  "/orders": "Orders",
  "/reports": "Reports",
};

export function AppHeader() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "IntelliStock+";

  return (
    <header className="h-14 border-b border-[#E4E1D8] bg-[#F4F3EE] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile: hamburger + logo */}
        <button
          aria-label="Open menu"
          className="lg:hidden p-1.5 rounded-lg text-[#77776F] hover:text-[#171717] hover:bg-[#E4E1D8] transition-colors"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="size-6 rounded bg-[#DFFF3F] flex items-center justify-center">
            <Package2 className="size-3.5 text-[#171717]" />
          </div>
          <span className="font-bold text-sm text-[#171717]">IntelliStock+</span>
        </div>
        {/* Desktop: page title */}
        <h1 className="hidden lg:block text-sm font-semibold text-[#171717]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell className="p-2 rounded-lg text-[#77776F] hover:text-[#171717] hover:bg-[#E4E1D8] transition-colors" />
        <div className="flex items-center gap-2.5 pl-1">
          <div className="size-8 rounded-full bg-[#DFFF3F] flex items-center justify-center">
            <span className="text-xs font-bold text-[#171717]">JD</span>
          </div>
          <div className="hidden sm:block leading-none">
            <p className="text-sm font-medium text-[#171717]">John Doe</p>
            <p className="text-xs text-[#77776F] mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
