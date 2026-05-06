import { useRef } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import DesertBg from '@/assets/images/desert.svg';
import {
  MAIN_SECTION_BODY_SCROLL_FADE,
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/components/animation/useScrollDrivenOpacity';

const AED_ROWS = [
  ['북악관', '로비 내'],
  ['유담관', '스포렉스'],
  ['유담관', '9층 출입문 옆'],
  ['청운관', '2층 세이프원 상황실'],
  ['혜인관', '1층 로비'],
];

const EVACUATION_ROWS = [
  '폭풍의 언덕',
  '혜청사(혜인관 청운관 사이)',
  '혜인관, 은주관 사이 대일외고 방향',
];

export default function Safety() {
  const iconBlockRef = useRef(null);
  const bodyBlockRef = useRef(null);
  const iconOpacity = useScrollDrivenOpacity(iconBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);
  const bodyOpacity = useScrollDrivenOpacity(bodyBlockRef, MAIN_SECTION_BODY_SCROLL_FADE);

  return (
    <section
      id="safety"
      className="relative min-h-[30rem] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[3.75rem]"
    >
      <img
        src={DesertBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-53rem] z-[1] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[6.5rem] z-[2] h-[20rem] w-[28.125rem] max-w-none -translate-x-1/2"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.1) 0%,  rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.45) 15%,rgba(0,0,0,0.65) 20%,rgba(0,0,0,0.75) 23%,rgba(0,0,0,0.85) 27%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[1.5rem] z-[2] h-[40rem] w-[28.125rem] max-w-none -translate-x-1/2"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0, 0.05) 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0.55) 35%,rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.9) 95%, rgba(0,0,0,1) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[3] h-[22rem] w-[28.125rem] max-w-none -translate-x-1/2"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.6) 50%,rgba(0,0,0,0.95) 100%)',
        }}
      />
      <div
        ref={iconBlockRef}
        style={{ opacity: iconOpacity, willChange: 'opacity' }}
        className="relative z-10 flex flex-col items-center gap-[0.25rem]"
      >
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          SAFETY GUIDE
        </p>
      </div>
      <div
        ref={bodyBlockRef}
        style={{ opacity: bodyOpacity, willChange: 'opacity' }}
        className="relative z-10 mt-[1.75rem] -mx-[2rem] w-[calc(100%+4rem)]"
      >
        <div className="mt-[0.8rem] h-px w-full bg-white/70" />
        <div className="pt-[1.61rem] pb-[1.15rem]">
          <div className="grid grid-cols-[7.5rem_4.6rem_1fr] items-start gap-x-[0.8rem]">
            <p className="whitespace-nowrap pt-[0.4rem] pl-[1rem] text-left text-[0.875rem] font-extrabold leading-[1.35] tracking-[-0.01rem] text-white [font-family:Pretendard]">
              AED 위치 안내
            </p>
            <div className="pt-[0.4rem] text-left text-[0.75rem] font-semibold leading-[1.46] tracking-[-0.01rem] text-white [font-family:Pretendard]">
              {AED_ROWS.map(([building, place]) => (
                <p key={`${building}-${place}`} className="m-0 whitespace-nowrap">
                  {building}
                </p>
              ))}
            </div>
            <div className="pt-[0.4rem] -translate-x-[2.6rem] text-left text-[0.75rem] font-normal leading-[1.46] tracking-[-0.01rem] text-white [font-family:Pretendard]">
              {AED_ROWS.map(([building, place]) => (
                <p key={`${building}-${place}-detail`} className="m-0 whitespace-nowrap">
                  {place}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-[0.75rem] h-px w-full bg-white/70" />
        <div className="pt-[1.61rem] pb-[1.15rem]">
          <div className="grid grid-cols-[6.1rem_1fr] items-start gap-x-[0.8rem]">
            <p className="pt-[0.4rem] pl-[1rem] text-left text-[0.875rem] font-extrabold leading-[1.35] tracking-[-0.01rem] text-white [font-family:Pretendard]">
              대피로 안내
            </p>
            <div className="pl-[1.3rem] mt-[0.4rem] text-left text-[0.75rem] font-semibold leading-[1.46] tracking-[-0.01rem] text-white [font-family:Pretendard]">
              {EVACUATION_ROWS.map((line) => (
                <p key={line} className="m-0 whitespace-nowrap">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
