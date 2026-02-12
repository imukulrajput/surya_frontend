// "use client";
// import { useEffect, useState } from "react";
// import api from "@/lib/axios";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {  
//    api.get("/admin/stats")
//       .then(res => setStats(res.data.stats))                     
//       .catch(err => console.error(err));   
//   }, []);

//   if (!stats) return <div className="p-10 text-white">Loading Command Center...</div>;


//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-white mb-8">Command Center</h1>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-600" />
//         <StatCard title="Pending Approvals" value={stats.pendingSubmissions} color="bg-yellow-600" />
//         <StatCard title="Total Liability" value={`₹ ${stats.totalLiability}`} color="bg-red-600" />
//         <StatCard title="Pending Payouts" value={stats.pendingWithdrawals} color="bg-purple-600" />
//       </div>
      
//       <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-800">
//         <h3 className="text-xl font-bold text-white mb-2">System Health</h3>
//         <p className="text-slate-400">Tasks Completed Today: <span className="text-green-400 font-bold">{stats.tasksCompletedToday}</span></p>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, color }) {
//     return (
//         <div className={`${color} p-6 rounded-xl shadow-lg`}>
//             <h3 className="text-white/80 text-sm font-bold uppercase">{title}</h3>
//             <p className="text-3xl font-bold text-white mt-2">{value}</p>
//         </div>
//     )
// } 

"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get("/admin/stats").then(res => setStats(res.data.stats)).catch(console.error); }, []);

  if (!stats) return <div className="p-10 text-slate-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Command Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-600" shadow="shadow-blue-200" />
        <StatCard title="Pending Approvals" value={stats.pendingSubmissions} color="bg-amber-500" shadow="shadow-amber-200" />
        <StatCard title="Total Liability" value={`₹ ${stats.totalLiability}`} color="bg-red-500" shadow="shadow-red-200" />
        <StatCard title="Pending Payouts" value={stats.pendingWithdrawals} color="bg-violet-600" shadow="shadow-violet-200" />
      </div>
      <div className="mt-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-2">System Health</h3>
        <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-slate-600 font-medium">Tasks Completed Today: <span className="text-slate-900 font-black text-lg">{stats.tasksCompletedToday}</span></p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, shadow }) {
    return (
        <div className={`${color} p-6 rounded-2xl shadow-xl ${shadow} text-white`}>
            <h3 className="text-white/80 text-xs font-bold uppercase tracking-wider">{title}</h3>
            <p className="text-4xl font-black mt-2">{value}</p>
        </div>
    )
}     