// "use client";
// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import toast, { Toaster } from "react-hot-toast";
// import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
// import api from "@/lib/axios"

// export default function ResetPassword() {
//   const router = useRouter();
//   const { token } = useParams(); // Grabs the token from URL
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       return toast.error("Passwords do not match");
//     }

//     setLoading(true);
//     try {
//       await api.post(`/users/reset-password/${token}`, { password });
//       toast.success("Password reset successful!");
//       setTimeout(() => router.push("/login"), 2000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Invalid or expired token");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthLayout title="Set New Password" subtitle="Create a secure password for your account">
//       <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#fff' } }}/>
//       <form onSubmit={handleSubmit}>
//         <AuthInput 
//           label="New Password" 
//           type="password" 
//           placeholder="••••••••" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//         />
//         <AuthInput 
//           label="Confirm Password" 
//           type="password" 
//           placeholder="••••••••" 
//           value={confirmPassword} 
//           onChange={(e) => setConfirmPassword(e.target.value)} 
//         />
        
//         <div className="mt-6">
//           <AuthButton text="Update Password" isLoading={loading} />
//         </div>
//       </form>
//     </AuthLayout>
//   );
// }

"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { AuthLayout, AuthInput, AuthButton } from "@/components/AuthUI";
import api from "@/lib/axios";

const LockIcon = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try { 
        await api.post(`/users/reset-password/${token}`, { password }); 
        toast.success("Password updated successfully!"); 
        setTimeout(() => router.push("/login"), 2000); 
    } catch (error) { 
        toast.error("Failed to reset password"); 
    } finally { 
        setLoading(false); 
    }
  };

  return (
    <AuthLayout title="Set New Password" subtitle="Make sure it's 8 characters or more">
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit}>
        <AuthInput 
            label="New Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            icon={LockIcon}
        />
        <AuthInput 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••" 
            value={confirm} 
            onChange={(e) => setConfirm(e.target.value)}  
            icon={LockIcon}
        />
        <div className="mt-8"><AuthButton text="Update Password" isLoading={loading} /></div>
      </form>
    </AuthLayout>
  );
}