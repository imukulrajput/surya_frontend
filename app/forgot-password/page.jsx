"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
import api from "@/lib/axios" 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

// ... existing imports

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/forgot-password", { email });
      toast.success("Reset link sent! Please check your email.");
      setEmail("");
    } catch (error) {
      // --- IMPROVED ERROR HANDLING ---
      let errorMessage = "Request failed";

      if (!error.response) {
        errorMessage = "Server unreachable. Please check your connection.";
      } else if (error.response.status === 404) {
        errorMessage = "No account found with this email.";
      } else {
        errorMessage = error.response.data?.message || "Could not send reset link.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
      <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
      <form onSubmit={handleSubmit}>
        <AuthInput label="Email Address" name="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <div className="mt-6">
          <AuthButton text="Send Reset Link" isLoading={loading} />
        </div>
      </form>
      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-textMuted hover:text-white transition-colors">
          ← Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}