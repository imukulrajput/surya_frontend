// "use client";
// import { useEffect, useState, useCallback } from "react";
// import Link from "next/link";
// import { Toaster } from "react-hot-toast";
// import { motion } from "framer-motion";
// import api from "@/lib/axios"; 
// import AccountSelector from "@/components/AccountSelector";

// // Icons
// const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V3"/><path d="M9 18a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M12 12h.01"/></svg>);
// const TaskIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-5.523 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>);
// const BankIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7"/><path d="M19 21V7"/><path d="M4 7h16"/><path d="m2 7 10-5 10 5"/><path d="M12 12v3"/></svg>);

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [announcement, setAnnouncement] = useState(null);
//   const [selectedAccount, setSelectedAccount] = useState(null);
  
//   // --- NEW: State for Bank Details ---
//   const [bankDetails, setBankDetails] = useState(null);

//   useEffect(() => {
//     // 1. Store the date when the user first opens the dashboard
//     const todayStr = new Date().toDateString();
//     localStorage.setItem('dashboardDate', todayStr);

//     // 2. Check every minute if the date has changed
//     const interval = setInterval(() => {
//         const storedDate = localStorage.getItem('dashboardDate');
//         const currentDate = new Date().toDateString();
        
//         // If the date has changed (e.g., passed midnight), reload the page
//         if (storedDate && storedDate !== currentDate) {
//             console.log("New Day Detected: Refreshing Dashboard...");
//             window.location.reload(); 
//         }
//     }, 60000); // Check every 60 seconds

//     return () => clearInterval(interval);
//   }, []);

//   // 1. Fetch User Data & Bank Details
//   const fetchData = useCallback(async () => {
//     try {
//       // Parallel requests for faster loading
//       const [userRes, walletRes] = await Promise.allSettled([
//           api.get("/users/me"),
//           api.get("/wallet/methods")
//       ]);

//       // Handle User Data
//       if (userRes.status === "fulfilled") {
//           const userData = userRes.value.data.user;
//           setUser(userData);
//           if (userData.linkedAccounts?.length > 0) {
//             setSelectedAccount(userData.linkedAccounts[0]);
//           }
//       }

//       // Handle Bank Details
//       if (walletRes.status === "fulfilled" && walletRes.value.data.methods.length > 0) {
//           setBankDetails(walletRes.value.data.methods[0]); // Take the first method
//       }

//     } catch (error) {
//       console.error("Dashboard Load Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // 2. Fetch Tasks (Dependent on selectedAccount or just general load)
//   useEffect(() => {
//     if (!loading) {
//         const query = selectedAccount ? `?accountId=${selectedAccount._id}` : "";
//         api.get(`/tasks/daily${query}`)
//            .then(res => setTasks(res.data.tasks))
//            .catch(err => console.error(err));
//     }
//   }, [selectedAccount, loading]);

//   // Initial Load
//   useEffect(() => {
//     fetchData();
//     api.get("/users/announcement").then(res => {
//         if(res.data.announcement) setAnnouncement(res.data.announcement);
//     }).catch(err => console.log("No announcement"));
//   }, [fetchData]);


//   // Calculations
//   const completedCount = tasks.filter(t => t.isCompleted).length;
//   const totalCount = tasks.length; 
//   const pendingEarnings = completedCount * 2.5; 
//   const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

//   if (loading) return (
//     <div className="h-96 flex items-center justify-center">
//       <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );

//   return (
//     <div className="space-y-8">
//       <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }}/>
      
//       {/* Top Header */}
//       <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
//           <p className="text-slate-400">Welcome back, {user?.fullName}</p>
//         </div>
//         <div className="text-left md:text-right">
//             <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Today's Date</p>
//             <p className="text-white font-mono">{new Date().toLocaleDateString()}</p>
//         </div>
//       </div>

//       {/* Account Selector (Only if social accounts exist) */}
//       {user?.linkedAccounts?.length > 0 && (
//          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
//              <div className="flex justify-between items-center mb-3">
//                 <label className="text-xs text-slate-500 uppercase font-bold block">Viewing Stats For</label>
//                 <Link href="/verify" className="text-xs text-blue-400 hover:text-white font-bold transition">+ Add Another</Link>
//              </div>
//              <AccountSelector 
//                 accounts={user.linkedAccounts} 
//                 selectedAccountId={selectedAccount?._id}
//                 onSelect={(id) => setSelectedAccount(user.linkedAccounts.find(a => a._id === id))}
//              />
//          </div>
//       )}

//       {/* Announcement Banner */}
//       {announcement?.isActive && (
//         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-600/20 border border-yellow-600/50 text-yellow-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg shadow-yellow-900/10">
//              <span className="text-xl">📢</span>
//              <span className="font-medium">{announcement.message}</span>
//         </motion.div>
//       )}

