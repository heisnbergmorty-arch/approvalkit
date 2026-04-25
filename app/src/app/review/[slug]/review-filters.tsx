"use client";

import Link from "next/link";

interface Props {
  slug: string;
  brandColor: string;
  counts: { all: number; pending: number; approved: number };
  active: "all" | "pending" | "approved";
}

const TABS: ("all" | "pending" | "approved")[] = ["all", "pending", "approved"];

export function ReviewFilters({ slug, brandColor, counts, active }: Props) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-1 border-b border-slate-200 pb-3">
      {TABS.map((t) => {
        const isActive = active === t;
        const href = t === "all" ? `/review/${slug}` : `/review/${slug}?filter=${t}`;
        return (
          <Link
            key={t}
            href={href}
            scroll={false}
            className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
              isActive ? "text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
            style={isActive ? { backgroundColor: brandColor } : undefined}
          >
            {t}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                isActive ? "bg-white/20" : "bg-slate-200 text-slate-600"
              }`}
            >
              {counts[t]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
