import clsx from 'clsx';

import { EUNJU2_BOOTH_MARKERS } from '@/components/Booth/BoothMarker';

const BG_DEFAULT = '#121212';
const BG_ACTIVE = '#C43A31';
const STROKE = '#C43A31';

const NUMBER_TEXT_CLASS =
  'pointer-events-none inline-block origin-center -rotate-90 select-none text-[0.4375rem] font-bold leading-none text-[#1A1A1A] [font-family:Pretendard]';

/**
 * 건물 active와 무관하게 숫자 색 고정
 * @param {{ fill: string; label: string; onPress?: () => void }} props
 */
function Eunju2Marker({ fill, label, onPress }) {
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
      aria-label={`은주2관 부스 ${label}`}
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
 * 은주2관 건물
 * @param {{ active?: boolean; onClick?: () => void; onBoothMarkerClick?: (boothId: string) => void; className?: string; hasBuildingSelection?: boolean }} props
 */
export default function Eunju2({
  active = false,
  onClick,
  onBoothMarkerClick,
  className,
  hasBuildingSelection,
}) {
  const panelBg = active ? BG_ACTIVE : BG_DEFAULT;
  const markerFill = active ? '#FF756C' : (hasBuildingSelection ?? true) ? '#FFDDDB' : '#FF958F';
  const labelClass = clsx(
    'text-[0.4925rem] font-semibold leading-none tracking-[-0.03em] [font-family:Pretendard]',
    active ? 'text-white' : 'text-[#E66A5C]'
  );

  const shellFrameClass = clsx(
    'relative box-border h-[2.35rem] w-[12.35rem] shrink-0 border-2 border-solid border-[#C43A31] transition-[background-color,box-shadow,transform] duration-200',
    onClick && 'cursor-pointer select-none',
    active &&
      'z-30 shadow-[0_0_12px_rgba(196,58,49,0.24),0_0_28px_rgba(196,58,49,0.16),0_0_44px_rgba(196,58,49,0.10)]'
  );

  const buildingShellClass = clsx(
    'inline-flex flex-col items-center gap-[0.25rem] rotate-[96deg]',
    className
  );

  const rootScaleClass = 'relative origin-top scale-[1.15]';

  const markerRow = (
    <div className="flex translate-x-[0px] translate-y-[3px] items-center justify-center gap-[3px]">
      {EUNJU2_BOOTH_MARKERS.map((m) => (
        <Eunju2Marker
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
      <div className={clsx(rootScaleClass, 'border-0 bg-transparent p-0')}>
        <div className={buildingShellClass}>
          <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label="은주2관"
            className="box-border border-0 bg-transparent p-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C43A31] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            <div
              className={shellFrameClass}
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
    <div className={rootScaleClass}>
      <div className={buildingShellClass}>
        <div className={shellFrameClass} style={{ backgroundColor: panelBg, borderColor: STROKE }}>
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
        {markerRow}
      </div>
    </div>
  );
}
