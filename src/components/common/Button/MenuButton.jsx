import clsx from 'clsx';

export default function MenuButton({ className, onClick, ariaLabel, variant = 'menu' }) {
  const label = ariaLabel ?? (variant === 'close' ? '메뉴 닫기' : '메뉴 열기');

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={clsx(
        'relative flex h-[3.4375rem] w-[3.4375rem] items-center justify-center overflow-hidden rounded-[12.5rem]',
        className
      )}
      style={{
        background: 'rgba(26, 26, 26, 0.7)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 8px rgba(255,255,255,0.22)',
          filter: 'blur(1.2px)',
        }}
      />
      <span className="sr-only">{variant === 'close' ? 'close' : 'menu'}</span>
      {variant === 'close' ? (
        <span
          aria-hidden="true"
          className="relative z-10 flex h-[2rem] w-[2rem] items-center justify-center"
        >
          <span className="absolute h-[0.125rem] w-[1.15rem] rotate-45 rounded-full bg-[#DA3328]" />
          <span className="absolute h-[0.125rem] w-[1.15rem] -rotate-45 rounded-full bg-[#DA3328]" />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="relative z-10 flex h-[2rem] w-[2rem] flex-col items-center justify-center gap-[0.3125rem]"
        >
          <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
          <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
          <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
        </span>
      )}
    </button>
  );
}
