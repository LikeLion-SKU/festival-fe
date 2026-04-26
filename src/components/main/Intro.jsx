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
        className="block h-[1.6rem] w-[2rem] max-w-none"
      />
    </span>
  );
}

export default function Intro() {
  return (
    <section
      id="intro"
      className="relative flex min-h-[100dvh] items-start justify-center bg-[#141414] px-[6rem] pt-[24.75rem]"
    >
      <div className="flex w-[34.25rem] flex-col items-center gap-[4.25rem] text-center">
        <img src={HatIcon} alt="" aria-hidden="true" className="h-auto w-[9.25rem]" />
        <div className="w-full">
          <p className="text-[3rem] leading-[4.096rem] text-white tracking-[-0.06rem] [font-family:Pretendard] whitespace-nowrap">
            <span className="font-medium">2026 </span>
            <span className="font-bold">서경대학교</span>
            <span className="font-medium"> 대동제</span>
          </p>
          <div className="mt-[1.5rem] h-[0.125rem] w-full bg-[#E6E6E6]" />
          <div className="mt-[3.25rem] flex items-center justify-center gap-[0.25rem]">
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
        className="absolute bottom-[8rem] left-1/2 flex h-[13.75rem] w-[13.75rem] -translate-x-1/2 items-center justify-center overflow-hidden rounded-[50rem]"
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
          className="relative z-10 flex h-[8rem] w-[8rem] flex-col items-center justify-center gap-[1.25rem]"
        >
          <span className="h-[0.5rem] w-[5.2rem] rounded-full bg-[#DA3328]" />
          <span className="h-[0.5rem] w-[5.2rem] rounded-full bg-[#DA3328]" />
          <span className="h-[0.5rem] w-[5.2rem] rounded-full bg-[#DA3328]" />
        </span>
      </button>
    </section>
  );
}
