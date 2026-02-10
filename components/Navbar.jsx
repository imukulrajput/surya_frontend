"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const navItems = [
  { name: "Overview", path: "/dashboard" },
  { name: "Daily Tasks", path: "/tasks" },
  { name: "Verify Account", path: "/verify" },
  { name: "Wallet", path: "/withdraw" },
  { name: "History", path: "/history" },
  { name: "Support", path: "/support" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 const handleLogout = async () => {
    try {
      // 1. Try to tell the server to clear cookies (optional but good practice)
      await api.post("/users/logout");
      
    } catch (error) {
      console.log("Server logout failed, but clearing local session anyway.");
    } finally {
      // 2. THIS IS THE REAL LOGOUT:
      // Remove the token from LocalStorage so you can't make new requests
      if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
      }

      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  return (
    <nav className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">S</div>
          <span className="font-bold text-xl tracking-tight text-white">SelfWorker</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Logout & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition">
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-6 py-4 space-y-2 absolute w-full left-0">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`block py-3 px-4 rounded-lg ${pathname === item.path ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}>
                {item.name}
              </div>
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full text-left py-3 px-4 text-red-400 hover:bg-slate-800 rounded-lg">Logout</button>
        </div>
      )}
    </nav>
  );
} 