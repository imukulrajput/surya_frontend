// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
// import api from "@/lib/axios" 

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

// // ... existing imports

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("/users/forgot-password", { email });
//       toast.success("Reset link sent! Please check your email.");
//       setEmail("");
//     } catch (error) {
//       // --- IMPROVED ERROR HANDLING ---
//       let errorMessage = "Request failed";

//       if (!error.response) {
//         errorMessage = "Server unreachable. Please check your connection.";
//       } else if (error.response.status === 404) {
//         errorMessage = "No account found with this email.";
//       } else {
//         errorMessage = error.response.data?.message || "Could not send reset link.";
//       }

//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
//       <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
//       <form onSubmit={handleSubmit}>
//         <AuthInput label="Email Address" name="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        
//         <div className="mt-6">
//           <AuthButton text="Send Reset Link" isLoading={loading} />
//         </div>
//       </form>
//       <div className="mt-6 text-center">
//         <Link href="/login" className="text-sm text-textMuted hover:text-white transition-colors">
//           ← Back to Login
//         </Link>
//       </div>
//     </AuthLayout>
//   );
// }
"use client";
import { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
import api from "@/lib/axios";

const EmailIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    try { 
        await api.post("/users/forgot-password", { email }); 
        toast.success("Reset link sent to your email!"); 
        setEmail(""); 
    } catch (error) { 
        toast.error(error.response?.data?.message || "Failed to send link"); 
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive instructions">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit}>
        <AuthInput 
            label="Email Address" 
            name="email" 
            type="email" 
            placeholder="john@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            icon={EmailIcon}
        />
        <div className="mt-8"><AuthButton text="Send Reset Link" isLoading={loading} /></div>
      </form>
      <div className="mt-8 text-center">
        <Link href="/login" className="text-sm text-slate-500 hover:text-violet-600 font-bold flex items-center justify-center gap-2 transition-colors">
            <span>←</span> Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}