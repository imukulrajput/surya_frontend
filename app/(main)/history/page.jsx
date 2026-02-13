// "use client";
// import { useState, useEffect } from "react";
// import { format } from "date-fns"; 
// import { Toaster } from "react-hot-toast";
// import api from "@/lib/axios";

// export default function HistoryPage() {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//        const { data } = await api.get("/tasks/history");
//        setHistory(data.history);
//       } catch (error) {
//         console.error("Error fetching history");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHistory();
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved": return "bg-green-500/10 text-green-400 border-green-500/20";
//       case "Rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
//       default: return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
//     }
//   };

//   if (loading) return <div className="text-white p-8">Loading...</div>;

//   return (
//     <div className="max-w-5xl mx-auto space-y-6">
//       <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }}/>
      
//       <div>
//         <h1 className="text-3xl font-bold text-white mb-1">Task History</h1>
//         <p className="text-slate-400">View your past submissions and approval status.</p>
//       </div>

//       {history.length === 0 ? (
//         <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
//           <p className="text-slate-400">No history found.</p>
//         </div>
//       ) : (
//         <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs tracking-wider">
//                 <tr>
//                   <th className="p-4 font-semibold">Date</th>
//                   <th className="p-4 font-semibold">Task Title</th>
//                   <th className="p-4 font-semibold">Platform</th>
//                   <th className="p-4 font-semibold">Reward</th>
//                   <th className="p-4 font-semibold">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-700 text-slate-300">
//                 {history.map((item) => (
//                   <tr key={item._id} className="hover:bg-slate-700/30 transition">
//                     <td className="p-4 text-sm">
//                       {format(new Date(item.createdAt), "MMM dd, yyyy • hh:mm a")}
//                     </td>
//                     <td className="p-4 font-medium text-white">
//                       {item.taskId?.title || "Unknown Task"}
//                     </td>
//                     <td className="p-4">
//                       <span className="px-2 py-1 rounded text-xs bg-slate-900 border border-slate-700">
//                         {item.platform}
//                       </span>
//                     </td>
//                     <td className="p-4 font-mono text-yellow-400 font-bold">
//                       ₹{item.taskId?.rewardAmount || 0}
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${getStatusColor(item.status)}`}>
//                         {item.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";

// --- Icons ---
const CheckCircle = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircle = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FilterIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>;

// --- Components ---

const PlatformIcon = ({ platform }) => {
    const styles = {
        Instagram: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white shadow-pink-200",
        Youtube: "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-red-200",
        Facebook: "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-200",
        Default: "bg-slate-800 text-white shadow-slate-200"
    };

    const styleClass = styles[platform] || styles.Default;
    const letter = platform ? platform[0] : "T";

    return (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${styleClass}`}>
            {letter}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    let config = {
        Approved: { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <CheckCircle /> },
        Rejected: { color: "text-red-600 bg-red-50 border-red-100", icon: <XCircle /> },
        Pending: { color: "text-amber-600 bg-amber-50 border-amber-100", icon: <ClockIcon /> },
        Default: { color: "text-slate-500 bg-slate-50 border-slate-100", icon: <ClockIcon /> }
    };

    const { color, icon } = config[status] || config.Default;

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${color}`}>
            {icon} <span>{status}</span>
        </div>
    );
};

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All"); // All, Approved, Pending, Rejected

    useEffect(() => {
        api.get("/tasks/history")
           .then(res => setHistory(res.data.history || []))
           .catch(e => console.error(e))
           .finally(() => setLoading(false));
    }, []);

    const filteredHistory = filter === "All" 
        ? history 
        : history.filter(h => h.status === filter);

    const tabs = ["All", "Approved", "Pending", "Rejected"];

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Loading timeline...</p>
        </div>
    );

    return (
        <div className="min-h-screen pb-20 pt-12 px-4 md:px-8 max-w-4xl mx-auto relative">
            <Toaster position="top-right "  containerStyle={{ top: 80, zIndex: 99999 }} 
          toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />

            {/* --- Ambient Background --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
            </div>

            {/* --- Header --- */}
            <div className="text-center mb-12">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2"
                >
                    Transaction History
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    className="text-slate-500 font-medium text-lg"
                >
                    Your earnings journey, tracked.
                </motion.p>
            </div>

            {/* --- Sticky Filter Bar --- */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="sticky top-24 z-30 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 mb-8 flex flex-wrap justify-between items-center gap-4"
            >
                <div className="flex space-x-1 w-full md:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                                filter === tab ? "text-violet-700" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {filter === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-violet-50 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </button>
                    ))}
                </div>
                
                <div className="hidden md:flex items-center gap-2 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <FilterIcon /> <span>Filter Results</span>
                </div>
            </motion.div>

            {/* --- Timeline Feed --- */}
            <div className="space-y-4 relative">
                {/* Vertical Line (Decoration) */}
                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent hidden md:block" />

                <AnimatePresence mode="popLayout">
                    {filteredHistory.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200"
                        >
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🕵️‍♂️</div>
                            <h3 className="text-slate-900 font-bold text-lg">No records found</h3>
                            <p className="text-slate-500 text-sm">Try adjusting your filters.</p>
                        </motion.div>
                    ) : (
                        filteredHistory.map((item, index) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative"
                            >
                                {/* Timeline Dot (Desktop) */}
                                <div className="absolute left-[31px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-violet-500 rounded-full z-10 hidden md:block group-hover:scale-125 transition-transform shadow-[0_0_0_4px_rgba(248,250,252,1)]" />

                                <div className="md:ml-20 bg-white hover:bg-white/80 p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 transform hover:-translate-y-1 cursor-default">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        
                                        {/* Left: Icon & Title */}
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="shrink-0">
                                                <PlatformIcon platform={item.platform} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-900 text-lg truncate pr-4">
                                                    {item.taskId?.title || "Task Submission"}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                                                    <span>{format(new Date(item.createdAt), "MMM dd, yyyy")}</span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                    <span>{format(new Date(item.createdAt), "hh:mm a")}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: Amount & Status */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 pl-[64px] sm:pl-0">
                                            <div className="text-right">
                                                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider text-[10px]">Reward</p>
                                                <p className="text-2xl font-black text-slate-900 tracking-tight">₹{item.taskId?.rewardAmount || 0}</p>
                                            </div>
                                            <StatusBadge status={item.status} />
                                        </div>

                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}