// "use client";
// import { useState } from "react";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import api from "@/lib/axios"

// export default function UploadTasks() {
//   const [jsonInput, setJsonInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Quick helper to generate template
//   const generateTemplate = () => { 
//     const template = Array.from({ length: 5 }, (_, i) => ({
//       title: `Task #${i + 1}`,
//       videoUrl: "https://drive.google.com/...",
//       caption: "Viral video #trending",
//       rewardAmount: 2.5
//     }));
//     setJsonInput(JSON.stringify(template, null, 2));
//   };

//   const handleUpload = async () => {
//     setLoading(true);
//     try {
//       const tasks = JSON.parse(jsonInput);
//      await api.post("/admin/batch-create", { tasks });
//       toast.success(`Successfully created ${tasks.length} tasks!`);
//     } catch (error) {
//       toast.error("Invalid JSON or Server Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl">
//       <Toaster />
//       <h1 className="text-3xl font-bold mb-6">Bulk Task Upload</h1>
      
//       <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
//         <div className="flex justify-between mb-4">
//             <p className="text-slate-400">Paste your JSON array of 50 tasks here.</p>
//             <button onClick={generateTemplate} className="text-sm text-blue-400 hover:underline">Generate Template</button>
//         </div>
        
//         <textarea
//             className="w-full h-96 bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm text-green-400 focus:outline-none"
//             value={jsonInput}
//             onChange={(e) => setJsonInput(e.target.value)}
//             placeholder='[ { "title": "Task 1", ... } ]'
//         ></textarea>

//         <button 
//             onClick={handleUpload}
//             disabled={loading}
//             className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
//         >
//             {loading ? "Uploading..." : "Upload Daily Batch"}
//         </button>
//       </div>
//     </div>
//   );
// }  

"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "@/lib/axios";

export default function UploadTasks() {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateTemplate = () => { 
    setJsonInput(JSON.stringify([{ title: "Task 1", videoUrl: "https://...", caption: "#viral", rewardAmount: 2.5 }], null, 2));
  };

  const handleUpload = async () => {
    setLoading(true);
    try { await api.post("/admin/batch-create", { tasks: JSON.parse(jsonInput) }); toast.success("Batch Uploaded!"); } 
    catch (e) { toast.error("Invalid JSON"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Bulk Upload</h1>
      <p className="text-slate-500 mb-8">Upload multiple tasks at once using JSON format.</p>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">JSON Editor</span>
            <button onClick={generateTemplate} className="text-sm font-bold text-violet-600 hover:underline">Insert Template</button>
        </div>
        
        <textarea
            className="w-full h-96 bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition resize-none"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ { "title": "Task 1", ... } ]'
        ></textarea>

        <button 
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition shadow-lg shadow-violet-200 disabled:opacity-50"
        >
            {loading ? "Processing..." : "Upload Tasks"}
        </button>
      </div>
    </div>
  );
}