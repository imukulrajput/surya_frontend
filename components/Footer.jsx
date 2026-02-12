// export default function Footer() {
//   return (
//     <footer className="border-t border-slate-800 bg-[#0f172a] mt-auto">
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           <div className="text-slate-500 text-sm">
//             &copy; {new Date().getFullYear()} MyWorker. All rights reserved.
//           </div>
//           <div className="flex gap-6 text-sm font-medium text-slate-400">
//             <span className="cursor-pointer hover:text-white transition">Terms</span>
//             <span className="cursor-pointer hover:text-white transition">Privacy</span>
//             <span className="cursor-pointer hover:text-white transition">Help</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// } 

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} MyWorker. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <span className="cursor-pointer hover:text-violet-600 transition">Terms</span>
            <span className="cursor-pointer hover:text-violet-600 transition">Privacy</span>
            <span className="cursor-pointer hover:text-violet-600 transition">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}   