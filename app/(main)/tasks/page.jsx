// "use client";
// import { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import AccountSelector from "@/components/AccountSelector";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import api from "@/lib/axios";

// // Google Drive Icon
// const DriveIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78" height="24" width="27">
//     <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
//     <path d="M43.65 25L29.9 1.2c-1.35-.8-2.9-1.2-4.5-1.2H18.25c1.6 0 3.15.4 4.55 1.2l29.6 51.3 8.6-14.9c.8-1.4 1.2-2.95 1.2-4.55 0-1.65-.4-3.2-1.2-4.6z" fill="#00ac47"/>
//     <path d="M73.55 66.85c.8-1.4 1.2-2.95 1.2-4.55 0-1.6-.4-3.15-1.2-4.55l-13.75-23.8-13.75 23.8 13.75 23.8c1.35-.8 2.5-1.9 3.3-3.3z" fill="#ea4335"/>
//     <path d="M43.65 25L57.4 48.8H29.9L16.15 25h27.5z" fill="#00832d"/>
//     <path d="M57.4 48.8L43.65 72.6h27.5l13.75-23.8H57.4z" fill="#2684fc"/>
//     <path d="M16.15 25H43.65L29.9 1.2 16.15 25z" fill="#ffba00"/>
//   </svg>
// );

// export default function TaskDashboard() {
//   const [user, setUser] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(null);
//   const [proofInputs, setProofInputs] = useState({});

//   // 1. Fetch User Data
//   useEffect(() => {
//     fetchData();
//   }, []);   

//   // 2. Fetch Tasks whenever selectedAccount changes OR if user loads with no accounts
//   useEffect(() => {
//     if (!loading) {
//         // If we have an account, fetch specific progress. If not, just fetch raw tasks.
//         const query = selectedAccount ? `?accountId=${selectedAccount._id}` : "";
//         fetchTasks(query);
//     }
//   }, [selectedAccount, loading]); 

//   const fetchData = async () => {
//     try {
//       const { data } = await api.get("/users/me");
//       setUser(data.user);
//       // If they have accounts, select the first one automatically
//       if (data.user.linkedAccounts?.length > 0) {
//           setSelectedAccount(data.user.linkedAccounts[0]);
//       }
//     } catch (error) {
//       toast.error("Please login first");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTasks = async (queryString) => {
//     try {
//      const { data } = await api.get(`/tasks/daily${queryString}`);
//      setTasks(data.tasks);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleCopy = (text) => {
//     if (typeof navigator !== 'undefined') {
//         navigator.clipboard.writeText(text);
//         toast.success("Caption copied!");
//     }
//   };

//   const handleSubmit = async (task) => {
//     if (!selectedAccount) return toast.error("Link an account first!");
    
//     const link = proofInputs[task._id];
//     if (!link) return toast.error("Paste your video link first!");

//     setSubmitting(task._id);
//     try {
//       await api.post("/tasks/submit", { 
//         taskId: task._id,
//         accountId: selectedAccount._id,
//         platform: selectedAccount.platform,
//         proofLink: link
//       });

//       toast.success("Task Submitted!");
//       setTasks(current => current.map(t => t._id === task._id ? { ...t, status: "Pending", isCompleted: true } : t));
//       setProofInputs(prev => ({ ...prev, [task._id]: "" }));
//     } catch (error) {
//       const msg = error.response?.data?.message || "Submission failed";
//       const detail = error.response?.data?.detail;
//       toast.error(
//           <div className="text-sm">
//             <p className="font-bold">{msg}</p>
//             {detail && <p className="mt-1 opacity-90">{detail}</p>}
//           </div>,
//           { duration: 5000 }
//       );
//     } finally {
//       setSubmitting(null);
//     }
//   };

//   if (loading) return <div className="text-white p-8">Loading...</div>;

//   const hasLinkedAccount = user?.linkedAccounts?.length > 0;

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <Toaster position="bottom-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
      
//       {/* Header Area */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white mb-1">Daily Tasks</h1>
//             <p className="text-slate-400">Complete tasks to earn rewards.</p>
//           </div>
//           <div className="bg-slate-800 px-5 py-3 rounded-xl border border-slate-700 text-right">
//              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Today's Earnings</p>
//              <p className="text-green-400 font-bold text-2xl">₹ {tasks.filter(t => t.status === 'Approved').length * 2.5}</p>
//           </div>
//       </div>

