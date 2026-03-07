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

const ITEMS_PER_PAGE = 50;

export default function ApprovalsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Set for fast ID lookups
  const [selectedIds, setSelectedIds] = useState(new Set());

  // --- Reject Modal State ---
  const [rejectModal, setRejectModal] = useState({ isOpen: false, type: null, id: null });
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  // Fetch data whenever filter OR page changes
  useEffect(() => { 
      fetchSubmissions(); 
  }, [filter, currentPage]);

  // Reset page and selections when switching tabs
  useEffect(() => {
      setCurrentPage(1);
      setSelectedIds(new Set());
  }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try { 
        // Pass page and limit to the server for server-side pagination
        const { data } = await api.get(`/admin/submissions?status=${filter}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`); 
        setSubmissions(data.submissions);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
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
        fetchSubmissions(); // Re-fetch the current page to get fresh data
        
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    } catch(e) { 
        toast.error("Error processing decision"); 
    }
  };

  const handleBulkAction = async (decision, adminComment = null) => {
    if (decision === "Approved" && !window.confirm(`Are you sure you want to approve ${selectedIds.size} tasks?`)) return;
    
    const toastId = toast.loading(`Processing ${selectedIds.size} tasks...`);
    const payloadIds = Array.from(selectedIds); 
    
    try { 
      await api.post("/admin/decide/bulk", { 
          submissionIds: payloadIds, 
          decision,
          adminComment
      }); 
      
      toast.success(`Batch ${decision} Complete!`, { id: toastId }); 
      setSelectedIds(new Set()); 
      
      // Jumping back to page 1 is safest after a bulk action
      setCurrentPage(1); 
      fetchSubmissions();
    } catch(e) { 
      toast.error("Failed to process bulk action", { id: toastId }); 
    }
  };

  const handleApproveAllPending = async () => {
      // High-friction warning since this is a massive database action
      if (!window.confirm(`🚨 DANGER: Are you absolutely sure you want to approve ALL ${totalItems} pending tasks in the database? This cannot be undone.`)) {
          return;
      }
      
      const toastId = toast.loading(`Approving all ${totalItems} pending tasks...`);
      
      try { 
        const res = await api.post("/admin/decide/approve-all"); 
        toast.success(res.data.message || "All pending tasks approved!", { id: toastId }); 
        
        // Reset the page and selections
        setSelectedIds(new Set()); 
        setCurrentPage(1); 
        fetchSubmissions(); 
      } catch(e) { 
        toast.error(e.response?.data?.message || "Failed to approve all tasks", { id: toastId }); 
      }
  };

  const toggleSelectOne = (id) => {
      setSelectedIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(id)) newSet.delete(id);
          else newSet.add(id);
          return newSet;
      });
  };

  const toggleSelectCurrentPage = (e) => {
      const newSet = new Set(selectedIds);
      if (e.target.checked) {
          // Add all IDs from the CURRENT page
          submissions.forEach(s => newSet.add(s._id));
      } else {
          // Remove all IDs from the CURRENT page
          submissions.forEach(s => newSet.delete(s._id));
      }
      setSelectedIds(newSet);
  };

  const confirmReject = () => {
      let finalReason = rejectReason;
      if (rejectReason === "Other") {
          if (!customReason.trim()) return toast.error("Please enter a custom rejection reason.");
          finalReason = customReason.trim();
      }

      if (rejectModal.type === "single") handleDecision(rejectModal.id, "Rejected", finalReason);
      else if (rejectModal.type === "bulk") handleBulkAction("Rejected", finalReason);
      
      setRejectModal({ isOpen: false, type: null, id: null });
      setRejectReason(REJECT_REASONS[0]);
      setCustomReason("");
  };

  const closeModal = () => {
      setRejectModal({ isOpen: false, type: null, id: null });
      setRejectReason(REJECT_REASONS[0]);
      setCustomReason("");
  };

  // Helper to check if all items on the CURRENT page are selected
  const isCurrentPageSelected = submissions.length > 0 && submissions.every(s => selectedIds.has(s._id));

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
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Show totalItems dynamically from the server */}
            <h1 className="text-3xl font-extrabold text-slate-900">{filter} <span className="text-slate-400 text-lg font-medium">({totalItems})</span></h1>
            
            {/* Checkbox-based bulk actions */}
            {selectedIds.size > 0 && filter === "Pending" && (
                <div className="flex gap-2">
                    <button onClick={() => handleBulkAction("Approved")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-200">Approve ({selectedIds.size})</button>
                    <button onClick={() => setRejectModal({ isOpen: true, type: "bulk", id: null })} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-200">Reject ({selectedIds.size})</button>
                </div>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap w-full xl:w-auto">
              {/* APPROVE ALL BUTTON */}
              {filter === "Pending" && totalItems > 0 && (
                  <button 
                      onClick={handleApproveAllPending} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-5 py-2 rounded-xl text-sm font-black shadow-md border-2 border-yellow-500 transition-all whitespace-nowrap"
                  >
                      ⚡ Approve ALL {totalItems}
                  </button>
              )}

              <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm w-full sm:w-auto overflow-x-auto">
                  {["Pending", "Approved", "Rejected"].map(s => (
                      <button key={s} onClick={() => setFilter(s)} className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition ${filter === s ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>{s}</button>
                  ))}
              </div>
          </div>
      </div>

      {submissions.length > 0 && filter === "Pending" && (
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <label className="flex items-center gap-2 text-slate-700 text-sm font-bold cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-slate-900" 
                    checked={isCurrentPageSelected} 
                    onChange={toggleSelectCurrentPage} 
                  /> 
                  Select Page {currentPage}
              </label>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                      <button 
                          disabled={currentPage === 1} 
                          onClick={() => setCurrentPage(p => p - 1)}
                          className="disabled:opacity-30 hover:text-slate-900 transition"
                      >
                          &larr; Prev
                      </button>
                      <span>Page {currentPage} of {totalPages}</span>
                      <button 
                          disabled={currentPage === totalPages} 
                          onClick={() => setCurrentPage(p => p + 1)}
                          className="disabled:opacity-30 hover:text-slate-900 transition"
                      >
                          Next &rarr;
                      </button>
                  </div>
              )}
          </div>
      )}

      {loading ? (
          <div className="text-center py-10 text-slate-500 font-bold animate-pulse">Loading tasks...</div>
      ) : submissions.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-bold">No tasks found.</div>
      ) : (
          <div className="grid gap-4">
            {submissions.map((sub) => {
                const isSelected = selectedIds.has(sub._id);
                return (
                <div key={sub._id} className={`bg-white border p-6 rounded-2xl flex flex-col md:flex-row items-start gap-5 shadow-sm transition ${isSelected ? 'border-violet-500 ring-1 ring-violet-500' : 'border-slate-200 hover:shadow-md'}`}>
                    {filter === "Pending" && (
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 mt-1 accent-violet-600 cursor-pointer hidden md:block" 
                            checked={isSelected} 
                            onChange={() => toggleSelectOne(sub._id)} 
                        />
                    )}
                    
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-3 mb-2 w-full">
                            {filter === "Pending" && (
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 accent-violet-600 cursor-pointer md:hidden" 
                                    checked={isSelected} 
                                    onChange={() => toggleSelectOne(sub._id)} 
                                />
                            )}
                            <span className="font-bold text-slate-900 truncate">{sub.userId?.fullName}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{sub.platform}</span>
                        </div>
                        
                        <h4 className="text-slate-700 font-medium text-sm mb-2">{sub.taskId?.title}</h4>
                        <a href={sub.proofLink} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-bold hover:underline bg-blue-50 px-3 py-1.5 rounded-lg inline-block mb-3">View Proof ↗</a>
                        
                        <div className="text-xs text-slate-400 font-mono flex flex-wrap gap-4 items-center">
                            <span>{new Date(sub.createdAt).toLocaleString()}</span>
                            {filter === "Rejected" && sub.adminComment && (
                                <span className="text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                                    Reason: {sub.adminComment}
                                </span>
                            )}
                        </div>
                    </div>

                    {filter === "Pending" && (
                        <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                            <button onClick={() => handleDecision(sub._id, "Approved")} className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold border border-green-200">Approve</button>
                            <button onClick={() => setRejectModal({ isOpen: true, type: "single", id: sub._id })} className="flex-1 md:flex-none px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold border border-slate-200">Reject</button>
                        </div>
                    )}
                </div>
            )})}
          </div>
      )}
      
      {/* Bottom Pagination Controls */}
      {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4 text-sm font-bold text-slate-600 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 rounded-lg disabled:opacity-30 hover:bg-slate-200 transition"
              >
                  &larr; Previous Page
              </button>
              <span className="flex items-center">Page {currentPage} of {totalPages}</span>
              <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 rounded-lg disabled:opacity-30 hover:bg-slate-200 transition"
              >
                  Next Page &rarr;
              </button>
          </div>
      )}
    </div>
  );
}