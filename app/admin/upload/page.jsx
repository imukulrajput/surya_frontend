"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios"

export default function UploadTasks() {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick helper to generate template
  const generateTemplate = () => { 
    const template = Array.from({ length: 5 }, (_, i) => ({
      title: `Task #${i + 1}`,
      videoUrl: "https://drive.google.com/...",
      caption: "Viral video #trending",
      rewardAmount: 2.5
    }));
    setJsonInput(JSON.stringify(template, null, 2));
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const tasks = JSON.parse(jsonInput);
     await api.post("/admin/batch-create", { tasks });
      toast.success(`Successfully created ${tasks.length} tasks!`);
    } catch (error) {
      toast.error("Invalid JSON or Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Bulk Task Upload</h1>
      
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
        <div className="flex justify-between mb-4">
            <p className="text-slate-400">Paste your JSON array of 50 tasks here.</p>
            <button onClick={generateTemplate} className="text-sm text-blue-400 hover:underline">Generate Template</button>
        </div>
        
        <textarea
            className="w-full h-96 bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm text-green-400 focus:outline-none"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ { "title": "Task 1", ... } ]'
        ></textarea>

        <button 
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
        >
            {loading ? "Uploading..." : "Upload Daily Batch"}
        </button>
      </div>
    </div>
  );
}  