//       {/* Account Selector OR Warning Banner */}
//       {hasLinkedAccount ? (
//         <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
//            <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Select Active Account</label>
//            <AccountSelector 
//               accounts={user.linkedAccounts} 
//               selectedAccountId={selectedAccount?._id}
//               onSelect={(id) => setSelectedAccount(user.linkedAccounts.find(a => a._id === id))}
//            />
//         </div>
//       ) : (
//         <div className="bg-blue-900/20 border border-blue-500/30 p-5 rounded-xl flex items-center justify-between gap-4">
//             <div>
//                 <h3 className="font-bold text-blue-100">View Only Mode</h3>
//                 <p className="text-sm text-blue-300">Link your social account to unlock submissions and start earning.</p>
//             </div>
//             <Link href="/verify">
//                 <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition whitespace-nowrap shadow-lg shadow-blue-900/20">
//                     Link Account Now
//                 </button>
//             </Link>
//         </div>
//       )}

//       {/* Helper Tip for ShareChat */}
//       {selectedAccount?.platform === 'ShareChat' && (
//         <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg flex items-center gap-2 text-sm text-blue-200">
//            <span>ℹ️</span>
//            <p>ShareChat verification may take 24-48 hours if auto-verify fails.</p>
//         </div>
//       )}

//       {/* Task List */}
//       <div className="space-y-6">
//         {tasks.length === 0 ? (
//             <div className="text-center py-20 text-slate-500">No tasks available for today yet.</div>
//         ) : tasks.map((task, index) => (
//             <motion.div 
//                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
//                 key={task._id} 
//                 className={`p-5 rounded-2xl border transition-all ${
//                     task.status === 'Approved' ? 'bg-green-900/10 border-green-900 opacity-80' : 
//                     task.status === 'Pending' ? 'bg-yellow-900/10 border-yellow-900/30' : 
//                     task.status === 'Rejected' ? 'bg-red-900/10 border-red-900/30' :
//                     'bg-slate-800 border-slate-700 hover:border-slate-600'
//                 }`}
//             >   
//                 <div className="flex flex-col md:flex-row gap-6">
//                     {/* File Preview */}
//                     <div className="w-full md:w-48 shrink-0 bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-800 text-center">
//                         <div className="mb-3 p-2 bg-white rounded-full"><DriveIcon /></div>
//                         {/* We allow download even in View Mode so they can prepare the content */}
//                         <a href={task.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
//                             Download File
//                         </a>
//                     </div>

//                     {/* Task Details */}
//                     <div className="flex-1 space-y-4">
//                         <div className="flex justify-between items-start">
//                             <h3 className="font-bold text-lg text-white">Task #{index + 1}: {task.title}</h3>
//                             <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded font-mono font-bold">₹{task.rewardAmount}</span>
//                         </div>

//                         <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center gap-2">
//                             <p className="text-sm text-slate-400 truncate flex-1 font-mono">{task.caption}</p>
//                             <button type="button" onClick={() => handleCopy(task.caption)} className="text-xs text-blue-400 hover:text-white shrink-0 font-bold uppercase">Copy Caption</button>
//                         </div> 

//                         {/* --- VIEW MODE VS ACTIVE MODE LOGIC --- */}
//                         {!hasLinkedAccount ? (
//                             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
//                                 <span className="text-sm text-slate-500">Log in & link account to submit</span>
//                                 <Link href="/verify">
//                                     <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-2">
//                                         🔒 Link Account
//                                     </button>
//                                 </Link>
//                             </div>
//                         ) : (
//                             /* Normal Submission Logic */
//                             <>
//                                 {task.status === "Approved" ? (
//                                     <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-bold flex items-center gap-2">
//                                         <span>✓ Task Approved & Paid</span>
//                                     </div>
//                                 ) : task.status === "Pending" ? (
//                                     <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm font-semibold flex items-center gap-2">
//                                         <span>⏳ Submitted & Pending Approval</span>
//                                     </div>
//                               ) : task.status === "Rejected" ? (
//                             <div className="space-y-3">
//                                 <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex flex-col gap-1">
//                                     <span className="font-bold flex items-center gap-2">
//                                         ✕ Task Rejected
//                                     </span>
//                                     {/* --- FIX #4: SHOW REASON --- */}
//                                     {task.adminComment && (
//                                         <span className="text-xs text-red-300 bg-red-900/20 p-2 rounded border border-red-900/30">
//                                           Reason: {task.adminComment}
//                                         </span>
//                                     )}
//                                     <span className="text-[10px] opacity-70">Please fix the issue and resubmit below.</span>
//                                 </div>
                                
