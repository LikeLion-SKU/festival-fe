import HorseIcon from '@/assets/icons/horse.svg';
import DesertBg from '@/assets/images/desert.svg';

export default function Safety() {
  return (
    <section
      id="safety"
      className="relative min-h-[100dvh] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[3.75rem]"
    >
      <img
        src={DesertBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-54.1rem] z-[1] w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[7.5rem] z-[2] h-[22rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.1) 0%,  rgba(0,0,0,0.3) 5%, rgba(0,0,0,0.45) 15%,rgba(0,0,0,0.65) 20%,rgba(0,0,0,0.75) 23%,rgba(0,0,0,0.85) 27%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[15rem] z-[2] h-[50rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0, 0.7) 0%, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.35) 35%,rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.9) 95%, rgba(0,0,0,1) 100%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-[0.25rem]">
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          SAFETY GUIDE
        </p>
      </div>
    </section>
  );
}
