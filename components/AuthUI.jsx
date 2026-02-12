// "use client";
// import { motion } from "framer-motion";

// export const AuthInput = ({ label, type, name, placeholder, value, onChange }) => (
//   <div className="mb-5">
//     <label className="block text-sm font-medium text-textMuted mb-2 ml-1">{label}</label>
//     <input
//       type={type}
//       name={name}
//       placeholder={placeholder}
//       value={value}  
//       onChange={onChange}
//       className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text 
//                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
//                  transition-all duration-200 placeholder-slate-600"
//     />
//   </div>
// );

// export const AuthButton = ({ text, isLoading, onClick }) => (
//   <motion.button
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//     type="submit"
//     disabled={isLoading}
//     onClick={onClick}
//     className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-blue-600 
//                hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl 
//                shadow-lg shadow-blue-500/20 transition-all duration-200
//                disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
//   >
//     {isLoading ? (
//       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//     ) : (
//       text
//     )}
//   </motion.button>
// );

// export const AuthLayout = ({ children, title, subtitle }) => (
//   <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
//     {/* Background Decorations */}
//     <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
//     <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="w-full max-w-md bg-surface/50 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl relative z-10"
//     >
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
//         <p className="text-textMuted mt-2 text-sm">{subtitle}</p>
//       </div>
//       {children}
//     </motion.div>
//   </div>
// );

"use client";
import { motion } from "framer-motion";

export const AuthInput = ({ label, type, name, placeholder, value, onChange }) => (
  <div className="mb-5">
    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}  
      onChange={onChange}
      className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                 transition-all duration-200 font-medium shadow-sm"
    />
  </div>
);

export const AuthButton = ({ text, isLoading, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    disabled={isLoading}
    onClick={onClick}
    className="w-full py-4 px-6 bg-violet-600 text-white font-bold rounded-xl 
               hover:bg-violet-700 transition-all duration-200 shadow-lg shadow-violet-200
               disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
  >
    {isLoading ? (
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
    ) : (
      text
    )}
  </motion.button>
);

export const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-100 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] pointer-events-none" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 relative z-10 border border-slate-100"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">{title}</h1>
        <p className="text-slate-500 font-medium">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  </div>
);  