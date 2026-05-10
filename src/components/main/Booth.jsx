import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import HorseIcon from '@/assets/icons/horse.svg';
import DesertBg from '@/assets/images/desert.svg';
import FenceBg from '@/assets/images/fence.svg';
import {
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/components/animation/useScrollDrivenOpacity';
import ArrowButton from '@/components/common/Button/ArrowButton';
import { getMainBoothCardsByBuilding } from '@/constants/boothBuildingData';
import { BUILDINGS } from '@/constants/mainDummyData';

const MAIN_BOOTH_CARDS_PER_PAGE = 4;
const BOOTH_SPREAD_MS = 1580;
const BOOTH_SPREAD_EASE = 'cubic-bezier(0.22,1,0.36,1)';
/** opacity는 카드별로 지정해지면 진해지니까 그룹 자체로 적용시킴 */
const BOOTH_STACKED_GROUP_OPACITY = 0.9;

/** 스프레드 시작: 중앙에서 카드들이 모인 상태*/
function getBoothCardCenterTransform(index) {
  switch (index) {
    case 0:
      return 'translate3d(58%, 55%, 0) rotate(8deg) scale(0.84)';
    case 1:
      return 'translate3d(-58%, 55%, 0) rotate(-8deg) scale(0.84)';
    case 2:
      return 'translate3d(58%, -55%, 0) rotate(5deg) scale(0.88)';
    case 3:
      return 'translate3d(-58%, -55%, 0) rotate(-5deg) scale(0.88)';
    default:
      return 'translate3d(0, 55%, 0) scale(0.86)';
  }
}

/** 짧은 간격으로 순차적으로  */
function getBoothCardScatterDelayMs(index) {
  return Math.round(index * 38);
}

/** @param {{ image: string; title: string | string[] }} props */
function BoothImageCard({ image, title }) {
  const titleLabel = Array.isArray(title) ? title.join(' ') : String(title ?? '');
  const imageAlt = titleLabel ? `${titleLabel} 부스 카드` : '부스 카드';
  return (
    <article className="relative h-[13.25rem] w-full overflow-hidden shadow-[1px_1px_0px_rgba(0,0,0,0.12)]">
      <img
        src={image}
        alt={imageAlt}
        className="size-full object-cover"
        decoding="async"
        draggable={false}
      />
    </article>
  );
}

export default function Booth() {
  const navigate = useNavigate();
  const [activeBuildingId, setActiveBuildingId] = useState(BUILDINGS[0].id);
  const [activePageByBuilding, setActivePageByBuilding] = useState({});
  const activeBuildingIndex = BUILDINGS.findIndex((b) => b.id === activeBuildingId);
  const iconBlockRef = useRef(null);
  const cardsGridRef = useRef(null);
  const hasCardsGridEnteredRef = useRef(false);
  const settleTimerRef = useRef(null);
  const spreadHintTimerRef = useRef(null);
  const [isCardsSettled, setIsCardsSettled] = useState(false);
  const [cardsOpacityAnimDone, setCardsOpacityAnimDone] = useState(false);
  const [spreadTransformHint, setSpreadTransformHint] = useState(false);
  const iconOpacity = useScrollDrivenOpacity(iconBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);

  const runCardsEntrance = useCallback(() => {
    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    if (spreadHintTimerRef.current) window.clearTimeout(spreadHintTimerRef.current);
    setCardsOpacityAnimDone(false);
    setSpreadTransformHint(false);
    setIsCardsSettled(false);
    settleTimerRef.current = window.setTimeout(() => {
      setIsCardsSettled(true);
      setCardsOpacityAnimDone(false);
      setSpreadTransformHint(true);
      spreadHintTimerRef.current = window.setTimeout(
        () => {
          setSpreadTransformHint(false);
          spreadHintTimerRef.current = null;
        },
        BOOTH_SPREAD_MS + Math.round(3 * 38) + 80
      );
      settleTimerRef.current = null;
    }, 300);
  }, []);

  const activeBuildingCards = useMemo(
    () => getMainBoothCardsByBuilding(activeBuildingId),
    [activeBuildingId]
  );
  const activeBuildingTotalPages = Math.max(
    1,
    Math.ceil(activeBuildingCards.length / MAIN_BOOTH_CARDS_PER_PAGE)
  );
  const activePage = Math.min(
    activePageByBuilding[activeBuildingId] ?? 0,
    activeBuildingTotalPages - 1
  );
  const hasPrevPage = activePage > 0;
  const hasNextPage = activePage < activeBuildingTotalPages - 1;
  const visibleCards = useMemo(() => {
    const start = activePage * MAIN_BOOTH_CARDS_PER_PAGE;
    return activeBuildingCards.slice(start, start + MAIN_BOOTH_CARDS_PER_PAGE);
  }, [activeBuildingCards, activePage]);

  const goToPrevBuilding = useCallback(() => {
    setActiveBuildingId((prevBuildingId) => {
      const idx = BUILDINGS.findIndex((b) => b.id === prevBuildingId);
      if (idx < 0) return prevBuildingId;

      const cards = getMainBoothCardsByBuilding(prevBuildingId);
      const totalPages = Math.max(1, Math.ceil(cards.length / MAIN_BOOTH_CARDS_PER_PAGE));
      const page = Math.min(activePageByBuilding[prevBuildingId] ?? 0, totalPages - 1);

      if (page > 0) {
        setActivePageByBuilding((prevPages) => ({ ...prevPages, [prevBuildingId]: page - 1 }));
        if (hasCardsGridEnteredRef.current) runCardsEntrance();
        return prevBuildingId;
      }

      if (idx <= 0) return prevBuildingId;

      const prevBuildingIdTarget = BUILDINGS[idx - 1].id;
      const prevBuildingCards = getMainBoothCardsByBuilding(prevBuildingIdTarget);
      const prevBuildingLastPage =
        Math.max(1, Math.ceil(prevBuildingCards.length / MAIN_BOOTH_CARDS_PER_PAGE)) - 1;
      setActivePageByBuilding((prevPages) => ({
        ...prevPages,
        [prevBuildingIdTarget]: prevBuildingLastPage,
      }));
      if (hasCardsGridEnteredRef.current) runCardsEntrance();
      return prevBuildingIdTarget;
    });
  }, [activePageByBuilding, runCardsEntrance]);

  const goToNextBuilding = useCallback(() => {
    setActiveBuildingId((prevBuildingId) => {
      const idx = BUILDINGS.findIndex((b) => b.id === prevBuildingId);
      if (idx < 0) return prevBuildingId;

      const cards = getMainBoothCardsByBuilding(prevBuildingId);
      const totalPages = Math.max(1, Math.ceil(cards.length / MAIN_BOOTH_CARDS_PER_PAGE));
      const page = Math.min(activePageByBuilding[prevBuildingId] ?? 0, totalPages - 1);

      if (page < totalPages - 1) {
        setActivePageByBuilding((prevPages) => ({ ...prevPages, [prevBuildingId]: page + 1 }));
        if (hasCardsGridEnteredRef.current) runCardsEntrance();
        return prevBuildingId;
      }

      if (idx >= BUILDINGS.length - 1) return prevBuildingId;
      const nextBuildingId = BUILDINGS[idx + 1].id;
      setActivePageByBuilding((prevPages) => ({ ...prevPages, [nextBuildingId]: 0 }));
      if (hasCardsGridEnteredRef.current) runCardsEntrance();
      return nextBuildingId;
    });
  }, [activePageByBuilding, runCardsEntrance]);

  useEffect(() => {
    const grid = cardsGridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasCardsGridEnteredRef.current) return;
          hasCardsGridEnteredRef.current = true;
          runCardsEntrance();
          observer.disconnect();
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(grid);
    return () => observer.disconnect();
  }, [runCardsEntrance]);

  useEffect(
    () => () => {
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      if (spreadHintTimerRef.current) window.clearTimeout(spreadHintTimerRef.current);
    },
    []
  );

  return (
    <section
      id="booth"
      className="relative min-h-[46rem] overflow-hidden bg-[#141414] px-[1.5rem] pb-[9.0rem] pt-[2.5rem]"
    >
      <style>{`
        @keyframes booth-card-spread-opacity {
          from {
            opacity: ${BOOTH_STACKED_GROUP_OPACITY};
          }
          52% {
            opacity: 0.92;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes booth-card-spread-transform {
          from {
            transform: var(--booth-from-transform);
          }
          to {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }
      `}</style>

      <div className="pointer-events-none absolute left-1/2 top-[-29rem] z-0 flex w-[28.125rem] max-w-none -translate-x-1/2 flex-col">
        <img
          src={FenceBg}
          alt=""
          aria-hidden="true"
          className="w-full object-cover"
          decoding="async"
          draggable={false}
          fetchPriority="low"
        />
        <img
          src={DesertBg}
          alt=""
          aria-hidden="true"
          className="-mt-[20rem] w-full object-cover"
          decoding="async"
          draggable={false}
          fetchPriority="low"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[450px] flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center gap-6">
          <div
            ref={iconBlockRef}
            style={{ opacity: iconOpacity }}
            className="flex flex-col items-center gap-4"
          >
            <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
            <p className="text-center text-[1rem] leading-[1.3] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
              BOOTH
            </p>
          </div>

          <div
            className="flex w-full flex-nowrap justify-center gap-2"
            role="tablist"
            aria-label="건물별 부스"
          >
            {BUILDINGS.map((b) => {
              const active = b.id === activeBuildingId;
              return (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setActiveBuildingId(b.id);
                    setActivePageByBuilding((prevPages) => ({ ...prevPages, [b.id]: 0 }));
                    if (hasCardsGridEnteredRef.current) runCardsEntrance();
                  }}
                  className={clsx(
                    'h-9 w-[clamp(2.2rem,14.5vw,3.5rem)] min-w-0 border border-solid border-white px-1 text-center text-[clamp(0.62rem,2.65vw,0.75rem)] tracking-[-0.01875rem] whitespace-nowrap transition-colors',
                    active
                      ? 'bg-white font-bold text-[#141414]'
                      : 'bg-transparent font-medium text-white'
                  )}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full">
          <div
            className={clsx(
              'transform-gpu',
              isCardsSettled && !cardsOpacityAnimDone && 'will-change-[opacity]'
            )}
            style={{
              opacity: isCardsSettled ? undefined : BOOTH_STACKED_GROUP_OPACITY,
              animation: isCardsSettled
                ? `booth-card-spread-opacity ${BOOTH_SPREAD_MS}ms ${BOOTH_SPREAD_EASE} 0ms both`
                : 'none',
            }}
            onAnimationEnd={(e) => {
              if (e.animationName !== 'booth-card-spread-opacity') return;
              setCardsOpacityAnimDone(true);
            }}
          >
            <div
              ref={cardsGridRef}
              className="grid min-h-[27.5rem] w-full grid-cols-2 content-start gap-x-4 gap-y-4"
            >
              {visibleCards.map((card, index) => (
                <div key={card.id} className="transform-gpu">
                  <div
                    style={{
                      '--booth-from-transform': getBoothCardCenterTransform(index),
                      ...(spreadTransformHint ? { willChange: 'transform' } : {}),
                      transform: isCardsSettled ? undefined : getBoothCardCenterTransform(index),
                      animation: isCardsSettled
                        ? `booth-card-spread-transform ${BOOTH_SPREAD_MS}ms ${BOOTH_SPREAD_EASE} ${getBoothCardScatterDelayMs(index)}ms both`
                        : 'none',
                    }}
                  >
                    <BoothImageCard image={card.image} title={card.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto -ml-4 w-[40px] h-[40px] flex items-center justify-center">
              {(activeBuildingIndex > 0 || hasPrevPage) && (
                <ArrowButton direction="left" onClick={goToPrevBuilding} ariaLabel="이전 건물" />
              )}
            </div>
            <div className="pointer-events-auto -mr-4 w-[40px] h-[40px] flex items-center justify-center">
              {(activeBuildingIndex < BUILDINGS.length - 1 || hasNextPage) && (
                <ArrowButton direction="right" onClick={goToNextBuilding} ariaLabel="다음 건물" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto mt-4 w-[min(86.5vw,25rem)]">
        <button
          type="button"
          onClick={() => navigate('/booth-map')}
          className="flex h-[3.25rem] w-full shrink-0 items-center justify-center border border-solid border-white bg-[rgba(255,255,255,0.2)] px-4 py-[0.875rem] text-base font-semibold leading-6 tracking-[-0.025rem] text-white shadow-[1px_1px_0px_rgba(0,0,0,0.12)]"
        >
          한눈에 보기
        </button>
      </div>
    </section>
  );
}
