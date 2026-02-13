// "use client";
// import { useState, useEffect } from "react";
// import api from "@/lib/axios";
// import { toast } from "react-hot-toast";

// // --- Icons ---
// const CheckCircleIcon = ({ className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
//   </svg>
// );

// const TrashIcon = ({ className }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//   </svg>
// );

// const CopyIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
//     </svg>
// );

// // --- Custom Confirmation Modal ---
// const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
//     if (!isOpen) return null;
//     return (
//         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
//             <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl p-6 shadow-2xl relative">
//                 <h3 className="text-lg font-bold text-white mb-2">Unlink Account?</h3>
//                 <p className="text-slate-400 text-sm mb-6">
//                     Are you sure you want to remove this account? You will lose any progress associated with it.
//                 </p>
//                 <div className="flex gap-3">
//                     <button 
//                         onClick={onClose} 
//                         disabled={loading}
//                         className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700 transition"
//                     >
//                         Cancel
//                     </button>
//                     <button 
//                         onClick={onConfirm} 
//                         disabled={loading}
//                         className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20"
//                     >
//                         {loading ? "Removing..." : "Yes, Remove"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default function SocialLinker({ onSuccess }) {
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(1);
//   const [platform, setPlatform] = useState("Moj");
//   const [url, setUrl] = useState("");
//   const [verificationCode, setVerificationCode] = useState(null);
  
//   const [linkedAccounts, setLinkedAccounts] = useState([]);
  
//   // --- NEW: Modal State ---
  

//   useEffect(() => {
//     fetchAccounts();
//   }, []);

//   const fetchAccounts = async () => {
//     try {
//         const { data } = await api.get("/users/me");
//         setLinkedAccounts(data.user.linkedAccounts || []);
//     } catch (e) {
//         console.error("Failed to fetch accounts");
//     }
//   };

//   const generateCode = async () => {
//     setLoading(true);
//     try {
//         const { data } = await api.get("/social/generate-code");
//         setVerificationCode(data.code);
//         setStep(2);
//     } catch (error) {
//         toast.error("Failed to generate code");
//     } finally {
//         setLoading(false);
//     }
//   };

//   const verifyAccount = async () => {
//     if (!url) return toast.error("Please enter your profile URL");
    
//     setLoading(true);
//     const toastId = toast.loading("Verifying bio & linking...");

//     try {
//       const cleanUrl = url.trim();
//       await api.post("/social/verify", { 
//         platform, 
//         profileUrl: cleanUrl 
//       });

//       toast.success("Account Linked Successfully!", { id: toastId });
//       fetchAccounts();
//       if (onSuccess) onSuccess(); 
      
//       setUrl(""); 
//       setStep(1);
//       setVerificationCode(null);

//     } catch (error) {
//       if (error.response) {
//           const serverMsg = error.response.data.message;
//           if (error.response.status === 409) {
//               toast.error(
//                   <div className="flex flex-col">
//                       <span className="font-bold">Linking Failed</span>
//                       <span className="text-sm">{serverMsg}</span>
//                   </div>, 
//                   { id: toastId, duration: 5000 }
//               );
//           } else {
//               toast.error(serverMsg || "Linking Failed", { id: toastId });
//           }
//       } else {
//           toast.error("Network Error", { id: toastId });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- TRIGGER MODAL INSTEAD OF WINDOW.CONFIRM ---
 
//   // --- ACTUAL UNLINK LOGIC ---
  

//   const copyToClipboard = () => {
//       navigator.clipboard.writeText(verificationCode);
//       toast.success("Code copied!");
//   };

//   return (
//     <div className="space-y-8">
      
//       {/* Linked Accounts List */}
//       {linkedAccounts.length > 0 && (
//           <div className="space-y-3">
//               <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                   <CheckCircleIcon className="w-5 h-5 text-green-500" />
//                   Your Linked Accounts
//               </h3>
//               <div className="grid gap-3">
//                   {linkedAccounts.map((acc, i) => (
//                       <div key={i} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
//                           <div className="flex items-center gap-4">
//                               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
//                                   {acc.platform === 'Moj' ? '🔥' : '📷'}
//                               </div>
//                               <div className="overflow-hidden">
//                                   <h4 className="font-bold text-white text-sm">{acc.platform}</h4>
//                                   <a href={acc.profileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 truncate block max-w-[200px]">
//                                       @{acc.username || "user"}
//                                   </a>
//                               </div>
//                           </div>
                        
//                       </div>
//                   ))}
//               </div>
//           </div>
//       )}

