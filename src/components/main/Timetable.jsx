import { useState } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import FireBg from '@/assets/images/fire1.svg';
import FireBg2 from '@/assets/images/fire2.svg';
import Banner from '@/components/main/Banner';

const DAY_BANNERS = {
  day2: [
    { id: 1, artist: '세븐틴', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 2, artist: '지드래곤', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 3, artist: '엔하이픈', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 4, artist: '아이유', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 5, artist: '블랙핑크', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 6, artist: '방탄소년단', time: '18:00 ★ ~ 18:30', variant: 2 },
    { id: 7, artist: '투어스', time: '18:00 ★ ~ 18:30', variant: 1 },
    { id: 8, artist: '프로미스나인', time: '18:00 ★ ~ 18:30', variant: 2 },
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

  const dayButtons = [
    { id: 'day2', label: 'DAY 2', date: '5월 14일 (목)' },
    { id: 'day3', label: 'DAY 3', date: '5월 15일 (금)' },
  ];

  return (
    <section
      id="timetable"
      className="min-h-[70rem] bg-[#141414] px-[1.5rem] pt-[7.5rem]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 32%), linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 35%), url(${FireBg}), url(${FireBg2}), linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,1) 100%)`,
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, no-repeat',
        backgroundPosition: 'center top, center bottom, center -7rem, center -15rem, center',
        backgroundSize: 'cover, cover, cover, cover, cover',
        backgroundBlendMode: 'normal, normal, hard-light, normal, normal',
      }}
    >
      <div className="flex flex-col items-center gap-[0.25rem]">
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
          const isDay3 = selectedDay === 'day3';
          const isRightAligned = isDay3 ? index % 2 === 0 : index % 2 === 1;
          const timeBadgeOffsetClass = isDay3
            ? banner.variant === 2
              ? '!-translate-x-[0.9rem]'
              : '!translate-x-[0.9rem]'
            : '';

          return (
            <div
              key={`${selectedDay}-${banner.id}`}
              className={`${isRightAligned ? 'self-end' : 'self-start'} ${
                banner.id >= 2 ? '-mt-[1.5rem]' : ''
              } ${banner.variant === 2 ? 'z-0' : 'z-10'}`}
            >
              <Banner
                artist={banner.artist}
                time={banner.time}
                variant={banner.variant}
                reverse={isRightAligned}
                mirrorImage={isDay3}
                tiltTimeBadgeLeft={isDay3 && banner.variant === 2}
                timeBadgeOffsetClass={timeBadgeOffsetClass}
                enableVariant2BaseShift={!isDay3}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
