"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  List,
  PlusSquare,
  LogOut,
  Menu,
  X,
  HomeIcon,
  ListOrdered,
} from "lucide-react";
import { signOut } from "next-auth/react";
import AdminNotification from "@/app/component/AdminNotification";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.replace("/login");
    }
  }, [session, status]);

  if (status === "loading" || !session) return null;

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ListOrdered },
    { name: "Categories", href: "/admin/categories", icon: List },
    { name: "Menu Items", href: "/admin/items", icon: PlusSquare },
    { name: "Home", href: "/", icon: HomeIcon },
  ];

  return (
    <div className="bg-[#0c0c0c] text-white flex min-h-screen">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 
        bg-[#0f0f0f]/90 backdrop-blur-xl border-r border-[#2a2a2a]
        p-6 flex flex-col z-40 shadow-xl
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
        md:translate-x-0`}
      >
        {/* Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-white mb-6 flex justify-end"
        >
          <X size={28} />
        </button>

        {/* LOGO */}
        <h1 className="text-2xl font-bold mb-12 tracking-wide text-[#d7b46a]">
          Admin Panel ✨
        </h1>

        {/* LINKS */}
        <nav className="space-y-2 flex-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all select-none
                ${
                  isActive
                    ? "bg-[#1a1a1a] border border-[#d7b46a] text-white shadow-md"
                    : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                <link.icon
                  size={20}
                  className={`${isActive ? "text-[#d7b46a]" : "text-gray-400"}`}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-white transition-all"
        >
          <LogOut size={20} /> Logout
        </button>

        {/* EMAIL */}
        <p className="text-gray-500 text-xs mt-4 hidden md:block">
          {session?.user?.email}
        </p>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64">

        {/* TOP NAV */}
        <div
          className="h-16 bg-[#0f0f0f]/70 backdrop-blur border-b border-[#2a2a2a]
          flex items-center justify-between px-6 sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-white"
          >
            <Menu size={28} />
          </button>

          <h2 className="text-lg font-semibold tracking-wide text-[#d7b46a]">
            Admin Dashboard
          </h2>

          <p className="text-gray-400 text-sm hidden md:block">
            {session?.user?.email}
          </p>
        </div>

        {/* PAGE CONTENT */}
        <AdminNotification />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
