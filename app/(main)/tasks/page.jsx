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
const InfoIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- Components ---

const PlatformBadge = ({ platform }) => {
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

// --- Instructions Modal ---
const InstructionsModal = ({ task, onClose }) => {
    if (!task) return null;
    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">
                            {task.platform || "TASK"} - UPLOAD VIDEO
                        </h3>
                        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
                            <CloseIcon />
                        </button>
                    </div>
                    
                    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                            Upload our video to your {task.platform || 'social'} account and grab money! Follow the steps carefully to ensure approval.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Create or use an existing active account.",
                                "Ensure your account is verified in the 'Verify' tab.",
                                "Post the video provided in this task.",
                                `Use this specific caption: "${task.caption?.substring(0, 30)}..."`,
                                "Copy the link to your post and submit it below."
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </div>
                                    <p className="text-slate-700 text-sm font-medium">{step}</p>
                                </div>
                            ))}
                        </div>

                        {/* <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 font-medium leading-relaxed">
                            <span className="font-bold block mb-1">⚠️ Attention:</span>
                            You must wait 30 minutes between uploading videos if doing multiple tasks. We only pay for videos from our official pack.
                        </div> */}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50">
                        <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition">
                            I Understand, Let's Earn
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default function TaskDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [proofInputs, setProofInputs] = useState({});
  const [instructionTask, setInstructionTask] = useState(null); // State for modal

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
    <div className="min-h-screen pb-20 pt-8 px-2 md:px-8 max-w-[1400px] mx-auto relative">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#fff', color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }}/>

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-violet-50 rounded-full blur-[120px] opacity-60"></div>
      </div>
      
      {/* --- Header --- */}
      <div className="sticky top-0 z-40 pb-6 bg-white/5 backdrop-blur-sm pt-4 -mx-2 px-3 md:-mx-8 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                    Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Tasks</span>
                </h1>
                <p className="text-slate-500 font-medium text-sm mt-1">Complete tasks to earn real money.</p>
            </div>
             
            {/* <div className="flex items-center gap-3">
                 <div className="px-5 py-3 bg-white/80 border border-slate-200 rounded-2xl shadow-sm backdrop-blur-md flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pot:</span>
                    <span className="text-violet-600 font-black text-xl tracking-tight">₹{tasks.length * 2.5}</span>
                 </div>
            </div> */}
        </div>

        {/* Account Selector */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {tasks.map((task, index) => (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}
                key={task._id} 
                className={`flex flex-col h-full bg-white rounded-[1.5rem] p-4 md:p-6 border transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100/50 ${
                    task.status === 'Approved' ? 'border-emerald-100 shadow-emerald-50' : 
                    task.status === 'Rejected' ? 'border-red-100 shadow-red-50' :
                    task.status === 'Pending' ? 'border-amber-100 shadow-amber-50' :
                    'border-slate-100 shadow-sm'
                }`}
            >
                {/* 1. Card Header */}
                <div className="flex justify-between items-start mb-4">
                    <PlatformBadge platform={selectedAccount?.platform} />
                    <span className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1">
                        ₹{task.rewardAmount}
                    </span>
                </div>

                {/* 2. Content */}
                <div className="mb-4 flex-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2 line-clamp-2" title={task.title}>
                        {task.title}
                    </h3>
                    
                    {/* Read Instructions Button (New Feature) */}
                    <button 
                        onClick={() => setInstructionTask(task)}
                        className="w-full text-left mb-3 flex items-center gap-2 text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                    >
                        <InfoIcon /> Read Instructions
                    </button>

                    {/* Enlarged Description Box */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-slate-500 text-xs font-mono mb-4 leading-relaxed line-clamp-4 min-h-[4.5rem]">
                        {task.caption}
                    </div>

                    {/* Action Buttons */}
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

      {/* --- Instructions Modal Injection --- */}
      {instructionTask && (
          <InstructionsModal task={instructionTask} onClose={() => setInstructionTask(null)} />
      )}

    </div>
  );
}