"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package2, Search, Menu, X, LogOut, Lock } from "lucide-react";
import { NotificationBell } from "./notification-bell";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/constants/app-routes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks";
import { usePlan } from "@/features/billing/hooks";

// Features behind the Pro paywall — shown with a lock when on the Free plan.
const PRO_HREFS = new Set<string>([APP_ROUTES.REPORTS]);

const NAV_ITEMS = [
  { label: "Dashboard", href: APP_ROUTES.DASHBOARD },
  { label: "Inventory", href: APP_ROUTES.INVENTORY },
  { label: "Products", href: APP_ROUTES.PRODUCTS },
  { label: "Suppliers", href: APP_ROUTES.SUPPLIERS },
  { label: "Orders", href: APP_ROUTES.ORDERS },
  { label: "Reorder", href: APP_ROUTES.REORDER },
  { label: "Reports", href: APP_ROUTES.REPORTS },
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppNavbar() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const { logout } = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.role === "ADMIN";
  const { isPro } = usePlan();

  const initials = user ? getInitials(user.name) : "?";

  return (
    <>
      <nav className="h-16 bg-[#F4F3EE] flex items-center justify-between px-6 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-[#DFFF3F] flex items-center justify-center flex-shrink-0">
            <Package2 className="size-4 text-[#171717]" />
          </div>
          <span className="font-bold text-[#171717] tracking-tight">IntelliStock+</span>
        </div>

        {/* Nav tabs — desktop */}
        <div className="hidden md:flex items-center bg-white rounded-xl border border-[#E4E1D8] p-1 gap-0.5">
          {NAV_ITEMS.map(({ label, href }) => {
            const isActive = pathname === href;
            const locked = PRO_HREFS.has(href) && !isPro;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1",
                  isActive
                    ? "bg-[#171717] text-white"
                    : "text-[#77776F] hover:text-[#171717]"
                )}
              >
                {label}
                {locked && <Lock className="size-3" />}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href={APP_ROUTES.SETTINGS_USERS}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap inline-flex items-center gap-1",
                pathname.startsWith(APP_ROUTES.SETTINGS_USERS)
                  ? "bg-[#171717] text-white"
                  : "text-[#77776F] hover:text-[#171717]"
              )}
            >
              Team
              {!isPro && <Lock className="size-3" />}
            </Link>
          )}
          {isAdmin && (
            <Link
              href={APP_ROUTES.BILLING}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                pathname.startsWith(APP_ROUTES.BILLING)
                  ? "bg-[#171717] text-white"
                  : "text-[#77776F] hover:text-[#171717]"
              )}
            >
              Billing
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* <button
            aria-label="Search"
            className="size-9 rounded-full bg-white border border-[#E4E1D8] flex items-center justify-center text-[#77776F] hover:text-[#171717] transition-colors"
          >
            <Search className="size-4" />
          </button> */}
          <NotificationBell className="size-9 rounded-full bg-white border border-[#E4E1D8] flex items-center justify-center text-[#77776F] hover:text-[#171717] transition-colors" />

          {/* User + logout */}
          <div className="flex items-center gap-2 ml-1">
            <div className="size-9 rounded-full bg-[#DFFF3F] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[#171717]">{initials}</span>
            </div>
            <div className="hidden sm:block leading-none">
              <p className="text-sm font-medium text-[#171717]">{user?.name ?? "—"}</p>
              <p className="text-xs text-[#77776F] mt-0.5">{user?.role ?? "—"}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Sign out"
              className="size-9 rounded-full bg-white border border-[#E4E1D8] flex items-center justify-center text-[#77776F] hover:text-[#EF4444] transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            className="md:hidden size-9 rounded-full bg-white border border-[#E4E1D8] flex items-center justify-center text-[#77776F] ml-1"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#171717] flex flex-col">
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[#DFFF3F] flex items-center justify-center flex-shrink-0">
                  <Package2 className="size-4 text-[#171717]" />
                </div>
                <span className="font-bold text-white tracking-tight">IntelliStock+</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="size-8 rounded-lg flex items-center justify-center text-[#9a9a8e] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(({ label, href }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                const locked = PRO_HREFS.has(href) && !isPro;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[#DFFF3F] text-[#171717]"
                        : "text-[#9a9a8e] hover:text-white hover:bg-white/5"
                    )}
                  >
                    {label}
                    {locked && <Lock className="size-3" />}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href={APP_ROUTES.SETTINGS_USERS}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith(APP_ROUTES.SETTINGS_USERS)
                      ? "bg-[#DFFF3F] text-[#171717]"
                      : "text-[#9a9a8e] hover:text-white hover:bg-white/5"
                  )}
                >
                  Team
                  {!isPro && <Lock className="size-3" />}
                </Link>
              )}
              {isAdmin && (
                <Link
                  href={APP_ROUTES.BILLING}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname.startsWith(APP_ROUTES.BILLING)
                      ? "bg-[#DFFF3F] text-[#171717]"
                      : "text-[#9a9a8e] hover:text-white hover:bg-white/5"
                  )}
                >
                  Billing
                </Link>
              )}
            </nav>

            <div className="px-3 pb-5 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="size-8 rounded-full bg-[#DFFF3F] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#171717]">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name ?? "—"}</p>
                  <p className="text-xs text-[#77776F] truncate">{user?.role ?? "—"}</p>
                </div>
              </div>
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#9a9a8e] hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="size-4 flex-shrink-0" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
