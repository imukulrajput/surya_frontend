// "use client";
// import { useState, useEffect } from "react";
// import api from "@/lib/axios";
// import { toast, Toaster } from "react-hot-toast";

// // --- MODAL 1: LINK ACCOUNT FORM ---
// const LinkAccountModal = ({ isOpen, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({ fullName: "", phone: "", bankName: "", accountNumber: "", ifsc: "" });
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("/wallet/methods", { details: formData });
//       toast.success("Account Linked!");
//       onSuccess();
//       onClose();
//     } catch (error) {
//       toast.error("Failed to link account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//       <div className="bg-slate-900 border border-slate-700 text-white rounded-xl w-full max-w-lg p-6 relative shadow-2xl">
//         <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold">✕</button>
//         <h2 className="text-xl font-bold mb-6 text-white">Add Bank Details</h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <input required placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, fullName: e.target.value})} />
//             <div className="grid grid-cols-2 gap-3">
//                 <input required placeholder="Phone (+91)" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, phone: e.target.value})} />
//                 <input required placeholder="IFSC Code" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, ifsc: e.target.value})} />
//             </div>
//             <input required placeholder="Account Number" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
//             <input required placeholder="Bank Name" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-white focus:border-blue-500 outline-none" onChange={e => setFormData({...formData, bankName: e.target.value})} />

//             <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition">
//                {loading ? "Linking..." : "Save Details"}
//             </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // --- MODAL 2: REQUEST MONEY ---
// const RequestPaymentModal = ({ isOpen, onClose, balance, linkedMethods, onSuccess }) => {
//     const [amount, setAmount] = useState("");
//     const [loading, setLoading] = useState(false);

//     if (!isOpen) return null;

//     const handleRequest = async () => {
//         if (!amount || amount < 50) return toast.error("Minimum withdrawal is ₹50");
//         if (amount > balance) return toast.error("Insufficient balance");

//         setLoading(true);
//         try {
//             await api.post("/wallet/withdraw", { 
//                 amount: Number(amount), 
//                 methodId: linkedMethods[0]._id 
//             });
//             toast.success("Request Submitted!");
//             onSuccess();
//             onClose();
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Request failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//             <div className="bg-slate-900 border border-slate-700 text-white rounded-xl w-full max-w-md p-8 relative shadow-2xl">
//                 <h2 className="text-xl font-bold mb-2">Request Payment</h2>
//                 <p className="text-sm text-slate-400 mb-6">Payments are processed every Tuesday.</p>
                
//                 <div className="mb-8">
//                     <label className="text-xs font-bold text-slate-500 block mb-2">AMOUNT (₹)</label>
//                     <input 
//                         type="number" 
//                         className="w-full text-4xl font-bold text-white border-b-2 border-slate-700 py-2 focus:border-blue-600 outline-none bg-transparent placeholder-slate-700" 
//                         placeholder="0"
//                         value={amount}
//                         onChange={e => setAmount(e.target.value)}
//                     />
//                     <p className="text-xs text-green-400 font-bold mt-2">Available: ₹{balance}</p>
//                 </div>

//                 <div className="flex gap-3">
//                     <button onClick={onClose} className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700 transition">Cancel</button>
//                     <button onClick={handleRequest} disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
//                         {loading ? "..." : "Confirm"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // --- MAIN PAGE ---
// export default function WithdrawPage() {
//   const [user, setUser] = useState(null);
//   const [methods, setMethods] = useState([]); 
//   const [history, setHistory] = useState([]); 
//   const [showLinkModal, setShowLinkModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);

//   const fetchData = async () => {
//     try {
//         const [uRes, mRes, hRes] = await Promise.all([
//             api.get("/users/me"),
//             api.get("/wallet/methods"),
//             api.get("/wallet/history") 
//         ]);
//         setUser(uRes.data.user);
//         setMethods(mRes.data.methods);
//         setHistory(hRes.data.history);
//     } catch (e) { console.error(e); }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const hasLinkedAccount = methods.length > 0;
  
//   // BUG FIX #4: Calculate Pending Withdrawals to show user where money went
//   const pendingAmount = history
//     .filter(t => t.status === 'Pending')
//     .reduce((acc, curr) => acc + curr.amount, 0);

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       <Toaster position="top-right" />
      
//       {/* Balance Header Grid */}
//       <div className="grid md:grid-cols-2 gap-6">
//           {/* Card 1: Available Balance */}
//           <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 shadow-xl">
//              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
//              <h2 className="text-5xl font-black text-white mb-4">₹ {user?.walletBalance || 0}</h2>
             
//              {hasLinkedAccount && (
//                   <button 
//                     onClick={() => setShowRequestModal(true)}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition flex items-center justify-center gap-2"
//                   >
//                     <span>Request Payout</span>
//                   </button>
//              )}
//           </div>

