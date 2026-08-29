"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Package,
  Truck,
  ShoppingCart,
  BarChart3,
  Package2,
  RefreshCw,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/constants/app-routes";
import { useCurrentUser } from "@/features/auth/hooks";

const NAV_ITEMS = [
  { label: "Dashboard", href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Inventory", href: APP_ROUTES.INVENTORY, icon: Boxes },
  { label: "Products", href: APP_ROUTES.PRODUCTS, icon: Package },
  { label: "Suppliers", href: APP_ROUTES.SUPPLIERS, icon: Truck },
  { label: "Orders", href: APP_ROUTES.ORDERS, icon: ShoppingCart },
  { label: "Reorder", href: APP_ROUTES.REORDER, icon: RefreshCw },
  { label: "Reports", href: APP_ROUTES.REPORTS, icon: BarChart3 },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";
  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <aside className="hidden lg:flex w-60 min-h-screen bg-[#171717] flex-col flex-shrink-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="size-8 rounded-lg bg-[#DFFF3F] flex items-center justify-center flex-shrink-0">
          <Package2 className="size-4 text-[#171717]" />
        </div>
        <span className="font-bold text-white tracking-tight">IntelliStock+</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#DFFF3F] text-[#171717]"
                  : "text-[#9a9a8e] hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="size-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-white/10 pt-4 space-y-0.5">
        {isAdmin && (
          <Link
            href={APP_ROUTES.SETTINGS_USERS}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith(APP_ROUTES.SETTINGS_USERS)
                ? "bg-[#DFFF3F] text-[#171717]"
                : "text-[#9a9a8e] hover:text-white hover:bg-white/5"
            )}
          >
            <Users className="size-4 flex-shrink-0" />
            Team
          </Link>
        )}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="size-8 rounded-full bg-[#DFFF3F] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#171717]">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentUser?.name ?? "—"}</p>
            <p className="text-xs text-[#77776F] truncate capitalize">
              {currentUser?.role?.toLowerCase().replace("_", " ") ?? ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
