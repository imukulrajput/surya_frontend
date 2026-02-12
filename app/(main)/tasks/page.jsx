"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AccountSelector from "@/components/AccountSelector";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/axios";

// Google Drive Icon
const DriveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78" height="24" width="27">
    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="M43.65 25L29.9 1.2c-1.35-.8-2.9-1.2-4.5-1.2H18.25c1.6 0 3.15.4 4.55 1.2l29.6 51.3 8.6-14.9c.8-1.4 1.2-2.95 1.2-4.55 0-1.65-.4-3.2-1.2-4.6z" fill="#00ac47"/>
    <path d="M73.55 66.85c.8-1.4 1.2-2.95 1.2-4.55 0-1.6-.4-3.15-1.2-4.55l-13.75-23.8-13.75 23.8 13.75 23.8c1.35-.8 2.5-1.9 3.3-3.3z" fill="#ea4335"/>
    <path d="M43.65 25L57.4 48.8H29.9L16.15 25h27.5z" fill="#00832d"/>
    <path d="M57.4 48.8L43.65 72.6h27.5l13.75-23.8H57.4z" fill="#2684fc"/>
    <path d="M16.15 25H43.65L29.9 1.2 16.15 25z" fill="#ffba00"/>
  </svg>
);

export default function TaskDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [proofInputs, setProofInputs] = useState({});

  // 1. Fetch User Data
  useEffect(() => {
    fetchData();
  }, []);   

  // 2. Fetch Tasks whenever selectedAccount changes OR if user loads with no accounts
  useEffect(() => {
    if (!loading) {
        // If we have an account, fetch specific progress. If not, just fetch raw tasks.
        const query = selectedAccount ? `?accountId=${selectedAccount._id}` : "";
        fetchTasks(query);
    }
  }, [selectedAccount, loading]); 

  const fetchData = async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data.user);
      // If they have accounts, select the first one automatically
      if (data.user.linkedAccounts?.length > 0) {
          setSelectedAccount(data.user.linkedAccounts[0]);
      }
    } catch (error) {
      toast.error("Please login first");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (queryString) => {
    try {
     const { data } = await api.get(`/tasks/daily${queryString}`);
     setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopy = (text) => {
    if (typeof navigator !== 'undefined') {
        navigator.clipboard.writeText(text);
        toast.success("Caption copied!");
    }
  };

  const handleSubmit = async (task) => {
    if (!selectedAccount) return toast.error("Link an account first!");
    
    const link = proofInputs[task._id];
    if (!link) return toast.error("Paste your video link first!");

    setSubmitting(task._id);
    try {
      await api.post("/tasks/submit", { 
        taskId: task._id,
        accountId: selectedAccount._id,
        platform: selectedAccount.platform,
        proofLink: link
      });

      toast.success("Task Submitted!");
      setTasks(current => current.map(t => t._id === task._id ? { ...t, status: "Pending", isCompleted: true } : t));
      setProofInputs(prev => ({ ...prev, [task._id]: "" }));
    } catch (error) {
      const msg = error.response?.data?.message || "Submission failed";
      const detail = error.response?.data?.detail;
      toast.error(
          <div className="text-sm">
            <p className="font-bold">{msg}</p>
            {detail && <p className="mt-1 opacity-90">{detail}</p>}
          </div>,
          { duration: 5000 }
      );
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  const hasLinkedAccount = user?.linkedAccounts?.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Daily Tasks</h1>
            <p className="text-slate-400">Complete tasks to earn rewards.</p>
          </div>
          <div className="bg-slate-800 px-5 py-3 rounded-xl border border-slate-700 text-right">
             <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Today's Earnings</p>
             <p className="text-green-400 font-bold text-2xl">₹ {tasks.filter(t => t.status === 'Approved').length * 2.5}</p>
          </div>
      </div>

      {/* Account Selector OR Warning Banner */}
      {hasLinkedAccount ? (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
           <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Select Active Account</label>
           <AccountSelector 
              accounts={user.linkedAccounts} 
              selectedAccountId={selectedAccount?._id}
              onSelect={(id) => setSelectedAccount(user.linkedAccounts.find(a => a._id === id))}
           />
        </div>
      ) : (
        <div className="bg-blue-900/20 border border-blue-500/30 p-5 rounded-xl flex items-center justify-between gap-4">
            <div>
                <h3 className="font-bold text-blue-100">View Only Mode</h3>
                <p className="text-sm text-blue-300">Link your social account to unlock submissions and start earning.</p>
            </div>
            <Link href="/verify">
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition whitespace-nowrap shadow-lg shadow-blue-900/20">
                    Link Account Now
                </button>
            </Link>
        </div>
      )}

      {/* Helper Tip for ShareChat */}
      {selectedAccount?.platform === 'ShareChat' && (
        <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded-lg flex items-center gap-2 text-sm text-blue-200">
           <span>ℹ️</span>
           <p>ShareChat verification may take 24-48 hours if auto-verify fails.</p>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-6">
        {tasks.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No tasks available for today yet.</div>
        ) : tasks.map((task, index) => (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                key={task._id} 
                className={`p-5 rounded-2xl border transition-all ${
                    task.status === 'Approved' ? 'bg-green-900/10 border-green-900 opacity-80' : 
                    task.status === 'Pending' ? 'bg-yellow-900/10 border-yellow-900/30' : 
                    task.status === 'Rejected' ? 'bg-red-900/10 border-red-900/30' :
                    'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
            >   
                <div className="flex flex-col md:flex-row gap-6">
                    {/* File Preview */}
                    <div className="w-full md:w-48 shrink-0 bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center border border-slate-800 text-center">
                        <div className="mb-3 p-2 bg-white rounded-full"><DriveIcon /></div>
                        {/* We allow download even in View Mode so they can prepare the content */}
                        <a href={task.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                            Download File
                        </a>
                    </div>

                    {/* Task Details */}
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-white">Task #{index + 1}: {task.title}</h3>
                            <span className="bg-yellow-500/10 text-yellow-500 text-xs px-2 py-1 rounded font-mono font-bold">₹{task.rewardAmount}</span>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center gap-2">
                            <p className="text-sm text-slate-400 truncate flex-1 font-mono">{task.caption}</p>
                            <button type="button" onClick={() => handleCopy(task.caption)} className="text-xs text-blue-400 hover:text-white shrink-0 font-bold uppercase">Copy Caption</button>
                        </div> 

                        {/* --- VIEW MODE VS ACTIVE MODE LOGIC --- */}
                        {!hasLinkedAccount ? (
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                                <span className="text-sm text-slate-500">Log in & link account to submit</span>
                                <Link href="/verify">
                                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-2">
                                        🔒 Link Account
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            /* Normal Submission Logic */
                            <>
                                {task.status === "Approved" ? (
                                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-bold flex items-center gap-2">
                                        <span>✓ Task Approved & Paid</span>
                                    </div>
                                ) : task.status === "Pending" ? (
                                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm font-semibold flex items-center gap-2">
                                        <span>⏳ Submitted & Pending Approval</span>
                                    </div>
                              ) : task.status === "Rejected" ? (
                            <div className="space-y-3">
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex flex-col gap-1">
                                    <span className="font-bold flex items-center gap-2">
                                        ✕ Task Rejected
                                    </span>
                                    {/* --- FIX #4: SHOW REASON --- */}
                                    {task.adminComment && (
                                        <span className="text-xs text-red-300 bg-red-900/20 p-2 rounded border border-red-900/30">
                                          Reason: {task.adminComment}
                                        </span>
                                    )}
                                    <span className="text-[10px] opacity-70">Please fix the issue and resubmit below.</span>
                                </div>
                                
                                {/* Resubmission Input */}
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Paste corrected link..."
                                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={proofInputs[task._id] || ""}
                                        onChange={(e) => setProofInputs({...proofInputs, [task._id]: e.target.value})}
                                    />
                                    <button 
                                        onClick={() => handleSubmit(task)}
                                        disabled={submitting === task._id}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition disabled:opacity-50"
                                    >
                                        {submitting === task._id ? '...' : 'Resubmit'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder={`Paste your ${selectedAccount?.platform} link here...`}
                                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={proofInputs[task._id] || ""}
                                            onChange={(e) => setProofInputs({...proofInputs, [task._id]: e.target.value})}
                                        />
                                        <button 
                                            onClick={() => handleSubmit(task)}
                                            disabled={submitting === task._id}
                                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition disabled:opacity-50"
                                        >
                                            {submitting === task._id ? '...' : 'Submit'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
}