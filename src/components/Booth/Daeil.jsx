import clsx from 'clsx';

import { DAEIL_BOOTH_MARKERS } from '@/components/Booth/BoothMarker';

const NUMBER_TEXT_CLASS =
  'pointer-events-none inline-block origin-center rotate-90 select-none text-[0.4375rem] font-bold leading-none text-[#1A1A1A] [font-family:Pretendard]';

/**
 * 바깥 건물 버튼과 중첩되지 않도록 div 마커 (원래 Square 자리와 동일 레이아웃)
 * @param {{ fill: string; label: string; onPress?: () => void }} props
 */
function DaeilMarker({ fill, label, onPress }) {
  const common = clsx(
    'relative z-[2] box-border flex shrink-0 items-center justify-center border-0 transition-[background-color] duration-200 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C43A31] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121212]',
    onPress ? 'cursor-pointer' : 'cursor-default'
  );
  const style = {
    width: 14,
    height: 10,
    backgroundColor: fill,
  };

  if (onPress) {
    return (
      <div
        className={common}
        style={style}
        aria-label={`대일관 부스 ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          onPress();
        }}
      >
        <span className={NUMBER_TEXT_CLASS}>{label}</span>
      </div>
    );
  }

  return (
    <div className={common} style={style} aria-hidden>
      <span className={NUMBER_TEXT_CLASS}>{label}</span>
    </div>
  );
}

const BG_DEFAULT = '#121212';
const BG_ACTIVE = '#C43A31';
const STROKE = '#C43A31';
const CORNER_NOTCH = 'polygon(0 0, 100% 0, 100% 66%, 91% 100%, 9% 100%, 0 66%)';

const SIDE_RECT_CLASS =
  'relative box-border flex h-[0.75rem] w-[3.75rem] shrink-0 border-2 border-solid border-[#C43A31] bg-[#121212]';

function SideRectWithTicks() {
  const tick = '#C43A31';
  const TICK_COUNT = 5;

  return (
    <div className={SIDE_RECT_CLASS} style={{ borderColor: STROKE }} aria-hidden>
      <div className="pointer-events-none absolute inset-x-[7px] inset-y-[0px]">
        {Array.from({ length: TICK_COUNT }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-0 block w-px rounded-[1px]"
            style={{
              left: `${((i + 0.1) / TICK_COUNT) * 100}%`,
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
 * 대일관 건물
 * @param {{ active?: boolean; onClick?: () => void; onBoothMarkerClick?: (boothId: string) => void; className?: string; hasBuildingSelection?: boolean }} props
 */
export default function Daeil({
  active = false,
  onClick,
  onBoothMarkerClick,
  className,
  hasBuildingSelection,
}) {
  const panelBg = active ? BG_ACTIVE : BG_DEFAULT;
  const markerFill = active ? '#FF756C' : (hasBuildingSelection ?? true) ? '#FFDDDB' : '#FF958F';
  const buildingGlowClass = active ? 'z-30' : '';
  const buildingGlowStyle = active
    ? { filter: 'drop-shadow(0 0 12px rgba(196,58,49,0.45))' }
    : undefined;
  const wrapperClass = clsx(
    'relative inline-flex flex-col items-center gap-[0.25rem] rotate-[262deg] origin-top scale-[1.15]',
    className
  );

  const frameClass = clsx(
    'relative box-border h-[2.5rem] w-[11.25rem] shrink-0 bg-[#C43A31] p-[2px] outline-none ring-0 transition-[box-shadow] duration-200',
    onClick && 'cursor-pointer select-none'
  );

  const labelClass = clsx(
    'text-[0.5625rem] font-semibold leading-none tracking-[-0.03em] [font-family:Pretendard]',
    active ? 'text-white' : 'text-[#E66A5C]'
  );

  const inner = (
    <div className="flex h-full w-full flex-col px-[0px] pb-[1px] pt-[5px]">
      <div className="flex shrink-0 justify-center">
        <span
          className={clsx(labelClass, '-translate-x-[4.2rem] translate-y-[6px] rotate-[88deg]')}
        >
          대일관
        </span>
      </div>
      <div className="mt-auto flex w-full translate-y-[3px] items-end justify-center">
        <div className="flex shrink-0 items-start gap-[3px]" aria-hidden>
          <div
            className="box-border -mt-[16px] h-[0.25rem] w-[0.95rem] shrink-0 -translate-x-[-29px] border-1 border-solid rotate-[0deg] bg-[#121212]"
            style={{ borderColor: STROKE }}
          />
          <div
            className="box-border -mt-[10px] ml-[5px] h-[0.25rem] w-[1.5rem] shrink-0 translate-x-[-3px] border-1 border-solid rotate-[180deg] bg-[#121212]"
            style={{ borderColor: STROKE }}
          />
        </div>
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

  /** 마커 개수 수정 */
  const markerRow = (
    <div className="flex translate-x-[0px] translate-y-[5px] items-center justify-center gap-[3px]">
      {DAEIL_BOOTH_MARKERS.map((m) => (
        <DaeilMarker
          key={m.id}
          fill={markerFill}
          label={m.label}
          onPress={onBoothMarkerClick ? () => onBoothMarkerClick(m.id) : undefined}
        />
      ))}
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
        <div className={buildingGlowClass} style={buildingGlowStyle}>
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
                transition: 'background-color 0.2s',
              }}
            >
              {inner}
            </div>
          </div>
        </div>
        {markerRow}
      </button>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className={buildingGlowClass}>
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
              transition: 'background-color 0.2s',
            }}
          >
            {inner}
          </div>
        </div>
      </div>
      {markerRow}
    </div>
  );
}
