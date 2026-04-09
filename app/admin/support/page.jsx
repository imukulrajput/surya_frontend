

"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const load = async () => { try { const { data } = await api.get("/admin/support"); setTickets(data.tickets); } catch(e){} };
    load();
  }, []);

  const handleStatus = async (id) => {
    try { await api.post("/admin/support/status", { ticketId: id, status: "Closed" }); toast.success("Closed"); 
    setTickets(prev => prev.map(t => t._id === id ? {...t, status: 'Closed'} : t)); } catch (e) { toast.error("Failed"); }
  };

  return (
    <div>
      <Toaster />
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Support Inbox</h1>
      
      <div className="grid gap-4">
        {tickets.map(ticket => (
            <div key={ticket._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{ticket.subject}</h3>
                        <p className="text-slate-500 text-sm">{ticket.email}</p>
                    </div>
                    {ticket.status === "Open" ? (
                        <button onClick={() => handleStatus(ticket._id)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-1.5 rounded-lg text-xs font-bold border border-blue-100 transition">Mark Closed</button>
                    ) : (
                        <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold border border-slate-200">Closed</span>
                    )}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap border border-slate-100 mb-2">
                    {ticket.message}
                </div>
                <p className="text-xs text-slate-400 font-medium">Received: {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
        ))}
        {tickets.length === 0 && <p className="text-center text-slate-400 py-10">No tickets found.</p>}
      </div>
    </div>
  );
}