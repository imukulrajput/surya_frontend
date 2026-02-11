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

export default function SocialLinker({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState("Moj");
  const [url, setUrl] = useState("");
  
  const [linkedAccounts, setLinkedAccounts] = useState([]);

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

  const verifyAccount = async () => {
    // 1. Basic Validation
    if (!url) return toast.error("Please enter your profile URL");
    if (!url.startsWith("http")) {
        return toast.error("Please enter a valid Link (starting with http/https)");
    }
    
    setLoading(true);
    const toastId = toast.loading("Verifying account...");

    try {
      const cleanUrl = url.trim();

      await api.post("/social/verify", { 
        platform, 
        profileUrl: cleanUrl 
      });

      // SUCCESS HANDLING
      toast.success("Account Linked Successfully!", { id: toastId });
      fetchAccounts();
      if (onSuccess) onSuccess(); 
      setUrl(""); // Clear input only on success

    } catch (error) {
      console.error("Link Error:", error);

      // ERROR HANDLING
      if (error.response) {
          // Case 1: Duplicate Account (409 Conflict)
          if (error.response.status === 409) {
              toast.error(
                  <div className="flex flex-col">
                      <span className="font-bold">Account Already Linked!</span>
                      <span className="text-sm">You have already added this profile.</span>
                  </div>, 
                  { id: toastId, duration: 4000 }
              );
          } 
          // Case 2: Other API Errors (Invalid URL, etc)
          else {
              toast.error(error.response.data.message || "Linking Failed", { id: toastId });
              // Show hint if backend sends one
              if(error.response.data.hint) {
                  setTimeout(() => toast(error.response.data.hint, { icon: '💡' }), 1000);
              }
          }
      } else {
          // Case 3: Network/Server Error
          toast.error("Network Error. Please try again.", { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* --- Display Linked Accounts --- */}
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
                                  <a href={acc.profileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 truncate block max-w-[200px]">
                                      @{acc.username || "user"}
                                  </a>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded">Active</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* --- Link New Account Form --- */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-bl-full pointer-events-none"></div>

        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 relative z-10">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Link New Account
        </h3>
        <p className="text-sm text-slate-400 mb-6 relative z-10">
            Paste your profile URL below. We will verify your username automatically.
        </p>
        
        <div className="space-y-4 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Select Platform</label>
              <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                  <option value="Moj">Moj</option>
                  <option value="ShareChat">ShareChat</option>
              </select>
            </div>    

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Profile Link</label>
              <input 
                  type="text" 
                  placeholder={platform === 'Moj' ? "e.g. https://mojapp.in/@surya123" : "e.g. https://sharechat.com/profile/surya123"}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white p-3 rounded-xl outline-none focus:border-blue-500 transition-all placeholder-slate-600"
              />
            </div>

            <button 
                onClick={verifyAccount} 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
                {loading ? "Verifying..." : "Link Account Now"}
            </button>
        </div>
      </div>
    </div>
  );
}