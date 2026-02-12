"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";

// --- Custom Confirmation Modal ---
const BanConfirmationModal = ({ isOpen, onClose, onConfirm, user, loading }) => {
  if (!isOpen || !user) return null;

  // Determine if we are Banning or Unbanning based on logic (assuming no token = banned)
  // Note: Since we hide refreshToken in the API, we assume 'Active' by default for the toggle text
  // or you can adjust this logic if you expose an 'isBanned' field from backend.
  const actionText = "Toggle Ban Status"; 

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl p-6 shadow-2xl relative">
        <h3 className="text-xl font-bold text-white mb-2">Confirm Action</h3>
        <p className="text-slate-400 text-sm mb-6">
          Are you sure you want to <strong>{actionText}</strong> for user <span className="text-white font-bold">{user.fullName}</span>?
          <br/><br/>
          <span className="text-xs text-slate-500">If banned, they will be logged out immediately.</span>
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-900/20"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        fetchUsers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchUsers = async () => {
    try {    
      const { data } = await api.get(`/admin/users?search=${search}`);
      setUsers(data.users);
    } catch (e) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // 1. Open Modal
  const initiateBan = (user) => {
    setSelectedUser(user);
    setBanModalOpen(true);
  };

  // 2. Perform Action
  const processBan = async () => {
    if (!selectedUser) return;
    
    setActionLoading(true);
    // Determine current ban status logic here if available, or just toggle
    // For now, we pass a boolean that flips the current state in the backend
    // Assuming backend handles the toggle logic if we don't strictly know current state
    const isBanned = false; // Defaulting to false so backend flips it to true (Ban) or vice versa

    try {
        await api.post("/admin/users/ban", { userId: selectedUser._id, banned: !isBanned });
        toast.success(`User status updated successfully`);
        fetchUsers(); // Refresh list
        setBanModalOpen(false);
        setSelectedUser(null);
    } catch (error) {
        toast.error("Action failed");
    } finally {
        setActionLoading(false);
    }
  };

  return ( 
    <div>
      <Toaster position="top-right" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-slate-400 text-sm">View details, linked accounts, and bank info.</p>
        </div>
        <input 
          type="text" 
          placeholder="Search Name or Email..." 
          className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-64"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="p-4">User Info</th>
                  <th className="p-4">Wallet</th>
                  <th className="p-4">Linked Socials</th>
                  <th className="p-4">Bank Details</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading users...</td></tr>
                ) : users.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td></tr>
                ) : (
                    users.map(user => (
                      <tr key={user._id} className="hover:bg-slate-800/50 transition">
                        
                        {/* User Info */}
                        <td className="p-4 align-top">
                            <p className="font-bold text-white text-base">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                            <p className="text-[10px] text-slate-600 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </td>

                        {/* Wallet */}
                        <td className="p-4 align-top">
                            <span className="text-green-400 font-mono font-bold text-lg">₹{user.walletBalance}</span>
                        </td>

                        {/* Linked Socials */}
                        <td className="p-4 align-top">
                            <div className="space-y-1">
                                {user.linkedAccounts && user.linkedAccounts.length > 0 ? (
                                    user.linkedAccounts.map((acc, i) => (
                                        <div key={i} className="text-xs flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${acc.platform === 'Moj' ? 'bg-orange-500' : 'bg-purple-500'}`}></span>
                                            <span className="text-slate-300">{acc.platform}</span>
                                            <a href={acc.profileUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 hover:underline">↗</a>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-slate-600 text-xs italic">No socials linked</span>
                                )}
                            </div>
                        </td>

                        {/* Bank Details */}
                        <td className="p-4 align-top">
                            {user.bankDetails ? (
                                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-xs w-fit min-w-[160px]">
                                    <p className="text-white font-bold mb-1">{user.bankDetails.details.bankName}</p>
                                    <div className="text-slate-400 space-y-0.5 font-mono">
                                        <p>AC: {user.bankDetails.details.accountNumber}</p>
                                        <p>IFSC: {user.bankDetails.details.ifsc}</p>
                                        <p>Name: {user.bankDetails.details.fullName}</p>
                                    </div>
                                </div>
                            ) : (
                                <span className="px-2 py-1 bg-red-900/10 text-red-500 text-[10px] font-bold uppercase rounded border border-red-900/20">
                                    Not Linked
                                </span>
                            )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right align-top">
                            <button 
                                onClick={() => initiateBan(user)}
                                className="text-xs font-bold px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 transition"
                            >
                                Ban / Unban
                            </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <BanConfirmationModal 
        isOpen={banModalOpen} 
        user={selectedUser} 
        onClose={() => setBanModalOpen(false)} 
        onConfirm={processBan}
        loading={actionLoading}
      />

    </div>
  );
}