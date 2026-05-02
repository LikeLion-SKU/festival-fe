import clsx from 'clsx';

const STROKE = '#C43A31';

/** @typedef {{ x1: number; y1: number; x2: number; y2: number }} LineSegment */

/** 왼쪽 변 기본값 */
const DEFAULT_LEFT_EDGE = { x1: 2, y1: 75, x2: 22, y2: 10 };

/** 오른쪽 변 기본값 */
const DEFAULT_RIGHT_EDGE = { x1: 65, y1: 78, x2: 50, y2: 10 };

/** 가운데 짧은 실선 4개  */
const DEFAULT_CENTER_SEGMENTS = [
  { x1: 34, y1: 55, x2: 34, y2: 49 },
  { x1: 34, y1: 44, x2: 34, y2: 38 },
  { x1: 34, y1: 33, x2: 34, y2: 27 },
  { x1: 34, y1: 23, x2: 34, y2: 16 },
];

/**
 * 폭풍의 언덕 (인터렉션 요소는 없음!)
 * @param {{
 *   className?: string;
 *   leftLine?: LineSegment;
 *   rightLine?: LineSegment;
 *   centerSegments?: LineSegment[];
 *   viewBox?: string;
 * }} props
 */
export default function Pokpung({
  className,
  leftLine = DEFAULT_LEFT_EDGE,
  rightLine = DEFAULT_RIGHT_EDGE,
  centerSegments = DEFAULT_CENTER_SEGMENTS,
  viewBox = '0 0 68 88',
}) {
  return (
    <div
      className={clsx(
        'pointer-events-none relative inline-flex flex-col items-center select-none',
        className
      )}
      aria-hidden
    >
      <div className="relative w-[3.75rem] overflow-visible pb-[1.125rem] pt-1">
        <svg
          className="mx-auto block h-[5.25rem] w-[4.05rem]"
          viewBox={viewBox}
          fill="none"
          aria-hidden
        >
          <line
            x1={leftLine.x1}
            y1={leftLine.y1}
            x2={leftLine.x2}
            y2={leftLine.y2}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {centerSegments.map((seg, i) => (
            <line
              key={i}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={STROKE}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
          <line
            x1={rightLine.x1}
            y1={rightLine.y1}
            x2={rightLine.x2}
            y2={rightLine.y2}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute bottom-0 left-1/2 rotate-[0.5deg] w-[max-content] max-w-[6rem] -translate-x-[18px] -translate-y-[30px] text-center text-[0.5625rem] font-semibold leading-tight tracking-[-0.03em] text-[#E66A5C] [font-family:Pretendard]">
          폭풍의 언덕
        </span>
      </div>
    </div>
  );
}
