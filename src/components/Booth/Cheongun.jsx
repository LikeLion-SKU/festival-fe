import clsx from 'clsx';

import AedIcon from '../../assets/icons/aed.svg?react';

const BG_DEFAULT = '#121212';
const BG_ACTIVE = '#C43A31';
/** 우측 하단 모서리만 비스듬히 깎임 */
const CORNER_NOTCH = 'polygon(0 0, 100% 0, 100% 66%, 88% 100%, 0 100%)';

const SIDE_RECT_CLASS =
  'relative box-border flex h-[0.75rem] w-[3.05rem] shrink-0 border-2 border-solid border-[#C43A31] bg-[#121212]';

/**
 * 청운관 (부스 지도용) — 혜인관과 동일 칩 구조 + AED
 * @param {{ active?: boolean; onClick?: () => void; className?: string }} props
 */
export default function Cheongun({ active = false, onClick, className }) {
  const panelBg = active ? BG_ACTIVE : BG_DEFAULT;
  const wrapperClass = clsx(
    'relative inline-flex flex-col items-center gap-[0.25rem] rotate-[-72deg]',
    className
  );

  const frameClass = clsx(
    'relative box-border h-[2.5rem] w-[5.05rem] shrink-0 appearance-none overflow-hidden bg-[#C43A31] p-[2px] outline-none ring-0 transition-[box-shadow] duration-200 focus:outline-none focus-visible:outline-none',
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
            'inline-block translate-x-[-27px] translate-y-[8px] rotate-[90deg]'
          )}
        >
          청운관
        </span>
      </div>
      {/* 중앙·사이드 각각 absolute → 너비·flex 영향 분리 */}
      <div className="relative mt-auto h-[1.35rem] w-full shrink-0 translate-y-[3px]">
        <div
          className="absolute bottom-0 left-[calc(50%+00px)] z-10 flex h-[1.25rem] w-[1.5rem] -translate-x-1/2 items-end justify-center border-2 border-solid bg-[#121212] pb-[1px]"
          style={{ borderColor: '#C43A31' }}
          aria-hidden
        >
          <div className="box-border h-[0.7rem] w-[0.8rem] translate-y-[3px] border-2 border-solid border-[#C43A31] bg-[#121212]" />
        </div>
        <div
          className={clsx(
            SIDE_RECT_CLASS,
            'absolute bottom-0 left-[calc(50%+0.65rem)] translate-y-[8px]'
          )}
          style={{ borderColor: active ? 'transparent' : '#C43A31' }}
          aria-hidden
        />
      </div>
      <div
        className="absolute right-[10px] top-[3px] flex items-center justify-center rotate-[90deg]"
        aria-hidden
      >
        <AedIcon
          width="14"
          height="14"
          className={active ? '[&_path]:fill-[#121212]' : '[&_path]:fill-[#C43A31]'}
        />
      </div>
      <div
        className="absolute right-[3px] top-[2.5px] box-border h-[1.2rem] w-[0.25rem] shrink-0 rotate-[0deg] border-1 border-solid bg-[#121212]"
        style={{ borderColor: active ? 'transparent' : '#C43A31' }}
        aria-hidden
      />
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label="청운관"
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
