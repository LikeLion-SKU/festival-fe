export default function OrderHeader({
  title,
  titleClassName = '',
  showBackButton = false,
  onBack,
}) {
  return (
    <div className="relative flex h-14 w-full items-center justify-center px-5 mt-10">
      {showBackButton && (
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로 가기"
          className="absolute left-5 flex size-11 items-center justify-center rounded-3xl shadow-[0_0_4px_rgba(0,0,0,0.25)]"
        >
          <svg
            width="10"
            height="18"
            viewBox="0 0 10 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 1L1 9L9 17"
              stroke="#1A1A1A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <h1
        className={`text-[18px] font-semibold leading-normal tracking-[-0.45px] text-[#1A1A1A] ${titleClassName}`}
      >
        {title}
      </h1>
    </div>
  );
}
