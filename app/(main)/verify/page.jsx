// "use client";
// import SocialLinker from "@/components/SocialLinker";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// export default function VerifyPage() {
//   const router = useRouter();

//   const handleSuccess = () => {
//     router.push("/tasks");
//   };

//   return (
//     <div className="max-w-3xl mx-auto py-10">
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
//         <h1 className="text-3xl font-bold text-white mb-2">Verify Your Account</h1>
//         <p className="text-slate-400">Link your social media profile to start earning rewards.</p>
//       </motion.div>

//       <div className="max-w-xl mx-auto">
//         <SocialLinker onSuccess={handleSuccess} />
//       </div>
//     </div>
//   );
// }
"use client";
import SocialLinker from "@/components/SocialLinker";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// --- Icons ---
const ShieldIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const LightningIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const LockIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

// --- Components ---
const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay }}
    className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4"
  >
    <div className="p-3 bg-violet-50 text-violet-600 rounded-xl shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export default function VerifyPage() {
  const router = useRouter();
  const handleSuccess = () => router.push("/tasks");

  return (
    <div className="min-h-screen relative py-12 px-4 flex flex-col items-center justify-center overflow-hidden">
      
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
      </div>

      {/* --- Main Content Container --- */}
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Context & Features */}
        <div className="order-2 lg:order-1 space-y-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-[1.1]">
                    Verify to Start <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">
                        Earning Today
                    </span>
                </h1>
                <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
                    Link your active social media profile to unlock daily tasks and instant withdrawals.
                </p>
            </motion.div>

            <div className="space-y-4">
                <FeatureCard 
                    delay={0.2}
                    icon={<ShieldIcon />}
                    title="Identity Protection"
                    desc="We use read-only access to verify your account. Your personal data is never shared."
                />
                <FeatureCard 
                    delay={0.3}
                    icon={<LightningIcon />}
                    title="Instant Activation"
                    desc="Verification takes less than 30 seconds. Start completing tasks immediately after."
                />
                <FeatureCard 
                    delay={0.4}
                    icon={<LockIcon />}
                    title="Secure Connection"
                    desc="We use bank-grade encryption to ensure your account details remain safe."
                />
            </div>
        </div>

        {/* Right Column: The Verification Card */}
        <div className="order-1 lg:order-2">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-violet-200/50 border border-slate-100 relative overflow-hidden"
            >
                {/* Decorative Blur Inside Card */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-100 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-4 shadow-inner">
                            🔗
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Link Account</h2>
                        <p className="text-slate-500 text-sm font-medium">Select a platform to connect</p>
                    </div>

                    {/* The Functional Component */}
                    <SocialLinker onSuccess={handleSuccess} />

                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Trusted by 10,000+ Earners</p>
                    </div>
                </div>
            </motion.div>
        </div>

      </div>
    </div>
  );
}