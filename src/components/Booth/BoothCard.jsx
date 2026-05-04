import { Link } from 'react-router-dom';

import clsx from 'clsx';

export default function BoothCard({
  imageSrc,
  locationDetail,
  departmentName,
  boothNumber,
  boothNumberEnd,
  className,
  variant = 'sheet',
  to,
}) {
  const heightClass = variant === 'search' ? 'h-[168px]' : 'h-[119px]';
  const subtitleSize = variant === 'search' ? 'text-[14px]' : 'text-[12px]';
  const titleSize = variant === 'search' ? 'text-[24px]' : 'text-[16px]';
  const badgeText =
    boothNumber != null && boothNumberEnd != null && boothNumberEnd > boothNumber
      ? `${boothNumber}~${boothNumberEnd}`
      : boothNumber;
  const badgeFont = variant === 'search' ? 'text-[14px]' : 'text-[11px]';
  const badgePadding = variant === 'search' ? 'min-h-8 px-3 py-1' : 'min-h-7 px-2 py-0.5';
  const showBadge = badgeText != null && String(badgeText).trim() !== '';

  const article = (
    <article
      className={clsx(
        'relative box-border min-w-0 max-w-full overflow-hidden bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]',
        heightClass,
        !to && className
      )}
    >
      {showBadge && (
        <div
          className={clsx(
            'pointer-events-none absolute left-2 top-2 z-[2] inline-flex max-w-[calc(100%-1rem)] shrink-0 items-center justify-center bg-[#333333]/95 [font-family:Pretendard]',
            badgePadding,
            badgeFont
          )}
          aria-hidden
        >
          <span className="font-bold leading-none tracking-[-0.02em] whitespace-nowrap text-white">
            {badgeText}
          </span>
        </div>
      )}
      <img
        src={imageSrc}
        alt=""
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex min-w-0 flex-col gap-0 px-[10px] pb-3 pt-10">
        <p
          className={clsx(
            'text-left font-normal leading-snug tracking-[-0.02em] text-white break-words [font-family:Pretendard]',
            subtitleSize
          )}
        >
          {locationDetail}
        </p>
        <p
          className={clsx(
            'mt-1 text-left font-bold leading-snug tracking-[-0.025em] text-white break-words [font-family:Pretendard]',
            titleSize
          )}
        >
          {departmentName}
        </p>
      </div>
    </article>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={clsx(
          'block min-w-0 max-w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
          className
        )}
      >
        {article}
      </Link>
    );
  }

  return article;
}
