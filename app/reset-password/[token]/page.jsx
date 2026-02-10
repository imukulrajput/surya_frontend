"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
import api from "@/lib/axios"

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useParams(); // Grabs the token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await api.post(`/users/reset-password/${token}`, { password });
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set New Password" subtitle="Create a secure password for your account">
      <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
      <form onSubmit={handleSubmit}>
        <AuthInput 
          label="New Password" 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <AuthInput 
          label="Confirm Password" 
          type="password" 
          placeholder="••••••••" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        
        <div className="mt-6">
          <AuthButton text="Update Password" isLoading={loading} />
        </div>
      </form>
    </AuthLayout>
  );
}