//                                 {/* Resubmission Input */}
//                                 <div className="flex gap-2">
//                                     <input 
//                                         type="text" 
//                                         placeholder="Paste corrected link..."
//                                         className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
//                                         value={proofInputs[task._id] || ""}
//                                         onChange={(e) => setProofInputs({...proofInputs, [task._id]: e.target.value})}
//                                     />
//                                     <button 
//                                         onClick={() => handleSubmit(task)}
//                                         disabled={submitting === task._id}
//                                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition disabled:opacity-50"
//                                     >
//                                         {submitting === task._id ? '...' : 'Resubmit'}
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                                     <div className="flex gap-2">
//                                         <input 
//                                             type="text" 
//                                             placeholder={`Paste your ${selectedAccount?.platform} link here...`}
//                                             className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
//                                             value={proofInputs[task._id] || ""}
//                                             onChange={(e) => setProofInputs({...proofInputs, [task._id]: e.target.value})}
//                                         />
//                                         <button 
//                                             onClick={() => handleSubmit(task)}
//                                             disabled={submitting === task._id}
//                                             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition disabled:opacity-50"
//                                         >
//                                             {submitting === task._id ? '...' : 'Submit'}
//                                         </button>
//                                     </div>
//                                 )}
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AccountSelector from "@/components/AccountSelector";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import Link from "next/link";

// --- Icons ---
const DownloadIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const CopyIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const LinkIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const AlertIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const SendIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

// --- Components ---

