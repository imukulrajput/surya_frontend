"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios"; 

const REJECT_REASONS = [
    "Wrong Video",
    "Missing Bio / Caption",
    "No Comment",
    "Duplicate Video Link",
    "Private Account / Link Unreachable",
    "Other"
];

export default function ApprovalsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");
  const [selectedIds, setSelectedIds] = useState([]);

  // --- Reject Modal State ---
  const [rejectModal, setRejectModal] = useState({ isOpen: false, type: null, id: null });
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  useEffect(() => { 
      fetchSubmissions(); 
      setSelectedIds([]); 
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try { 
        const { data } = await api.get(`/admin/submissions?status=${filter}`); 
        setSubmissions(data.submissions); 
    } catch (error) { 
        toast.error("Failed to load"); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleDecision = async (id, decision, adminComment = null) => {
    try { 
        await api.post("/admin/decide", { submissionId: id, decision, adminComment }); 
        toast.success(decision); 
        setSubmissions(prev => prev.filter(s => s._id !== id)); 
    } catch(e) { 
        toast.error("Error processing decision"); 
    }
  };

  const handleBulkAction = async (decision, adminComment = null) => {
    if (decision === "Approved" && !confirm(`Are you sure you want to approve ${selectedIds.length} tasks?`)) return;
    
    const toastId = toast.loading(`Processing ${selectedIds.length} tasks...`);
    
    try { 
      await api.post("/admin/decide/bulk", { 
          submissionIds: selectedIds, 
          decision,
          adminComment
      }); 
      
      toast.success(`Batch ${decision} Complete!`, { id: toastId }); 
      fetchSubmissions(); 
      setSelectedIds([]); 
    } catch(e) { 
      toast.error("Failed to process bulk action", { id: toastId }); 
    }
  };

  const toggleSelectOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const confirmReject = () => {
      let finalReason = rejectReason;
      
      // If "Other" is selected, force them to type something
      if (rejectReason === "Other") {
          if (!customReason.trim()) {
              return toast.error("Please enter a custom rejection reason.");
          }
          finalReason = customReason.trim();
      }

      if (rejectModal.type === "single") {
          handleDecision(rejectModal.id, "Rejected", finalReason);
      } else if (rejectModal.type === "bulk") {
          handleBulkAction("Rejected", finalReason);
      }
      
      // Reset Modal
      setRejectModal({ isOpen: false, type: null, id: null });
      setRejectReason(REJECT_REASONS[0]);
      setCustomReason("");
  };

  const closeModal = () => {
      setRejectModal({ isOpen: false, type: null, id: null });
      setRejectReason(REJECT_REASONS[0]);
      setCustomReason("");
  };

  return (
    <div>
      <Toaster position="top-right" />

      {/* --- REJECT MODAL --- */}
      {rejectModal.isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl transition-all">
                  <h3 className="text-xl font-black text-slate-900 mb-1">Rejection Reason</h3>
                  <p className="text-sm text-slate-500 mb-6 font-medium">This reason will be shown to the user.</p>
                  
                  <div className="space-y-3 mb-6">
                      <select 
                          value={rejectReason}
                          onChange={(e) => {
                              setRejectReason(e.target.value);
                              if (e.target.value !== "Other") setCustomReason(""); 
                          }}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-xl font-bold outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all cursor-pointer"
                      >
                          {REJECT_REASONS.map(reason => (
                              <option key={reason} value={reason}>{reason}</option>
                          ))}
                      </select>

                      {/* Render custom input if "Other" is selected */}
                      {rejectReason === "Other" && (
                          <input 
                              type="text"
                              autoFocus
                              placeholder="Type custom reason here..."
                              value={customReason}
                              onChange={(e) => setCustomReason(e.target.value)}
                              className="w-full bg-white border-2 border-slate-200 text-slate-900 p-3.5 rounded-xl font-medium outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-400"
                          />
                      )}
                  </div>

                  <div className="flex gap-3">
                      <button onClick={closeModal} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">Cancel</button>
                      <button onClick={confirmReject} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition">Reject Now</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- HEADER CONTROLS --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900">{filter} <span className="text-slate-400 text-lg font-medium">({submissions.length})</span></h1>
            {selectedIds.length > 0 && filter === "Pending" && (
                <div className="flex gap-2">
                    <button onClick={() => handleBulkAction("Approved")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-200">Approve ({selectedIds.length})</button>
                    <button onClick={() => setRejectModal({ isOpen: true, type: "bulk", id: null })} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-200">Reject ({selectedIds.length})</button>
                </div>
            )}
          </div>
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
              {["Pending", "Approved", "Rejected"].map(s => (
                  <button key={s} onClick={() => setFilter(s)} className={`px-5 py-2 rounded-lg text-sm font-bold transition ${filter === s ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>{s}</button>
              ))}
          </div>
      </div>

      {submissions.length > 0 && filter === "Pending" && (
          <div className="mb-4 flex items-center gap-2 text-slate-500 text-sm font-medium">
              <input type="checkbox" className="w-4 h-4 accent-slate-900" checked={selectedIds.length === submissions.length} onChange={(e) => setSelectedIds(e.target.checked ? submissions.map(s => s._id) : [])} /> Select All
          </div>
      )}

      {/* --- SUBMISSIONS LIST --- */}
      <div className="grid gap-4">
        {submissions.map((sub) => (
            <div key={sub._id} className={`bg-white border p-6 rounded-2xl flex items-start gap-5 shadow-sm transition ${selectedIds.includes(sub._id) ? 'border-violet-500 ring-1 ring-violet-500' : 'border-slate-200 hover:shadow-md'}`}>
                {filter === "Pending" && <input type="checkbox" className="w-5 h-5 mt-1 accent-violet-600 cursor-pointer" checked={selectedIds.includes(sub._id)} onChange={() => toggleSelectOne(sub._id)} />}
                
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-slate-900">{sub.userId?.fullName}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{sub.platform}</span>
                    </div>
                    
                    <h4 className="text-slate-700 font-medium text-sm mb-2">{sub.taskId?.title}</h4>
                    <a href={sub.proofLink} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold hover:underline bg-blue-50 px-3 py-1.5 rounded-lg inline-block mb-3">View Proof ↗</a>
                    
                    <div className="text-xs text-slate-400 font-mono flex flex-wrap gap-4 items-center">
                        <span>{new Date(sub.createdAt).toLocaleString()}</span>
                        {/* Display the rejection reason securely if rejected */}
                        {filter === "Rejected" && sub.adminComment && (
                            <span className="text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                                Reason: {sub.adminComment}
                            </span>
                        )}
                    </div>
                </div>

                {filter === "Pending" && (
                    <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => handleDecision(sub._id, "Approved")} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold border border-green-200">Approve</button>
                        <button onClick={() => setRejectModal({ isOpen: true, type: "single", id: sub._id })} className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold border border-slate-200">Reject</button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
}