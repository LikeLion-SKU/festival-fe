import AboutFire2 from '@/assets/images/about-fire2.svg';
import AboutFire from '@/assets/images/about-fire.svg';

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-[100dvh] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[3.75rem]"
    >
      <img
        src={AboutFire}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-[0] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <img
        src={AboutFire2}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[0] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[16rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.15) 90%,rgba(0,0,0,0) 100%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-[1rem]">
        <p className="text-center text-[1.25rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          ABOUT
        </p>
      </div>
    </section>
  );
}
