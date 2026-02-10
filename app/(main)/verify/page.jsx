"use client";
import SocialLinker from "@/components/SocialLinker";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/tasks");
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Verify Your Account</h1>
        <p className="text-slate-400">Link your social media profile to start earning rewards.</p>
      </motion.div>

      <div className="max-w-xl mx-auto">
        <SocialLinker onSuccess={handleSuccess} />
      </div>
    </div>
  );
}