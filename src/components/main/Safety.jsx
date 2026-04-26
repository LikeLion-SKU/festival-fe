import HorseIcon from '@/assets/icons/horse.svg';

export default function Safety() {
  return (
    <section id="safety" className="min-h-[100dvh] bg-[#141414] px-[3.65625rem] pt-[3.75rem]">
      <div className="flex flex-col items-center gap-[0.25rem]">
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[1] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          SAFETY GUIDE
        </p>
      </div>
    </section>
  );
}
