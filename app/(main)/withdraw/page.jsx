"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast, Toaster } from "react-hot-toast";

// --- MODAL 1: LINK ACCOUNT FORM ---
const LinkAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ fullName: "", phone: "", bankName: "", accountNumber: "", ifsc: "" });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/wallet/methods", { details: formData });
      toast.success("Account Linked!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to link account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-xl w-full max-w-lg p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">✕</button>
        <h2 className="text-xl font-bold mb-6 text-white">Add Bank Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Phone (+91)" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
                <input required placeholder="IFSC Code" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, ifsc: e.target.value})} />
            </div>
            <input required placeholder="Account Number" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
            <input required placeholder="Bank Name" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, bankName: e.target.value})} />

            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition">
               {loading ? "Linking..." : "Save Details"}
            </button>
        </form>
      </div>
    </div>
  );
};

// --- MODAL 2: REQUEST MONEY ---
const RequestPaymentModal = ({ isOpen, onClose, balance, linkedMethods, onSuccess }) => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleRequest = async () => {
        if (!amount || amount < 50) return toast.error("Minimum withdrawal is ₹50");
        if (amount > balance) return toast.error("Insufficient balance");

        setLoading(true);
        try {
            await api.post("/wallet/withdraw", { 
                amount: Number(amount), 
                methodId: linkedMethods[0]._id 
            });
            toast.success("Request Submitted!");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-xl w-full max-w-md p-8 relative shadow-2xl">
                <h2 className="text-xl font-bold mb-2">Request Payment</h2>
                <p className="text-sm text-slate-400 mb-6">Payments are processed every Tuesday.</p>
                
                <div className="mb-8">
                    <label className="text-xs font-bold text-slate-500 block mb-2">AMOUNT (₹)</label>
                    <input 
                        type="number" 
                        className="w-full text-4xl font-bold text-white border-b-2 border-slate-700 py-2 focus:border-blue-600 outline-none bg-transparent placeholder-slate-700" 
                        placeholder="0"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                    <p className="text-xs text-green-400 font-bold mt-2">Available: ₹{balance}</p>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700 transition">Cancel</button>
                    <button onClick={handleRequest} disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                        {loading ? "..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function WithdrawPage() {
  const [user, setUser] = useState(null);
  const [methods, setMethods] = useState([]); 
  const [history, setHistory] = useState([]); 
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const fetchData = async () => {
    try {
        const [uRes, mRes, hRes] = await Promise.all([
            api.get("/users/me"),
            api.get("/wallet/methods"),
            api.get("/wallet/history")
        ]);
        setUser(uRes.data.user);
        setMethods(mRes.data.methods);
        setHistory(hRes.data.history);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const hasLinkedAccount = methods.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="top-right" />
      
      {/* Balance Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Current Balance</p>
            <h2 className="text-5xl font-black text-white">₹ {user?.walletBalance || 0}</h2>
        </div>
        {hasLinkedAccount && (
             <button 
                onClick={() => setShowRequestModal(true)}
                className="bg-white text-slate-900 hover:bg-slate-200 py-3 px-6 rounded-xl font-bold shadow-xl shadow-white/10 transition flex items-center gap-2"
            >
                <span>Request Payout</span>
                <span>→</span>
            </button>
        )}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl text-blue-200 text-sm flex gap-3 items-start">
           <span className="text-xl">ℹ️</span>
           <p className="leading-relaxed">
               Payments are processed automatically every <strong>Tuesday</strong>. 
               <br/>You can manually request a withdrawal if you need funds urgently.
           </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
           {/* Payment Method Card */}
           <div>
               <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wide">Linked Bank Account</h3>
               {hasLinkedAccount ? (
                   <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ACTIVE</div>
                       <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center text-xl font-bold">🏦</div>
                           <div>
                               <h3 className="text-lg font-bold text-white">{methods[0].details.bankName}</h3>
                               <p className="text-slate-400 text-sm font-mono">**** {methods[0].details.accountNumber.slice(-4)}</p>
                           </div>
                       </div>
                       <button onClick={() => setShowLinkModal(true)} className="text-blue-400 text-xs font-bold hover:text-white transition uppercase tracking-wider">
                           Edit Details
                       </button>
                   </div>
               ) : (
                   <button onClick={() => setShowLinkModal(true)} className="w-full bg-slate-800/50 p-6 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-center h-32 hover:border-blue-500 hover:bg-slate-800 transition group">
                       <div className="text-slate-400 group-hover:text-blue-500 mb-2 font-bold text-2xl">+</div>
                       <h3 className="font-bold text-slate-400 group-hover:text-white">Add Bank Account</h3>
                   </button>
               )}
           </div>

           {/* Coming Soon Card */}
           <div className="opacity-50 pointer-events-none">
                <h3 className="text-slate-500 font-bold mb-4 uppercase text-sm tracking-wide">Crypto (USDT)</h3>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center h-32">
                     <h3 className="font-bold text-slate-500">Coming Soon</h3>
                </div>
           </div>
      </div>

      {/* Transaction History */}
      <div>
           <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wide">Recent Transactions</h3>
           
           {history.length === 0 ? (
               <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-800">
                   <p className="text-slate-500">No withdrawals yet.</p>
               </div>
           ) : (
               <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                   {history.map((tx) => (
                       <div key={tx._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition gap-4">
                           <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                   tx.status === 'Processed' ? 'bg-green-900/30 text-green-400' : 
                                   tx.status === 'Rejected' ? 'bg-red-900/30 text-red-400' : 
                                   'bg-yellow-900/30 text-yellow-400'
                               }`}>
                                   {tx.status === 'Processed' ? '✓' : tx.status === 'Rejected' ? '✕' : '⏳'}
                               </div>
                               <div>
                                   <h4 className="font-bold text-white">
                                       {tx.status === 'Rejected' ? 'Request Rejected' : 'Withdrawal to Bank'}
                                   </h4>
                                   <p className="text-xs text-slate-500">
                                       {new Date(tx.createdAt).toLocaleDateString()}
                                   </p>
                                   {tx.transactionId && tx.transactionId !== "N/A" && (
                                       <div className="mt-1">
                                           <code className="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
                                               UTR: {tx.transactionId}
                                           </code>
                                       </div>
                                   )}
                                   {tx.status === 'Rejected' && tx.adminComment && (
                                       <p className="text-xs text-red-400 mt-1">Reason: {tx.adminComment}</p>
                                   )}
                               </div>
                           </div>
                           <div className="text-right">
                               <p className="font-bold text-white text-lg">₹{tx.amount}</p>
                               <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded inline-block mt-1 ${
                                   tx.status === 'Processed' ? 'bg-green-500/10 text-green-400' : 
                                   tx.status === 'Rejected' ? 'bg-red-500/10 text-red-400' : 
                                   'bg-yellow-500/10 text-yellow-400'
                               }`}>
                                   {tx.status}
                               </span>
                           </div>
                       </div>
                   ))}
               </div> 
           )}
      </div>

      {/* Render Modals */}
      <LinkAccountModal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} onSuccess={fetchData} />
      <RequestPaymentModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} balance={user?.walletBalance || 0} linkedMethods={methods} onSuccess={fetchData} />
    </div>
  );
}