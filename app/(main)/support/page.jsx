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
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";

// --- Icons ---
const TelegramIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const MailIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const SendIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const ChevronDown = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

// --- Components ---

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all hover:shadow-md">
            <button 
                onClick={onClick}
                className="w-full flex justify-between items-center p-6 text-left"
            >
                <span className="font-bold text-slate-800 text-lg">{question}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ContactInput = ({ label, type, placeholder, value, onChange, isTextArea = false }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">{label}</label>
        {isTextArea ? (
            <textarea 
                rows="4" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all resize-none shadow-sm" 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
            />
        ) : (
            <input 
                type={type} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm" 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
            />
        )}
    </div>
);

export default function SupportPage() {
    const [formData, setFormData] = useState({ email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [openFAQ, setOpenFAQ] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);
        try { 
            await api.post("/support", formData); 
            toast.success("Message sent successfully!"); 
            setFormData({ email: "", subject: "", message: "" }); 
        } catch (error) { 
            toast.error("Failed to send message."); 
        } finally { 
            setLoading(false); 
        }
    };

    const faqs = [
        { q: "How do I withdraw my earnings?", a: "Go to the Dashboard and click 'Withdraw Funds'. We support bank transfers and UPI. Withdrawals are processed within 24-48 hours." },
        { q: "Why was my task rejected?", a: "Tasks are usually rejected if they don't meet the proof requirements or if the screenshot is unclear. Check the task instructions again." },
        { q: "Is there a minimum withdrawal limit?", a: "Yes, the minimum withdrawal amount is ₹300. Once you reach this balance, the withdraw button will become active." },
    ];

    return (
        <div className="min-h-screen py-12 px-4 md:px-8 max-w-6xl mx-auto relative">
            <Toaster position="top-right"   containerStyle={{ top: 80, zIndex: 99999 }} 
          toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />

            {/* --- Background Ambience --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70" />
            </div>

            {/* --- Header --- */}
            <div className="text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
                >
                    We're here to help
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    className="text-slate-500 text-lg max-w-2xl mx-auto"
                >
                    Have questions? Check out our FAQ or send us a message directly.
                </motion.p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start mb-20">
                
                {/* --- Left: Contact Info Card --- */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="relative bg-gradient-to-br from-violet-600 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-violet-200 overflow-hidden min-h-[500px] flex flex-col justify-between"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                        <p className="text-violet-100 text-lg mb-12 leading-relaxed opacity-90">
                            Fill out the form and our team will get back to you within 24 hours.
                        </p>
                        
                        <div className="space-y-8">
                         <a 
                                href="https://t.me/Myworksupport" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-6 group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                    <TelegramIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-violet-200 uppercase font-bold tracking-widest mb-1">Telegram Channel</p>
                                    <p className="text-xl font-bold group-hover:underline decoration-white/50 underline-offset-4">t.me/Myworksupport</p>
                                </div>
                            </a>
                            
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                    <MailIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-violet-200 uppercase font-bold tracking-widest mb-1">Email Support</p>
                                    <p className="text-xl font-bold">mywork0000011@gmail
                                      .com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 flex gap-4">
                        {/* Social Icons Placeholder */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/30 transition-colors cursor-pointer" />
                        ))}
                    </div>
                </motion.div>

                {/* --- Right: Contact Form --- */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <ContactInput 
                                label="Your Email" 
                                type="email" 
                                placeholder="john@example.com" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                            <ContactInput 
                                label="Subject" 
                                type="text" 
                                placeholder="Payment Issue" 
                                value={formData.subject} 
                                onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                            />
                        </div>
                        
                        <ContactInput 
                            label="Message" 
                            isTextArea 
                            placeholder="Describe your issue in detail..." 
                            value={formData.message} 
                            onChange={(e) => setFormData({...formData, message: e.target.value})} 
                        />
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            disabled={loading} 
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Send Message <SendIcon /></>
                            )}
                        </motion.button>
                    </form>
                </motion.div>

            </div>

            {/* --- FAQ Section --- */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-3xl font-black text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem 
                            key={index} 
                            question={faq.q} 
                            answer={faq.a} 
                            isOpen={openFAQ === index} 
                            onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)} 
                        />
                    ))}
                </div>
            </motion.div>

        </div>
    );
}