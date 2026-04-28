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
        'transition-transform duration-150 active:scale-95',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <div className="relative" style={{ width: 44, height: 44 }}>
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(53, 53, 53, 0.10)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(
                -45deg,
                rgba(255, 255, 255, 0.10) 0%,
                rgba(255, 255, 255, 0.04) 30%,
                rgba(255, 255, 255, 0.00) 60%,
                rgba(0, 0, 0, 0.04) 100%
              )`,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: -4,
              left: -4,
              width: 32,
              height: 32,
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
              filter: 'blur(3px)',
            }}
          />
        </div>

        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            aria-hidden="true"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
          >
            <path
              d="M26 14L18 22L26 30"
              stroke="rgba(255,255,255,0.80)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
