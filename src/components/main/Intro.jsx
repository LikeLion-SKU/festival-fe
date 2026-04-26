import HatIcon from '@/assets/icons/hat.svg';
import ZeroIcon from '@/assets/icons/main/0.svg';
import OneIcon from '@/assets/icons/main/1.svg';
import ThreeIcon from '@/assets/icons/main/3.svg';
import FiveIcon from '@/assets/icons/main/5.svg';
import HyphenIcon from '@/assets/icons/main/hypen.svg';
import SpotIcon from '@/assets/icons/main/spot.svg';

function DateDot() {
  return (
    <span
      className="inline-flex shrink-0"
      style={{ transform: 'translateY(6px) scale(0.7)', transformOrigin: 'center' }}
    >
      <img
        src={SpotIcon}
        alt=""
        aria-hidden="true"
        className="block h-[0.4rem] w-[0.5rem] max-w-none"
      />
    </span>
  );
}

export default function Intro() {
  return (
    <section
      id="intro"
      className="relative flex min-h-[100dvh] items-start justify-center bg-[#121212] px-[1.5rem] pt-[6.1875rem]"
    >
      <div className="flex w-[8.5625rem] flex-col items-center gap-[1.0625rem] text-center">
        <img src={HatIcon} alt="" aria-hidden="true" className="h-auto w-[2.3125rem]" />
        <div className="w-full">
          <p className="text-[0.75rem] leading-[1.024rem] text-white tracking-[-0.015rem] [font-family:Pretendard] whitespace-nowrap">
            <span className="font-medium">2026 </span>
            <span className="font-bold">서경대학교</span>
            <span className="font-medium"> 대동제</span>
          </p>
          <div className="mt-[0.375rem] h-[0.03125rem] w-full bg-[#E6E6E6]" />
          <div className="mt-[0.8125rem] flex items-center justify-center gap-[0.0625rem]">
            <img src={ZeroIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <img src={FiveIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <DateDot />
            <img src={OneIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <img src={ThreeIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <img src={HyphenIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <img src={ZeroIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <img src={FiveIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <DateDot />
            <img src={OneIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            <img src={FiveIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-label="메뉴 열기"
        className="absolute bottom-[5rem] left-1/2 z-[10] flex h-[3.4375rem] w-[3.4375rem] -translate-x-1/2 items-center justify-center overflow-hidden rounded-[12.5rem]"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid transparent',
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 8px rgba(255,255,255,0.22)',
            filter: 'blur(1.2px)',
          }}
        />
        <span className="sr-only">menu</span>
        <span
          aria-hidden="true"
          className="relative z-10 flex h-[2rem] w-[2rem] flex-col items-center justify-center gap-[0.3125rem]"
        >
          <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
          <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
          <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
        </span>
      </button>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[65rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.05) 0%,  rgba(18,18,18,0.5) 40%, rgba(18,18,18,0.7) 80%, rgba(0,0,0,1) 100%)',
        }}
      />
    </section>
  );
}
