
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

// Reusing the Logo from your Navbar for brand consistency
const LogoIcon = () => (
  <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-violet-200 mb-6 mx-auto">
    T
  </div>
);

export const AuthInput = ({ label, type, name, placeholder, value, onChange, icon }) => (
  <div className="mb-5">
    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 ml-1">
      {label}
    </label>
    <div className="relative group">
      {/* Icon Wrapper */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400
                   focus:outline-none focus:bg-white focus:ring-2 focus:ring-violet-100 focus:border-violet-500
                   transition-all duration-200 font-medium shadow-sm"
      />
    </div>
  </div>
);

export const AuthButton = ({ text, isLoading, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    disabled={isLoading}
    onClick={onClick}
    className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold rounded-xl 
               hover:shadow-lg hover:shadow-violet-200 transition-all duration-200 
               disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
  >
    {isLoading ? (
      <>
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <span>Processing...</span>
      </>
    ) : (
      <>
        {text} 
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </>
    )}
  </motion.button>
);

export const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden font-sans">
    
    {/* Background Gradients (Matches Homepage) */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-violet-50 rounded-full blur-[120px] opacity-60"></div>
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[440px] bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 relative z-10 border border-slate-100"
    >
      <div className="text-center mb-10">
        <Link href="/">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <LogoIcon />
            </motion.div>
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
            {title}
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
            {subtitle}
        </p>
      </div>
      
      {children}
    </motion.div>
  </div>
); 