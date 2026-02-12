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
      toast.success("Account created!");
      router.push("/dashboard"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join us and start earning today">
      <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }}/>
      <form onSubmit={handleSubmit}>
        <AuthInput label="Full Name" name="fullName" type="text" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
        <AuthInput label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
        <AuthInput label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
        <div className="mt-8"><AuthButton text="Sign Up" isLoading={loading} /></div>
      </form>
      <p className="text-center text-slate-500 mt-6 text-sm">
        Already have an account? <Link href="/login" className="text-violet-600 font-bold hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}     