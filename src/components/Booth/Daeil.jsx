import clsx from 'clsx';

const BG_DEFAULT = '#121212';
const BG_ACTIVE = '#C43A31';
const STROKE = '#C43A31';
const CORNER_NOTCH = 'polygon(0 0, 100% 0, 100% 66%, 91% 100%, 9% 100%, 0 66%)';

const SIDE_RECT_CLASS =
  'relative box-border flex h-[0.75rem] w-[3.75rem] shrink-0 border-2 border-solid border-[#C43A31] bg-[#121212]';

function SideRectWithTicks() {
  const tick = '#C43A31';
  const TICK_COUNT = 8;

  return (
    <div className={SIDE_RECT_CLASS} style={{ borderColor: STROKE }} aria-hidden>
      <div className="pointer-events-none absolute inset-x-[2px] inset-y-[0px]">
        {Array.from({ length: TICK_COUNT }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-0 block w-px rounded-[1px]"
            style={{
              left: `${((i + 0.5) / TICK_COUNT) * 100}%`,
              transform: 'translateX(-50%)',
              height: '0.3125rem',
              backgroundColor: tick,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 대일관 (부스 지도용)
 * 은주1관과 동일 구조/스타일
 * @param {{ active?: boolean; onClick?: () => void; className?: string }} props
 */
export default function Daeil({ active = false, onClick, className }) {
  const panelBg = active ? BG_ACTIVE : BG_DEFAULT;
  const wrapperClass = clsx('relative inline-flex flex-col items-center gap-[0.25rem]', className);

  const frameClass = clsx(
    'relative box-border h-[2.5rem] w-[10.25rem] shrink-0 rotate-[265deg] bg-[#C43A31] p-[2px] outline-none ring-0 transition-[box-shadow] duration-200',
    onClick && 'cursor-pointer select-none',
    active && 'z-30 shadow-[0_0_12px_rgba(196,58,49,0.45)]'
  );

  const labelClass = clsx(
    'text-[0.5625rem] font-semibold leading-none tracking-[-0.03em] [font-family:Pretendard]',
    active ? 'text-white' : 'text-[#E66A5C]'
  );

  const inner = (
    <div className="flex h-full w-full flex-col px-[0px] pb-[1px] pt-[5px]">
      <div className="flex shrink-0 justify-center">
        <span
          className={clsx(
            labelClass,
            '-translate-x-[-3.1rem] -translate-y-[-0.12rem] rotate-[180deg]'
          )}
        >
          대일관
        </span>
      </div>
      <div className="mt-auto flex w-full translate-y-[3px] items-end justify-center">
        <SideRectWithTicks />
        <div
          className="z-10 -mx-[2px] box-border flex h-[1.25rem] w-[3rem] shrink-0 items-end justify-center border-2 border-solid bg-[#121212] pb-[1px]"
          style={{ borderColor: STROKE }}
          aria-hidden
        >
          <div className="box-border h-[0.7rem] w-[0.8rem] translate-y-[2px] border-2 border-solid border-[#C43A31] bg-[#121212]" />
        </div>
        <SideRectWithTicks />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label="대일관"
        className={wrapperClass}
      >
        <div
          className={frameClass}
          style={{ clipPath: CORNER_NOTCH, WebkitClipPath: CORNER_NOTCH }}
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              backgroundColor: panelBg,
              clipPath: CORNER_NOTCH,
              WebkitClipPath: CORNER_NOTCH,
            }}
          >
            {inner}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className={frameClass} style={{ clipPath: CORNER_NOTCH, WebkitClipPath: CORNER_NOTCH }}>
        <div
          className="relative h-full w-full overflow-hidden"
          style={{ backgroundColor: panelBg, clipPath: CORNER_NOTCH, WebkitClipPath: CORNER_NOTCH }}
        >
          {inner}
        </div>
      </div>
    </div>
  );
}
