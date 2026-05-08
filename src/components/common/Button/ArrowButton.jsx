import { useRef, useState } from 'react';

export default function ArrowButton({ direction, onClick, disabled, ariaLabel }) {
  const isLeft = direction === 'left';
  const [pressed, setPressed] = useState(false);
  const timerRef = useRef(null);

  const handleClick = () => {
    setPressed(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPressed(false), 400);
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel ?? (isLeft ? '이전' : '다음')}
      className="rounded-full flex items-center justify-center active:scale-95 disabled:opacity-30"
      style={{
        width: '40px',
        height: '40px',
        background: pressed ? '#2A2A2A' : '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
        {isLeft ? (
          <polygon points="11,2 11,14 3,8" fill="#DA3328" />
        ) : (
          <polygon points="5,2 5,14 13,8" fill="#DA3328" />
        )}
      </svg>
    </button>
  );
}