//       {/* Main Stats Grid - Updated to 4 Columns on Large Screens */}
//       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
//         {/* Card 1: Wallet (Global Balance) */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
//           className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl relative overflow-hidden group">
//            <div className="absolute top-0 right-0 p-4 opacity-10"><WalletIcon /></div>
//            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Balance</h3>
//            <div className="flex flex-col">
//              <span className="text-4xl font-bold text-white tracking-tight">₹ {user?.walletBalance || 0}</span>
//              <p className="text-xs text-slate-500 mt-2">Combined earnings</p>
//            </div>
//            <Link href="/withdraw" className="mt-6 block">
//              <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-lg transition">Manage Wallet</button>
//            </Link>
//         </motion.div>

//         {/* Card 2: Daily Progress */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
//           className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl">
//            <div className="flex justify-between items-start mb-4">
//              <div>
//                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">
//                  Daily Tasks
//                </h3>
//                <p className="text-2xl font-bold text-white">{completedCount} / {totalCount}</p>
//              </div>
//              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><TaskIcon /></div>
//            </div>
           
//            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden">
//              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
//            </div>
           
//            <div className="flex justify-between text-xs font-medium text-slate-500 mb-4">
//               <span>{Math.round(progressPercentage)}% Complete</span>
//            </div>

//            <Link href="/tasks" className="block">
//              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition shadow-lg shadow-blue-900/20">
//                 {totalCount > 0 && completedCount === totalCount ? "All Done! 🎉" : "Continue Tasks"}
//              </button>
//            </Link>
//         </motion.div>

//         {/* Card 3: Bank Details (NEW) */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
//           className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex flex-col justify-between">
           
//            <div className="flex justify-between items-start mb-2">
//              <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Bank Details</h3>
//              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><BankIcon /></div>
//            </div>

//            {bankDetails ? (
//               <div>
//                   <div className="mb-4">
//                       <p className="text-xl font-bold text-white truncate" title={bankDetails.details.bankName}>
//                           {bankDetails.details.bankName}
//                       </p>
//                       <p className="text-slate-400 font-mono text-sm tracking-widest">
//                           •••• {bankDetails.details.accountNumber.slice(-4)}
//                       </p>
//                   </div>
//                   <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 w-fit px-2 py-1 rounded border border-green-500/20">
//                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                       Verified & Active
//                   </div>
//               </div>
//            ) : (
//               <div className="flex flex-col items-center justify-center h-full py-2 text-center">
//                   <p className="text-slate-500 text-sm mb-3">No account linked</p>
//                   <Link href="/withdraw" className="w-full">
//                     <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition">
//                         + Link Account
//                     </button>
//                   </Link>
//               </div>
//            )}
//         </motion.div>

//         {/* Card 4: Social Account Status */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
//           className="p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl flex flex-col justify-between">
//             {user?.linkedAccounts?.length === 0 ? (
//                 <>
//                   <div>
//                     <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">⚠️ Action Required</h3>
//                     <p className="text-slate-400 text-sm">Verify a social account to start earning.</p>
//                   </div>
//                   <Link href="/verify" className="w-full mt-4">
//                     <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition">Verify Now</button>
//                   </Link>
//                 </>
//             ) : (
//                 <>
//                    <div>
//                       <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
//                         Social Accounts
//                       </h3>
//                       <div className="flex items-center gap-2 mb-1">
//                          <span className="text-2xl font-bold text-white">{user.linkedAccounts.length}</span>
//                          <span className="text-sm text-slate-400">Linked</span>
//                       </div>
//                       <p className="text-xs text-slate-500">
//                         Total Pending: <span className="text-yellow-400 font-bold">₹{pendingEarnings}</span>
//                       </p>
//                    </div>
//                    <Link href="/verify" className="w-full mt-4">
//                      <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold rounded-lg transition border border-slate-600 hover:border-slate-500">
//                        + Link New
//                      </button>
//                    </Link>
//                 </>
//             )}
//         </motion.div>

//       </section>
//     </div>
//   );
// }

"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "@/lib/axios"; 
import AccountSelector from "@/components/AccountSelector";

