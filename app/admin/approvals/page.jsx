// "use client";
// import { useState, useEffect } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import api from "@/lib/axios"; 

// export default function ApprovalsPage() {
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("Pending");
//   const [selectedIds, setSelectedIds] = useState([]); // <--- New State for Checkboxes

//   useEffect(() => {
//     fetchSubmissions();
//     setSelectedIds([]); // Reset selection on filter change
//   }, [filter]);

//   const fetchSubmissions = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get(`/admin/submissions?status=${filter}`);
//       setSubmissions(data.submissions);
//     } catch (error) {
//       toast.error("Failed to load");
//     } finally {  
//       setLoading(false);
//     }
//   };

//   const handleDecision = async (id, decision) => {
//     try {
//       await api.post("/admin/decide", { submissionId: id, decision });
//       toast.success(`${decision} successfully!`);
//       setSubmissions(prev => prev.filter(s => s._id !== id));
//     } catch (error) {
//       toast.error("Action failed");
//     }
//   };

//   // --- NEW: Handle Bulk Actions ---
//   const handleBulkAction = async (decision) => {
//     if (selectedIds.length === 0) return;
//     if (!confirm(`Are you sure you want to ${decision} ${selectedIds.length} tasks?`)) return;

//     const toastId = toast.loading(`Processing ${selectedIds.length} tasks...`);
    
//     try {
//         // We can loop through IDs or create a new bulk API endpoint. 
//         // Loop is simpler for now without changing backend logic deeply.
//         await Promise.all(selectedIds.map(id => 
//             api.post("/admin/decide", { submissionId: id, decision })
//         ));

//         toast.success(`Batch ${decision} Complete!`, { id: toastId });
//         setSubmissions(prev => prev.filter(s => !selectedIds.includes(s._id)));
//         setSelectedIds([]);
//     } catch (error) {
//         toast.error("Some actions failed", { id: toastId });
//         // Refresh to see what actually happened
//         fetchSubmissions();
//     }
//   };

//   const toggleSelectAll = (e) => {
//     if (e.target.checked) {
//         setSelectedIds(submissions.map(s => s._id));
//     } else {
//         setSelectedIds([]);
//     }
//   };

//   const toggleSelectOne = (id) => {
//     if (selectedIds.includes(id)) {
//         setSelectedIds(prev => prev.filter(i => i !== id));
//     } else {
//         setSelectedIds(prev => [...prev, id]);
//     }
//   };

//   return (
//     <div>
//       <Toaster position="top-right" />
      
//       {/* --- HEADER & FILTER --- */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//           <div className="flex items-center gap-4">
//             <h1 className="text-3xl font-bold text-white">
//                 {filter} <span className="text-slate-500 text-lg">({submissions.length})</span>
//             </h1>
//             {/* BULK ACTION BUTTONS (Only visible if items selected) */}
//             {selectedIds.length > 0 && filter === "Pending" && (
//                 <div className="flex gap-2 animate-pulse">
//                     <button onClick={() => handleBulkAction("Approved")} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold shadow-lg shadow-green-900/20">
//                         Approve ({selectedIds.length})
//                     </button>
//                     <button onClick={() => handleBulkAction("Rejected")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold">
//                         Reject ({selectedIds.length})
//                     </button>
//                 </div>
//             )}
//           </div>
          
//           <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
//               {["Pending", "Approved", "Rejected"].map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => setFilter(status)}
//                     className={`px-4 py-2 rounded-md text-sm font-bold transition ${
//                         filter === status ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"
//                     }`}
//                   >
//                     {status}
//                   </button>
//               ))}
//           </div>
//       </div>

//       {/* --- SELECT ALL CHECKBOX --- */}
//       {submissions.length > 0 && filter === "Pending" && (
//           <div className="mb-4 flex items-center gap-2 text-slate-400 text-sm pl-2">
//               <input 
//                 type="checkbox" 
//                 className="w-4 h-4 accent-blue-600"
//                 checked={selectedIds.length === submissions.length}
//                 onChange={toggleSelectAll}
//               />
//               <span>Select All</span>
//           </div>
//       )}

//       {loading ? (
//         <div className="text-white p-10 text-center">Loading...</div>
//       ) : submissions.length === 0 ? (
//         <div className="text-slate-500 text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
//             No {filter.toLowerCase()} submissions found.
//         </div>
//       ) : (
//         <div className="grid gap-4">
//           {submissions.map((sub) => (
//             <div key={sub._id} className={`bg-slate-900 border p-4 rounded-xl flex items-start gap-4 transition ${selectedIds.includes(sub._id) ? 'border-blue-500 bg-blue-900/10' : 'border-slate-800'}`}>
              
