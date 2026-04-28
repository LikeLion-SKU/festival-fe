export default function OpenButton({ open, color = '#252525', className = '' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`transition-transform ${open ? 'rotate-180' : ''} ${className}`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
