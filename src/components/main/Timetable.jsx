import { useEffect, useRef, useState } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import FireBg from '@/assets/images/fire1.svg';
import FireBg2 from '@/assets/images/fire2.svg';
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
      className="min-h-[70rem] overflow-x-clip bg-black px-[1.5rem] pt-[7.5rem]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.58) 22%, rgba(8,8,8,0.28) 40%, rgba(0,0,0,0) 54%), linear-gradient(0deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 35%), url(${FireBg}), url(${FireBg2}), linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 100%)`,
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
        backgroundPosition: 'center top, center bottom, center -5rem, center -5rem, center',
        backgroundSize: 'cover, cover, cover, cover, cover',
        backgroundBlendMode: 'normal, normal, hard-light, hard-light, normal',
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
          const isVariant2 = banner.variant === 2;
          const isVariant1 = banner.variant === 1;
          const isRightAligned = index % 2 === 1;
          const variant1ShiftClass = isVariant1 ? 'translate-x-[0.95rem]' : '';
          const variant2ShiftClass = isVariant2 ? '-translate-x-[0.95rem]' : '';
          const stackSpacingClass =
            (selectedDay === 'day2' && banner.id >= 6) || (selectedDay === 'day3' && banner.id >= 5)
              ? '-mt-[1.9rem]'
              : banner.id >= 2
                ? '-mt-[1.6rem]'
                : '';
          const banner37OffsetClass =
            selectedDay === 'day3' && banner.id === 7 ? '-mt-[0.95rem]' : '';
          const banner28OffsetClass =
            selectedDay === 'day2' && banner.id === 8 ? 'mt-[0.01rem]' : '';

          return (
            <div
              key={`${selectedDay}-${banner.id}`}
              className={`${isRightAligned ? 'self-end' : 'self-start'} ${variant1ShiftClass} ${variant2ShiftClass} ${
                stackSpacingClass
              } ${banner37OffsetClass} ${banner28OffsetClass} ${banner.variant === 2 ? 'z-0' : 'z-9'}`}
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
                  bannerImageSrc={banner.bannerImageSrc}
                  bannerScale={banner.bannerScale ?? 1}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
