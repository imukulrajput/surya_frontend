"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios"

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {    
     const { data } = await api.get(`/admin/users?search=${search}`);
      setUsers(data.users);
    } catch (e) {}
  };

  // --- NEW: Handle Ban Logic ---
  const handleBan = async (userId, currentStatus) => {
    if(!confirm(`Are you sure you want to ${currentStatus ? 'Unban' : 'Ban'} this user?`)) return;

    try {
       await api.post("/admin/users/ban", { userId, banned: !currentStatus });
        toast.success(`User ${currentStatus ? 'Unbanned' : 'Banned'}`);
        // Refresh list to show new status (Optional: you can also update local state)
        fetchUsers();
    } catch (error) {
        toast.error("Action failed");
    }
  };

  return ( 
    <div>
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <input 
          type="text" 
          placeholder="Search Name or Email..." 
          className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-950 text-slate-500 uppercase text-xs">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Wallet</th>
              <th className="p-4">Linked Accounts</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map(user => (
              <tr key={user._id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">{user.fullName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 text-green-400 font-mono">₹{user.walletBalance}</td>
                <td className="p-4 text-xs">
                    {user.linkedAccounts.map((acc, i) => (
                        <div key={i}>{acc.platform}: <a href={acc.profileUrl} target="_blank" className="text-blue-400 hover:underline">Link</a></div>
                    ))}
                </td>
                <td className="p-4">
                    {/* --- NEW: Dynamic Button --- */}
                    <button 
                        onClick={() => handleBan(user._id, user.refreshToken === null)} // Simple check if banned
                        className={`text-xs uppercase font-bold border px-3 py-1 rounded transition ${
                            user.refreshToken === null 
                            ? "border-green-900/50 bg-green-900/20 text-green-400 hover:text-green-300"
                            : "border-red-900/50 bg-red-900/20 text-red-400 hover:text-red-300"
                        }`}
                    >
                        {user.refreshToken === null ? "Unban User" : "Ban User"}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 