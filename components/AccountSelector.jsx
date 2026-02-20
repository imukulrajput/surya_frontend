// export default function AccountSelector({ accounts, selectedAccountId, onSelect }) {
//   if (!accounts || accounts.length === 0) {
//     return <div className="text-red-400 text-sm">Please link an account first.</div>;
//   }

//   return (
//     <div className="flex gap-3 overflow-x-auto pb-2">
//       {accounts.map((acc) => (
//         <button
//           key={acc._id}
//           onClick={() => onSelect(acc._id)}
//           className={`
//             flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap
//             ${selectedAccountId === acc._id 
//               ? "bg-primary text-white border-primary shadow-lg shadow-blue-500/20" 
//               : "bg-surface text-textMuted border-border hover:border-gray-500"}
//           `}
//         >
//           {/* Icons based on platform could go here */}
//           <span className="font-bold">{acc.platform}</span>
//           <span className="text-xs opacity-75">({acc.profileUrl.split('/').pop()})</span>
//         </button>
//       ))}
//     </div>
//   );
// }     
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

// Helper to get platform icon
const getPlatformIcon = (platform) => {
  const p = platform?.toLowerCase() || "";
  if (p.includes("moj")) return <span className="text-lg">🔥</span>;
  if (p.includes("sharechat")) return <span className="text-lg">🌀</span>;
  if (p.includes("instagram")) return <span className="text-lg">📸</span>;
  if (p.includes("youtube")) return <span className="text-lg">▶️</span>;
  if (p.includes("facebook")) return <span className="text-lg">🔵</span>;
  return <span className="text-lg">👤</span>;
};

export default function AccountSelector({ accounts, selectedAccountId, onSelect }) {
  if (!accounts || accounts.length === 0) {
    return (
        <Link href="/Account-verify">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold hover:bg-red-100 transition-colors">
                <span>⚠️ No Accounts Linked</span>
                <span className="underline">Link Now</span>
            </button>
        </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      {accounts.map((acc) => {
        const isSelected = selectedAccountId === acc._id;
        
        return (
          <motion.button
            key={acc._id}
            onClick={() => onSelect(acc._id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap group
              ${isSelected 
                ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow-lg shadow-violet-200 ring-2 ring-violet-100 ring-offset-1" 
                : "bg-white text-slate-500 border-slate-200 hover:border-violet-200 hover:text-violet-600 hover:shadow-sm"}
            `}
          >
            {/* Icon Circle */}
            <div className={`
                w-6 h-6 flex items-center justify-center rounded-full 
                ${isSelected ? "bg-white/20 backdrop-blur-sm" : "bg-slate-100 group-hover:bg-violet-50"}
            `}>
                {getPlatformIcon(acc.platform)}
            </div>

            <div className="flex flex-col items-start leading-none">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-violet-100" : "text-slate-400"}`}>
                    {acc.platform}
                </span>
                <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-slate-700"}`}>
                    @{acc.username || 'user'}
                </span>
            </div>

            {/* Active Indicator Dot */}
            {isSelected && (
                <motion.div 
                    layoutId="active-dot"
                    className="absolute right-3 top-3 w-1.5 h-1.5 bg-white rounded-full shadow-sm animate-pulse"
                />
            )}
          </motion.button>
        );
      })}

      {/* Quick Add Button */}
      <Link href="/Account-verify">
        <motion.button 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:text-violet-600 hover:border-violet-400 hover:bg-violet-50 transition-all"
            title="Link another account"
        >
            <span className="text-xl font-bold leading-none mb-0.5">+</span>
        </motion.button>
      </Link>
    </div>
  );
} 