//               {/* CHECKBOX (Only for Pending) */}
//               {filter === "Pending" && (
//                   <div className="pt-1">
//                     <input 
//                         type="checkbox" 
//                         className="w-5 h-5 accent-blue-600 cursor-pointer"
//                         checked={selectedIds.includes(sub._id)}
//                         onChange={() => toggleSelectOne(sub._id)}
//                     />
//                   </div>
//               )}

//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-1">
//                     <span className="font-bold text-white">{sub.userId?.fullName || "Unknown"}</span>
//                     <span className="text-xs text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-700 font-mono">{sub.platform}</span>
//                 </div>
                
//                 <h4 className="text-slate-300 font-medium text-sm mb-1">{sub.taskId?.title}</h4>
//                 <a href={sub.proofLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-xs break-all block mb-2">{sub.proofLink}</a>
                
//                 <div className="flex gap-4 text-[10px] text-slate-500 mt-2">
//                     <span>{new Date(sub.createdAt).toLocaleString()}</span>
//                     {filter === "Rejected" && sub.adminComment && (
//                         <span className="text-red-400 font-bold">Reason: {sub.adminComment}</span>
//                     )}
//                 </div>
//               </div>

//               {/* INDIVIDUAL ACTIONS */}
//               {filter === "Pending" ? (
//                   <div className="flex flex-col gap-2">
//                     <button onClick={() => handleDecision(sub._id, "Approved")} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold">Approve</button>
//                     <button onClick={() => handleDecision(sub._id, "Rejected")} className="px-3 py-1 bg-slate-800 hover:bg-red-900/50 text-red-400 border border-slate-700 rounded text-xs font-bold">Reject</button>
//                   </div>
//               ) : (
//                   <div className="px-3 py-1 rounded border bg-slate-950 border-slate-800 self-center">
//                       <span className={`font-bold text-xs ${filter === "Approved" ? "text-green-500" : "text-red-500"}`}>
//                           {filter === "Approved" ? "Approved" : "Rejected"}
//                       </span>
//                   </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }    

"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios"; 

export default function ApprovalsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => { fetchSubmissions(); setSelectedIds([]); }, [filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try { const { data } = await api.get(`/admin/submissions?status=${filter}`); setSubmissions(data.submissions); } 
    catch (error) { toast.error("Failed to load"); } finally { setLoading(false); }
  };

  const handleDecision = async (id, decision) => {
    try { await api.post("/admin/decide", { submissionId: id, decision }); toast.success(decision); setSubmissions(prev => prev.filter(s => s._id !== id)); } catch(e){ toast.error("Error"); }
  };

  const handleBulkAction = async (decision) => {
    if (!confirm(`Bulk ${decision}?`)) return;
    try { await Promise.all(selectedIds.map(id => api.post("/admin/decide", { submissionId: id, decision }))); toast.success("Bulk Action Complete"); fetchSubmissions(); setSelectedIds([]); } catch(e){ toast.error("Failed"); }
  };

  const toggleSelectOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900">{filter} <span className="text-slate-400 text-lg font-medium">({submissions.length})</span></h1>
            {selectedIds.length > 0 && filter === "Pending" && (
                <div className="flex gap-2">
                    <button onClick={() => handleBulkAction("Approved")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-green-200">Approve ({selectedIds.length})</button>
                    <button onClick={() => handleBulkAction("Rejected")} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-red-200">Reject ({selectedIds.length})</button>
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

      <div className="grid gap-4">
        {submissions.map((sub) => (
            <div key={sub._id} className={`bg-white border p-6 rounded-2xl flex items-start gap-5 shadow-sm transition ${selectedIds.includes(sub._id) ? 'border-violet-500 ring-1 ring-violet-500' : 'border-slate-200 hover:shadow-md'}`}>
                {filter === "Pending" && <input type="checkbox" className="w-5 h-5 mt-1 accent-violet-600" checked={selectedIds.includes(sub._id)} onChange={() => toggleSelectOne(sub._id)} />}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-slate-900">{sub.userId?.fullName}</span>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{sub.platform}</span>
                    </div>
                    <h4 className="text-slate-700 font-medium text-sm mb-2">{sub.taskId?.title}</h4>
                    <a href={sub.proofLink} target="_blank" className="text-blue-600 text-xs font-bold hover:underline bg-blue-50 px-3 py-1.5 rounded-lg inline-block mb-3">View Proof ↗</a>
                    <div className="text-xs text-slate-400 font-mono">{new Date(sub.createdAt).toLocaleString()}</div>
                </div>
                {filter === "Pending" && (
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleDecision(sub._id, "Approved")} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold border border-green-200">Approve</button>
                        <button onClick={() => handleDecision(sub._id, "Rejected")} className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold border border-slate-200">Reject</button>
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
} 