import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, onClick, fixed = true, className }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (to) return navigate(to);
    navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="뒤로가기"
      className={[
        fixed ? 'fixed top-5 left-4 z-50' : '',
        'flex h-[3rem] w-[3rem] items-center justify-center rounded-[12.5rem] transition-transform duration-150 active:scale-95',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        background: 'rgba(26, 26, 26, 0.7)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: 'pointer',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="relative z-10"
      >
        <path
          d="M15 6L9 12L15 18"
          stroke="#DA3328"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
