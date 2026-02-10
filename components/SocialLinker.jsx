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

const ClipboardDocumentIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
);

const TrashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export default function SocialLinker({ onSuccess }) {
  const [step, setStep] = useState(1); // 1 = Generate, 2 = Verify
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(null);
  const [platform, setPlatform] = useState("Instagram");
  const [url, setUrl] = useState("");
  
  // New State for Linked Accounts
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  // Fetch Accounts on Load
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

  const copyToClipboard = () => {
    if (code) {
      if (typeof navigator !== 'undefined') {
        navigator.clipboard.writeText(code);
        toast.success("Code copied!");
      } else {
        toast.error("Clipboard not supported");
      }
    }
  };

  const generateCode = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/social/generate-code");
      setCode(data.code);
      setStep(2);
      toast.success("Code Generated!");
    } catch (error) {
      toast.error("Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async () => {
    if (!url) return toast.error("Please enter your profile URL");
    
    setLoading(true);
    try {
      await api.post("/social/verify", { 
        platform, 
        profileUrl: url 
      });

      toast.success("Account Verified Successfully!");
      
      // Update the list immediately
      fetchAccounts();

      if (onSuccess) onSuccess(); 

      // Reset Form
      setStep(1);
      setUrl("");
      setCode(null);

    } catch (error) {
      toast.error(error.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* --- NEW SECTION: Display Linked Accounts --- */}
      {linkedAccounts.length > 0 && (
          <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  Your Linked Accounts
              </h3>
              <div className="grid gap-3">
                  {linkedAccounts.map((acc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-sm group">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl">
                                  {acc.platform === 'Moj' ? '🔥' : '📷'}
                              </div>
                              <div className="overflow-hidden">
                                  <h4 className="font-bold text-white text-sm">{acc.platform}</h4>
                                  <a href={acc.profileUrl} target="_blank" className="text-xs text-blue-400 hover:text-blue-300 truncate block max-w-[200px]">
                                      {acc.profileUrl}
                                  </a>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded">Verified</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- EXISTING FORM: Link New Account --- */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Link New Account
        </h3>
        
        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Select a platform and verify ownership to enable tasks.
            </p>
            <button 
              onClick={generateCode} 
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition disabled:opacity-50 shadow-lg shadow-blue-900/20"
            >
              {loading ? "Generating..." : "Start Verification"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center relative group">
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Your Verification Code</p>
              <p className="text-2xl font-mono font-bold text-white tracking-widest">{code}</p>
              <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  title="Copy Code"
              >
                  <ClipboardDocumentIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-xs text-yellow-500 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                ⚠️ <strong>Step 1:</strong> Paste this code in your Bio. <br/>
                ⚠️ <strong>Step 2:</strong> Wait 1 min, then paste your URL below.
            </div>

            <div className="space-y-2">
              <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-blue-500"
              >
                  <option value="Instagram">Instagram</option>
                  <option value="Moj">Moj</option>
                  <option value="ShareChat">ShareChat</option>
                  <option value="Josh">Josh</option>
              </select>
              
              <input 
                  type="text" 
                  placeholder="Paste Profile URL..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
               <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition"
               >
                  Cancel
               </button>
               <button 
                  onClick={verifyAccount} 
                  disabled={loading}
                  className="flex-[2] py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
               >
                  {loading ? "Checking..." : "Verify Now"}
                  {!loading && <CheckCircleIcon className="w-5 h-5" />}
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}