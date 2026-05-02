import clsx from 'clsx';

const BG_DEFAULT = '#121212';
const BG_ACTIVE = '#C43A31';
const STROKE = '#C43A31';
const SIDE_RECT_CLASS =
  'relative box-border flex h-[4.25rem] w-[0.5rem] shrink-0 border-1 border-solid border-[#C43A31] bg-[#121212]';

function LeftSideRect({ className, height, tickCount = 8 }) {
  const tick = '#C43A31';

  return (
    <div
      className={clsx(SIDE_RECT_CLASS, className)}
      style={{ borderColor: STROKE, ...(height ? { height } : {}) }}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-x-[2px] inset-y-[3px]">
        {Array.from({ length: tickCount }).map((_, i) => (
          <span
            key={i}
            className="absolute left-0 block h-px rounded-[1px]"
            style={{
              top: `${((i + 0.5) / tickCount) * 100}%`,
              transform: 'translateY(-50%)',
              width: '0.3125rem',
              backgroundColor: tick,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MiddleRect() {
  return (
    <div
      className="z-10 box-border flex h-[1.05rem] w-[2.6rem] shrink-0 items-end justify-center border-1 border-solid bg-[#121212] pb-[1px]"
      style={{ borderColor: STROKE }}
      aria-hidden
    >
      <div
        className="box-border h-[0.6rem] w-[1rem] translate-y-[2px] border-1 border-solid bg-[#121212]"
        style={{ borderColor: STROKE }}
      />
    </div>
  );
}

function TopLongRect() {
  return (
    <div
      className="box-border h-[0.25rem] w-[1.2rem] border-1 border-solid bg-[#121212]"
      style={{ borderColor: STROKE }}
      aria-hidden
    />
  );
}

/**
 * 은주2관 (부스 지도용)
 * @param {{ active?: boolean; onClick?: () => void; className?: string }} props
 */
export default function Eunju2({ active = false, onClick, className }) {
  const panelBg = active ? BG_ACTIVE : BG_DEFAULT;
  const labelClass = clsx(
    'text-[0.4925rem] font-semibold leading-none tracking-[-0.03em] [font-family:Pretendard]',
    active ? 'text-white' : 'text-[#E66A5C]'
  );

  const shellClass = clsx(
    'relative box-border h-[2.35rem] w-[11rem] shrink-0 rotate-[100deg] border-2 border-solid border-[#C43A31] transition-[background-color,box-shadow,transform] duration-200',
    onClick && 'cursor-pointer select-none',
    active && 'z-30 shadow-[0_0_12px_rgba(196,58,49,0.45)]',
    className
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label="은주2관"
        className={shellClass}
        style={{ backgroundColor: panelBg, borderColor: STROKE }}
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-[-215%] -translate-y-1/2 rotate-[-90deg]">
          <span className={labelClass}>은주2관</span>
        </div>
        <div className="pointer-events-none absolute left-[1.80rem] top-[55%] -translate-y-1/3 rotate-[90deg]">
          <LeftSideRect />
        </div>
        <div className="pointer-events-none absolute left-[3.87rem] top-[68%] -translate-y-1/3 rotate-[0deg]">
          <MiddleRect />
        </div>
        <div className="pointer-events-none absolute left-[-0.3rem] top-[37%] -translate-y-1/3 rotate-[90deg]">
          <TopLongRect />
        </div>
        <div className="pointer-events-none absolute left-[7.15rem] top-[72%] -translate-y-1/3 rotate-[90deg]">
          <LeftSideRect height="2.0rem" tickCount={4} />
        </div>
      </button>
    );
  }

  return (
    <div className={shellClass} style={{ backgroundColor: panelBg, borderColor: STROKE }}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rotate-[10deg]">
        <span className={labelClass}>은주2관</span>
      </div>
      <div className="pointer-events-none absolute left-[0.22rem] top-1/2 -translate-y-1/2 rotate-[-100deg]">
        <LeftSideRect />
      </div>
      <div className="pointer-events-none absolute left-[1.22rem] top-[69%] -translate-y-1/2 rotate-[-100deg]">
        <MiddleRect />
      </div>
      <div className="pointer-events-none absolute left-[1.75rem] top-[28%] -translate-y-1/2 rotate-[-100deg]">
        <TopLongRect />
      </div>
      <div className="pointer-events-none absolute left-[0.22rem] top-[82%] -translate-y-1/2 rotate-[-100deg]">
        <LeftSideRect height="2.3rem" tickCount={2} />
      </div>
    </div>
  );
}
