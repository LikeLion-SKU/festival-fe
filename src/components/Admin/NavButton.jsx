export default function NavButton({ iconUrl, activeIconUrl, name, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-15 flex-1 flex-col items-center gap-2 ${
        isActive ? 'border-b-2 border-[#FF756C]' : ''
      }`}
    >
      <img src={isActive ? activeIconUrl : iconUrl} alt="" className="shrink-0" />
      <span
        className={`text-[13px] font-medium leading-[19.5px] tracking-[-0.3px] ${
          isActive ? 'text-[#FF756C]' : 'text-[#A0A0A0]'
        }`}
      >
        {name}
      </span>
    </button>
  );
}
