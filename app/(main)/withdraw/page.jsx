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
import { motion, AnimatePresence } from "framer-motion";

// --- Icons ---
const WalletIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const CheckCircle = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BankIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const ArrowRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>;
const PlusIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const ArrowUpRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;
const HistoryIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" 
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
                    >
                        <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 relative pointer-events-auto border border-slate-100">
                            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">{title}</h2>
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default function WithdrawPage() {
  const [user, setUser] = useState(null);
  const [methods, setMethods] = useState([]); 
  const [history, setHistory] = useState([]); 
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({ bankName: "", accountNumber: "", ifsc: "", fullName: "" });
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
        const [u, m, h] = await Promise.all([api.get("/users/me"), api.get("/wallet/methods"), api.get("/wallet/history")]);
        setUser(u.data.user); setMethods(m.data.methods); setHistory(h.data.history);
    } catch(e){} finally { setLoading(false); }
  };
  useEffect(() => { fetchData() }, []);

  // --- FIXED: Validation Logic Added ---
  const handleLink = async () => {
      // Check if all fields are filled
      if (!formData.bankName || !formData.accountNumber || !formData.ifsc || !formData.fullName) {
          return toast.error("Please fill all bank details.");
      }

      try { 
          await api.post("/wallet/methods", { details: formData }); 
          toast.success("Bank Account Linked!"); 
          setShowLinkModal(false); 
          fetchData(); 
          setFormData({ bankName: "", accountNumber: "", ifsc: "", fullName: "" }); // Reset form
      } catch(e){ 
          toast.error("Failed to link account"); 
      }
  };

  const handleWithdraw = async () => {
      if(amount < 50) return toast.error("Minimum withdrawal is ₹50");
      if(amount > user?.walletBalance) return toast.error("Insufficient balance");
      try { await api.post("/wallet/withdraw", { amount: Number(amount), methodId: methods[0]._id }); toast.success("Withdrawal Requested!"); setShowRequestModal(false); fetchData(); } catch(e){ toast.error(e.response?.data?.message || "Failed"); }
  };

  const pendingAmount = history.filter(t => t.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 md:px-8 max-w-5xl mx-auto relative">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', borderRadius: '12px' } }}/>

      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-violet-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
      </div>
      
      {/* --- Header --- */}
      <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">My Wallet</h1>
          <p className="text-slate-500 font-medium text-lg">Manage your earnings and payouts securely.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Cards --- */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Virtual Card */}
              <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-10 shadow-2xl shadow-slate-200/50 min-h-[320px] flex flex-col justify-between group"
              >
                  {/* Card Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-900 opacity-90" />
                  <div className="absolute -right-20 -top-20 w-80 h-80 bg-violet-500/30 rounded-full blur-[80px]" />
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                  
                  {/* Card Content */}
                  <div className="relative z-10 flex justify-between items-start">
                      <div>
                          <p className="text-violet-200 font-bold uppercase tracking-widest text-xs mb-1">Total Balance</p>
                          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">₹ {user?.walletBalance || 0}</h2>
                      </div>
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                          <WalletIcon />
                      </div>
                  </div>

                  <div className="relative z-10">
                      <div className="flex justify-between items-end mb-8">
                          <div>
                              <p className="text-slate-300 text-xs font-mono mb-1">CARD HOLDER</p>
                              <p className="font-bold text-lg tracking-wide uppercase">{user?.fullName || "USER"}</p>
                          </div>
                          {methods.length > 0 && (
                              <div className="text-right">
                                  <p className="text-slate-300 text-xs font-mono mb-1">LINKED BANK</p>
                                  <p className="font-bold text-lg tracking-wide uppercase">•••• {methods[0].details.accountNumber.slice(-4)}</p>
                              </div>
                          )}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-4">
                          {methods.length > 0 ? (
                              <button 
                                  onClick={() => setShowRequestModal(true)} 
                                  className="py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-violet-50 transition shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95 duration-200"
                              >
                                  Withdraw <ArrowUpRight />
                              </button>
                          ) : (
                              <button 
                                  onClick={() => setShowLinkModal(true)} 
                                  className="col-span-2 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-violet-50 transition shadow-lg flex items-center justify-center gap-2"
                              >
                                  <PlusIcon /> Link Bank Account
                              </button>
                          )}
                          {methods.length > 0 && (
                             <button 
                                 onClick={() => setShowLinkModal(true)} 
                                 className="py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition flex items-center justify-center gap-2"
                             >
                                 Update Bank
                             </button>
                          )}
                      </div>
                  </div>
              </motion.div>

              {/* Pending Balance Card */}
              {pendingAmount > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-50 border border-amber-100 rounded-[2rem] p-8 flex items-center justify-between shadow-sm"
                  >
                      <div>
                          <p className="text-amber-600 font-bold uppercase tracking-wider text-xs mb-1">Pending Processing</p>
                          <h3 className="text-3xl font-black text-slate-900">₹ {pendingAmount}</h3>
                      </div>
                      <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
                          <svg className="w-8 h-8 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                  </motion.div>
              )}
          </div>

          {/* --- Right Column: History --- */}
          <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-600"><HistoryIcon /></div>
                      <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-6 max-h-[500px] scrollbar-thin scrollbar-thumb-slate-200">
                      {history.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-3xl">💸</div>
                              <p className="text-sm font-bold text-slate-400">No transactions yet</p>
                          </div>
                      ) : history.map((tx, i) => (
                          <motion.div 
                              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                              key={tx._id} 
                              className="group flex justify-between items-start pb-6 border-b border-slate-50 last:border-0 last:pb-0"
                          >
                              <div className="flex gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                                      tx.status === 'Processed' ? 'bg-green-100 text-green-600' : 
                                      tx.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                  }`}>
                                      {tx.status === 'Rejected' ? '✕' : '↗'}
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900 text-sm">{tx.status === 'Rejected' ? 'Failed Payout' : 'Withdrawal'}</p>
                                      <p className="text-xs text-slate-400 font-medium mt-0.5">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                      {tx.status === 'Rejected' && <p className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-1 rounded mt-2">{tx.adminComment}</p>}
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="font-black text-slate-900">-₹{tx.amount}</p>
                                  <span className={`text-[10px] font-bold uppercase tracking-wide ${
                                      tx.status === 'Processed' ? 'text-green-500' : 
                                      tx.status === 'Rejected' ? 'text-red-500' : 'text-amber-500'
                                  }`}>{tx.status}</span>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* --- Modals --- */}
      
      {/* Link Bank Modal */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)} title="Link Bank Account">
          <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Secure Information</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Your bank details are encrypted and stored securely. All fields are mandatory.</p>
              </div>
              
              <input 
                placeholder="Bank Name" 
                value={formData.bankName}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold text-slate-700 placeholder-slate-400" 
                onChange={e => setFormData({...formData, bankName: e.target.value})} 
              />
              <input 
                placeholder="Account Number" 
                value={formData.accountNumber}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold text-slate-700 placeholder-slate-400" 
                onChange={e => setFormData({...formData, accountNumber: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="IFSC Code" 
                    value={formData.ifsc}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold text-slate-700 placeholder-slate-400" 
                    onChange={e => setFormData({...formData, ifsc: e.target.value})} 
                  />
                  <input 
                    placeholder="Holder Name" 
                    value={formData.fullName}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold text-slate-700 placeholder-slate-400" 
                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                  />
              </div>
              <button onClick={handleLink} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 mt-2">
                  <BankIcon /> Save Bank Details
              </button>
          </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Request Payout">
          <div className="text-center mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ENTER AMOUNT</p>
              <div className="relative inline-block">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300">₹</span>
                  <input 
                    type="number" 
                    autoFocus
                    className="w-full text-center text-6xl font-black text-slate-900 border-none outline-none placeholder-slate-200 bg-transparent py-4 pl-10" 
                    placeholder="0" 
                    onChange={e => setAmount(e.target.value)} 
                  />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-violet-50 rounded-lg text-violet-700 text-xs font-bold">
                  Available: ₹{user?.walletBalance}
              </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">To:</span>
              <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{methods[0]?.details.bankName}</p>
                  <p className="text-xs text-slate-400">**** {methods[0]?.details.accountNumber.slice(-4)}</p>
              </div>
          </div>

          <button onClick={handleWithdraw} className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all transform active:scale-95">
              Confirm Withdrawal
          </button>
      </Modal>

    </div>
  );
}