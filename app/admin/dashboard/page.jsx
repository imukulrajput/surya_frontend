"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {  
   api.get("/admin/stats")
      .then(res => setStats(res.data.stats))                     
      .catch(err => console.error(err));   
  }, []);

  if (!stats) return <div className="p-10 text-white">Loading Command Center...</div>;


  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Command Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-600" />
        <StatCard title="Pending Approvals" value={stats.pendingSubmissions} color="bg-yellow-600" />
        <StatCard title="Total Liability" value={`₹ ${stats.totalLiability}`} color="bg-red-600" />
        <StatCard title="Pending Payouts" value={stats.pendingWithdrawals} color="bg-purple-600" />
      </div>
      
      <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-2">System Health</h3>
        <p className="text-slate-400">Tasks Completed Today: <span className="text-green-400 font-bold">{stats.tasksCompletedToday}</span></p>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
    return (
        <div className={`${color} p-6 rounded-xl shadow-lg`}>
            <h3 className="text-white/80 text-sm font-bold uppercase">{title}</h3>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
    )
} 