const PlatformBadge = ({ platform }) => {
    // Professional Gradients for each platform
    const styles = {
        Instagram: "from-pink-500 via-red-500 to-yellow-500 shadow-pink-200",
        Youtube: "from-red-600 to-red-700 shadow-red-200",
        Facebook: "from-blue-600 to-blue-700 shadow-blue-200",
        ShareChat: "from-indigo-500 to-violet-500 shadow-indigo-200",
        MOJ: "from-orange-500 to-yellow-500 shadow-orange-200",
        Default: "from-slate-600 to-slate-800 shadow-slate-200"
    };
    const bg = styles[platform] || styles.Default;
    
    return (
        <span className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${bg} text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md`}>
            {platform || "Task"}
        </span>
    );
};

export default function TaskDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [proofInputs, setProofInputs] = useState({});

  useEffect(() => {
    const init = async () => {
        try {
            const { data } = await api.get("/users/me");
            setUser(data.user);
            if(data.user.linkedAccounts?.length) setSelectedAccount(data.user.linkedAccounts[0]);
        } catch(e){} finally { setLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) {
        const query = selectedAccount ? `?accountId=${selectedAccount._id}` : "";
        api.get(`/tasks/daily${query}`).then(res => setTasks(res.data.tasks));
    }
  }, [selectedAccount, loading]);

  const handleSubmit = async (task) => {
    if (!selectedAccount) return toast.error("Link an account first!");
    const link = proofInputs[task._id];
    if (!link) return toast.error("Paste your video link first!");
    
    setSubmitting(task._id);
    try {
      await api.post("/tasks/submit", { taskId: task._id, accountId: selectedAccount._id, platform: selectedAccount.platform, proofLink: link });
      toast.success("Submitted Successfully!");
      setTasks(current => current.map(t => t._id === task._id ? { ...t, status: "Pending", isCompleted: true } : t));
      setProofInputs(prev => ({ ...prev, [task._id]: "" }));
    } catch (error) { toast.error(error.response?.data?.message || "Failed"); } finally { setSubmitting(null); }
  };

  const handleCopy = (text) => {
      navigator.clipboard.writeText(text);
      toast.success("Caption copied!");
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading tasks...</p>
    </div>
  );

  const hasLinkedAccount = user?.linkedAccounts?.length > 0;

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 md:px-8 max-w-[1400px] mx-auto relative">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#fff', color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}/>

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-violet-50 rounded-full blur-[120px] opacity-60"></div>
      </div>
      
      {/* --- Header & Sticky Account Bar --- */}
      <div className="sticky top-0 z-40 pb-6 bg-white/5 backdrop-blur-sm pt-4 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Tasks</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">Complete tasks to earn real money.</p>
            </div>
            
            <div className="flex items-center gap-3">
                 <div className="px-5 py-3 bg-white/80 border border-slate-200 rounded-2xl shadow-sm backdrop-blur-md flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pot:</span>
                    <span className="text-violet-600 font-black text-xl tracking-tight">₹{tasks.length * 2.5}</span>
                 </div>
            </div>
        </div>

        {/* Account Selector Section */}
        {hasLinkedAccount ? (
            <div className="bg-white/90 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 shadow-sm inline-flex items-center gap-3 max-w-full overflow-x-auto no-scrollbar">
                <span className="pl-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap hidden sm:block">Active:</span>
                <div className="min-w-[200px]">
                    <AccountSelector accounts={user.linkedAccounts} selectedAccountId={selectedAccount?._id} onSelect={(id) => setSelectedAccount(user.linkedAccounts.find(a => a._id === id))} />
                </div>
            </div>
        ) : (
             <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-red-700 text-sm font-bold">
                    <div className="p-1.5 bg-red-100 rounded-lg"><AlertIcon /></div>
                    <span>You are in View Mode. Link an account to earn.</span>
                </div>
                <Link href="/verify"><button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md transition whitespace-nowrap">Link Now</button></Link>
            </motion.div>
        )}
      </div>

      {/* --- Responsive Task Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task, index) => (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
                key={task._id} 
                className={`flex flex-col h-full bg-white rounded-[1.5rem] p-6 border transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/50 ${
                    task.status === 'Approved' ? 'border-emerald-100 shadow-emerald-50' : 
                    task.status === 'Rejected' ? 'border-red-100 shadow-red-50' :
                    task.status === 'Pending' ? 'border-amber-100 shadow-amber-50' :
                    'border-slate-100 shadow-sm'
                }`}
            >
                {/* 1. Card Header */}
                <div className="flex justify-between items-start mb-5">
                    <PlatformBadge platform={selectedAccount?.platform} />
                    <span className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1">
                        ₹{task.rewardAmount}
                    </span>
                </div>

                {/* 2. Content */}
                <div className="mb-6 flex-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2 line-clamp-2" title={task.title}>
                        {task.title}
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-slate-500 text-xs font-mono mb-4 line-clamp-2">
                        {task.caption}
                    </div>

                    {/* Action Buttons (Soft colors, no harsh blacks) */}
                    <div className="flex gap-3">
                         <a 
                            href={task.videoUrl} 
                            target="_blank" 
                            className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                         >
                            <DownloadIcon /> Video
                         </a>
                         <button 
                            onClick={() => handleCopy(task.caption)} 
                            className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                         >
                            <CopyIcon /> Caption
                         </button>
                    </div>
                </div>

                {/* 3. Footer: Submission Area */}
                <div className="mt-auto pt-4 border-t border-slate-50">
                    {!hasLinkedAccount ? (
                        <p className="text-xs text-center text-slate-400 font-bold bg-slate-50 py-2 rounded-lg">🔒 Link account to unlock</p>
                    ) : (
                        <>
                            {/* Status State pills */}
                            {task.status === 'Approved' && (
                                <div className="w-full py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 text-sm font-bold rounded-xl text-center flex items-center justify-center gap-2">
                                    ✓ Paid Successfully
                                </div>
                            )}
                            {task.status === 'Pending' && (
                                <div className="w-full py-3 bg-amber-50 text-amber-600 border border-amber-100 text-sm font-bold rounded-xl text-center flex items-center justify-center gap-2">
                                    ⏳ Under Review
                                </div>
                            )}
                            
                            {/* Input State (New or Rejected) */}
                            {(!task.status || task.status === 'Rejected' || task.status === 'New') && (
                                <div className="space-y-3">
                                    {task.status === 'Rejected' && (
                                        <div className="text-[11px] text-red-600 font-semibold bg-red-50 border border-red-100 p-2 rounded-lg leading-tight">
                                            <span className="font-bold">Rejected:</span> {task.adminComment}
                                        </div>
                                    )}
                                    
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                            <LinkIcon />
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Paste post link here..." 
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-10 pr-12 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder-slate-400 text-slate-700"
                                            value={proofInputs[task._id] || ""} 
                                            onChange={(e) => setProofInputs({...proofInputs, [task._id]: e.target.value})}
                                        />
                                        <button 
                                            onClick={() => handleSubmit(task)}
                                            disabled={submitting === task._id}
                                            className="absolute inset-y-1.5 right-1.5 px-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-violet-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center"
                                        >
                                            {submitting === task._id ? <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"/> : "Send"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
}