"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
import api from "@/lib/axios" 

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
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      // --- IMPROVED ERROR HANDLING ---
      let errorMessage = "Something went wrong";

      if (!error.response) {
        // Network error (Backend down or internet issue)
        errorMessage = "Unable to connect to server. Is the backend running?";
      } else if (error.response.status === 401) {
        // Specific credential error
        errorMessage = "Invalid email or password.";
      } else {
        // Other server errors (400, 500, etc.)
        errorMessage = error.response.data?.message || "Login failed.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Access your workspace">
      <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
      <form onSubmit={handleSubmit}>
        <AuthInput label="Email Address" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
        <AuthInput label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
        
        <div className="flex justify-end mb-6">
          <Link href="/forgot-password" className="text-sm text-primary hover:text-blue-400 transition-colors">
            Forgot Password?
          </Link>
        </div>

        <AuthButton text="Sign In" isLoading={loading} />
      </form>
      <p className="text-center text-textMuted mt-6 text-sm">
        New to MyWorker? <Link href="/signup" className="text-primary hover:text-blue-400 font-semibold transition-colors">Create account</Link>
      </p>
    </AuthLayout>
  );
}