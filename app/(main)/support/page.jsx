// "use client";
// import { useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { motion } from "framer-motion";
// import api from "@/lib/axios";

// export default function SupportPage() {
//   const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("/support", formData);
//       toast.success("Message sent successfully!");
//       setFormData({ email: "", subject: "", message: "" });
//     } catch (error) {
//       toast.error("Failed to send message.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto py-6">
//       <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }}/>

//       <div className="grid md:grid-cols-2 gap-8 items-stretch">
//         {/* Left Side: Contact Info */}
//         <motion.div 
//           initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//           className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden"
//         >
//           <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

//           <div>
//             <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
//             <p className="text-blue-100 text-lg mb-8">
//               Have a question about your earnings or tasks? We are here to help 24/7.
//             </p>

//             <div className="space-y-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
//                 </div>
//                 <div>
//                   <p className="text-sm text-blue-200">Phone</p>
//                   <p className="font-semibold">+91 98765 43210</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
//                 </div>
//                 <div>
//                   <p className="text-sm text-blue-200">Email</p>
//                   <p className="font-semibold">help@myworker.com</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Right Side: Simple Form */}
//         <motion.div 
//           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
//           className="bg-slate-800 p-8 md:p-10 rounded-3xl border border-slate-700 shadow-xl"
//         >
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-400 mb-2">Your Email</label>
//               <input type="email" required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
//               <input type="text" required className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Payment Issue" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
//               <textarea required rows="4" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Describe your issue..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
//             </div>

//             <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50">
//               {loading ? "Sending..." : "Send Message"}
//             </button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "@/lib/axios";

export default function SupportPage() {
  const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await api.post("/support", formData); toast.success("Message sent!"); setFormData({ email: "", subject: "", message: "" }); } 
    catch (error) { toast.error("Failed to send."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Toaster position="top-right" />
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-3xl p-10 text-white flex flex-col justify-between shadow-2xl shadow-violet-200 relative overflow-hidden"
        >
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div>
            <h1 className="text-4xl font-extrabold mb-4">Contact Support</h1>
            <p className="text-violet-100 text-lg mb-8 leading-relaxed">
              Have a question about your earnings or tasks? We are here to help you grow.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">📞</div>
                <div><p className="text-xs text-violet-200 uppercase font-bold">Phone</p><p className="font-bold">+91 98765 43210</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">✉️</div>
                <div><p className="text-xs text-violet-200 uppercase font-bold">Email</p><p className="font-bold">help@myworker.com</p></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Email</label>
              <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-violet-500 outline-none transition" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Subject</label>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-violet-500 outline-none transition" placeholder="Payment Issue" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
              <textarea required rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-violet-500 outline-none resize-none transition" placeholder="Describe your issue..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            <button disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-50">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}   