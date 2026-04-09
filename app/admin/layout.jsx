

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Overview", path: "/admin/dashboard" },
    { name: "Approvals", path: "/admin/approvals" },
    { name: "Manage Tasks", path: "/admin/tasks" },
    { name: "Bulk Upload", path: "/admin/upload" },
    { name: "Finance & Payouts", path: "/admin/finance" },
    { name: "User Management", path: "/admin/users" }, 
    { name: "Support Tickets", path: "/admin/support" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 fixed h-full overflow-y-auto z-50 shadow-sm">
        <div className="mb-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-violet-200">A</div>
            <div><h2 className="text-lg font-bold text-slate-800 leading-tight">Admin<br/>Panel</h2></div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`px-4 py-3 rounded-xl cursor-pointer transition flex items-center gap-3 text-sm font-semibold ${
                pathname === item.path ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}>
                {item.name}
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-slate-100 mt-10">
           <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-violet-600 transition px-4 py-2">
             ← Exit Admin
           </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-10 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div> 
  );
}