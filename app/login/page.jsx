// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
// import api from "@/lib/axios" 

// export default function Login() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("/users/login", formData);
//       toast.success("Welcome back!");
//       setTimeout(() => router.push("/dashboard"), 1500);
//     } catch (error) {
//       // --- IMPROVED ERROR HANDLING ---
//       let errorMessage = "Something went wrong";

//       if (!error.response) {
//         // Network error (Backend down or internet issue)
//         errorMessage = "Unable to connect to server. Is the backend running?";
//       } else if (error.response.status === 401) {
//         // Specific credential error
//         errorMessage = "Invalid email or password.";
//       } else {
//         // Other server errors (400, 500, etc.)
//         errorMessage = error.response.data?.message || "Login failed.";
//       }
      
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout title="Welcome Back" subtitle="Access your workspace">
//       <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
//       <form onSubmit={handleSubmit}>
//         <AuthInput label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
//         <AuthInput label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
        
//         <div className="flex justify-end mb-6">
//           <Link href="/forgot-password" className="text-sm text-primary hover:text-blue-400 transition-colors">
//             Forgot Password?
//           </Link>
//         </div>

//         <AuthButton text="Sign In" isLoading={loading} />
//       </form>
//       <p className="text-center text-textMuted mt-6 text-sm">
//         New to MyWorker? <Link href="/signup" className="text-primary hover:text-blue-400 font-semibold transition-colors">Create account</Link>
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
const EmailIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>;
const LockIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/login", formData);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (!error.response) errorMessage = "Unable to connect to server.";
      else if (error.response.status === 401) errorMessage = "Invalid email or password.";
      else errorMessage = error.response.data?.message || "Login failed.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue earning rewards">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }}/>
      
      <form onSubmit={handleSubmit} className="space-y-2">
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
            placeholder="••••••••" 
            value={formData.password} 
            onChange={handleChange} 
            icon={LockIcon}
        />
        
        <div className="flex justify-end mb-8">
          <Link href="/forgot-password" className="text-sm font-bold text-violet-600 hover:text-blue-600 transition-colors">
            Forgot password?
          </Link>
        </div>

        <AuthButton text="Sign In" isLoading={loading} />
      </form>
      
      <p className="text-center text-slate-500 mt-8 text-sm font-medium">
        Don't have an account? <Link href="/signup" className="text-violet-600 hover:text-blue-600 font-bold transition-colors">Create one now</Link>
      </p>
    </AuthLayout>
  );
} 