"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";

// --- Icons ---
const CheckCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

const CopyIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
    </svg>
);

// --- Custom Confirmation Modal ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl p-6 shadow-2xl relative">
                <h3 className="text-lg font-bold text-white mb-2">Unlink Account?</h3>
                <p className="text-slate-400 text-sm mb-6">
                    Are you sure you want to remove this account? You will lose any progress associated with it.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={loading}
                        className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20"
                    >
                        {loading ? "Removing..." : "Yes, Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function SocialLinker({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState("Moj");
  const [url, setUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState(null);
  
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  
  // --- NEW: Modal State ---
  

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
        const { data } = await api.get("/users/me");
        setLinkedAccounts(data.user.linkedAccounts || []);
    } catch (e) {
        console.error("Failed to fetch accounts");
    }
  };

  const generateCode = async () => {
    setLoading(true);
    try {
        const { data } = await api.get("/social/generate-code");
        setVerificationCode(data.code);
        setStep(2);
    } catch (error) {
        toast.error("Failed to generate code");
    } finally {
        setLoading(false);
    }
  };

  const verifyAccount = async () => {
    if (!url) return toast.error("Please enter your profile URL");
    
    setLoading(true);
    const toastId = toast.loading("Verifying bio & linking...");

    try {
      const cleanUrl = url.trim();
      await api.post("/social/verify", { 
        platform, 
        profileUrl: cleanUrl 
      });

      toast.success("Account Linked Successfully!", { id: toastId });
      fetchAccounts();
      if (onSuccess) onSuccess(); 
      
      setUrl(""); 
      setStep(1);
      setVerificationCode(null);

    } catch (error) {
      if (error.response) {
          const serverMsg = error.response.data.message;
          if (error.response.status === 409) {
              toast.error(
                  <div className="flex flex-col">
                      <span className="font-bold">Linking Failed</span>
                      <span className="text-sm">{serverMsg}</span>
                  </div>, 
                  { id: toastId, duration: 5000 }
              );
          } else {
              toast.error(serverMsg || "Linking Failed", { id: toastId });
          }
      } else {
          toast.error("Network Error", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  // --- TRIGGER MODAL INSTEAD OF WINDOW.CONFIRM ---
 
  // --- ACTUAL UNLINK LOGIC ---
  

  const copyToClipboard = () => {
      navigator.clipboard.writeText(verificationCode);
      toast.success("Code copied!");
  };

  return (
    <div className="space-y-8">
      
      {/* Linked Accounts List */}
      {linkedAccounts.length > 0 && (
          <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  Your Linked Accounts
              </h3>
              <div className="grid gap-3">
                  {linkedAccounts.map((acc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
                                  {acc.platform === 'Moj' ? '🔥' : '📷'}
                              </div>
                              <div className="overflow-hidden">
                                  <h4 className="font-bold text-white text-sm">{acc.platform}</h4>
                                  <a href={acc.profileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 truncate block max-w-[200px]">
                                      @{acc.username || "user"}
                                  </a>
                              </div>
                          </div>
                        
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Link New Account Form */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-6 relative z-10">
          Link New Account
        </h3>
        
        {step === 1 ? (
            <div className="space-y-4 relative z-10">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Select Platform</label>
                    <select 
                        value={platform} 
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-blue-500"
                    >
                        <option value="Moj">Moj</option>
                        <option value="ShareChat">ShareChat</option>
                    </select>
                </div>
                <button 
                    onClick={generateCode}
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
                >
                    {loading ? "Generating..." : "Next: Get Verification Code"}
                </button>
            </div>
        ) : (
            <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-right-4">
                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-center">
                    <p className="text-xs text-blue-300 uppercase font-bold mb-2">Step 1: Copy & Paste into Bio</p>
                    <div className="flex items-center gap-2 justify-center bg-slate-950 p-3 rounded-lg border border-blue-500/50 cursor-pointer hover:bg-slate-900 transition" onClick={copyToClipboard}>
                        <span className="text-xl font-mono font-bold text-white tracking-widest">{verificationCode}</span>
                        <CopyIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                        Go to your {platform} profile → Edit Bio → Paste this code.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Step 2: Enter Profile Link</label>
                    <input 
                        type="text" 
                        placeholder={`e.g. ${platform === 'Moj' ? "mojapp.in/@user" : "sharechat.com/profile/user"}`}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-green-500 transition-all"
                    />
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-4 py-3 bg-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-600">Back</button>
                    <button 
                        onClick={verifyAccount} 
                        disabled={loading}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
                    >
                        {loading ? "Verifying..." : "I've Updated My Bio - Verify"}
                    </button>
                </div>
            </div>
        )}
      </div>

      
    </div>
  );
}