function IsTakeOutButton({ isActive, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 rounded-[10px] flex items-center justify-between px-6 font-semibold border ${
        isActive ? 'bg-button-red text-white border-button-red' : 'bg-white border-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default IsTakeOutButton;