//           {/* Card 2: Pending Withdrawal (Fixes Confusion) */}
//           <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-center">
//              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Processing</p>
//              <h2 className="text-4xl font-bold text-yellow-400 mb-2">₹ {pendingAmount}</h2>
//              <p className="text-xs text-slate-500">
//                 This amount has been deducted from your wallet and is waiting for admin approval.
//              </p>
//           </div>
//       </div>

//       <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl text-blue-200 text-sm flex gap-3 items-start">
//            <span className="text-xl">ℹ️</span>
//            <p className="leading-relaxed">
//                Payments are processed automatically every <strong>Tuesday</strong>. 
//                <br/>You can manually request a withdrawal if you need funds urgently.
//            </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//            {/* Payment Method Card */}
//            <div>
//                <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wide">Linked Bank Account</h3>
//                {hasLinkedAccount ? (
//                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative overflow-hidden group">
//                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">ACTIVE</div>
//                        <div className="flex items-center gap-4 mb-4">
//                            <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center text-xl font-bold">🏦</div>
//                            <div>
//                                <h3 className="text-lg font-bold text-white">{methods[0].details.bankName}</h3>
//                                <p className="text-slate-400 text-sm font-mono">**** {methods[0].details.accountNumber.slice(-4)}</p>
//                            </div>
//                        </div>
//                        <button onClick={() => setShowLinkModal(true)} className="text-blue-400 text-xs font-bold hover:text-white transition uppercase tracking-wider">
//                            Edit Details
//                        </button>
//                    </div>
//                ) : (
//                    <button onClick={() => setShowLinkModal(true)} className="w-full bg-slate-800/50 p-6 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-center h-32 hover:border-blue-500 hover:bg-slate-800 transition group">
//                        <div className="text-slate-400 group-hover:text-blue-500 mb-2 font-bold text-2xl">+</div>
//                        <h3 className="font-bold text-slate-400 group-hover:text-white">Add Bank Account</h3>
//                    </button>
//                )}
//            </div>

//            {/* Coming Soon Card */}
//            <div className="opacity-50 pointer-events-none">
//                 <h3 className="text-slate-500 font-bold mb-4 uppercase text-sm tracking-wide">Crypto (USDT)</h3>
//                 <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center h-32">
//                      <h3 className="font-bold text-slate-500">Coming Soon</h3>
//                 </div>
//            </div>
//       </div>

//       {/* Transaction History */}
//       <div>
//            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-wide">Recent Transactions</h3>
           
//            {history.length === 0 ? (
//                <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-800">
//                    <p className="text-slate-500">No withdrawals yet.</p>
//                </div>
//            ) : (
//                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
//                    {history.map((tx) => (
//                        <div key={tx._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition gap-4">
//                            <div className="flex items-center gap-4">
//                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
//                                    tx.status === 'Processed' ? 'bg-green-900/30 text-green-400' : 
//                                    tx.status === 'Rejected' ? 'bg-red-900/30 text-red-400' : 
//                                    'bg-yellow-900/30 text-yellow-400'
//                                }`}>
//                                    {tx.status === 'Processed' ? '✓' : tx.status === 'Rejected' ? '✕' : '⏳'}
//                                </div>
//                                <div>
//                                    <h4 className="font-bold text-white">
//                                            {tx.status === 'Rejected' ? 'Request Rejected' : 'Withdrawal to Bank'}
//                                    </h4>
//                                    <p className="text-xs text-slate-500">
//                                            {new Date(tx.createdAt).toLocaleDateString()}
//                                    </p>
//                                    {tx.transactionId && tx.transactionId !== "N/A" && (
//                                            <div className="mt-1">
//                                                    <code className="bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
//                                                            UTR: {tx.transactionId}
//                                                    </code>
//                                            </div>
//                                    )}
//                                    {tx.status === 'Rejected' && tx.adminComment && (
//                                            <p className="text-xs text-red-400 mt-1">Reason: {tx.adminComment}</p>
//                                    )}
//                                </div>
//                            </div>
//                            <div className="text-right">
//                                <p className="font-bold text-white text-lg">₹{tx.amount}</p>
//                                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded inline-block mt-1 ${
//                                    tx.status === 'Processed' ? 'bg-green-500/10 text-green-400' : 
//                                    tx.status === 'Rejected' ? 'bg-red-500/10 text-red-400' : 
//                                    'bg-yellow-500/10 text-yellow-400'
//                                }`}>
//                                    {tx.status}
//                                </span>
//                            </div>
//                        </div>
//                    ))}
//                </div> 
//            )}
//       </div>

