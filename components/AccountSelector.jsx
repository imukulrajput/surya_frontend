export default function AccountSelector({ accounts, selectedAccountId, onSelect }) {
  if (!accounts || accounts.length === 0) {
    return <div className="text-red-400 text-sm">Please link an account first.</div>;
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {accounts.map((acc) => (
        <button
          key={acc._id}
          onClick={() => onSelect(acc._id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap
            ${selectedAccountId === acc._id 
              ? "bg-primary text-white border-primary shadow-lg shadow-blue-500/20" 
              : "bg-surface text-textMuted border-border hover:border-gray-500"}
          `}
        >
          {/* Icons based on platform could go here */}
          <span className="font-bold">{acc.platform}</span>
          <span className="text-xs opacity-75">({acc.profileUrl.split('/').pop()})</span>
        </button>
      ))}
    </div>
  );
}     