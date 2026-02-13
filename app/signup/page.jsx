// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
// import api from "@/lib/axios"

// export default function Signup() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true); 
//     try { 
//       await api.post("/users/signup", formData);
//       toast.success("Account created!");
//       router.push("/dashboard"); 
//     } catch (error) {
//       // --- IMPROVED ERROR HANDLING ---
//       let errorMessage = "Signup failed";

//       if (!error.response) {
//         errorMessage = "Unable to connect to server. Please try again later.";
//       } else if (error.response.status === 409) {
//          errorMessage = "This email is already registered.";
//       } else {
//         errorMessage = error.response.data?.message || "Could not create account.";
//       }

//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout title="Join MyWorker" subtitle="Start your professional journey today">
//       <Toaster position="top-right" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
//       <form onSubmit={handleSubmit}>
//         <AuthInput label="Full Name" name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
//         <AuthInput label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
//         <AuthInput label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
        
//         <div className="mt-6">
//           <AuthButton text="Create Account" isLoading={loading} />
//         </div>
//       </form>
//       <p className="text-center text-textMuted mt-6 text-sm">
//         Already have an account? <Link href="/login" className="text-primary hover:text-blue-400 font-semibold transition-colors">Log in</Link>
//       </p>
//     </AuthLayout>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
import api from "@/lib/axios";

// Icons
const UserIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const EmailIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>;
const LockIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { 
      await api.post("/users/signup", formData);
      toast.success("Account created successfully!");
      router.push("/dashboard"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally { 
      setLoading(false); 
    }
  };
     
  return (
    <AuthLayout title="Create Account" subtitle="Join 10,000+ earners today">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }}/>
      <form onSubmit={handleSubmit}>
        <AuthInput 
            label="Full Name" 
            name="fullName" 
            type="text" 
            placeholder="John Doe" 
            value={formData.fullName} 
            onChange={handleChange} 
            icon={UserIcon}
        />
        <AuthInput 
            label="Email Address" 
            name="email" 
            type="email" 
            placeholder="john@example.com" 
            value={formData.email} 
            onChange={handleChange} 
            icon={EmailIcon}
        />
        <AuthInput 
            label="Password" 
            name="password" 
            type="password" 
            placeholder="Create a strong password" 
            value={formData.password} 
            onChange={handleChange} 
            icon={LockIcon}
        />
        <div className="mt-8"><AuthButton text="Create Account" isLoading={loading} /></div>
      </form>
      <p className="text-center text-slate-500 mt-6 text-sm font-medium">
        Already have an account? <Link href="/login" className="text-violet-600 hover:text-blue-600 font-bold transition-colors">Log in</Link>
      </p>
    </AuthLayout>
  );
} 