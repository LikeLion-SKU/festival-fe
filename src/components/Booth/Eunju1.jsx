import clsx from 'clsx';

import { EUNJU1_BOOTH_MARKERS } from '@/components/Booth/BoothMarker';

const NUMBER_TEXT_CLASS =
  'pointer-events-none inline-block origin-center rotate-180 select-none text-[0.4375rem] font-bold leading-none text-[#1A1A1A] [font-family:Pretendard]';

/**
 * @param {{ fill: string; label: string; onPress?: () => void }} props
 */
function Eunju1Marker({ fill, label, onPress }) {
  return (
    <button
      type="button"
      className={clsx(
        'relative z-[2] box-border flex shrink-0 items-center justify-center border-0 p-0 outline-none transition-[background-color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C43A31] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121212]',
        onPress && 'cursor-pointer',
        !onPress && 'cursor-default'
      )}
      style={{
        width: 14,
        height: 10,
        backgroundColor: fill,
      }}
      aria-label={`은주1관 부스 ${label}`}
      onClick={(e) => {
        if (onPress) {
          e.stopPropagation();
          onPress();
        }
      }}
    >
      <span className={NUMBER_TEXT_CLASS}>{label}</span>
    </button>
  );
}

const BG_DEFAULT = '#121212';
const BG_ACTIVE = '#C43A31';
const STROKE = '#C43A31';
const CORNER_NOTCH = 'polygon(0.95rem 0, 100% 0, 100% 100%, 0 100%, 0 0.85rem)';

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
 * 은주1관 건물
 * 혜인관과 동일 구조 + 본체 기울기/위치 변경 + 우측 상단 삼각형 파임
 * @param {{ active?: boolean; onClick?: () => void; onBoothMarkerClick?: (boothId: string) => void; className?: string; hasBuildingSelection?: boolean }} props
 */
export default function Eunju1({
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
    'relative inline-flex flex-col items-center origin-top scale-[1.15]',
    className
  );

  const buildingShellClass =
    'inline-flex flex-col items-center gap-[0.25rem] rotate-[170deg] translate-x-[3.2rem] -translate-y-[-7.8rem]';

  const boxClass = clsx(
    'relative box-border flex h-[2.5rem] w-[11.65rem] shrink-0 appearance-none overflow-hidden border-2 border-solid border-[#C43A31] outline-none ring-0 transition-[background-color,box-shadow] duration-200 focus:outline-none focus-visible:outline-none',
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
          className={clsx(
            labelClass,
            '-translate-x-[-3.1rem] -translate-y-[-0.12rem] rotate-[180deg]'
          )}
        >
          은주1관
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

  const notchStroke = (
    <svg
      className="pointer-events-none absolute left-[-2px] top-[-2px] h-[0.95rem] w-[1.05rem]"
      viewBox="0 0 105 95"
      preserveAspectRatio="none"
      aria-hidden
    >
      <line
        x1="104"
        y1="2"
        x2="2"
        y2="94"
        stroke={STROKE}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );

  /** 마커 16→23 좌→우 순서 */
  const markerRow = (
    <div className="flex translate-x-[12px] translate-y-[3px] items-center justify-center gap-[3px]">
      {EUNJU1_BOOTH_MARKERS.map((m) => (
        <Eunju1Marker
          key={m.id}
          fill={markerFill}
          label={m.label}
          onPress={onBoothMarkerClick ? () => onBoothMarkerClick(m.id) : undefined}
        />
      ))}
    </div>
  );

  const markerHitClass = clsx(onClick && 'cursor-pointer select-none', 'inline-flex');

  if (onClick) {
    return (
      <div className={wrapperClass}>
        <div className={buildingShellClass}>
          <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label="은주1관"
            className="box-border border-0 bg-transparent p-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C43A31] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            <div className={buildingGlowClass} style={buildingGlowStyle}>
              <div
                className={boxClass}
                style={{
                  backgroundColor: panelBg,
                  clipPath: CORNER_NOTCH,
                  WebkitClipPath: CORNER_NOTCH,
                }}
              >
                {notchStroke}
                {inner}
              </div>
            </div>
          </button>
          <div className={markerHitClass} onClick={onClick}>
            {markerRow}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className={buildingShellClass}>
        <div className={buildingGlowClass}>
          <div
            className={boxClass}
            style={{
              backgroundColor: panelBg,
              clipPath: CORNER_NOTCH,
              WebkitClipPath: CORNER_NOTCH,
            }}
          >
            {notchStroke}
            {inner}
          </div>
        </div>
        {markerRow}
      </div>
    </div>
  );
}