//       {/* Link New Account Form */}
//       <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
//         <h3 className="text-xl font-bold text-white mb-6 relative z-10">
//           Link New Account
//         </h3>
        
//         {step === 1 ? (
//             <div className="space-y-4 relative z-10">
//                 <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500 uppercase">Select Platform</label>
//                     <select 
//                         value={platform} 
//                         onChange={(e) => setPlatform(e.target.value)}
//                         className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-blue-500"
//                     >
//                         <option value="Moj">Moj</option>
//                         <option value="ShareChat">ShareChat</option>
//                     </select>
//                 </div>
//                 <button 
//                     onClick={generateCode}
//                     disabled={loading}
//                     className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
//                 >
//                     {loading ? "Generating..." : "Next: Get Verification Code"}
//                 </button>
//             </div>
//         ) : (
//             <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-4">
//                 <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-center">
//                     <p className="text-xs text-blue-300 uppercase font-bold mb-2">Step 1: Copy & Paste into Bio</p>
//                     <div className="flex items-center gap-2 justify-center bg-slate-950 p-3 rounded-lg border border-blue-500/50 cursor-pointer hover:bg-slate-900 transition" onClick={copyToClipboard}>
//                         <span className="text-xl font-mono font-bold text-white tracking-widest">{verificationCode}</span>
//                         <CopyIcon className="w-5 h-5 text-blue-400" />
//                     </div>
//                     <p className="text-[10px] text-slate-400 mt-2">
//                         Go to your {platform} profile → Edit Bio → Paste this code.
//                     </p>
//                 </div>

//                 <div className="space-y-2">
//                     <label className="text-xs font-bold text-slate-500 uppercase">Step 2: Enter Profile Link</label>
//                     <input 
//                         type="text" 
//                         placeholder={`e.g. ${platform === 'Moj' ? "mojapp.in/@user" : "sharechat.com/profile/user"}`}
//                         value={url}
//                         onChange={(e) => setUrl(e.target.value)}
//                         className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-green-500 transition-all"
//                     />
//                 </div>

//                 <div className="flex gap-3">
//                     <button onClick={() => setStep(1)} className="px-4 py-3 bg-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-600">Back</button>
//                     <button 
//                         onClick={verifyAccount} 
//                         disabled={loading}
//                         className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
//                     >
//                         {loading ? "Verifying..." : "I've Updated My Bio - Verify"}
//                     </button>
//                 </div>
//             </div>
//         )}
//       </div>

      
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// --- Icons ---
const CheckCircleIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CopyIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ArrowRight = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>;
const LinkIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const RefreshIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;

