import { useState } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import FenceBg from '@/assets/images/fence.svg';
import HorseCard from '@/assets/images/horse-card.png';
import HorseRed from '@/assets/images/horse-red.svg';
import LineupCardBg from '@/assets/images/lineup-card.svg';
import LineupStarBg from '@/assets/images/lineup-star.svg';
import Singer2 from '@/assets/images/singer2.png';

const LINEUP_ITEMS = [
  {
    id: 1,
    group: '경영학부 밴드부',
    artist: '워커스',
    day: 'DAY 2',
    time: '18:00 ~ 18:30',
    image: Singer2,
    textPosition: { left: '6rem', bottom: '2.55rem' },
    textTilt: -3,
  },
  {
    id: 2,
    group: '실용음악학부 밴드부',
    artist: '워커스2',
    day: 'DAY 2',
    time: '18:40 ~ 19:10',
    image: Singer2,
    textPosition: { left: '5.85rem', bottom: '2.6rem' },
    textTilt: -2,
  },
  {
    id: 3,
    group: '멋쟁이사자차럼',
    artist: '라이크',
    day: 'DAY 2',
    time: '19:20 ~ 19:50',
    image: Singer2,
    textPosition: { left: '6.15rem', bottom: '2.5rem' },
    textTilt: -4,
  },
  {
    id: 4,
    group: '멋쟁이',
    artist: '멋쟁이다',
    day: 'DAY 2',
    time: '20:00 ~ 20:30',
    image: Singer2,
    textPosition: { left: '6.1rem', bottom: '2.58rem' },
    textTilt: -1,
  },
];

const LINEUP_TEXT_GLOBAL_OFFSET_Y = '2.2rem';
const LINEUP_TEXT_GLOBAL_TILT = -4;

function getVisibleLineupItems(items, centerIndex) {
  const total = items.length;
  if (total === 0) return [];
  if (total === 1) return [{ item: items[0], position: 'center' }];

  const prevIndex = (centerIndex - 1 + total) % total;
  const nextIndex = (centerIndex + 1) % total;

  return [
    { item: items[prevIndex], position: 'left' },
    { item: items[centerIndex], position: 'center' },
    { item: items[nextIndex], position: 'right' },
  ];
}

function LineupCard({ item, position = 'center' }) {
  const wrapperClass =
    position === 'left'
      ? 'left-[-12rem] top-[0.1rem] z-[2] -rotate-[6deg] blur-[2px] opacity-95'
      : position === 'right'
        ? 'right-[-15.2rem] top-[0.1rem] z-[2] rotate-[18deg] blur-[2px] opacity-95'
        : 'left-1/2 top-[3.5rem] z-[4] -translate-x-1/2 rotate-[0.85deg]';
  const starWrapperClass = 'right-[12rem] top-[2.35rem] h-[8.9rem] w-[8.9rem] -rotate-[3deg]';
  const starTextTiltClass = '-rotate-[7deg]';

  return (
    <article className={`absolute w-[19.5rem] transition-all duration-300 ${wrapperClass}`}>
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
            className="absolute inset-0 h-full w-full scale-[2.79] translate-y-[4.0rem] translate-x-[0.4rem] object-contain object-bottom"
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
          <img
            src={LineupStarBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
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
    </article>
  );
}

export default function Lineup() {
  const [centerIndex, setCenterIndex] = useState(0);
  const [activeNavButton, setActiveNavButton] = useState(null);
  const visibleCards = getVisibleLineupItems(LINEUP_ITEMS, centerIndex);
  const hasManyCards = LINEUP_ITEMS.length > 1;

  const handlePrev = () => {
    setActiveNavButton('prev');
    setCenterIndex((prev) => (prev - 1 + LINEUP_ITEMS.length) % LINEUP_ITEMS.length);
  };

  const handleNext = () => {
    setActiveNavButton('next');
    setCenterIndex((prev) => (prev + 1) % LINEUP_ITEMS.length);
  };

  return (
    <section
      id="lineup"
      className="relative min-h-[48rem] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[0rem]"
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
      <div className="relative z-10 flex flex-col items-center gap-[0.25rem]">
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          LINEUP
        </p>
      </div>

      <div className="relative z-[20] mx-auto mt-[3.1rem] h-[20.5rem] w-full max-w-[21rem] overflow-visible">
        {visibleCards.map(({ item, position }) => (
          <LineupCard key={`${position}-${item.id}`} item={item} position={position} />
        ))}
      </div>

      {hasManyCards && (
        <div className="pointer-events-none absolute left-1/2 top-[22.2rem] z-[30] flex w-full max-w-[22rem] -translate-x-1/2 items-center justify-between px-[0.75rem]">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 라인업 카드"
            className={`pointer-events-auto flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition ${
              activeNavButton === 'prev' ? 'bg-[#2A2A2A]' : 'bg-white'
            }`}
          >
            <span
              aria-hidden="true"
              className="h-0 w-0 border-y-[0.5rem] border-y-transparent border-r-[0.9rem] border-r-[#C43A31]"
            />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 라인업 카드"
            className={`pointer-events-auto flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition ${
              activeNavButton === 'next' ? 'bg-[#2A2A2A]' : 'bg-white'
            }`}
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
