


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