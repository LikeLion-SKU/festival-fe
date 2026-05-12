import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import FenceBg from '@/assets/images/fence.svg';
import HorseCard from '@/assets/images/horse-card.webp';
import HorseRed from '@/assets/images/horse-red.svg';
import LineupCardDay2Bg from '@/assets/images/lineup-card-day2.svg';
import LineupCardBg from '@/assets/images/lineup-card.svg';
import LineupStarBg from '@/assets/images/lineup-star.webp';
import LineupCarouselDragSurface from '@/components/animation/LineupCarouselDragSurface';
import LineupSlotCard from '@/components/animation/LineupSlotCard';
import {
  LINEUP_CARD_WIDTH_PX,
  LINEUP_STAGE_WIDTH_PX,
  lineupManualNavCooldownMs,
  slotPositionFromIndex,
} from '@/components/animation/lineupMotion';
import {
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/components/animation/useScrollDrivenOpacity';
import { LINEUP_ITEMS } from '@/constants/lineupDummyData';

const LINEUP_TEXT_GLOBAL_OFFSET_Y = '2.2rem';
const LINEUP_TEXT_GLOBAL_TILT = -4;

const LINEUP_SWIPE_OFFSET_PX = 52;
const LINEUP_SWIPE_VELOCITY_MIN = 380;
/** 스냅 복귀 시 반대 방향 velocity 오판 방지 — 속도만으로 넘길 때 남은 변위 방향과 일치해야 함 */
const LINEUP_SWIPE_AXIS_EPS_PX = 8;

const LINEUP_IGNORE_DRAG_AFTER_NAV_MS = 480;

/** 3슬롯 + 단일 링: 카드 객체는 id로 유지되고 slotIndex만 바뀌어 공전처럼 보이게 함 */
function buildVisibleCards(items, centerCursor) {
  const n = items.length;
  if (n === 0) return [];
  if (n === 1) return [{ item: items[0], slotIndex: 1 }];
  const center = ((centerCursor % n) + n) % n;
  const left = (center - 1 + n) % n;
  const right = (center + 1) % n;
  return [
    { item: items[left], slotIndex: 0 },
    { item: items[center], slotIndex: 1 },
    { item: items[right], slotIndex: 2 },
  ];
}

function LineupCardFace({ item }) {
  const starWrapperClass = 'right-[13rem] top-[2.35rem] h-[7.2rem] w-[8rem]';
  const starTextTiltClass = '-rotate-[7deg]';
  const imageOffsetX = item.imageOffsetX ?? '0.4rem';
  const imageOffsetY = item.imageOffsetY ?? '4.0rem';
  const imageScale = item.imageScale ?? 2.79;
  const normalizedDay = item.day?.replace(/\s/g, '').toUpperCase();
  const cardBackgroundImage = normalizedDay === 'DAY2' ? LineupCardDay2Bg : LineupCardBg;
  const artistTextColor = normalizedDay === 'DAY2' ? '#FFE5AD' : '#F1CCB2';

  return (
    <div className="relative h-[19.5rem] w-[19.5rem]">
      <img
        src={cardBackgroundImage}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
      />

      <div className="absolute left-[2.75rem] top-[5.1rem] h-[6.8rem] w-[13.6rem] -rotate-[4.6deg] overflow-hidden rounded-[15px] bg-white">
        <img
          src={item.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
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
          {item.group ? (
            <p className="pb-[0.18rem] text-[0.72rem] font-medium leading-[1.2] whitespace-normal break-keep">
              {item.group}
            </p>
          ) : null}
          <p
            className="text-[1.45rem] font-extrabold leading-[1.1] whitespace-nowrap"
            style={{ color: artistTextColor }}
          >
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
  const lineupAutoRotateIntervalMs = 4700;
  const lineupAutoRotatePauseAfterManualMs = lineupAutoRotateIntervalMs;

  const [centerCursor, setCenterCursor] = useState(0);

  const [pressedLeft, setPressedLeft] = useState(false);
  const [pressedRight, setPressedRight] = useState(false);
  const pressLeftTimerRef = useRef(null);
  const pressRightTimerRef = useRef(null);

  const total = LINEUP_ITEMS.length;

  const stageRef = useRef(null);
  const cardMeasureRef = useRef(null);
  const [layoutMetrics, setLayoutMetrics] = useState(() => ({
    stage: LINEUP_STAGE_WIDTH_PX,
    card: LINEUP_CARD_WIDTH_PX,
  }));

  const iconBlockRef = useRef(null);
  const ignoreCarouselDragUntilRef = useRef(0);
  const suppressAutoRotateUntilRef = useRef(0);
  const manualNavCooldownUntilRef = useRef(0);
  const iconOpacity = useScrollDrivenOpacity(iconBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);

  const pauseAutoRotateAfterUserGesture = () => {
    suppressAutoRotateUntilRef.current = Date.now() + lineupAutoRotatePauseAfterManualMs;
  };

  const registerManualCarouselNav = () => {
    ignoreCarouselDragUntilRef.current = Date.now() + LINEUP_IGNORE_DRAG_AFTER_NAV_MS;
    pauseAutoRotateAfterUserGesture();
  };

  const hasManyCards = total > 1;

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const visible = buildVisibleCards(LINEUP_ITEMS, centerCursor);

  const commitLayoutIfChanged = (stageW, cardW) => {
    if (stageW <= 0) return;
    setLayoutMetrics((prev) => {
      if (Math.abs(prev.stage - stageW) < 0.5 && Math.abs(prev.card - cardW) < 0.5) return prev;
      return { stage: stageW, card: cardW };
    });
  };

  /** centerCursor마다 RO 재연결/전체 리렌더 유발하지 않음 */
  useLayoutEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl || typeof ResizeObserver === 'undefined') return;

    const measure = () => {
      const stageW = stageEl.getBoundingClientRect().width;
      const cardEl = cardMeasureRef.current;
      const cardW = cardEl && cardEl.offsetWidth > 0 ? cardEl.offsetWidth : LINEUP_CARD_WIDTH_PX;
      commitLayoutIfChanged(stageW, cardW);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stageEl);
    return () => ro.disconnect();
  }, []);

  /** 가운데 카드 ref가 바뀔 때만 카드 폭 재측정 */
  useLayoutEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const stageW = stageEl.getBoundingClientRect().width;
    const cardEl = cardMeasureRef.current;
    const cardW = cardEl && cardEl.offsetWidth > 0 ? cardEl.offsetWidth : LINEUP_CARD_WIDTH_PX;
    commitLayoutIfChanged(stageW, cardW);
  }, [centerCursor]);

  const designCenterLeft = LINEUP_STAGE_WIDTH_PX / 2 - LINEUP_CARD_WIDTH_PX / 2;
  const actualCenterLeft = layoutMetrics.stage / 2 - layoutMetrics.card / 2;
  const stageShiftX = actualCenterLeft - designCenterLeft;

  const tryAdvanceCenterCursor = (update) => {
    if (total < 2) return;
    const now = Date.now();
    if (now < manualNavCooldownUntilRef.current) return;
    manualNavCooldownUntilRef.current = now + lineupManualNavCooldownMs(total);
    setCenterCursor(update);
  };

  /** 오른쪽: 오른쪽 카드가 중앙으로 → ci+1 */
  const handleNext = () => {
    tryAdvanceCenterCursor((prev) => (prev + 1) % total);
  };

  /** 왼쪽: 왼쪽 카드가 중앙으로 → ci-1 */
  const handlePrev = () => {
    tryAdvanceCenterCursor((prev) => (prev - 1 + total) % total);
  };

  const lineupSectionRef = useRef(null);
  const lineupInViewRef = useRef(true);

  useEffect(() => {
    const el = lineupSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => {
        lineupInViewRef.current = e.isIntersecting;
      },
      { root: null, rootMargin: '80px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!hasManyCards || reduceMotion) return;
    if (typeof window === 'undefined') return;

    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (!lineupInViewRef.current) return;
      if (Date.now() < suppressAutoRotateUntilRef.current) return;
      setCenterCursor((prev) => (prev + 1) % total);
    }, lineupAutoRotateIntervalMs);

    return () => clearInterval(id);
  }, [hasManyCards, reduceMotion, total, lineupAutoRotateIntervalMs]);

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
      tryAdvanceCenterCursor((prev) => (prev + 1) % total);
      return;
    }
    if (wantsBackward) {
      pauseAutoRotateAfterUserGesture();
      tryAdvanceCenterCursor((prev) => (prev - 1 + total) % total);
    }
  };

  return (
    <section
      id="lineup"
      ref={lineupSectionRef}
      className="relative min-h-[34.1rem] overflow-hidden bg-black px-[3.65625rem] pt-[0rem] [contain:layout_paint]"
    >
      <img
        src={HorseCard}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute left-1/2 top-[0.75rem] z-[10] w-[28.125rem] max-w-none -translate-x-1/2 object-contain"
      />
      <img
        src={HorseRed}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute left-1/2 top-[8rem] z-[11] w-[9.28125rem] max-w-none -translate-x-1/2 object-contain mix-blend-multiply"
      />
      <img
        src={FenceBg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute left-1/2 top-[19rem] z-[2] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <div
        ref={iconBlockRef}
        style={{ opacity: iconOpacity }}
        className="relative z-10 flex flex-col items-center gap-[0.25rem]"
      >
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          LINEUP
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative z-[20] mx-auto mt-[3.1rem] h-[20.5rem] w-full max-w-[21rem] overflow-visible [perspective-origin:center_38%] [perspective:1750px] [transform-style:preserve-3d]"
      >
        <div className="relative h-full w-full [transform-style:preserve-3d]">
          {visible.map(({ item, slotIndex }) => (
            <LineupSlotCard
              key={item.id}
              position={slotPositionFromIndex(slotIndex)}
              stageShiftX={stageShiftX}
              measureRef={slotIndex === 1 ? cardMeasureRef : undefined}
              reduceMotion={reduceMotion}
            >
              <LineupCardFace item={item} />
            </LineupSlotCard>
          ))}
        </div>
        <LineupCarouselDragSurface reduceMotion={reduceMotion} onDragEnd={onCarouselDragEnd} />
      </div>

      {hasManyCards && (
        <div className="pointer-events-none absolute left-1/2 top-[22.2rem] z-[150] flex w-full max-w-[22rem] -translate-x-1/2 items-center justify-between px-[0.75rem]">
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
              handlePrev();
            }}
            aria-label="라인업 이전 카드"
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
              handleNext();
            }}
            aria-label="라인업 다음 카드"
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
