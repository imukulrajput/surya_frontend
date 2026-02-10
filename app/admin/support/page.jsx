"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios"

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
       const { data } = await api.get("/admin/support");
        setTickets(data.tickets);
    } catch (e) {}
  };

  const handleStatus = async (id, newStatus) => {
    try {
      await api.post("/admin/support/status", { ticketId: id, status: newStatus });       
        toast.success("Status Updated");
        fetchTickets();
    } catch (e) { toast.error("Failed"); }
  };

  return (
    <div>
      <Toaster />
      <h1 className="text-3xl font-bold text-white mb-6">Support Inbox</h1>
      
      <div className="grid gap-4">
        {tickets.map(ticket => (
            <div key={ticket._id} className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-white text-lg">{ticket.subject}</h3>
                        <p className="text-slate-500 text-sm">From: {ticket.email}</p>
                    </div>
                    <div className="flex gap-2">
                        {ticket.status === "Open" ? (
                            <button 
                                onClick={() => handleStatus(ticket._id, "Closed")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold"
                            >
                                Mark Closed
                            </button>
                        ) : (
                            <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs font-bold">Closed</span>
                        )}
                    </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg text-slate-300 text-sm whitespace-pre-wrap">
                    {ticket.message}
                </div>
                <p className="text-xs text-slate-600 mt-2">
                    Received: {new Date(ticket.createdAt).toLocaleString()}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
} 