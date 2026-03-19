"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/hedgewood", label: "Hedgewood report" },
  { href: "/lintfree", label: "Lintfree report" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-stone-800 bg-stone-900/90">
      <div className="border-b border-stone-800 px-4 py-4">
        <Link
          href="/hedgewood"
          className="text-sm font-semibold text-stone-100 hover:text-amber-400"
        >
          ARS
        </Link>
        <p className="mt-0.5 text-xs text-stone-500">Facebook ads report</p>
      </div>

      <nav className="flex-1 px-3 py-3">
        <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-stone-500">
          Reports
        </p>
        <ul className="space-y-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-amber-500/15 text-amber-400"
                      : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
