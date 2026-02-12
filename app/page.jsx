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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto z-10"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
                Complete Tasks,
            </span>
            <br />
            <span className="relative text-slate-900">
                Earn Rewards
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                   <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
            </span>
          </h1>

          <p className="text-sm md:text-base font-bold text-slate-400 uppercase tracking-widest mb-6">
            We pay, not you!
          </p>

          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
            Earn money by completing simple tasks online.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl text-lg shadow-xl shadow-violet-500/30 uppercase tracking-wide"
              >
                Sign Up
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-violet-600 text-violet-700 font-bold rounded-xl text-lg uppercase tracking-wide hover:bg-violet-50 transition"
              >
                I Have an Account
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}   