export default function SocialLinker({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState("Moj");
  const [url, setUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  // Fetch Accounts
  useEffect(() => { fetchAccounts(); }, []);
  const fetchAccounts = async () => { try { const { data } = await api.get("/users/me"); setLinkedAccounts(data.user.linkedAccounts || []); } catch (e) {} };

  // Actions
  const generateCode = async () => {
    setLoading(true);
    try { const { data } = await api.get("/social/generate-code"); setVerificationCode(data.code); setStep(2); } 
    catch (error) { toast.error("Error generating code"); } finally { setLoading(false); }
  };

  const verifyAccount = async () => {
    if (!url) return toast.error("Please enter your profile URL");
    setLoading(true);
    try {
      await api.post("/social/verify", { platform, profileUrl: url.trim() });
      toast.success("Profile Verified Successfully!"); 
      fetchAccounts(); 
      if (onSuccess) onSuccess();
      // Reset
      setUrl(""); setStep(1); setVerificationCode(null);
    } catch (error) { 
        toast.error(error.response?.data?.message || "Verification Failed. Check URL."); 
    } finally { 
        setLoading(false); 
    }
  };

  // Theme Configuration
  const platformConfig = {
      Moj: { 
          gradient: "from-orange-500 to-amber-500", 
          border: "border-orange-200",
          shadow: "shadow-orange-500/20", 
          icon: "🔥", 
          label: "Moj App",
          accentText: "text-orange-600", 
          accentBg: "bg-orange-50" 
      },
      ShareChat: { 
          gradient: "from-violet-600 to-fuchsia-600", 
          border: "border-violet-200",
          shadow: "shadow-violet-500/20", 
          icon: "💬", 
          label: "ShareChat",
          accentText: "text-violet-600", 
          accentBg: "bg-violet-50" 
      }
  };

  const currentTheme = platformConfig[platform];

  return (
    <div className="space-y-8 w-full max-w-lg mx-auto">
      {/* --- FIX APPLIED HERE: Added containerStyle with zIndex and top offset --- */}
      <Toaster 
          position="top-center" 
          containerStyle={{
              top: 80, // Moves toast down so it doesn't hide behind navbar
              zIndex: 99999, // Forces it to stay on top of everything
          }}
          toastOptions={{ 
              style: { background: '#1e293b', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } 
          }}
      />
      
      {/* --- Section 1: Active Accounts --- */}
      {linkedAccounts.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Connected Profiles
              </h3>
              <div className="grid gap-3">
                  {linkedAccounts.map((acc, i) => {
                      const theme = platformConfig[acc.platform] || platformConfig.Moj;
                      return (
                          <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg`}>
                                      {theme.icon}
                                  </div>
                                  <div>
                                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{acc.platform}</h4>
                                      <p className="text-xs text-slate-400 font-mono">@{acc.username || "verified_user"}</p>
                                  </div>
                              </div>
                              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1">
                                  <CheckCircleIcon /> Active
                              </div>
                          </div>
                      );
                  })}
              </div>
          </motion.div>  
      )}

      {/* --- Section 2: The "Magic" Linker Card --- */}
      <motion.div 
        layout
        className={`relative bg-white rounded-[2rem] p-1 shadow-2xl transition-all duration-500 ${currentTheme.shadow}`}
      >
        {/* Animated Gradient Border */}
        <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${currentTheme.gradient} opacity-20`} />
        
        <div className="relative bg-white rounded-[1.8rem] p-6 md:p-8 overflow-hidden">
             
             {/* Header */}
             <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Connect Profile</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Step {step} of 2</p>
                </div>
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                        <RefreshIcon /> Change
                    </button>
                )}
             </div>

             <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Platform Selector Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(platformConfig).map((p) => {
                                const isSelected = platform === p;
                                const theme = platformConfig[p];
                                return (
                                    <button 
                                        key={p}
                                        onClick={() => setPlatform(p)}
                                        className={`relative group p-4 h-32 rounded-2xl border-2 text-left transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                                            isSelected 
                                            ? `border-transparent bg-slate-50 shadow-inner` 
                                            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"
                                        }`}
                                    >
                                        {isSelected && (
                                            <motion.div 
                                                layoutId="activeRing"
                                                className={`absolute inset-0 border-2 rounded-2xl opacity-100 z-10`}
                                                style={{ borderColor: isSelected ? 'transparent' : '' }} // Custom border handled by glow
                                            >
                                                 <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${theme.gradient}`} />
                                                 <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
                                            </motion.div>
                                        )}
                                        
                                        <div className="relative z-20 flex justify-between items-start w-full">
                                            <span className="text-3xl filter drop-shadow-sm">{theme.icon}</span>
                                            {isSelected && <div className={`w-2 h-2 rounded-full bg-current ${theme.accentText}`} />}
                                        </div>
                                        <span className={`relative z-20 font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {theme.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* CTA Button */}
                        <button 
                            onClick={generateCode} 
                            disabled={loading} 
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 bg-gradient-to-r ${currentTheme.gradient}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Continue <ArrowRight /></>
                            )}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        {/* The Code Ticket */}
                        <div className="relative group cursor-pointer" onClick={() => {navigator.clipboard.writeText(verificationCode); toast.success("Code copied!");}}>
                            <div className="absolute inset-0 bg-slate-900 rounded-2xl transform translate-y-2 translate-x-0 transition-transform group-hover:translate-y-3 opacity-10"></div>
                            <div className="relative bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-white hover:border-violet-400 transition-colors">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Verification Code</p>
                                <div className="text-3xl font-mono font-black text-slate-800 tracking-[0.2em]">{verificationCode}</div>
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-violet-600 bg-violet-50 w-fit mx-auto px-3 py-1 rounded-full">
                                    <CopyIcon /> Tap to Copy
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="text-center text-sm text-slate-500 font-medium">
                            Paste this code into your <span className={`font-bold ${currentTheme.accentText}`}>{platform} Bio</span> to verify ownership.
                        </div>

                        {/* URL Input */}
                        <div className="space-y-2">
                             <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                    <LinkIcon />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder={`Paste your ${platform} profile link...`} 
                                    value={url} 
                                    onChange={(e) => setUrl(e.target.value)} 
                                    className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-4 py-4 rounded-xl font-bold focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none shadow-sm transition-all" 
                                />
                             </div>
                        </div>

                        {/* Verify Button */}
                        <button 
                            onClick={verifyAccount} 
                            disabled={loading} 
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 bg-slate-900 hover:bg-slate-800`}
                        >
                            {loading ? "Verifying..." : "Verify Profile"}
                        </button>
                    </motion.div>
                )}
             </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}