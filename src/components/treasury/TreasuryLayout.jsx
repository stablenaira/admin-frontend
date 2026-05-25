import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { TreasurySidebar } from "./TreasurySidebar";

function MainScrollArea({ children }) {
  return <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain">{children}</main>;
}

export function TreasuryLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("snr_sidebar_collapsed") === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("snr_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex h-full">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed left-3 top-3 z-[60] rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-sm font-extrabold text-white/85 backdrop-blur lg:hidden"
          aria-label="Open navigation"
        >
          ☰
        </button>

        {mobileOpen ? (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
            <div className="relative h-full w-72 overflow-hidden border-r border-white/10 bg-black/60 backdrop-blur">
              <TreasurySidebar onClose={() => setMobileOpen(false)} />
            </div>
          </div>
        ) : null}

        <div
          className={`relative hidden shrink-0 overflow-visible border-white/10 lg:block lg:border-r ${collapsed ? "w-20" : "w-64"} transition-[width] duration-200`}
        >
          <TreasurySidebar collapsed={collapsed} />
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="absolute right-0 top-6 z-10 flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-xl border border-white/10 bg-black/70 text-white/80 shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur hover:bg-white/6 hover:text-white"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            <svg
              className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <MainScrollArea>
          <Outlet />
        </MainScrollArea>
      </div>
    </div>
  );
}
