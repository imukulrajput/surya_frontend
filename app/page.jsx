// "use client";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative">
      
//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
//         <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
//           MyWorker
//         </div>
//         <div className="space-x-4">
//           <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
//           <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full transition font-medium">
//             Get Started
//           </Link>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main className="flex flex-col items-center justify-center text-center mt-20 px-4 relative z-10">
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
//             Find the perfect <br />
//             <span className="text-blue-500">worker</span> for any job.
//           </h1>
//           <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
//             The modern marketplace for services. Connect with professionals, 
//             get work done, and grow your business securely.
//           </p>
          
//           <div className="flex gap-4 justify-center">
//             <Link href="/signup">
//               <motion.button 
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full text-lg shadow-lg shadow-white/10"
//               >
//                 Join Now
//               </motion.button>
//             </Link>
//             <Link href="/login">
//               <button className="px-8 py-4 border border-gray-600 rounded-full text-lg hover:bg-gray-800 transition">
//                 Sign In
//               </button>
//             </Link>
//           </div>
//         </motion.div>
//       </main>

//       {/* Background Glow */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 relative overflow-hidden">
        
        {/* Background Gradients (Matches Screenshot Blur) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-50 rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-violet-50 rounded-full blur-[120px] opacity-60"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto z-10 flex flex-col items-center"
        >
          {/* Top Pill Badge */}
          <div className="mb-8 inline-flex items-center gap-2 bg-violet-50 border border-violet-100 px-4 py-1.5 rounded-full">
             <span className="text-violet-600 text-sm font-bold">✨ Join 10,000+ Task Earners</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2 leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
                Complete Tasks,
            </span>
            <br />
            <span className="relative text-slate-900 inline-block">
                Earn Rewards
                {/* Yellow Underline SVG */}
                <svg className="absolute w-[105%] h-6 -bottom-2 -left-1 text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                </svg>
            </span>
          </h1>

          {/* Yellow Badge Below Title */}
          <div className="mt-8 mb-8">
             <span className="bg-yellow-400 text-slate-900 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-sm transform -rotate-2 inline-block">
                📈 We pay, not you!
             </span>
          </div>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Turn your free time into income by completing simple tasks online. <span className="text-violet-600 font-bold">Start earning today.</span>
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl text-lg shadow-xl shadow-violet-200 flex items-center justify-center gap-2"
              >
                SIGN UP <span className="text-xl">→</span>
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-violet-100 text-violet-700 font-bold rounded-xl text-lg hover:border-violet-200 hover:bg-violet-50 transition flex items-center justify-center gap-2"
              >
                I HAVE AN ACCOUNT
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </motion.button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-3 gap-8 md:gap-20 text-center border-t border-slate-100 pt-10 w-full max-w-4xl">
             <div>
                <h3 className="text-3xl md:text-4xl font-black text-violet-600">10k+</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mt-1">Active Users</p>
             </div>
             <div>
                <h3 className="text-3xl md:text-4xl font-black text-violet-600">$2M+</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mt-1">Paid Out</p>
             </div>
             <div>
                <h3 className="text-3xl md:text-4xl font-black text-violet-600">50k+</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mt-1">Tasks Completed</p>
             </div>
          </div>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
}