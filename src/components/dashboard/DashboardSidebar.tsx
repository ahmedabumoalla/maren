"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "الرئيسية", href: "/dashboard", icon: "⌂" },
  { label: "المهارات", href: "/skills", icon: "▦" },
  { label: "الفرص", href: "/opportunities", icon: "◇" },
  { label: "الدورات", href: "/courses", icon: "▣" },
  { label: "المساعد", href: "/ai-assistant", icon: "✦" },
  { label: "الإعدادات", href: "/settings", icon: "⚙" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 right-0 top-0 z-30 hidden w-[240px] border-l border-[#E1E8F8] bg-white/85 shadow-[0_20px_70px_rgba(7,29,75,0.08)] backdrop-blur-2xl lg:block">
      <div className="flex h-28 items-center justify-center border-b border-[#EEF3FF] px-6">
        <Link href="/" className="flex flex-col items-center">
          <img
            src="/images/mern-logo.png"
            alt="Mern Logo"
            className="w-[145px] object-contain"
            draggable={false}
          />
          <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#F5B700]" />
        </Link>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-13 items-center gap-3 rounded-2xl px-4 text-sm font-black transition ${
                active
                  ? "bg-[#071D8F] text-white shadow-[0_12px_28px_rgba(7,29,143,0.28)]"
                  : "text-[#6F7EA8] hover:bg-[#F0F5FF] hover:text-[#071D63]"
              }`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-lg">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}