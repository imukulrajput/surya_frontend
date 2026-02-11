"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          MyWorker
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full transition font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center mt-20 px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Find the perfect <br />
            <span className="text-blue-500">worker</span> for any job.
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            The modern marketplace for services. Connect with professionals, 
            get work done, and grow your business securely.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-900 font-bold rounded-full text-lg shadow-lg shadow-white/10"
              >
                Join Now
              </motion.button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border border-gray-600 rounded-full text-lg hover:bg-gray-800 transition">
                Sign In
              </button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}