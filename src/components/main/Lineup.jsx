import HorseIcon from '@/assets/icons/horse.svg';
import FenceBg from '@/assets/images/fence.svg';
import HorseCard from '@/assets/images/horse-card.svg';
import HorseRed from '@/assets/images/horse-red.svg';

export default function Lineup() {
  return (
    <section
      id="lineup"
      className="relative min-h-[103dvh] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[0rem]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 32%), linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,1) 100%)',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: 'center top, center',
          backgroundSize: 'cover, cover',
        }}
      />
      <img
        src={HorseCard}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[0.75rem] z-[10] w-full object-contain"
      />
      <img
        src={HorseRed}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[8rem] z-[11] w-[33%] -translate-x-1/2 object-contain mix-blend-multiply"
      />
      <img
        src={FenceBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-5rem] z-[2] w-full object-cover"
      />
      <div className="relative z-10 flex flex-col items-center gap-[0.25rem]">
        <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
        <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          LINEUP
        </p>
      </div>
    </section>
  );
}
