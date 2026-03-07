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

  useEffect(() => { fetchAccounts(); }, []);
  const fetchAccounts = async () => { try { const { data } = await api.get("/users/me"); setLinkedAccounts(data.user.linkedAccounts || []); } catch (e) {} };

  const generateCode = async () => {
    setLoading(true);
    try { const { data } = await api.get("/social/generate-code"); setVerificationCode(data.code); setStep(2); } 
    catch (error) { toast.error("Error generating code"); } finally { setLoading(false); }
  };

  const verifyAccount = async () => {
    if (!url) return toast.error("Enter profile URL");
    setLoading(true);
    try {
      await api.post("/social/verify", { platform, profileUrl: url.trim() });
      toast.success("Linked Successfully!"); 
      fetchAccounts(); 
      if (onSuccess) onSuccess();
      setUrl(""); setStep(1); setVerificationCode(null);
    } catch (error) { 
        toast.error(error.response?.data?.message || "Verification Failed"); 
    } finally { 
        setLoading(false); 
    }
  };

  const platformConfig = {
      Moj: { gradient: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/20", icon: "🔥", label: "Moj", accentText: "text-orange-600" },
      ShareChat: { gradient: "from-violet-600 to-fuchsia-600", shadow: "shadow-violet-500/20", icon: "💬", label: "ShareChat", accentText: "text-violet-600" }
  };

  const currentTheme = platformConfig[platform];

  // --- NEW: Helper to get active account count per platform ---
  const getActiveCount = (plat) => linkedAccounts.filter(acc => acc.platform === plat && acc.active !== false).length;
  
  // --- NEW: Check if the currently selected platform is maxed out ---
  const isCurrentPlatformMaxed = getActiveCount(platform) >= 8;

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto">
      <Toaster position="top-center" containerStyle={{ top: 80, zIndex: 99999 }} toastOptions={{ style: { background: '#1e293b', color: '#fff' } }}/>
      
      {/* Active Accounts List */}
      {linkedAccounts.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="grid gap-3">
              {linkedAccounts.filter(acc => acc.active !== false).map((acc, i) => {
                  const theme = platformConfig[acc.platform] || platformConfig.Moj;
                  return (
                      <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${theme.gradient} text-white`}>
                                  {theme.icon}
                              </div>
                              <div className="min-w-0">
                                  <h4 className="font-bold text-slate-800 text-sm">{acc.platform}</h4>
                                  <p className="text-xs text-slate-400 font-mono truncate max-w-[120px]">@{acc.username || "user"}</p>
                              </div>
                          </div>
                          <div className="bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-green-100 shrink-0">
                              Active
                          </div>
                      </div>
                  );
              })}
          </motion.div>  
      )}

      {/* Main Card */}
      <motion.div layout className={`bg-white rounded-[2rem] shadow-xl ${currentTheme.shadow} border border-slate-100 overflow-hidden`}>
        <div className="p-5 md:p-8">
             
             {/* Header */}
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900">Connect Profile</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Step {step} of 2</p>
                </div>
                {step === 2 && (
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg hover:text-slate-600 transition-colors">
                        Change
                    </button>
                )}
             </div>

             <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                            {Object.keys(platformConfig).map((p) => {
                                const isSelected = platform === p;
                                const theme = platformConfig[p];
                                
                                // --- NEW: Check limits for this specific button ---
                                const pCount = getActiveCount(p);
                                const isMaxed = pCount >= 8;

                                return (
                                    <button 
                                        key={p}
                                        onClick={() => setPlatform(p)}
                                        disabled={isMaxed} // Disable if maxed
                                        className={`p-3 md:p-4 h-28 md:h-32 rounded-2xl border-2 text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                                            isSelected ? `border-transparent bg-slate-50 ring-2 ring-slate-100` : "border-slate-100 bg-white hover:border-slate-200"
                                        } ${isMaxed ? "opacity-50 cursor-not-allowed grayscale" : ""}`}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <span className="text-2xl md:text-3xl">{theme.icon}</span>
                                            {/* Show counter badge */}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isMaxed ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {pCount}/8
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`font-bold text-sm block ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>{theme.label}</span>
                                            {isMaxed && <span className="text-[10px] text-red-500 font-semibold block mt-0.5">Limit Reached</span>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <button 
                            onClick={generateCode} 
                            disabled={loading || isCurrentPlatformMaxed} 
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isCurrentPlatformMaxed ? 'bg-slate-300 cursor-not-allowed shadow-none' : `bg-gradient-to-r ${currentTheme.gradient}`}`}
                        >
                            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Continue <ArrowRight /></>}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                        {/* Code Box */}
                        <div onClick={() => {navigator.clipboard.writeText(verificationCode); toast.success("Copied!");}} className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center cursor-pointer active:scale-95 transition-transform">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Tap to Copy Code</p>
                            <div className="text-2xl md:text-3xl font-mono font-black text-slate-800 break-all">{verificationCode}</div>
                        </div>

                        <p className="text-center text-xs text-slate-500 px-4">
                            Paste into <span className={`font-bold ${currentTheme.accentText}`}>{platform} Bio</span> then enter link:
                        </p>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400"><LinkIcon /></div>
                            <input type="text" placeholder="Profile Link..." value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pr-4 py-3.5 rounded-xl font-bold focus:ring-2 focus:ring-slate-200 outline-none" />
                        </div>

                        <button onClick={verifyAccount} disabled={loading} className="w-full py-4 rounded-xl font-bold text-white shadow-lg bg-slate-900">
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