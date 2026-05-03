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
        backgroundPosition: 'center top, center bottom, center -7rem, center -15rem, center',
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
        {(TIMETABLE_DAY_BANNERS[selectedDay] ?? []).map((banner, index, banners) => {
          const isVariant2 = banner.variant === 2;
          const isVariant1 = banner.variant === 1;
          const isRightAligned = index % 2 === 1;
          const timeBadgeOffsetClass = isVariant1 ? '!translate-x-[0.45rem]' : '';
          const rightImageSlotOffsetClass = isVariant1 ? '!top-[45%] !translate-x-[0.55rem]' : '';
          const leftImageSlotOffsetClass = isVariant2 ? '!top-[42%] !translate-x-[-15.85rem]' : '';
          const variant1ShiftClass = isVariant1 ? 'translate-x-[0.95rem]' : '';
          const variant2ShiftClass = isVariant2 ? '-translate-x-[0.95rem]' : '';
          const artistOffsetClass = [
            isVariant1
              ? selectedDay === 'day2' && (banner.id === 1 || banner.id === 5)
                ? '!ml-[0.6rem]'
                : '!ml-[2.5rem]'
              : '',
            banner.id === 6 ? '!translate-x-[1.2rem]' : '',
            banner.id === 7 ? '!-translate-x-[0.8rem]' : '',
          ].join(' ');
          const isSmallArtistText =
            (selectedDay === 'day2' && (banner.id === 1 || banner.id === 5)) ||
            (selectedDay === 'day3' && (banner.id === 4 || banner.id === 7));
          const artistSizeClass = isSmallArtistText ? '!text-[1.15rem]' : '';

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
                    ? `timetable-banner-rise 700ms cubic-bezier(0.22,1,0.36,1) ${(banners.length - 1 - index) * 90}ms both`
                    : 'none',
                }}
                className="transform-gpu"
              >
                <Banner
                  artist={banner.artist}
                  team={banner.team ?? ''}
                  time={banner.time}
                  variant={banner.variant}
                  reverse={isRightAligned}
                  mirrorImage={false}
                  tiltTimeBadgeLeft={false}
                  timeBadgeOffsetClass={timeBadgeOffsetClass}
                  enableVariant2BaseShift
                  adjustDay2Variant2Text={isVariant2}
                  useVariant1TextLayoutForVariant2={false}
                  artistOffsetClass={artistOffsetClass}
                  artistSizeClass={artistSizeClass}
                  showRightImageSlot={isVariant1}
                  rightImageSlotSrc={isVariant1 ? Singer1 : ''}
                  rightImageSlotOffsetClass={rightImageSlotOffsetClass}
                  showLeftImageSlot={isVariant2}
                  leftImageSlotSrc={isVariant2 ? Singer1 : ''}
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
