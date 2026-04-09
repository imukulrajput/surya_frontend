


"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";

const BanConfirmationModal = ({ isOpen, onClose, onConfirm, user, loading }) => {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 w-full max-w-sm rounded-xl p-6 shadow-2xl relative">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Action</h3>
        <p className="text-slate-500 text-sm mb-6">
          Are you sure you want to <strong>Toggle Ban Status</strong> for user <span className="text-slate-900 font-bold">{user.fullName}</span>?
          <br/><br/><span className="text-xs text-red-500">If banned, they will be logged out immediately.</span>
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">{loading ? "Processing..." : "Confirm"}</button>
        </div>
      </div>
    </div>
  );
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => { fetchUsers(); }, 300);
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

  const initiateBan = (user) => { setSelectedUser(user); setBanModalOpen(true); };

  const processBan = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    // Note: Backend logic toggles status based on 'banned' boolean sent. 
    // Sending !selectedUser.isBanned would be ideal if you expose isBanned in projection.
    // Assuming backend toggles regardless or we send 'true' to trigger logic.
    // For safety, let's assume we want to flip their current state.
    // Since we don't have explicit 'isBanned' in the frontend user object yet (unless you added it to projection),
    // we rely on the backend toggle or assume 'true' means 'change status'.
    
    // Simplest way given previous context: Just send a toggle signal. 
    const targetStatus = selectedUser.isBanned ? false : true; 

    try {
        await api.post("/admin/users/ban", { userId: selectedUser._id, banned: targetStatus });
        toast.success(`User status updated`);
        fetchUsers(); setBanModalOpen(false); setSelectedUser(null);
    } catch (error) { toast.error("Action failed"); } finally { setActionLoading(false); }
  };

  return ( 
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-bold text-slate-900">User Management</h1><p className="text-slate-500 text-sm">View details, linked accounts, and bank info.</p></div>
        <input type="text" placeholder="Search Name or Email..." className="bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-64 shadow-sm" onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <tr><th className="p-4">User Info</th><th className="p-4">Wallet</th><th className="p-4">Linked Socials</th><th className="p-4">Bank Details</th><th className="p-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading users...</td></tr> : users.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td></tr> : (
                    users.map(user => (
                      <tr key={user._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 align-top"><p className="font-bold text-slate-900 text-base">{user.fullName}</p><p className="text-xs text-slate-500">{user.email}</p><p className="text-[10px] text-slate-400 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p></td>
                        <td className="p-4 align-top"><span className="text-green-600 font-mono font-bold text-lg">₹{user.walletBalance}</span></td>
                        <td className="p-4 align-top"><div className="space-y-1">{user.linkedAccounts && user.linkedAccounts.length > 0 ? (user.linkedAccounts.map((acc, i) => (<div key={i} className="text-xs flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${acc.platform === 'Moj' ? 'bg-orange-500' : 'bg-purple-500'}`}></span><span className="text-slate-700">{acc.platform}</span><a href={acc.profileUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 hover:underline">↗</a></div>))) : (<span className="text-slate-400 text-xs italic">No socials linked</span>)}</div></td>
                        <td className="p-4 align-top">{user.bankDetails ? (<div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs w-fit min-w-[160px]"><p className="text-slate-900 font-bold mb-1">{user.bankDetails.details.bankName}</p><div className="text-slate-500 space-y-0.5 font-mono"><p>AC: {user.bankDetails.details.accountNumber}</p><p>IFSC: {user.bankDetails.details.ifsc}</p><p>Name: {user.bankDetails.details.fullName}</p></div></div>) : (<span className="px-2 py-1 bg-red-50 text-red-500 text-[10px] font-bold uppercase rounded border border-red-100">Not Linked</span>)}</td>
                        <td className="p-4 text-right align-top"><button onClick={() => initiateBan(user)} className="text-xs font-bold px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition shadow-sm">Ban / Unban</button></td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
        </div>
      </div>
      <BanConfirmationModal isOpen={banModalOpen} user={selectedUser} onClose={() => setBanModalOpen(false)} onConfirm={processBan} loading={actionLoading} />
    </div>
  );
}    