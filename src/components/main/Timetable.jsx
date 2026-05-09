import { useEffect, useRef, useState } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import FireBg from '@/assets/images/fire1.svg';
import FireBg2 from '@/assets/images/fire2.svg';
import Singer1 from '@/assets/images/singer1.png';
import {
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/components/animation/useScrollDrivenOpacity';
import Banner from '@/components/main/Banner';
import { TIMETABLE_DAY_BANNERS } from '@/constants/timetableData';

/** day + 배너 id → Tailwind 클래스 (없으면 빈 문자열로) */
function classForBanner(table, day, bannerId) {
  return table[day]?.[bannerId] ?? '';
}

const TIMETABLE_ARTIST_OFFSET_BY_DAY = {
  day2: {
    1: '!translate-x-[0.25rem] !translate-y-[0.45rem]',
    5: '!-translate-x-[0.25rem] !translate-y-[0.5rem]',
    6: '!-translate-x-[2.1rem] !-translate-y-[0.15rem]',
    7: '!translate-x-[0.05rem] !-translate-y-[0.05rem]',
    8: '!-translate-x-[1.1rem] !-translate-y-[0.1rem]',
  },
  day3: {
    1: '!translate-x-[0.5rem] !-translate-y-[0.15rem]',
    2: '!-translate-x-[1rem] !translate-y-[0.05rem]',
    4: '!translate-x-[1.25rem] !translate-y-[0.2rem]',
    5: '!translate-x-[1.35rem] !translate-y-[0.05rem]',
    6: '!translate-x-[1.2rem] !translate-y-[0.1rem]',
    7: '!translate-x-[0.5rem] !-translate-y-[0.05rem]',
  },
};

const TIMETABLE_TEAM_OFFSET_BY_DAY = {
  day2: {
    1: '!translate-x-[0.55rem] !translate-y-[0.25rem]',
    2: '!-translate-x-[0.3rem] !translate-y-[0.25rem]',
    3: '!-translate-x-[0.3rem] !translate-y-[0.25rem]',
    4: '!-translate-x-[0.3rem] !translate-y-[0.25rem]',
    5: '!translate-y-[0.05rem]',
    6: '!-translate-x-[0.3rem] !translate-y-[0.25rem]',
    7: '!translate-x-[0.1rem] !translate-y-[0.15rem]',
    8: '!-translate-x-[1rem] !translate-y-[0.15rem]',
  },
  day3: {
    1: '!translate-x-[0.5rem] !translate-y-[0.25rem]',
    2: '!-translate-x-[1rem] !translate-y-[0.2rem]',
    3: '!translate-x-[0.1rem] !translate-y-[0.3rem]',
    4: '!-translate-x-[0.55rem] !translate-y-[0.2rem]',
    5: '!translate-x-[0.55rem] !translate-y-[0.25rem]',
    6: '!-translate-x-[0.55rem] !translate-y-[0.25rem]',
    7: '!-translate-x-[0.55rem] !translate-y-[0.45rem]',
  },
};

/** `${day}:${id}` → 아티스트 글자 크기 보정 */
const TIMETABLE_ARTIST_SIZE_BY_KEY = {
  'day3:4': '!text-[1.6rem]',
  'day3:7': '!text-[1.4rem]',
  'day2:1': '!text-[1.6rem]',
};

function variant1ArtistMarginClass(bannerVariant) {
  return bannerVariant === 3 ? '!-ml-[2rem]' : '!ml-[2.5rem]';
}

export default function Timetable() {
  const [selectedDay, setSelectedDay] = useState('day2');
  const iconBlockRef = useRef(null);
  const bannerListRef = useRef(null);
  const [isBannerSequenceStarted, setIsBannerSequenceStarted] = useState(false);
  const iconOpacity = useScrollDrivenOpacity(iconBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);

  const dayButtons = [
    { id: 'day2', label: 'DAY 2', date: '5월 14일 (목)' },
    { id: 'day3', label: 'DAY 3', date: '5월 15일 (금)' },
  ];

  useEffect(() => {
    if (isBannerSequenceStarted) return;
    const listEl = bannerListRef.current;
    if (!listEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setIsBannerSequenceStarted(true);
          observer.disconnect();
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(listEl);

    return () => observer.disconnect();
  }, [selectedDay, isBannerSequenceStarted]);

  return (
    <section
      id="timetable"
      className="min-h-[70rem] overflow-x-hidden bg-[#141414] px-[1.5rem] pt-[7.5rem]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 32%), linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 35%), url(${FireBg}), url(${FireBg2}), linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,1) 100%)`,
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
        backgroundPosition: 'center top, center bottom, center 6rem, center 6rem, center',
        backgroundSize: 'cover, cover, cover, cover, cover',
        backgroundBlendMode: 'normal, normal, hard-light, normal, normal',
      }}
    >
      <style>{`
        @keyframes timetable-banner-rise {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* iOS Safari: 인접 섹션 경계 서브픽셀 합성으로 생기는 1px 헤어라인 완화 */
        @supports (-webkit-touch-callout: none) {
          #timetable {
            margin-top: -1px;
            position: relative;
            z-index: 1;
          }
        }
      `}</style>

      <div
        ref={iconBlockRef}
        style={{ opacity: iconOpacity, willChange: 'opacity' }}
        className="flex flex-col items-center gap-[0.25rem]"
      >
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          TIMETABLE
        </p>
      </div>

      <div className="mx-auto mt-[1.625rem] flex w-full max-w-[24rem] gap-[0.625rem]">
        {dayButtons.map((day) => {
          const isSelected = selectedDay === day.id;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => {
                setIsBannerSequenceStarted(false);
                setSelectedDay(day.id);
              }}
              className={`flex h-[3.35rem] flex-1 flex-col items-center justify-center border-[1.5px] transition-all duration-200 ${
                isSelected
                  ? 'border-white bg-white text-[#EB1F00]'
                  : 'border-white/90 bg-white/10 text-white backdrop-blur-[0.02rem]'
              }`}
            >
              <span className="text-[0.875rem] leading-[1] [font-family:Sekuya]">{day.label}</span>
              <span
                className={`mt-[0.4rem] text-[0.645rem] font-bold ${isSelected ? 'text-[#EB1F00]' : 'text-white'}`}
              >
                {day.date}
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={bannerListRef}
        className="mx-auto mt-[1.5rem] flex w-full max-w-[24rem] flex-col gap-[0.05rem]"
      >
        {(TIMETABLE_DAY_BANNERS[selectedDay] ?? []).map((banner, index) => {
          const slotImageSrc = banner.imageSlotSrc ?? Singer1;
          const isVariant2 = banner.variant === 2;
          const isVariant1 = banner.variant === 1;
          const isRightAligned = index % 2 === 1;
          const timeBadgeOffsetClass = isVariant1 ? '!translate-x-[0.45rem]' : '';
          const rightImageSlotOffsetClass = isVariant1 ? '!top-[45%] !translate-x-[0.55rem]' : '';
          const leftImageSlotOffsetClass = isVariant2 ? '!top-[42%] !translate-x-[-15.85rem]' : '';
          const variant1ShiftClass = isVariant1 ? 'translate-x-[0.95rem]' : '';
          const variant2ShiftClass = isVariant2 ? '-translate-x-[0.95rem]' : '';

          const artistOffsetClass = [
            isVariant1 ? variant1ArtistMarginClass(banner.bannerVariant) : '',
            classForBanner(TIMETABLE_ARTIST_OFFSET_BY_DAY, selectedDay, banner.id),
          ].join(' ');

          const artistSizeKey = `${selectedDay}:${banner.id}`;
          const artistSizeClass = TIMETABLE_ARTIST_SIZE_BY_KEY[artistSizeKey] ?? '';

          const teamOffsetClass = classForBanner(
            TIMETABLE_TEAM_OFFSET_BY_DAY,
            selectedDay,
            banner.id
          );

          const artistFirstLineOffsetClass =
            selectedDay === 'day3' && banner.id === 7
              ? '!translate-x-[3.8rem] !translate-y-[0.4rem]'
              : '';

          return (
            <div
              key={`${selectedDay}-${banner.id}`}
              className={`${isRightAligned ? 'self-end' : 'self-start'} ${variant1ShiftClass} ${variant2ShiftClass} ${
                banner.id >= 2 ? '-mt-[1.5rem]' : ''
              } ${banner.variant === 2 ? 'z-0' : 'z-10'}`}
            >
              <div
                style={{
                  opacity: isBannerSequenceStarted ? undefined : 0,
                  transform: isBannerSequenceStarted ? undefined : 'translateY(100px)',
                  willChange: 'opacity, transform',
                  animation: isBannerSequenceStarted
                    ? `timetable-banner-rise 1200ms cubic-bezier(0.22,1,0.36,1) ${index * 170}ms both`
                    : 'none',
                }}
                className="transform-gpu"
              >
                <Banner
                  artist={banner.artist}
                  team={banner.team ?? ''}
                  time={banner.time}
                  variant={banner.variant}
                  imageVariant={banner.bannerVariant}
                  reverse={isRightAligned}
                  mirrorImage={false}
                  tiltTimeBadgeLeft={false}
                  timeBadgeOffsetClass={timeBadgeOffsetClass}
                  enableVariant2BaseShift
                  adjustDay2Variant2Text={isVariant2}
                  useVariant1TextLayoutForVariant2={false}
                  artistOffsetClass={artistOffsetClass}
                  artistFirstLineOffsetClass={artistFirstLineOffsetClass}
                  artistSizeClass={artistSizeClass}
                  teamOffsetClass={teamOffsetClass}
                  showRightImageSlot={isVariant1}
                  rightImageSlotSrc={isVariant1 ? slotImageSrc : ''}
                  rightImageSlotOffsetClass={rightImageSlotOffsetClass}
                  showLeftImageSlot={isVariant2}
                  leftImageSlotSrc={isVariant2 ? slotImageSrc : ''}
                  leftImageSlotMirror={isVariant2}
                  leftImageSlotOffsetClass={leftImageSlotOffsetClass}
                  leftImageSlotRotateDeg={-10}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
