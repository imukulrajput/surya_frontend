// "use client";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import api from "@/lib/axios";

// const navItems = [
//   { name: "Overview", path: "/dashboard" },
//   { name: "Daily Tasks", path: "/tasks" },
//   { name: "Verify Account", path: "/verify" },
//   { name: "Wallet", path: "/withdraw" },
//   { name: "History", path: "/history" },
//   { name: "Support", path: "/support" },
// ];

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//  const handleLogout = async () => {
//     try {
//       // 1. Try to tell the server to clear cookies (optional but good practice)
//       await api.post("/users/logout");
      
//     } catch (error) {
//       console.log("Server logout failed, but clearing local session anyway.");
//     } finally {
//       // 2. THIS IS THE REAL LOGOUT:
//       // Remove the token from LocalStorage so you can't make new requests
//       if (typeof window !== "undefined") {
//           localStorage.removeItem("accessToken");
//       }

//       toast.success("Logged out successfully");
//       router.push("/login");
//     }
//   };

//   return (
//     <nav className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
//         {/* Logo */}
//         <Link href="/dashboard" className="flex items-center gap-2 group">
//           <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">S</div>
//           <span className="font-bold text-xl tracking-tight text-white">MyWorker</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-1">
//           {navItems.map((item) => {
//             const isActive = pathname === item.path;
//             return (
//               <Link key={item.path} href={item.path}>
//                 <span className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                   isActive 
//                     ? "bg-slate-800 text-white shadow-sm border border-slate-700" 
//                     : "text-slate-400 hover:text-white hover:bg-slate-800/50"
//                 }`}>
//                   {item.name}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>

//         {/* Logout & Mobile Toggle */}
//         <div className="flex items-center gap-4">
//           <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition">
//             Logout
//           </button>

//           {/* Mobile Menu Button */}
//           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-slate-800 bg-slate-900 px-6 py-4 space-y-2 absolute w-full left-0">
//           {navItems.map((item) => (
//             <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
//               <div className={`block py-3 px-4 rounded-lg ${pathname === item.path ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}>
//                 {item.name}
//               </div>
//             </Link>
//           ))}
//           <button onClick={handleLogout} className="w-full text-left py-3 px-4 text-red-400 hover:bg-slate-800 rounded-lg">Logout</button>
//         </div>
//       )}
//     </nav>
//   );
// } 

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/axios";

// Logo Icon from Screenshot (Purple T square)
const LogoIcon = () => (
  <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-violet-200">
    T
  </div>
);

const navItems = [
  { name: "Overview", path: "/dashboard" },
  { name: "Tasks", path: "/tasks" },
  { name: "Wallet", path: "/withdraw" },
  { name: "Verify", path: "/verify" },
  { name: "History", path: "/history" },
  { name: "Support", path: "/support" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLanding = pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname.includes("/reset-password") || pathname === "/forgot-password";

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.log("Server logout failed");
    } finally {
      if (typeof window !== "undefined") localStorage.removeItem("accessToken");
      toast.success("Logged out");
      router.push("/login");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href={isLanding ? "/" : "/dashboard"} className="flex items-center gap-2.5 group">
          <LogoIcon />
          <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-violet-600 transition">
              MyWork 
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!isLanding ? (
            // Logged In Menu
            <>
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span className={`text-sm font-bold transition-colors ${
                    pathname === item.path ? "text-violet-600" : "text-slate-500 hover:text-slate-900"
                  }`}>
                    {item.name}
                  </span>
                </Link>
              ))}
              <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-600 ml-4">
                Logout
              </button>
            </>
          ) : (
            // Landing Page Menu (Matches Screenshot: About, How It Works, Login, Get Started)
            <>
                <Link href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900">About</Link>
                <Link href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900">How It Works</Link>
                <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900">Login</Link>
                
                <Link href="/signup">
                    <button className="px-6 py-2.5 bg-violet-600 text-white rounded-lg font-bold text-sm hover:bg-violet-700 transition shadow-lg shadow-violet-200 transform hover:scale-105">
                        Get Started
                    </button>
                </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-600">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
           </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 absolute w-full shadow-xl z-50">
           {!isLanding ? (
             <>
               {navItems.map((item) => (
                  <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`block py-2 font-bold ${pathname === item.path ? "text-violet-600" : "text-slate-600"}`}>
                        {item.name}
                    </div>
                  </Link>
               ))}
               <button onClick={handleLogout} className="text-red-500 font-bold block py-2 w-full text-left">Logout</button>
             </>
           ) : (
             <div className="flex flex-col gap-4">
               <Link href="#" className="text-slate-600 font-bold">About</Link>
               <Link href="#" className="text-slate-600 font-bold">How It Works</Link>
               <div className="h-px bg-slate-100 my-2"></div>
               <Link href="/login"><button className="w-full py-3 rounded-lg border-2 border-violet-600 text-violet-600 font-bold">Login</button></Link>
               <Link href="/signup"><button className="w-full py-3 rounded-lg bg-violet-600 text-white font-bold">Get Started</button></Link>
             </div>
           )}
        </div>
      )}
    </nav>
  );
}   