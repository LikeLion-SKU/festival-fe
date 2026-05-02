import clsx from 'clsx';

/**
 * 부스 안내 지도 하단 모달용 카드 (피그마 4071:12056 계열)
 * @param {{
 *   imageSrc?: string;
 *   locationDetail: string;
 *   departmentName: string;
 *   className?: string;
 *   variant?: 'sheet' | 'search';
 * }} props
 */
export default function BoothCard({
  imageSrc,
  locationDetail,
  departmentName,
  className,
  variant = 'sheet',
}) {
  const heightClass = variant === 'search' ? 'h-[168px]' : 'h-[119px]';
  const subtitleSize = variant === 'search' ? 'text-[14px]' : 'text-[12px]';
  const titleSize = variant === 'search' ? 'text-[24px]' : 'text-[16px]';

  return (
    <article
      className={clsx(
        'relative box-border min-w-0 max-w-full overflow-hidden bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]',
        heightClass,
        className
      )}
    >
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
}
