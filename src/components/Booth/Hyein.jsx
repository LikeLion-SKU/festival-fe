import clsx from 'clsx';

import { HYEIN_BOOTH_MARKERS } from '@/components/Booth/BoothMarker';

import AedIcon from '../../assets/icons/aed.svg?react';

const NUMBER_TEXT_CLASS =
  'pointer-events-none select-none text-[0.4375rem] font-bold leading-none text-[#1A1A1A] [font-family:Pretendard]';

/**
 * 건물 active 여부와 무관하게 숫자 색 고정 (건물 클릭 시에도 동일)
 * @param {{ fill: string; label: string; variant?: 'booth' | 'pin'; onPress?: () => void }} props
 */
const MARKER_W = 14;
const MARKER_H = 10;

function HyeinMarker({ fill, label, variant = 'booth', onPress }) {
  const isPin = variant === 'pin';
  return (
    <button
      type="button"
      className={clsx(
        'relative z-[2] box-border flex shrink-0 items-center justify-center border-0 p-0 outline-none transition-[background-color,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C43A31] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121212]',
        onPress && 'cursor-pointer',
        !onPress && 'cursor-default'
      )}
      style={{
        width: MARKER_W,
        height: MARKER_H,
        backgroundColor: isPin ? '#FFFFFF' : fill,
        transform: isPin ? 'rotate(-12deg)' : undefined,
      }}
      aria-label={`혜인관 부스 ${label}`}
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
 * @param {{ active?: boolean; onClick?: () => void; onBoothMarkerClick?: (boothId: string) => void; className?: string; hasBuildingSelection?: boolean }} props
 */
export default function Hyein({
  active = false,
  isFlashing = false,
  onClick,
  onBoothMarkerClick,
  className,
  hasBuildingSelection,
}) {
  const panelBg = active ? BG_ACTIVE : BG_DEFAULT;
  const markerFill = active ? '#FF756C' : (hasBuildingSelection ?? true) ? '#FFDDDB' : '#FF958F';
  const buildingGlowStyle = active
    ? { filter: 'drop-shadow(0 0 12px rgba(196,58,49,0.45))' }
    : undefined;
  const boxStyle =
    isFlashing && !active
      ? { animation: 'hyein-panel-flash 1.2s ease-out 2 forwards' }
      : { backgroundColor: panelBg, ...buildingGlowStyle };
  /** 건물·무대·마커 일괄 확대 (지도 상단 배치 기준) */
  const wrapperClass = clsx(
    'relative inline-flex origin-top scale-[1.15] flex-col items-center gap-[0.25rem]',
    className
  );

  const boxClass = clsx(
    'relative box-border flex h-[2.5rem] w-[10.25rem] shrink-0 appearance-none overflow-hidden border-2 border-solid border-[#C43A31] outline-none ring-0 transition-[background-color] duration-200 focus:outline-none focus-visible:outline-none',
    onClick && 'cursor-pointer select-none',
    active && 'z-30'
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

  const leftMarkers = HYEIN_BOOTH_MARKERS.slice(0, 2);
  const rightMarkers = HYEIN_BOOTH_MARKERS.slice(2);

  const stageRow = (
    <div className="flex items-center justify-center gap-[6px]">
      <div className="flex -translate-y-[5px] items-center gap-[4px]">
        {leftMarkers.map((m) => (
          <HyeinMarker
            key={m.id}
            fill={markerFill}
            label={m.label}
            variant={m.variant}
            onPress={onBoothMarkerClick ? () => onBoothMarkerClick(m.id) : undefined}
          />
        ))}
      </div>
      {stageBox}
      <div className="flex -translate-y-[5px] items-center gap-[3px]">
        {rightMarkers.map((m) => (
          <HyeinMarker
            key={m.id}
            fill={markerFill}
            label={m.label}
            variant={m.variant}
            onPress={onBoothMarkerClick ? () => onBoothMarkerClick(m.id) : undefined}
          />
        ))}
      </div>
    </div>
  );

  const stageHitAreaClass = clsx(
    onClick && 'cursor-pointer select-none',
    'inline-flex flex-col items-center'
  );

  if (onClick) {
    return (
      <div className={wrapperClass}>
        <button
          type="button"
          onClick={onClick}
          aria-pressed={active}
          aria-label="혜인관"
          className="box-border border-0 bg-transparent p-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C43A31] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
        >
          <div className={boxClass} style={boxStyle}>
            {inner}
          </div>
        </button>
        {/* 무대·마커 줄: 마커는 별도 버튼이라 건물 버튼에 넣지 않음 */}
        <div className={stageHitAreaClass} onClick={onClick}>
          {stageRow}
        </div>
      </div>
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
