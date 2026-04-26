import HorseIcon from '@/assets/icons/horse.svg';
import FenceBg from '@/assets/images/fence.svg';

export default function Booth() {
  return (
    <section
      id="booth"
      className="relative min-h-[100dvh] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[2.5rem]"
    >
      <img
        src={FenceBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] w-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center gap-[0.25rem]">
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[1] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          BOOTH
        </p>
      </div>
    </section>
  );
}
