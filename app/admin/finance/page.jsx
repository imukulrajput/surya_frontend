// "use client";
// import { useState, useEffect } from "react";
// import api from "@/lib/axios";
// import { toast, Toaster } from "react-hot-toast";

// // --- Action Modal (Approve/Reject) ---
// const ActionModal = ({ isOpen, onClose, request, action, onSuccess }) => {
//     const [inputValue, setInputValue] = useState("");
//     const [loading, setLoading] = useState(false);

//     if (!isOpen) return null;

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             await api.post(`/admin/withdrawals/${request._id}`, {
//                 action: action, // "approve" or "reject"
//                 transactionId: action === 'approve' ? inputValue : undefined,
//                 comment: action === 'reject' ? inputValue : undefined
//             });
//             toast.success(`Request ${action}ed!`);
//             onSuccess();
//             onClose();
//         } catch (error) {
//             toast.error("Failed to process");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//             <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md">
//                 <h3 className={`text-xl font-bold mb-4 ${action === 'approve' ? 'text-green-400' : 'text-red-400'}`}>
//                     {action === 'approve' ? 'Approve Payment' : 'Reject Request'}
//                 </h3>
                
//                 <p className="text-slate-300 mb-4 text-sm">
//                     User: <span className="text-white font-bold">{request.userId.fullName}</span><br/>
//                     Amount: <span className="text-white font-bold">₹{request.amount}</span>
//                 </p>

//                 <label className="block text-slate-400 text-xs font-bold mb-2">
//                     {action === 'approve' ? 'ENTER TRANSACTION ID (UTR):' : 'REASON FOR REJECTION:'}
//                 </label>
//                 <input 
//                     type="text" 
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     className="w-full bg-slate-950 border border-slate-700 p-3 rounded text-white mb-6 outline-none focus:border-blue-500"
//                     placeholder={action === 'approve' ? 'e.g. 345281903' : 'e.g. Invalid bank details'}
//                 />

//                 <div className="flex gap-3">
//                     <button onClick={onClose} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
//                     <button 
//                         onClick={handleSubmit} 
//                         disabled={loading}
//                         className={`flex-1 py-2 rounded font-bold text-white ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
//                     >
//                         {loading ? "Processing..." : "Confirm"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default function FinancePage() {
//     const [withdrawals, setWithdrawals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modalData, setModalData] = useState(null); // { request, action }

//     const fetchWithdrawals = async () => {
//         try {
//             const { data } = await api.get("/admin/withdrawals");
//             setWithdrawals(data.withdrawals);
//         } catch (error) {
//             toast.error("Failed to load data");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => { fetchWithdrawals(); }, []);

//     // --- NEW: Handle CSV Export ---
//     const handleExport = async () => {
//         try {
//             const response = await api.get('/admin/withdrawals/export', { responseType: 'blob' });
//             // Create a download link programmatically
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', 'pending_payouts.csv');
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             toast.success("Payout List Downloaded!");
//         } catch (error) {
//             toast.error("Export Failed");
//         }
//     };

//     // Helper to format bank details object into text
//     const formatDetails = (details) => {
//         if (!details) return "N/A";
//         const d = typeof details === 'string' ? JSON.parse(details) : details;
//         return (
//             <div className="text-xs text-slate-400 space-y-1">
//                 <p><strong className="text-slate-300">Bank:</strong> {d.bankName}</p>
//                 <p><strong className="text-slate-300">Acct:</strong> {d.accountNumber}</p>
//                 <p><strong className="text-slate-300">IFSC:</strong> {d.ifsc}</p>
//                 <p><strong className="text-slate-300">Name:</strong> {d.fullName}</p>
//             </div>
//         );
//     };

//     return (
//         <div className="min-h-screen text-white">
//             <Toaster position="top-right" />
            
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">Finance & Payouts</h1>
                
//                 {/* --- EXPORT BUTTON --- */}
//                 <button 
//                     onClick={handleExport}
//                     className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold border border-slate-700 transition"
//                 >
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
//                     </svg>
//                     Export CSV
//                 </button>
//             </div>

//             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
//                 <table className="w-full text-left">
//                     <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-bold">
//                         <tr>
//                             <th className="p-4">User</th>
//                             <th className="p-4">Amount</th>
//                             <th className="p-4">Bank Details</th>
//                             <th className="p-4">Status</th>
//                             <th className="p-4 text-right">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-800">
//                         {loading ? (
//                             <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading...</td></tr>
//                         ) : withdrawals.length === 0 ? (
//                             <tr><td colSpan="5" className="p-8 text-center text-slate-500">No withdrawal requests found.</td></tr>
//                         ) : (
//                             withdrawals.map((req) => (
//                                 <tr key={req._id} className="hover:bg-slate-800/50 transition">
//                                     <td className="p-4">
//                                         <p className="font-bold text-white">{req.userId?.fullName || "Unknown"}</p>
//                                         <p className="text-xs text-slate-500">{req.userId?.email}</p>
//                                         <p className="text-[10px] text-slate-600 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
//                                     </td>
//                                     <td className="p-4 font-mono text-green-400 font-bold text-lg">
//                                         ₹{req.amount}
//                                     </td>
//                                     <td className="p-4">
//                                         {formatDetails(req.details)}
//                                     </td>
//                                     <td className="p-4">
//                                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
//                                             req.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
//                                             req.status === 'Processed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
//                                             'bg-red-500/10 text-red-500 border border-red-500/20'
//                                         }`}>
//                                             {req.status}
//                                         </span>
//                                         {req.transactionId && req.status === 'Processed' && (
//                                             <p className="text-[10px] text-slate-500 mt-1">UTR: {req.transactionId}</p>
//                                         )}
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         {req.status === 'Pending' && (
//                                             <div className="flex justify-end gap-2">
//                                                 <button 
//                                                     onClick={() => setModalData({ request: req, action: 'approve' })}
//                                                     className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition"
//                                                 >
//                                                     Pay
//                                                 </button>
//                                                 <button 
//                                                     onClick={() => setModalData({ request: req, action: 'reject' })}
//                                                     className="px-3 py-1 bg-slate-800 hover:bg-red-600 text-white text-xs font-bold rounded transition"
//                                                 >
//                                                     Reject
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Action Modal */}
//             <ActionModal 
//                 isOpen={!!modalData} 
//                 onClose={() => setModalData(null)}
//                 request={modalData?.request}
//                 action={modalData?.action}
//                 onSuccess={fetchWithdrawals}
//             />
//         </div>
//     );
// }


"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast, Toaster } from "react-hot-toast";

const formatDetails = (details) => {
    if (!details) return "N/A";
    const d = typeof details === 'string' ? JSON.parse(details) : details;
    return (
        <div className="text-xs text-slate-500 space-y-1 font-mono">
            <p><strong className="text-slate-700">Bank:</strong> {d.bankName}</p>
            <p><strong className="text-slate-700">Acct:</strong> {d.accountNumber}</p>
            <p><strong className="text-slate-700">IFSC:</strong> {d.ifsc}</p>
            <p><strong className="text-slate-700">Name:</strong> {d.fullName}</p>
        </div>
    );
};

export default function FinancePage() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWithdrawals = async () => {
        try { const { data } = await api.get("/admin/withdrawals"); setWithdrawals(data.withdrawals); } catch(e){} finally { setLoading(false); }
    };
    useEffect(() => { fetchWithdrawals(); }, []);

    const handleAction = async (id, action) => {
        if(!confirm(`Confirm ${action}?`)) return;
        try { 
            await api.post(`/admin/withdrawals/${id}`, { action, transactionId: action === 'approve' ? prompt("Enter UTR:") : undefined, comment: action === 'reject' ? prompt("Reason:") : undefined });
            toast.success("Processed"); fetchWithdrawals();
        } catch(e) { toast.error("Failed"); }
    };

    const handleExport = async () => {
       try {
           const response = await api.get('/admin/withdrawals/export', { responseType: 'blob' });
           const url = window.URL.createObjectURL(new Blob([response.data]));
           const link = document.createElement('a');
           link.href = url;
           link.setAttribute('download', 'payouts.csv');
           document.body.appendChild(link);
           link.click();
           link.remove();
           toast.success("Downloaded");
       } catch(e) { toast.error("Export Failed"); }
    };

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Payouts</h1>
                <button onClick={handleExport} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">Export CSV</button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                        <tr><th className="p-5">User</th><th className="p-5">Amount</th><th className="p-5">Details</th><th className="p-5">Status</th><th className="p-5 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {withdrawals.map((req) => (
                            <tr key={req._id} className="hover:bg-slate-50/50">
                                <td className="p-5"><p className="font-bold text-slate-900">{req.userId?.fullName}</p><p className="text-xs text-slate-500">{req.userId?.email}</p></td>
                                <td className="p-5 font-bold text-green-600 text-lg font-mono">₹{req.amount}</td>
                                <td className="p-5">{formatDetails(req.details)}</td>
                                <td className="p-5"><span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : req.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span></td>
                                <td className="p-5 text-right">
                                    {req.status === 'Pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleAction(req._id, 'approve')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm">Pay</button>
                                            <button onClick={() => handleAction(req._id, 'reject')} className="px-3 py-1.5 bg-white border border-slate-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50">Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}