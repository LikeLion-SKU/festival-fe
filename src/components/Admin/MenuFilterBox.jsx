export default function MenuFilterBox({
  title,
  count,
  filters,
  dateFilter,
  onDateFilterChange,
  searchQuery,
  onSearchQueryChange,
  showRevenueButton = false,
  onRevenueClick,
}) {
  return (
    <div className="sticky flex w-full flex-col gap-3 bg-white px-5 pt-3 pb-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center">
        <p className="text-[16px] font-semibold leading-[1.6] text-[#222]">
          {title} <span className="text-[14px] font-medium text-[#A0A0A0]">(총 {count}건)</span>
        </p>
        {showRevenueButton && (
          <button
            onClick={onRevenueClick}
            className="flex w-18 h-8 justify-center items-center bg-[#FFDDDB] text-[#FE5F54] text-[14px] font-medium rounded-lg"
          >
            매출 확인
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {filters.map((f) => {
          const active = dateFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onDateFilterChange(f.key)}
              className={`w-14 h-8 rounded-lg px-3 text-[13px] font-medium ${
                active ? 'bg-[#FF756C] text-white' : 'bg-[#F6F6F6] text-[#7F7F7F]'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex h-10 w-full items-center gap-2 rounded-lg border border-[#A0A0A0] px-3">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke="#A0A0A0" strokeWidth="1.4" />
          <path d="M12.5 12.5L15.5 15.5" stroke="#A0A0A0" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="이름 또는 전화번호로 검색"
          className="flex-1 bg-transparent text-[14px] text-[#222] placeholder:text-[#A0A0A0] outline-none"
        />
      </div>
    </div>
  );
}
