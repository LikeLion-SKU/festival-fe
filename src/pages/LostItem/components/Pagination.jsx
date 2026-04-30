const VISIBLE_PAGES = 5;

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(VISIBLE_PAGES / 2), totalPages - VISIBLE_PAGES + 1)
  );
  const endPage = Math.min(totalPages, startPage + VISIBLE_PAGES - 1);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div
      className="flex items-center justify-center"
      style={{ paddingBottom: '30px', gap: '20px' }}
    >
      <div className="flex items-center" style={{ gap: 4 }}>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          aria-label="첫 페이지"
          className="flex items-center justify-center bg-[#2a2a2a] text-[#A0A0A0] disabled:opacity-30 transition-colors"
          style={{ width: 28, height: 28 }}
        >
          <ChevronDoubleLeft />
        </button>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="이전 페이지"
          className="flex items-center justify-center bg-[#2a2a2a] text-[#A0A0A0] disabled:opacity-30 transition-colors"
          style={{ width: 28, height: 28 }}
        >
          <ChevronLeft />
        </button>
      </div>

      <div className="flex items-center gap-[0.5rem]">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`${page}페이지`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`flex items-center justify-center rounded-full text-[0.875rem] font-semibold transition-colors ${
              page === currentPage ? 'text-white' : 'text-[#A0A0A0]'
            }`}
            style={{
              letterSpacing: '-0.025em',
              width: 28,
              height: 28,
              ...(page === currentPage && {
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                background: 'rgba(196, 58, 49, 0.5)',
                border: '1px solid',
                borderColor: 'rgba(255,255,255,0.22)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.15)',
              }),
            }}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="flex items-center" style={{ gap: 4 }}>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="다음 페이지"
          className="flex items-center justify-center bg-[#2a2a2a] text-[#A0A0A0] disabled:opacity-30 transition-colors"
          style={{ width: 28, height: 28 }}
        >
          <ChevronRight />
        </button>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="마지막 페이지"
          className="flex items-center justify-center bg-[#2a2a2a] text-[#A0A0A0] disabled:opacity-30 transition-colors"
          style={{ width: 28, height: 28 }}
        >
          <ChevronDoubleRight />
        </button>
      </div>
    </div>
  );
}

function ChevronDoubleLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  );
}

function ChevronDoubleRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
