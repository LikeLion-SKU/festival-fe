import HorseIcon from '@/assets/icons/horse.svg';

export default function Safety() {
  return (
    <section id="safety" className="min-h-[100dvh] bg-[#141414] px-[14.625rem] pt-[15rem]">
      <div className="flex flex-col items-center gap-[1rem]">
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[10rem] w-[9.75rem]" />
        <p className="text-center text-[4rem] leading-[5.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          SAFETY GUIDE
        </p>
      </div>
    </section>
  );
}
