"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios" 

export default function ApprovalsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const { data } = await api.get("/admin/submissions");
      setSubmissions(data.submissions);
    } catch (error) {
      toast.error("Failed to load");
    } finally {  
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleDecision = async (id, decision) => {
    try {
     await api.post("/admin/decide", { submissionId: id, decision });
      toast.success(`${decision} successfully!`);
      // Remove from list UI 
      setSubmissions(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      toast.error("Action failed");
    }
  };

  if (loading) return <div className="p-10">Loading Pending Work...</div>;

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Pending Approvals ({submissions.length})</h1>

      {submissions.length === 0 ? (
        <div className="text-slate-500">No pending submissions. Good job!</div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((sub) => (
            <div key={sub._id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-white">{sub.userId?.fullName}</span>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{sub.platform}</span>
                </div>
                <h4 className="text-slate-300 font-medium mb-1">{sub.taskId?.title}</h4>
                <a 
                    href={sub.proofLink} 
                    target="_blank" 
                    className="text-blue-400 hover:underline text-sm break-all"
                >
                    {sub.proofLink}
                </a>
                <p className="text-xs text-slate-500 mt-2">Submitted: {new Date(sub.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <button 
                    onClick={() => handleDecision(sub._id, "Rejected")}
                    className="px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-red-400 border border-slate-700 rounded-lg text-sm font-bold"
                >
                    Reject
                </button>
                <button 
                    onClick={() => handleDecision(sub._id, "Approved")}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-green-900/20"
                >
                    Approve (₹{sub.taskId?.rewardAmount})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 