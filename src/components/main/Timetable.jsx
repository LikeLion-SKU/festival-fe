import { useRef, useState } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import FireBg from '@/assets/images/fire1.svg';
import FireBg2 from '@/assets/images/fire2.svg';
import Singer1 from '@/assets/images/singer1.png';
import Banner from '@/components/main/Banner';
import {
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/hooks/useScrollDrivenOpacity';

const DAY_BANNERS = {
  day2: [
    { id: 1, artist: '세븐틴', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 2, artist: '지드래곤', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 3, artist: '엔하이픈', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 4, artist: '아이유', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 5, artist: '블랙핑크', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 6, artist: '방탄소년단', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 7, artist: '투어스', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 8, artist: '데이식스', time: '18:00 ★ ~ 18:30', variant: 2 },
  ],
  day3: [
    { id: 1, artist: '윤희준', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 2, artist: '임다현', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 3, artist: '정영진', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 4, artist: '최운조', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 5, artist: '김정현', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 6, artist: '금시언', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 7, artist: '김나경', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 8, artist: '신채린', time: '18:00 ★ ~ 18:30', variant: 2 },
  ],
};

export default function Timetable() {
  const [selectedDay, setSelectedDay] = useState('day2');
  const iconBlockRef = useRef(null);
  const iconOpacity = useScrollDrivenOpacity(iconBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);

  const dayButtons = [
    { id: 'day2', label: 'DAY 2', date: '5월 14일 (목)' },
    { id: 'day3', label: 'DAY 3', date: '5월 15일 (금)' },
  ];

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
              onClick={() => setSelectedDay(day.id)}
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

      <div className="mx-auto mt-[1.5rem] flex w-full max-w-[24rem] flex-col gap-[0.05rem]">
        {(DAY_BANNERS[selectedDay] ?? []).map((banner, index) => {
          const isVariant2 = banner.variant === 2;
          const isVariant1 = banner.variant === 1;
          const isRightAligned = index % 2 === 1;
          const timeBadgeOffsetClass = isVariant1 ? '!translate-x-[0.45rem]' : '';
          const rightImageSlotOffsetClass = isVariant1 ? '!top-[45%] !translate-x-[0.55rem]' : '';
          const leftImageSlotOffsetClass = isVariant2 ? '!top-[42%] !translate-x-[-15.85rem]' : '';
          const variant1ShiftClass = isVariant1 ? 'translate-x-[0.95rem]' : '';
          const variant2ShiftClass = isVariant2 ? '-translate-x-[0.95rem]' : '';
          const artistOffsetClass = isVariant1 ? '!ml-[2.5rem]' : '';

          return (
            <div
              key={`${selectedDay}-${banner.id}`}
              className={`${isRightAligned ? 'self-end' : 'self-start'} ${variant1ShiftClass} ${variant2ShiftClass} ${
                banner.id >= 2 ? '-mt-[1.5rem]' : ''
              } ${banner.variant === 2 ? 'z-0' : 'z-10'}`}
            >
              <Banner
                artist={banner.artist}
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
          );
        })}
      </div>
    </section>
  );
}
