import clsx from 'clsx';

export default function MenuButton({ className, onClick, ariaLabel = '메뉴 열기' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(
        'flex h-[3.4375rem] w-[3.4375rem] items-center justify-center overflow-hidden rounded-[12.5rem]',
        className
      )}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid transparent',
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
      <span className="sr-only">menu</span>
      <span
        aria-hidden="true"
        className="relative z-10 flex h-[2rem] w-[2rem] flex-col items-center justify-center gap-[0.3125rem]"
      >
        <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
        <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
        <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
      </span>
    </button>
  );
}
