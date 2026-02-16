"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import api from "@/lib/axios"; 
import AccountSelector from "@/components/AccountSelector";

// --- Icons ---
const WalletIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const CheckCircle = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BankIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const ArrowRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const BellIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, className, glowColor = "from-violet-500/20 to-blue-500/20" }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY }) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-[2rem] shadow-xl transition-all duration-300 group ${className}`}
    >
      <motion.div
        className={`pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 bg-gradient-to-r ${glowColor}`}
        style={{
          maskImage: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent
            )
          `,
        }}
      />
      <div className="relative h-full z-10 flex flex-col">{children}</div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17) setGreeting("Good Evening");
    
    // Auto Refresh Logic
    const todayStr = new Date().toDateString();
    localStorage.setItem('dashboardDate', todayStr);
    const interval = setInterval(() => {
        const storedDate = localStorage.getItem('dashboardDate');
        const currentDate = new Date().toDateString();
        if (storedDate && storedDate !== currentDate) {
            window.location.reload(); 
        }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, walletRes] = await Promise.allSettled([
          api.get("/users/me"),
          api.get("/wallet/methods")
      ]);

      if (userRes.status === "fulfilled") {
          const userData = userRes.value.data.user;
          setUser(userData);
          if (userData.linkedAccounts?.length > 0) setSelectedAccount(userData.linkedAccounts[0]);
      }
      if (walletRes.status === "fulfilled" && walletRes.value.data.methods.length > 0) {
          setBankDetails(walletRes.value.data.methods[0]); 
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!loading) {
        const query = selectedAccount ? `?accountId=${selectedAccount._id}` : "";
        api.get(`/tasks/daily${query}`).then(res => setTasks(res.data.tasks)).catch(err => console.error(err));
    }
  }, [selectedAccount, loading]);

  useEffect(() => {
    fetchData();
    api.get("/users/announcement").then(res => {
        if(res.data.announcement) setAnnouncement(res.data.announcement);
    }).catch(err => console.log("No announcement"));
  }, [fetchData]);

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const totalCount = tasks.length; 
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
 const pendingEarnings = tasks
    .filter(t => t.status === 'Pending') 
    .reduce((sum, t) => sum + (t.rewardAmount || 0), 0);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-100 rounded-full animate-spin border-t-violet-600"></div>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-violet-600 text-xs">T</div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 pt-20 px-4 sm:px-8 max-w-[1400px] mx-auto space-y-8 overflow-x-hidden">
      
      {/* Toast Config */}
      <Toaster 
          position="top-right" 
          containerStyle={{ top: 80, zIndex: 99999 }} 
          toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }}
      />

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-violet-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
          <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
      </div>

      {/* --- Header Section (FIXED RESPONSIVENESS) --- */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-end gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           {/* Resized Font for Mobile: text-3xl instead of text-5xl */}
           <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-2">
             {greeting}, <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
               {user?.fullName?.split(" ")[0] || "Earner"}
             </span>
           </h1>
           <p className="text-slate-500 font-medium text-lg">Let's make today productive.</p>
        </motion.div>

        {user?.linkedAccounts?.length > 0 && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
             // Added w-full and max-w-md to ensure it doesn't overflow mobile screen
             className="bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2 w-full max-w-md"
           >
              {/* Added min-w-0 to allow flex child to shrink so horizontal scroll works */}
              <div className="flex-1 min-w-0">
                 <AccountSelector 
                    accounts={user.linkedAccounts} 
                    selectedAccountId={selectedAccount?._id}
                    onSelect={(id) => setSelectedAccount(user.linkedAccounts.find(a => a._id === id))}
                 />
              </div>
              <Link href="/verify" className="p-3 hover:bg-violet-50 rounded-xl text-violet-600 transition-colors shrink-0">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </Link>
           </motion.div>
        )}
      </div>

      {/* --- Announcement --- */}
      {announcement?.isActive && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-4 flex items-start gap-4 shadow-sm"
        >
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0"><BellIcon /></div>
          <div>
             <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wide mb-1">Update</h4>
             <p className="text-amber-800 font-medium text-sm md:text-base leading-relaxed">{announcement.message}</p>
          </div>
        </motion.div>
      )}

      {/* --- Bento Grid Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-[minmax(220px,auto)]">

        {/* 1. Wallet Card (FIXED CONTRAST & MOBILE LAYOUT) */}
        <TiltCard className="md:col-span-2 bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-slate-900 group relative overflow-hidden min-h-[260px] border border-white shadow-xl shadow-slate-200/60">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200/20 to-blue-200/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex flex-col justify-between h-full p-6 md:p-8 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white shadow-sm rounded-2xl border border-slate-100 text-violet-600 shrink-0">
                            <WalletIcon />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Total Balance</p>
                            <div className="flex flex-wrap items-baseline gap-2">
                                {/* Adjusted Font Size for Mobile */}
                                <span className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">₹{user?.walletBalance || 0}</span>
                                {/* <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">+20%</span> */}
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                       <span className="px-3 py-1.5 rounded-full bg-white border border-slate-100 text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                          Verified
                       </span>
                    </div>
                </div>

                <div className="flex items-end justify-between mt-6">
                    <div className="space-y-1">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Card Holder</p>
                        {/* Changed color to Slate-900 so it's visible on light bg */}
                        <p className="font-mono text-xl md:text-2xl text-slate-900 font-black tracking-widest truncate max-w-[150px] md:max-w-xs">
                            {user?.fullName?.toUpperCase() || "USER"}
                        </p>
                    </div>
                    <Link href="/withdraw">
                        <motion.button 
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-slate-200"
                        >
                            Withdraw <ArrowRight />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </TiltCard>

        {/* 2. Task Progress */}
        <TiltCard className="p-6 sm:p-8 bg-white border border-slate-100">
            <div className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Daily Goals</h3>
                        <p className="text-slate-500 text-sm font-medium mt-1">Keep the streak alive!</p>
                    </div>
                    <div className="relative w-20 h-20 shrink-0">
                        <svg className="transform -rotate-90 w-20 h-20">
                            <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                            <circle cx="40" cy="40" r={radius} stroke="#7c3aed" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-700 text-sm">
                            {Math.round(progressPercentage)}%
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-3xl font-black text-slate-900">{completedCount}<span className="text-slate-300 text-xl">/{totalCount}</span></span>
                        <span className="text-xs font-bold bg-violet-50 text-violet-600 px-2 py-1 rounded-lg">Tasks Done</span>
                    </div>
                    <Link href="/tasks" className="w-full block">
                        <button className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition shadow-lg shadow-violet-200 flex justify-center items-center gap-2 group-hover:gap-3">
                            {completedCount === totalCount ? "View Rewards" : "Start Earning"} <ArrowRight />
                        </button>
                    </Link>
                </div>
            </div>
        </TiltCard>

        {/* 3. Bank Method */}
        <TiltCard className="p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 border border-slate-100">
             <div className="flex flex-col h-full">
                 <div className="flex items-center gap-3 mb-4 shrink-0">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BankIcon /></div>
                    <h3 className="text-lg font-bold text-slate-800">Payout Method</h3>
                 </div>

                 {bankDetails ? (
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full"></div>
                            <p className="text-slate-900 font-bold truncate">{bankDetails.details.bankName}</p>
                            <p className="text-slate-400 font-mono text-sm tracking-widest mt-1">•••• {bankDetails.details.accountNumber.slice(-4)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                            <CheckCircle /> Verified & Ready
                        </div>
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                        <p className="text-slate-400 text-sm mb-4">No bank account linked</p>
                        <Link href="/withdraw" className="w-full">
                            <button className="w-full py-3 border border-dashed border-slate-300 hover:border-violet-500 hover:text-violet-600 text-slate-500 font-bold rounded-xl transition whitespace-nowrap">
                                + Link Bank Account
                            </button>
                        </Link>
                    </div>
                 )}
             </div>
        </TiltCard>

        {/* 4. Action / Pending */}
        <TiltCard className="md:col-span-2 p-8 relative overflow-hidden bg-white border border-slate-100">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 h-full">
                {user?.linkedAccounts?.length === 0 ? (
                    <>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">⚠️ Activation Required</h3>
                            <p className="text-slate-500 font-medium">To ensure quality, we require you to link at least one active social media profile.</p>
                        </div>
                        <Link href="/verify" className="w-full md:w-auto">
                            <button className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl hover:scale-105 transition-transform">
                                Link Account Now
                            </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
                                <span className="text-sm font-bold text-orange-600 uppercase tracking-wider">Pending Review</span>
                            </div>
                            <div className="flex items-end gap-3">
                                <h3 className="text-5xl font-black text-slate-900 tracking-tighter">₹{pendingEarnings}</h3>
                                <p className="text-slate-400 font-medium mb-2">estimated earnings</p>
                            </div>
                        </div>
                         <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 max-w-sm hidden md:block">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Your submitted tasks are being reviewed. Funds usually clear within 24 hours.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </TiltCard>

      </div>
    </div>
  );
}