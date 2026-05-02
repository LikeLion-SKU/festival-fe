export default function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="box-border flex h-[3.25rem] w-full items-center justify-between overflow-hidden border border-[#A0A0A0]/40 bg-[#353535]/20 px-[1.25rem]">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[0.875rem] font-semibold text-white placeholder:text-[#A0A0A0] outline-none"
        style={{ letterSpacing: '-0.025em', lineHeight: '1.25rem' }}
      />
      <svg
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#A0A0A0"
        strokeWidth="2.8"
        strokeLinecap="butt"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0 ml-[0.75rem]"
      >
        <circle cx="10" cy="10" r="7" strokeLinecap="round" />
        <line x1="15.5" y1="15.5" x2="21.5" y2="21.5" />
      </svg>
    </div>
  );
}
