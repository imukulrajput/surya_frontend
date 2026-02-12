"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Overview", path: "/admin/dashboard" },
    { name: "Approvals", path: "/admin/approvals" }, // <--- THIS WAS MISSING
    { name: "Manage Tasks", path: "/admin/tasks" },
    { name: "Bulk Upload", path: "/admin/upload" },
    { name: "Finance & Payouts", path: "/admin/finance" },
    { name: "User Management", path: "/admin/users" },
    { name: "Support Tickets", path: "/admin/support" },
    { name: "Settings & Broadcast", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 fixed h-full overflow-y-auto z-50">
        <div className="mb-10 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white">A</div>
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`p-3 rounded-lg cursor-pointer transition flex items-center gap-3 ${
                pathname === item.path ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-10">
           <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-white transition p-3 hover:bg-slate-800 rounded-lg">
             <span>← Back to User App</span>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 bg-slate-950 min-h-screen">
        {children}
      </main>
    </div> 
  );
}