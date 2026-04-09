
"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";
import { motion } from "framer-motion";

const EditTaskModal = ({ isOpen, onClose, task, onUpdate }) => {
    const [formData, setFormData] = useState({ ...task });
    const [loading, setLoading] = useState(false);

    useEffect(() => { if(task) setFormData({ ...task }); }, [task]);
    if (!isOpen || !task) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try { await api.put(`/admin/tasks/${task._id}`, formData); toast.success("Updated"); onUpdate(); onClose(); } 
        catch (error) { toast.error("Failed"); } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white border border-slate-100 w-full max-w-lg rounded-2xl p-8 shadow-2xl relative">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Task</h2>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Title</label><input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Video URL</label><input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Caption</label><textarea className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" rows="3" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} /></div>
                    <div className="flex gap-4">
                        <div className="flex-1"><label className="text-xs font-bold text-slate-500 uppercase">Reward (₹)</label><input type="number" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500" value={formData.rewardAmount} onChange={e => setFormData({...formData, rewardAmount: e.target.value})} /></div>
                        <div className="flex-1 pt-6"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-5 h-5 accent-violet-600" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} /><span className="font-bold text-slate-700">Active</span></label></div>
                    </div>
                </div>
                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition shadow-lg shadow-violet-200">{loading ? "Saving..." : "Save Changes"}</button>
                </div>
            </div>
        </div>
    );
};

export default function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editTask, setEditTask] = useState(null);

    const fetchTasks = async () => { try { const { data } = await api.get("/admin/tasks"); setTasks(data.tasks); } catch (e){} finally { setLoading(false); } };
    useEffect(() => { fetchTasks(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this task?")) return;
        try { await api.delete(`/admin/tasks/${id}`); toast.success("Deleted"); setTasks(prev => prev.filter(t => t._id !== id)); } catch (e) { toast.error("Failed"); }
    };

    return (
        <div>
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Task Manager</h1>
                <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-slate-500 text-sm font-medium mr-2">Total Tasks:</span>
                    <span className="text-violet-600 font-black text-lg">{tasks.length}</span>
                </div>
            </div>

            {loading ? <div className="text-slate-500">Loading...</div> : (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <motion.div key={task._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-slate-900 text-lg">{task.title}</h3>
                                    <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-bold px-2 py-0.5 rounded">₹{task.rewardAmount}</span>
                                    {!task.active && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">Inactive</span>}
                                </div>
                                <p className="text-slate-500 text-sm font-medium truncate max-w-xl">{task.caption}</p>
                                <a href={task.videoUrl} target="_blank" className="text-violet-600 text-xs font-bold hover:underline mt-1 block">View File ↗</a>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <button onClick={() => setEditTask(task)} className="px-5 py-2.5 bg-slate-50 text-slate-600 hover:text-violet-600 font-bold rounded-xl border border-slate-200 transition">Edit</button>
                                <button onClick={() => handleDelete(task._id)} className="px-5 py-2.5 bg-white text-red-500 hover:bg-red-50 font-bold rounded-xl border border-slate-200 hover:border-red-100 transition">Delete</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            <EditTaskModal isOpen={!!editTask} onClose={() => setEditTask(null)} task={editTask} onUpdate={fetchTasks} />
        </div>
    );
}  