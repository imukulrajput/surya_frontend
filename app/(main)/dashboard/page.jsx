"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "@/lib/axios"; 

const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V3"/><path d="M9 18a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M12 12h.01"/></svg>);
const TaskIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-5.523 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
     
  const refreshData = useCallback(async () => {
    try {
      const { data: userData } = await api.get("/users/me");
      setUser(userData.user);
      if (userData.user.linkedAccounts?.length > 0) {
        const firstAccountId = userData.user.linkedAccounts[0]._id;
        const { data: taskData } = await api.get(`/tasks/daily?accountId=${firstAccountId}`);
        setTasks(taskData.tasks);
      }
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    api.get("/users/announcement").then(res => {
        if(res.data.announcement) setAnnouncement(res.data.announcement);
    }).catch(err => console.log("No announcement"));
  }, [refreshData]);

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const pendingEarnings = completedCount * 2.5; 
  const progressPercentage = (completedCount / 50) * 100;

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }}/>
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user?.fullName}</p>
        </div>
        <div className="hidden sm:block text-right">
           <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Today's Date</p>
           <p className="text-white font-mono">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {announcement?.isActive && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-600/20 border border-yellow-600/50 text-yellow-400 px-6 py-4 rounded-xl flex items-center gap-3">
             <span className="text-xl">📢</span>
             <span className="font-medium">{announcement.message}</span>
        </motion.div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10"><WalletIcon /></div>
           <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Wallet Balance</h3>
           <div className="flex flex-col">
             <span className="text-4xl font-bold text-white tracking-tight">₹ {user?.walletBalance || 0}</span>
             {pendingEarnings > 0 && <span className="text-sm text-yellow-400 font-medium mt-1">+ ₹{pendingEarnings} Pending</span>}
           </div>
           <Link href="/withdraw" className="mt-6 block">
             <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition">Manage Wallet</button>
           </Link>
        </motion.div>

        {/* Task Progress Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Daily Progress</h3>
               <p className="text-2xl font-bold text-white">{completedCount} / 50 Tasks</p>
             </div>
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><TaskIcon /></div>
           </div>
           <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden">
             <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
           </div>
           <Link href="/tasks" className="mt-4 block">
             <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition shadow-lg shadow-blue-900/20">Continue Tasks</button>
           </Link>
        </motion.div>

        {/* Verify Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex flex-col justify-between">
            {user?.linkedAccounts?.length === 0 ? (
                <>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">⚠️ Action Required</h3>
                    <p className="text-slate-400 text-sm">Verify an account to start earning.</p>
                  </div>
                  <Link href="/verify" className="w-full mt-4">
                    <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition">Verify Now</button>
                  </Link>
                </>
            ) : (
                <>
                   <div>
                     <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active Account
                     </h3>
                     <p className="text-sm text-slate-400">Account verified and ready.</p>
                   </div>
                   <Link href="/verify" className="w-full mt-4">
                     <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold rounded-lg transition">Add Account</button>
                   </Link>
                </>
            )}
        </motion.div>
      </section>
    </div>
  );
}