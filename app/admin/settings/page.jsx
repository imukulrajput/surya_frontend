"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";

export default function SettingsPage() {
  const [reward, setReward] = useState(2.5);
  const [applyToAll, setApplyToAll] = useState(false); // NAYA: Checkbox ke liye state
  const [announcement, setAnnouncement] = useState({ message: "", isActive: false });
  const [loading, setLoading] = useState(false);

  // Page load hote hi database se saved settings lana (Isi wajah se 2.5 nahi, saved prize dikhega)
  useEffect(() => {
    api.get("/admin/settings").then(res => {
        if (res.data.reward) setReward(res.data.reward);
        if (res.data.announcement) setAnnouncement(res.data.announcement);
    }).catch(console.error);
  }, []);

  const saveSettings = async (type) => {
    setLoading(true);
    try {
        if(type === 'reward') {
            // Reward ke sath 'applyToExisting' ki value bhi bhej rahe hain
            await api.post("/admin/settings", { 
                key: "reward_per_task", 
                value: reward,
                applyToExisting: applyToAll 
            });

            // Success message condition ke hisaab se
            if (applyToAll) {
                toast.success(`Saved! All tasks updated to ₹${reward}`);
            } else {
                toast.success("Saved for future tasks only!");
            }
            
            setApplyToAll(false); // Save hone ke baad checkbox wapas untick kar do
        }
        
        if(type === 'announcement') {
            await api.post("/admin/announcement", announcement);
            toast.success("Broadcast Updated!");
        }
    } catch(e) { 
        toast.error("Failed to save settings"); 
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-extrabold text-slate-900">Settings</h1>
      
      {/* --- BASE REWARD SECTION --- */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">💰 Base Reward</h2>
        
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Amount (₹)</label>
                    <input 
                        type="number" 
                        value={reward} 
                        onChange={(e) => setReward(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-bold text-slate-900" 
                    />
                </div>
                <div className="flex items-end">
                    <button 
                        onClick={() => saveSettings('reward')} 
                        disabled={loading} 
                        className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
                    >
                        {loading && applyToAll ? "Updating All..." : loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            {/* NAYA UI: Checkbox for applying to all existing tasks */}
            <label className="flex items-center gap-3 cursor-pointer mt-2 bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit hover:bg-slate-100 transition">
                <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-violet-600 cursor-pointer rounded" 
                    checked={applyToAll} 
                    onChange={(e) => setApplyToAll(e.target.checked)} 
                />
                <span className="text-sm font-bold text-slate-700">
                    Apply this ₹{reward} reward to ALL existing tasks right now
                </span>
            </label>
        </div>
      </div>

      {/* --- GLOBAL BROADCAST SECTION (Unchanged) --- */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-bl-full -mr-4 -mt-4"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">📢 Global Broadcast</h2>
        
        <div className="space-y-4 relative z-10">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Message</label>
                <input 
                    type="text" 
                    value={announcement.message} 
                    onChange={(e) => setAnnouncement({...announcement, message: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" 
                    placeholder="Announcement text..." 
                />
            </div>
            
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${announcement.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                    <span className="font-bold text-slate-700">{announcement.isActive ? 'Broadcast Active' : 'Broadcast Off'}</span>
                </div>
                <input 
                    type="checkbox" 
                    className="w-6 h-6 accent-violet-600" 
                    checked={announcement.isActive} 
                    onChange={(e) => setAnnouncement({...announcement, isActive: e.target.checked})} 
                />
            </div>

            <button 
                onClick={() => saveSettings('announcement')} 
                disabled={loading} 
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition shadow-lg shadow-violet-200 disabled:opacity-50"
            >
                {loading && !applyToAll ? "Updating..." : "Update Broadcast"}
            </button>
        </div>
      </div>
      
    </div>
  );
}