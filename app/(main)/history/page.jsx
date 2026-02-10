"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns"; 
import { Toaster } from "react-hot-toast";
import api from "@/lib/axios";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
       const { data } = await api.get("/tasks/history");
       setHistory(data.history);
      } catch (error) {
        console.error("Error fetching history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }}/>
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Task History</h1>
        <p className="text-slate-400">View your past submissions and approval status.</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700">
          <p className="text-slate-400">No history found.</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Task Title</th>
                  <th className="p-4 font-semibold">Platform</th>
                  <th className="p-4 font-semibold">Reward</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-slate-300">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 text-sm">
                      {format(new Date(item.createdAt), "MMM dd, yyyy • hh:mm a")}
                    </td>
                    <td className="p-4 font-medium text-white">
                      {item.taskId?.title || "Unknown Task"}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs bg-slate-900 border border-slate-700">
                        {item.platform}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-yellow-400 font-bold">
                      ₹{item.taskId?.rewardAmount || 0}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}