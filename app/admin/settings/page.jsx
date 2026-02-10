"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios"; // Use your new api instance
import toast, { Toaster } from "react-hot-toast";

export default function SettingsPage() {
  const [reward, setReward] = useState(2.5);
  const [announcement, setAnnouncement] = useState({ 
    message: "", 
    isActive: false 
  });
  const [loading, setLoading] = useState(false);

  // Fetch current settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/admin/settings");
        if (data.reward) setReward(data.reward);
        if (data.announcement) setAnnouncement(data.announcement);
      } catch (error) {
        console.log("Could not fetch settings.");
      }
    };
    fetchSettings();
  }, []);

  // 1. Save Reward
  const saveReward = async () => {
    setLoading(true);
    try {
      await api.post("/admin/settings", { key: "reward_per_task", value: reward });
      toast.success("Reward Updated");
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  // 2. Save Announcement
  const saveAnnouncement = async () => {
    setLoading(true);
    try {
      await api.post("/admin/announcement", announcement);
      toast.success(announcement.isActive ? "Broadcast is LIVE" : "Broadcast Removed");
    } catch (error) {
      toast.error("Failed to update broadcast");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Toaster position="top-right" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
      
      <h1 className="text-3xl font-bold text-white mb-8">System Configuration</h1>
      
      {/* --- Section 1: Money --- */}
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 space-y-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
        <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">💰 Reward Settings</h2>
            <label className="block text-slate-400 mb-2 font-medium">Reward Per Task (₹)</label>
            <div className="flex gap-4">
                <input 
                    type="number" 
                    value={reward} 
                    onChange={(e) => setReward(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                    onClick={saveReward}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition disabled:opacity-50"
                >
                    Save
                </button>
            </div>
        </div>
      </div>

      {/* --- Section 2: Announcement (THIS IS WHAT YOU WERE MISSING) --- */}
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>

        <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">📢 Global Broadcast</h2>
            <p className="text-slate-400 text-sm mb-4">
                Send a message to all users instantly. It will appear at the top of their dashboard.
            </p>

            <label className="block text-slate-400 mb-2 font-medium">Message</label>
            <input 
                type="text" 
                value={announcement.message}
                onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none mb-4"
                placeholder="e.g. Payments processed at 6 PM today!"
            />

            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${announcement.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></div>
                    <label className="text-white font-medium cursor-pointer" htmlFor="activeToggle">
                        {announcement.isActive ? 'Broadcast is Active' : 'Broadcast is Off'}
                    </label>
                </div>
                
                {/* Simple Checkbox Toggle */}
                <input 
                    id="activeToggle"
                    type="checkbox" 
                    checked={announcement.isActive} 
                    onChange={(e) => setAnnouncement({...announcement, isActive: e.target.checked})}
                    className="w-5 h-5 accent-purple-600 cursor-pointer" 
                />
            </div>

            <button 
                onClick={saveAnnouncement}
                disabled={loading}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 shadow-lg shadow-purple-900/20"
            >
                {loading ? "Updating..." : "Update Broadcast"}
            </button>
        </div>
      </div>

    </div>
  );
}