import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import FenceBg from '@/assets/images/fence.svg';
import HorseCard from '@/assets/images/horse-card.png';
import HorseRed from '@/assets/images/horse-red.svg';
import LineupCardBg from '@/assets/images/lineup-card.svg';
import LineupStarBg from '@/assets/images/lineup-star.svg';
import LineupCarouselDragSurface from '@/components/animation/LineupCarouselDragSurface';
import LineupSlotCard from '@/components/animation/LineupSlotCard';
import {
  LINEUP_CARD_WIDTH_PX,
  LINEUP_SPRING_TRANSITION,
  LINEUP_STAGE_WIDTH_PX,
  LINEUP_TWEEN_TRANSITION,
} from '@/components/animation/lineupMotion';
import {
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/components/animation/useScrollDrivenOpacity';
import { LINEUP_DAY_GROUPS } from '@/constants/lineupDummyData';

const LINEUP_TEXT_GLOBAL_OFFSET_Y = '2.2rem';
const LINEUP_TEXT_GLOBAL_TILT = -4;

const LINEUP_SWIPE_OFFSET_PX = 52;
const LINEUP_SWIPE_VELOCITY_MIN = 380;
/** 스냅 복귀 시 반대 방향 velocity 오판 방지 — 속도만으로 넘길 때 남은 변위 방향과 일치해야 함 */
const LINEUP_SWIPE_AXIS_EPS_PX = 8;

const LINEUP_IGNORE_DRAG_AFTER_NAV_MS = 480;

/**
 * id 순서 기준으로 카드 배치
 */
function slotsFromIdRing(navIds, centerCursor, itemById, swapSideNeighbors = false) {
  const n = navIds.length;
  if (n === 0) return [];
  if (n === 1) {
    const item = itemById.get(navIds[0]);
    return item ? [{ item, position: 'center' }] : [];
  }
  const ci = ((centerCursor % n) + n) % n;
  const leftI = (ci - 1 + n) % n;
  const rightI = (ci + 1) % n;
  const triple = swapSideNeighbors
    ? [
        { idx: rightI, position: 'left' },
        { idx: ci, position: 'center' },
        { idx: leftI, position: 'right' },
      ]
    : [
        { idx: leftI, position: 'left' },
        { idx: ci, position: 'center' },
        { idx: rightI, position: 'right' },
      ];
  return triple
    .map(({ idx, position }) => {
      const item = itemById.get(navIds[idx]);
      return item ? { item, position } : null;
    })
    .filter(Boolean);
}

/**
 * DOM 순서를 item.id 기준으로 고정해 매 스텝마다 재정렬되지 않게 함.
 */
function sortSlotsStable(slots) {
  return [...slots].sort((a, b) => a.item.id - b.item.id);
}

function LineupCardFace({ item }) {
  const starWrapperClass = 'right-[13rem] top-[2.35rem] h-[8.9rem] w-[8.9rem]';
  const starTextTiltClass = '-rotate-[7deg]';
  const imageOffsetX = item.imageOffsetX ?? '0.4rem';
  const imageOffsetY = item.imageOffsetY ?? '4.0rem';
  const imageScale = item.imageScale ?? 2.79;

  return (
    <div className="relative h-[19.5rem] w-[19.5rem]">
      <img
        src={LineupCardBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain"
      />

      <div className="absolute left-[2.75rem] top-[5.1rem] h-[6.8rem] w-[13.6rem] -rotate-[4.6deg] overflow-hidden rounded-[15px] bg-white">
        <img
          src={item.image}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="sync"
          className="absolute inset-0 h-full w-full scale-[var(--lineup-image-scale)] translate-y-[var(--lineup-image-offset-y)] translate-x-[var(--lineup-image-offset-x)] object-contain object-bottom"
          style={{
            '--lineup-image-offset-x': imageOffsetX,
            '--lineup-image-offset-y': imageOffsetY,
            '--lineup-image-scale': imageScale,
          }}
        />
      </div>

      <div
        className="absolute max-w-[12.8rem] text-white"
        style={{
          left: item.textPosition?.left ?? '6.9rem',
          bottom: `calc(${item.textPosition?.bottom ?? '2.55rem'} + ${LINEUP_TEXT_GLOBAL_OFFSET_Y})`,
          transform: `rotate(${LINEUP_TEXT_GLOBAL_TILT}deg)`,
          transformOrigin: 'left bottom',
        }}
      >
        <div className="flex items-end gap-[0.35rem]">
          <p className="pb-[0.18rem] text-[0.72rem] font-medium leading-[1.2] whitespace-normal break-keep">
            {item.group}
          </p>
          <p className="text-[1.45rem] font-extrabold leading-[1.1] whitespace-nowrap">
            {item.artist}
          </p>
        </div>
      </div>

      <div className={`absolute ${starWrapperClass}`}>
        <div
          aria-hidden="true"
          className="h-full w-full bg-center bg-no-repeat [background-size:100%_100%]"
          style={{ backgroundImage: `url(${LineupStarBg})` }}
        />
        <div
          className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 ${starTextTiltClass} flex-col items-center text-[#3B2F20]`}
        >
          <p
            className="-translate-x-[0.34rem] -translate-y-[0.18rem] -rotate-[12deg] tracking-[-0.04em] font-regular leading-[1.05] text-[1.2rem]"
            style={{ fontFamily: 'Jaro, sans-serif' }}
          >
            {item.day}
          </p>
          <p className="mt-[0.1rem] -translate-x-[0.7rem] -translate-y-[0.2rem] -rotate-[12deg] tracking-[-0.01em] text-[0.64rem] font-bold leading-[1.1]">
            {item.time.split(' ~ ')[0]}
          </p>
          <p className="translate-x-[0.7rem] -translate-y-[0.5rem] -rotate-[12deg] tracking-[0.01em] text-[0.64rem] font-bold leading-[1.1]">
            {`~${item.time.split(' ~ ')[1]}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Lineup() {
  /** 라인업 자동 회전 속도*/
  const lineupAutoRotateIntervalMs = 4700;
  const lineupAutoRotatePauseAfterManualMs = lineupAutoRotateIntervalMs;

  const leftNavIds = useMemo(() => LINEUP_DAY_GROUPS[0].items.map((it) => it.id), []);
  const rightNavIds = useMemo(() => LINEUP_DAY_GROUPS[1].items.map((it) => it.id), []);
  const itemById = useMemo(() => {
    const m = new Map();
    for (const g of LINEUP_DAY_GROUPS) {
      for (const it of g.items) m.set(it.id, it);
    }
    return m;
  }, []);

  useEffect(() => {
    // 화살표 전환 시 깜빡임을 줄이기 위해 라인업 이미지를 선로딩한다.
    const allImages = LINEUP_DAY_GROUPS.flatMap((group) =>
      group.items.map((item) => item.image).filter(Boolean)
    );
    const uniqueImages = [...new Set(allImages)];

    uniqueImages.forEach((src) => {
      const img = new Image();
      img.decoding = 'sync';
      img.src = src;
    });
  }, []);

  const [pressedLeft, setPressedLeft] = useState(false);
  const [pressedRight, setPressedRight] = useState(false);
  const pressLeftTimerRef = useRef(null);
  const pressRightTimerRef = useRef(null);

  const [laneNav, setLaneNav] = useState(() => ({
    /** 버튼 혹은 스와이프 등 수동 조작 후에는 좌/우 동작만 */
    arrowOrSwipeUsed: false,
    /** 뱌튼 미사용 시 1→2→3 전체 순환 */
    fullAutoCursor: 0,
    activeLane: 'left',
    cursorLeft: 0,
    cursorRight: 0,
  }));

  /** 버튼 혹은 스와이프 전에는 DAY 2 가 디폴트임 */
  const navIds = laneNav.arrowOrSwipeUsed
    ? laneNav.activeLane === 'left'
      ? leftNavIds
      : rightNavIds
    : leftNavIds;
  const centerCursor = laneNav.arrowOrSwipeUsed
    ? laneNav.activeLane === 'left'
      ? laneNav.cursorLeft
      : laneNav.cursorRight
    : laneNav.fullAutoCursor;
  const total = navIds.length;

  /** DAY 2는 슬롯 미러링 → 커서 +1 이어도 다음 카드가 왼쪽에서 들어와 반시계 느낌. DAY 3은 미러링 끔 → +1 이 시계 방향. id 순서는 항상 배열 순서(1→2→3, 4→5→6). */
  const swapSideNeighbors = laneNav.arrowOrSwipeUsed ? laneNav.activeLane === 'left' : true;
  const stageRef = useRef(null);
  const cardMeasureRef = useRef(null);
  const [layoutMetrics, setLayoutMetrics] = useState(() => ({
    stage: LINEUP_STAGE_WIDTH_PX,
    card: LINEUP_CARD_WIDTH_PX,
  }));

  const iconBlockRef = useRef(null);
  const ignoreCarouselDragUntilRef = useRef(0);
  const suppressAutoRotateUntilRef = useRef(0);
  const iconOpacity = useScrollDrivenOpacity(iconBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);

  const pauseAutoRotateAfterUserGesture = () => {
    suppressAutoRotateUntilRef.current = Date.now() + lineupAutoRotatePauseAfterManualMs;
  };

  /** 네비 버튼: 드래그 종료 오판 방지 + 자동 회전과 동시 충돌 방지 */
  const registerManualCarouselNav = () => {
    ignoreCarouselDragUntilRef.current = Date.now() + LINEUP_IGNORE_DRAG_AFTER_NAV_MS;
    pauseAutoRotateAfterUserGesture();
  };

  const hasManyCards = total > 1;

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const transition = reduceMotion ? LINEUP_TWEEN_TRANSITION : LINEUP_SPRING_TRANSITION;

  const visible = slotsFromIdRing(navIds, centerCursor, itemById, swapSideNeighbors);
  const stableSlots = sortSlotsStable(visible);

  /**
   * 중앙 카드 왼쪽 좌표 대비 평행 이동량 계산
   */
  useLayoutEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl || typeof ResizeObserver === 'undefined') return;

    const measure = () => {
      const stageW = stageEl.getBoundingClientRect().width;
      const cardEl = cardMeasureRef.current;
      const cardW = cardEl && cardEl.offsetWidth > 0 ? cardEl.offsetWidth : LINEUP_CARD_WIDTH_PX;
      if (stageW > 0) setLayoutMetrics({ stage: stageW, card: cardW });
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(stageEl);
    const cardEl = cardMeasureRef.current;
    if (cardEl) ro.observe(cardEl);

    return () => ro.disconnect();
  }, [
    laneNav.arrowOrSwipeUsed,
    laneNav.activeLane,
    laneNav.cursorLeft,
    laneNav.cursorRight,
    laneNav.fullAutoCursor,
  ]);

  const designCenterLeft = LINEUP_STAGE_WIDTH_PX / 2 - LINEUP_CARD_WIDTH_PX / 2;
  const actualCenterLeft = layoutMetrics.stage / 2 - layoutMetrics.card / 2;
  const stageShiftX = actualCenterLeft - designCenterLeft;

  /** 왼쪽 UI(DAY 2): 같은 레인일 때 커서 +1 → 중앙 id 1→2→3, 회전은 반시계 느낌(swap). 오른쪽에서 넘어오면 id 1부터 */
  const handleLeftLaneNav = () => {
    setLaneNav((s) => {
      if (!s.arrowOrSwipeUsed) {
        return {
          ...s,
          arrowOrSwipeUsed: true,
          activeLane: 'left',
          cursorLeft: 0,
          cursorRight: 0,
        };
      }
      if (s.activeLane !== 'left') {
        return {
          ...s,
          activeLane: 'left',
          cursorLeft: 0,
        };
      }
      return {
        ...s,
        cursorLeft: (s.cursorLeft + 1) % leftNavIds.length,
      };
    });
  };

  /** 오른쪽 UI(DAY 3): 같은 레인일 때 커서 +1 → 중앙 id 4→5→6, 회전은 시계 방향(swap 끔). 왼쪽에서 넘어오면 id 4부터 */
  const handleRightLaneNav = () => {
    setLaneNav((s) => {
      if (!s.arrowOrSwipeUsed) {
        return {
          ...s,
          arrowOrSwipeUsed: true,
          activeLane: 'right',
          cursorLeft: 0,
          cursorRight: 0,
        };
      }
      if (s.activeLane !== 'right') {
        return {
          ...s,
          activeLane: 'right',
          cursorRight: 0,
        };
      }
      return {
        ...s,
        cursorRight: (s.cursorRight + 1) % rightNavIds.length,
      };
    });
  };

  useEffect(() => {
    if (!hasManyCards || reduceMotion) return;
    if (typeof window === 'undefined') return;

    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() < suppressAutoRotateUntilRef.current) return;
      setLaneNav((s) => {
        if (!s.arrowOrSwipeUsed) {
          const n = leftNavIds.length;
          return {
            ...s,
            fullAutoCursor: (s.fullAutoCursor + 1) % n,
          };
        }
        if (s.activeLane === 'left') {
          return {
            ...s,
            cursorLeft: (s.cursorLeft + 1) % leftNavIds.length,
          };
        }
        return {
          ...s,
          cursorRight: (s.cursorRight + 1) % rightNavIds.length,
        };
      });
    }, lineupAutoRotateIntervalMs);

    return () => clearInterval(id);
  }, [
    hasManyCards,
    reduceMotion,
    leftNavIds.length,
    rightNavIds.length,
    lineupAutoRotateIntervalMs,
  ]);

  const onCarouselDragEnd = (_, info) => {
    if (reduceMotion || !hasManyCards) return;
    if (Date.now() < ignoreCarouselDragUntilRef.current) return;

    const { offset, velocity } = info;
    const wantsForward =
      offset.x < -LINEUP_SWIPE_OFFSET_PX ||
      (velocity.x < -LINEUP_SWIPE_VELOCITY_MIN && offset.x < LINEUP_SWIPE_AXIS_EPS_PX);
    const wantsBackward =
      offset.x > LINEUP_SWIPE_OFFSET_PX ||
      (velocity.x > LINEUP_SWIPE_VELOCITY_MIN && offset.x > -LINEUP_SWIPE_AXIS_EPS_PX);

    if (wantsForward && wantsBackward) return;

    if (wantsForward) {
      pauseAutoRotateAfterUserGesture();
      setLaneNav((s) => {
        if (!s.arrowOrSwipeUsed) {
          return {
            ...s,
            arrowOrSwipeUsed: true,
            activeLane: 'right',
            cursorLeft: 0,
            cursorRight: 0,
          };
        }
        if (s.activeLane !== 'right') {
          return {
            ...s,
            activeLane: 'right',
            cursorRight: 0,
          };
        }
        return {
          ...s,
          cursorRight: (s.cursorRight + 1) % rightNavIds.length,
        };
      });
      return;
    }
    if (wantsBackward) {
      pauseAutoRotateAfterUserGesture();
      setLaneNav((s) => {
        if (!s.arrowOrSwipeUsed) {
          return {
            ...s,
            arrowOrSwipeUsed: true,
            activeLane: 'left',
            cursorLeft: 0,
            cursorRight: 0,
          };
        }
        if (s.activeLane !== 'left') {
          return {
            ...s,
            activeLane: 'left',
            cursorLeft: 0,
          };
        }
        return {
          ...s,
          cursorLeft: (s.cursorLeft + 1) % leftNavIds.length,
        };
      });
    }
  };

  return (
    <section
      id="lineup"
      className="relative min-h-[34.1rem] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[0rem]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 32%), linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,1) 100%)',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: 'center top, center',
          backgroundSize: 'cover, cover',
        }}
      />
      <img
        src={HorseCard}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[0.75rem] z-[10] w-[28.125rem] max-w-none -translate-x-1/2 object-contain"
      />
      <img
        src={HorseRed}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[8rem] z-[11] w-[9.28125rem] max-w-none -translate-x-1/2 object-contain mix-blend-multiply"
      />
      <img
        src={FenceBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[19rem] z-[2] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <div
        ref={iconBlockRef}
        style={{ opacity: iconOpacity, willChange: 'opacity' }}
        className="relative z-10 flex flex-col items-center gap-[0.25rem]"
      >
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          LINEUP
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative z-[20] mx-auto mt-[3.1rem] h-[20.5rem] w-full max-w-[21rem] overflow-visible [perspective:1100px] [transform-style:preserve-3d]"
      >
        <LineupCarouselDragSurface reduceMotion={reduceMotion} onDragEnd={onCarouselDragEnd}>
          {stableSlots.map(({ item, position }, index) => (
            <LineupSlotCard
              key={item.id}
              position={position}
              transition={transition}
              stageShiftX={stageShiftX}
              measureRef={index === 0 ? cardMeasureRef : undefined}
            >
              <LineupCardFace item={item} />
            </LineupSlotCard>
          ))}
        </LineupCarouselDragSurface>
      </div>

      {hasManyCards && (
        <div className="pointer-events-none absolute left-1/2 top-[22.2rem] z-[30] flex w-full max-w-[22rem] -translate-x-1/2 items-center justify-between px-[0.75rem]">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              registerManualCarouselNav();
            }}
            onClick={() => {
              setPressedLeft(true);
              clearTimeout(pressLeftTimerRef.current);
              pressLeftTimerRef.current = setTimeout(() => setPressedLeft(false), 400);
              handleLeftLaneNav();
            }}
            aria-label="DAY 2 라인업 카드 순서 보기"
            className="pointer-events-auto flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            style={{
              background: pressedLeft ? '#2A2A2A' : '#ffffff',
              transition: 'background-color 0.3s ease',
            }}
          >
            <span
              aria-hidden="true"
              className="h-0 w-0 border-y-[0.5rem] border-y-transparent border-r-[0.9rem] border-r-[#C43A31]"
            />
          </button>
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              registerManualCarouselNav();
            }}
            onClick={() => {
              setPressedRight(true);
              clearTimeout(pressRightTimerRef.current);
              pressRightTimerRef.current = setTimeout(() => setPressedRight(false), 400);
              handleRightLaneNav();
            }}
            aria-label="DAY 3 라인업 카드 순서 보기"
            className="pointer-events-auto flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            style={{
              background: pressedRight ? '#2A2A2A' : '#ffffff',
              transition: 'background-color 0.3s ease',
            }}
          >
            <span
              aria-hidden="true"
              className="h-0 w-0 border-y-[0.5rem] border-y-transparent border-l-[0.9rem] border-l-[#C43A31]"
            />
          </button>
        </div>
      )}
    </section>
  );
}
