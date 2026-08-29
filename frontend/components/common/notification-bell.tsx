"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { NOTIFICATION_MESSAGES } from "@/constants/messages";
import { useNotifications } from "@/features/notifications/hooks";
import type { AppNotification } from "@/features/notifications/types";

const RELATIVE_TIME = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

function timeAgo(iso: string): string {
  const elapsed = Date.now() - new Date(iso).getTime();
  for (const [unit, ms] of UNITS) {
    if (elapsed >= ms) return RELATIVE_TIME.format(-Math.floor(elapsed / ms), unit);
  }
  return "just now";
}

const TYPE_DOT: Record<AppNotification["type"], string> = {
  OUT_OF_STOCK: "bg-[#EF4444]",
  LOW_STOCK: "bg-[#F59E0B]",
  ORDER_STATUS: "bg-[#77776F]",
};

export function NotificationBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { data, unreadCount, isLoading, error, markRead, markAllRead } = useNotifications();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn("relative", className)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#DFFF3F] text-[10px] font-bold text-[#171717] flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-[#E4E1D8] bg-white shadow-lg z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4E1D8] sticky top-0 bg-white">
            <span className="text-sm font-semibold text-[#171717]">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-[#77776F] hover:text-[#171717] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {isLoading && (
            <p className="px-4 py-6 text-sm text-[#77776F] text-center">Loading…</p>
          )}
          {!isLoading && error && (
            <p className="px-4 py-6 text-sm text-[#EF4444] text-center">{error}</p>
          )}
          {!isLoading && !error && data.length === 0 && (
            <p className="px-4 py-6 text-sm text-[#77776F] text-center">
              {NOTIFICATION_MESSAGES.EMPTY}
            </p>
          )}

          <ul>
            {data.map((n) => {
              const body = (
                <>
                  <span className={cn("mt-1.5 size-1.5 rounded-full flex-shrink-0", TYPE_DOT[n.type])} />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm leading-snug",
                        n.read ? "text-[#77776F]" : "text-[#171717] font-medium"
                      )}
                    >
                      {n.message}
                    </span>
                    <span className="block text-xs text-[#9a9a8e] mt-0.5">{timeAgo(n.createdAt)}</span>
                  </span>
                </>
              );
              const classes = cn(
                "flex items-start gap-2.5 w-full text-left px-4 py-3 border-b border-[#E4E1D8] last:border-0 hover:bg-[#F4F3EE] transition-colors",
                !n.read && "bg-[#FBFBF7]"
              );
              return (
                <li key={n.id} role="none">
                  {n.link ? (
                    <Link
                      role="menuitem"
                      href={n.link}
                      onClick={() => { markRead(n.id); setOpen(false); }}
                      className={classes}
                    >
                      {body}
                    </Link>
                  ) : (
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={classes}
                    >
                      {body}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
