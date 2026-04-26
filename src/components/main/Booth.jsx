import HorseIcon from '@/assets/icons/horse.svg';
import DesertBg from '@/assets/images/desert.svg';
import FenceBg from '@/assets/images/fence.svg';

export default function Booth() {
  return (
    <section
      id="booth"
      className="relative min-h-[100dvh] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[2.5rem]"
    >
      <div className="pointer-events-none absolute left-1/2 top-[-23.5rem] z-[1] flex w-[28.125rem] max-w-none -translate-x-1/2 flex-col">
        <img src={FenceBg} alt="" aria-hidden="true" className="w-full object-cover" />
        <img src={DesertBg} alt="" aria-hidden="true" className="-mt-[20rem] w-full object-cover" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-[0.25rem]">
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          BOOTH
        </p>
      </div>
    </section>
  );
}