//       {/* Render Modals */}
//       <LinkAccountModal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} onSuccess={fetchData} />
//       <RequestPaymentModal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} balance={user?.walletBalance || 0} linkedMethods={methods} onSuccess={fetchData} />
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast, Toaster } from "react-hot-toast";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default function WithdrawPage() {
  const [user, setUser] = useState(null);
  const [methods, setMethods] = useState([]); 
  const [history, setHistory] = useState([]); 
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [amount, setAmount] = useState("");

  const fetchData = async () => {
    try {
        const [u, m, h] = await Promise.all([api.get("/users/me"), api.get("/wallet/methods"), api.get("/wallet/history")]);
        setUser(u.data.user); setMethods(m.data.methods); setHistory(h.data.history);
    } catch(e){}
  };
  useEffect(() => { fetchData() }, []);

  const handleLink = async () => {
      try { await api.post("/wallet/methods", { details: formData }); toast.success("Linked!"); setShowLinkModal(false); fetchData(); } catch(e){ toast.error("Failed"); }
  };

  const handleWithdraw = async () => {
      if(amount < 50) return toast.error("Min ₹50");
      try { await api.post("/wallet/withdraw", { amount: Number(amount), methodId: methods[0]._id }); toast.success("Requested!"); setShowRequestModal(false); fetchData(); } catch(e){ toast.error(e.response?.data?.message || "Failed"); }
  };

  const pendingAmount = history.filter(t => t.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="top-center" />
      
      <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-violet-200">
             <p className="text-violet-200 font-bold uppercase tracking-wider text-sm mb-1">Available Balance</p>
             <h2 className="text-5xl font-black mb-6">₹ {user?.walletBalance || 0}</h2>
             {methods.length > 0 && (
                 <button onClick={() => setShowRequestModal(true)} className="w-full bg-white text-violet-700 py-3.5 rounded-xl font-bold hover:bg-violet-50 transition shadow-lg">Request Payout</button>
             )}
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
             <p className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-1">Pending Processing</p>
             <h2 className="text-4xl font-black text-slate-800 mb-2">₹ {pendingAmount}</h2>
             <p className="text-xs text-slate-500">Deducted from wallet, waiting for approval.</p>
          </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
           {methods.length > 0 ? (
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                   <div className="flex justify-between items-start mb-4">
                       <div>
                           <h3 className="font-bold text-slate-700 text-lg">{methods[0].details.bankName}</h3>
                           <p className="text-slate-500 font-mono">**** {methods[0].details.accountNumber.slice(-4)}</p>
                       </div>
                       <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
                   </div>
                   <button onClick={() => setShowLinkModal(true)} className="text-violet-600 text-sm font-bold hover:underline">Edit Details</button>
               </div>
           ) : (
               <button onClick={() => setShowLinkModal(true)} className="w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-violet-400 hover:text-violet-600 transition bg-slate-50 hover:bg-violet-50">
                   <span className="text-2xl font-bold">+</span>
                   <span className="font-bold text-sm">Add Bank Account</span>
               </button>
           )}
      </div>

      <div>
           <h3 className="font-bold text-slate-800 text-lg mb-4">Transaction History</h3>
           <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
               {history.length === 0 ? <p className="p-8 text-center text-slate-400">No transactions yet.</p> : history.map(tx => (
                   <div key={tx._id} className="flex justify-between items-center p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                       <div>
                           <p className="font-bold text-slate-800">{tx.status === 'Rejected' ? 'Request Rejected' : 'Withdrawal to Bank'}</p>
                           <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                           {tx.status === 'Rejected' && <p className="text-xs text-red-500 mt-1">{tx.adminComment}</p>}
                       </div>
                       <div className="text-right">
                           <p className="font-bold text-slate-800">₹{tx.amount}</p>
                           <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${tx.status === 'Processed' ? 'bg-green-100 text-green-700' : tx.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{tx.status}</span>
                       </div>
                   </div>
               ))}
           </div>
      </div>

      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title="Link Bank Account">
          <div className="space-y-4">
              <input placeholder="Bank Name" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" onChange={e => setFormData({...formData, bankName: e.target.value})} />
              <input placeholder="Account Number" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
              <input placeholder="IFSC Code" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" onChange={e => setFormData({...formData, ifsc: e.target.value})} />
              <input placeholder="Account Holder Name" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" onChange={e => setFormData({...formData, fullName: e.target.value})} />
              <button onClick={handleLink} className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition">Save Details</button>
          </div>
      </Modal>

      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Withdraw Money">
          <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 block mb-2">AMOUNT (₹)</label>
              <input type="number" className="w-full text-4xl font-black text-slate-800 border-b-2 border-slate-200 py-2 outline-none focus:border-violet-600 placeholder-slate-300" placeholder="0" onChange={e => setAmount(e.target.value)} />
              <p className="text-xs text-slate-500 mt-2">Available: ₹{user?.walletBalance}</p>
          </div>
          <button onClick={handleWithdraw} className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition shadow-lg shadow-violet-200">Confirm Withdrawal</button>
      </Modal>
    </div>
  );
}