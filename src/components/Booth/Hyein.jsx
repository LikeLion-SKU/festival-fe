import clsx from 'clsx';

import Square from '@/components/Booth/Square';

import AedIcon from '../../assets/icons/aed.svg?react';

const BG_DEFAULT = '#121212';
const BG_ACTIVE = '#C43A31';

/** 클릭했을 때 색상 변하는 부분 */
const SIDE_RECT_CLASS =
  'relative box-border flex h-[0.75rem] w-[3.75rem] shrink-0 border-2 border-solid border-[#C43A31] bg-[#121212]';

function SideRectWithTicks({ active }) {
  const tick = '#C43A31';
  const TICK_COUNT = 8;

  return (
    <div
      className={SIDE_RECT_CLASS}
      style={{ borderColor: active ? 'transparent' : '#C43A31' }}
      aria-hidden
    >
      {/* grid 대신 절대좌표로 */}
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
 * 혜인관 건물
 * @param {{ active?: boolean; onClick?: () => void; className?: string; hasBuildingSelection?: boolean }} props
 */
export default function Hyein({ active = false, onClick, className, hasBuildingSelection }) {
  const panelBg = active ? BG_ACTIVE : BG_DEFAULT;
  const markerFill = active ? '#FF756C' : (hasBuildingSelection ?? true) ? '#FFDDDB' : '#FF958F';
  const wrapperClass = clsx('relative inline-flex flex-col items-center gap-[0.25rem]', className);

  const boxClass = clsx(
    'relative box-border flex h-[2.5rem] w-[10.25rem] shrink-0 appearance-none overflow-hidden border-2 border-solid border-[#C43A31] outline-none ring-0 transition-[background-color,box-shadow] duration-200 focus:outline-none focus-visible:outline-none',
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
        <span className={labelClass}>혜인관</span>
      </div>
      <div className="mt-auto flex w-full translate-y-[3px] items-end justify-center">
        <SideRectWithTicks active={active} />
        <div
          className="z-10 -mx-[2px] box-border flex h-[1.25rem] w-[3rem] shrink-0 items-end justify-center border-2 border-solid bg-[#121212] pb-[1px]"
          style={{ borderColor: '#C43A31' }}
          aria-hidden
        >
          <div className="box-border h-[0.7rem] w-[0.8rem] translate-y-[2px] border-2 border-solid border-[#C43A31] bg-[#121212]" />
        </div>
        <SideRectWithTicks active={active} />
      </div>
      <div className="absolute right-[4px] top-[8px] flex items-center justify-center" aria-hidden>
        <AedIcon
          width="14"
          height="14"
          className={active ? '[&_path]:fill-[#121212]' : '[&_path]:fill-[#C43A31]'}
        />
      </div>
    </div>
  );

  const stageBox = (
    <div
      className="box-border flex h-[1.25rem] w-[4.5rem] items-center justify-center border-1 border-solid border-[#C43A31]"
      style={{ backgroundColor: BG_DEFAULT }}
    >
      <span className="text-[0.5625rem] font-bold leading-none tracking-[-0.03em] text-[#FF756C] [font-family:Pretendard]">
        무대
      </span>
    </div>
  );

  const stageRow = (
    <div className="flex items-center justify-center gap-[6px]">
      <div className="flex -translate-y-[5px] items-center gap-[4px]" aria-hidden>
        <Square color={markerFill} />
        <Square color={markerFill} />
      </div>
      {stageBox}
      <div className="flex -translate-y-[5px] items-center gap-[4px]" aria-hidden>
        <Square color={markerFill} />
        <Square color={markerFill} />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label="혜인관"
        className={wrapperClass}
      >
        <div className={boxClass} style={{ backgroundColor: panelBg }}>
          {inner}
        </div>
        {stageRow}
      </button>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className={boxClass} style={{ backgroundColor: panelBg }}>
        {inner}
      </div>
      {stageRow}
    </div>
  );
}
