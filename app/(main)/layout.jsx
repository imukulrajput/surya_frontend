// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export default function MainLayout({ children }) {
//   return (
//     <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-50">
//       <Navbar />
//       <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// }

"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Central container for all dashboard pages */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 