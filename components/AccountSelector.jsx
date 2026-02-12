// export default function AccountSelector({ accounts, selectedAccountId, onSelect }) {
//   if (!accounts || accounts.length === 0) {
//     return <div className="text-red-400 text-sm">Please link an account first.</div>;
//   }

//   return (
//     <div className="flex gap-3 overflow-x-auto pb-2">
//       {accounts.map((acc) => (
//         <button
//           key={acc._id}
//           onClick={() => onSelect(acc._id)}
//           className={`
//             flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap
//             ${selectedAccountId === acc._id 
//               ? "bg-primary text-white border-primary shadow-lg shadow-blue-500/20" 
//               : "bg-surface text-textMuted border-border hover:border-gray-500"}
//           `}
//         >
//           {/* Icons based on platform could go here */}
//           <span className="font-bold">{acc.platform}</span>
//           <span className="text-xs opacity-75">({acc.profileUrl.split('/').pop()})</span>
//         </button>
//       ))}
//     </div>
//   );
// }     

export default function AccountSelector({ accounts, selectedAccountId, onSelect }) {
  if (!accounts || accounts.length === 0) {
    return <div className="text-red-500 text-sm font-bold">Please link an account first.</div>;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {accounts.map((acc) => (
        <button
          key={acc._id}
          onClick={() => onSelect(acc._id)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all whitespace-nowrap text-sm font-bold
            ${selectedAccountId === acc._id 
              ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200" 
              : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"}
          `}
        >
          <span>{acc.platform}</span>
          <span className="text-xs opacity-80 font-normal">@{acc.username || 'user'}</span>
        </button>
      ))}
    </div>
  );
}      