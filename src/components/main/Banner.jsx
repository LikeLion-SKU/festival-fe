import WhiteBanner1 from '@/assets/images/white-banner1.png';
import WhiteBanner2 from '@/assets/images/white-banner2.png';

const BANNER_BACKGROUNDS = {
  1: WhiteBanner1,
  2: WhiteBanner2,
};

export default function Banner({
  artist,
  team = '경영학부 밴드',
  time = '18:00 ~ 18:30',
  variant = 1,
  reverse = false,
  mirrorImage = false,
  tiltTimeBadgeLeft = false,
  timeBadgeOffsetClass = '',
  enableVariant2BaseShift = true,
}) {
  const bannerImage = BANNER_BACKGROUNDS[variant] ?? WhiteBanner1;
  const timeSegments = time.split('★');

  return (
    <div className="relative w-full max-w-[22rem]">
      <div className="relative mx-auto w-[18.6rem]">
        <img
          src={bannerImage}
          alt=""
          aria-hidden="true"
          className={`h-auto w-full object-contain ${mirrorImage ? '-scale-x-100' : ''}`}
        />
        <div
          className={`absolute inset-0 flex flex-col justify-center ${
            reverse ? 'items-end pr-[4.45rem] text-right' : 'pl-[4.45rem]'
          }`}
        >
          <p
            className={`text-[0.7rem] font-medium leading-none tracking-[-0.01em] text-[#545454]
          ${
            variant === 1
              ? reverse
                ? 'mr-[1.7rem] origin-right rotate-[4.3deg]'
                : 'ml-[1.7rem] origin-left -rotate-[4.3deg]'
              : ''
          }`}
          >
            {team}
          </p>
          <p
            className={`mt-[0.3rem] text-[1.85rem] font-black leading-none tracking-[0.02rem] text-[#cf3a23] ${
              variant === 1
                ? reverse
                  ? 'mr-[3rem] origin-right rotate-[4.3deg]'
                  : 'ml-[3rem] origin-left -rotate-[4.3deg]'
                : ''
            }`}
          >
            {artist}
          </p>
        </div>
      </div>

      <div
        className={`absolute z-10 w-[5.5rem] -translate-y-1/2 bg-[#1f232b] px-[0.8rem] py-[0.5rem] text-center shadow-[0_8px_20px_rgba(0,0,0,0.45)] ${
          variant === 2 && enableVariant2BaseShift ? 'translate-x-[0.5rem]' : ''
        } ${
          tiltTimeBadgeLeft
            ? 'top-[30%] -rotate-[8deg]'
            : variant === 1
              ? reverse
                ? 'top-[25%] rotate-[8deg]'
                : 'top-[25%] rotate-[-8deg]'
              : 'top-[30%] rotate-[8deg]'
        } ${
          reverse
            ? variant === 1
              ? 'right-[0.55rem]'
              : 'right-[0.16rem]'
            : variant === 1
              ? 'left-[-0.65rem]'
              : 'left-[0.17rem]'
        } ${timeBadgeOffsetClass}`}
      >
        <p className="text-[0.8rem] font-black leading-[1.15] tracking-[-0.02em] text-[#C0B7B0]">
          {timeSegments.map((segment, index) => (
            <span key={`time-segment-${segment}-${index}`}>
              {index > 0 && <span className="text-[0.65rem] align-[0.08em]">★</span>}
              {segment}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