const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V3"/><path d="M9 18a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M12 12h.01"/></svg>);
const TaskIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-5.523 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>);
const BankIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7"/><path d="M19 21V7"/><path d="M4 7h16"/><path d="m2 7 10-5 10 5"/><path d="M12 12v3"/></svg>);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [bankDetails, setBankDetails] = useState(null);

  useEffect(() => {
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
          if (userData.linkedAccounts?.length > 0) {
            setSelectedAccount(userData.linkedAccounts[0]);
          }
      }

      if (walletRes.status === "fulfilled" && walletRes.value.data.methods.length > 0) {
          setBankDetails(walletRes.value.data.methods[0]); 
      }

    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
        const query = selectedAccount ? `?accountId=${selectedAccount._id}` : "";
        api.get(`/tasks/daily${query}`)
           .then(res => setTasks(res.data.tasks))
           .catch(err => console.error(err));
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
  const pendingEarnings = completedCount * 2.5; 
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) return <div className="h-96 flex items-center justify-center text-slate-500 font-medium">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <Toaster position="top-right" toastOptions={{ style: { background: '#fff', color: '#333', border: '1px solid #e2e8f0' } }}/>
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {user?.fullName} 👋</p>
        </div>
        <div className="text-left md:text-right">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Today's Date</p>
            <p className="text-slate-700 font-mono font-bold text-lg">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {user?.linkedAccounts?.length > 0 && (
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <label className="text-xs text-slate-400 uppercase font-extrabold tracking-wide">Viewing Data For</label>
                <Link href="/verify" className="text-xs text-violet-600 hover:text-violet-700 font-bold bg-violet-50 px-3 py-1 rounded-lg transition">+ Add Another</Link>
             </div>
             <AccountSelector 
                accounts={user.linkedAccounts} 
                selectedAccountId={selectedAccount?._id}
                onSelect={(id) => setSelectedAccount(user.linkedAccounts.find(a => a._id === id))}
             />
         </div>
      )}

      {announcement?.isActive && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
             <span className="text-xl">📢</span>
             <span className="font-semibold">{announcement.message}</span>
        </motion.div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-200 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-20"><WalletIcon /></div>
           <h3 className="text-violet-100 text-sm font-bold uppercase tracking-wider mb-1">Total Balance</h3>
           <span className="text-4xl font-extrabold tracking-tight">₹ {user?.walletBalance || 0}</span>
           <Link href="/withdraw" className="mt-6 block">
             <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-lg transition backdrop-blur-sm">
                Manage Wallet
             </button>
           </Link>
        </motion.div>

        <motion.div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
           <div className="flex justify-between items-start mb-4">
             <div>
               <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Daily Tasks</h3>
               <p className="text-2xl font-black text-slate-800">{completedCount} <span className="text-slate-300 text-lg">/ {totalCount}</span></p>
             </div>
             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><TaskIcon /></div>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
             <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
           </div>
           <div className="flex justify-between text-xs font-medium text-slate-500 mb-4">
              <span>{Math.round(progressPercentage)}% Complete</span>
           </div>
           <Link href="/tasks">
             <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition shadow-lg shadow-blue-100">
                {totalCount > 0 && completedCount === totalCount ? "All Done! 🎉" : "Continue Tasks"}
             </button>
           </Link>
        </motion.div>

        <motion.div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
           <div className="flex justify-between items-start mb-2">
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Bank Details</h3>
             <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><BankIcon /></div>
           </div>
           {bankDetails ? (
              <div>
                  <p className="text-xl font-bold text-slate-800 truncate" title={bankDetails.details.bankName}>{bankDetails.details.bankName}</p>
                  <p className="text-slate-500 font-mono text-sm tracking-widest mt-1">•••• {bankDetails.details.accountNumber.slice(-4)}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 w-fit px-3 py-1 rounded-full">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Verified
                  </div>
              </div>
           ) : (
              <div className="text-center py-2">
                  <p className="text-slate-400 text-sm mb-3">No account linked</p>
                  <Link href="/withdraw">
                    <button className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-violet-400 text-slate-400 hover:text-violet-600 text-sm font-bold rounded-xl transition">
                        + Link Now
                    </button>
                  </Link>
              </div>
           )}
        </motion.div>

        <motion.div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
            {user?.linkedAccounts?.length === 0 ? (
                <>
                  <div>
                    <h3 className="text-slate-800 font-bold text-lg mb-2 flex items-center gap-2">⚠️ Verify Account</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">You must link a social profile to start earning money.</p>
                  </div>
                  <Link href="/verify" className="w-full mt-4">
                    <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition shadow-lg">Link Now</button>
                  </Link>
                </>
            ) : (
                <>
                   <div>
                      <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Pending Earnings</h3>
                      <p className="text-3xl font-black text-slate-800">₹{pendingEarnings}</p>
                      <p className="text-xs text-slate-500 mt-1">From unapproved tasks</p>
                   </div>
                   <Link href="/verify" className="w-full mt-4">
                     <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-lg transition">Link New Account</button>
                   </Link>
                </>
            )}
        </motion.div>
      </section>
    </div>
  );
}