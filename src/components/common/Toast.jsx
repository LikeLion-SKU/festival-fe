import { useEffect } from 'react';

function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <style>{`
        @keyframes draw-circle {
          from { stroke-dashoffset: 190; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
        .toast-circle {
          stroke-dasharray: 190;
          stroke-dashoffset: 190;
          animation: draw-circle 0.35s ease-out forwards;
        }
        .toast-check {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: draw-check 0.5s ease-out 0.32s forwards;
        }
      `}</style>
      <circle className="toast-circle" cx="32" cy="32" r="30" stroke="white" strokeWidth="2.5" />
      <path
        className="toast-check"
        d="M20 32l9 9 15-16"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  check: <CheckIcon />,
  warning: (
    <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
      <path
        d="M32 8L58 54H6L32 8Z"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M32 28v10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="44" r="1.5" fill="white" />
    </svg>
  ),
};

export default function Toast({
  message,
  visible,
  onClose,
  duration = 1500,
  icon = 'check',
  variant,
  className = '',
}) {
  useEffect(() => {
    if (!visible || !onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (variant === 'pill') {
    return (
      <div
        className={`w-44 h-11 flex items-center justify-center bg-gray-50 rounded-full shadow-[0px_0px_5px_0px_rgba(196,58,49,0.35)] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
      >
        <span className="text-sm font-semibold text-gray-500">{message}</span>
      </div>
    );
  }

  if (!visible) return null;

  return (
    <div className="absolute top-1/2 left-[1.25rem] right-[1.25rem] -translate-y-1/2 z-[100] h-[11rem] rounded-[0.75rem] bg-[#353535]/40 backdrop-blur-xl border border-[#A0A0A0]/30 flex flex-col items-center justify-center gap-[1rem]">
      {ICONS[icon]}
      <p className="text-white text-[1.125rem] font-semibold" style={{ letterSpacing: '-0.025em' }}>
        {message}
      </p>
    </div>
  );
}
