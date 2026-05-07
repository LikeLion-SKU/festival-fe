import { useState } from 'react';

import Skeleton from '@/components/common/Skeleton';
import { getLangFontClass } from '@/utils/langFont';

const CONTENT_LIMIT = 150;

function BoothInfoSection({
  boothName,
  departmentName,
  location,
  isOpen,
  content,
  images,
  isLoading,
  isQR,
  lang,
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content?.length > CONTENT_LIMIT;
  const displayText = isLong && !expanded ? content.slice(0, CONTENT_LIMIT) : content;

  const textPrimary = isQR ? 'text-black' : 'text-white';
  const textSecondary = isQR ? 'text-deep-gray' : 'text-white/70';
  const textLabel = isQR ? 'text-text-gray' : 'text-[#C9C9C9]';
  const fontClass = getLangFontClass(lang);

  return (
    <div className="relative px-7 mt-18">
      <div className="relative flex justify-between items-center">
        {isLoading ? (
          <Skeleton className="h-7 w-40" />
        ) : (
          <div className={`text-2xl font-bold ${textPrimary} ${fontClass}`}>{boothName}</div>
        )}
        {isLoading ? (
          <Skeleton className="w-12 h-6" />
        ) : isOpen ? (
          <div className="flex shrink-0 w-12 h-6 rounded-[5px] outline justify-center items-center bg-button-red-bg outline-button-red">
            <div className="text-center justify-start text-button-red text-xs font-semibold font-['Pretendard']">
              영업 중
            </div>
          </div>
        ) : (
          <div className="flex shrink-0 w-12 h-6 rounded-[5px] outline justify-center items-center bg-button-gray-bg outline-button-gray">
            <div className="text-center justify-start text-button-gray text-xs font-semibold font-['Pretendard']">
              오픈 전
            </div>
          </div>
        )}
      </div>
      <div className="relative flex mt-2.5 gap-3">
        <div className={`w-7 h-5 text-sm font-medium ${textLabel}`}>학과</div>
        {isLoading ? (
          <Skeleton className="w-24 h-5" />
        ) : (
          <div className={`h-5 text-sm font-medium ${textSecondary} ${fontClass}`}>
            {departmentName}
          </div>
        )}
      </div>
      <div className="relative flex mt-1.5 gap-3">
        <div className={`w-7 h-5 text-sm font-medium ${textLabel}`}>위치</div>
        {isLoading ? (
          <Skeleton className="w-24 h-5" />
        ) : (
          <div className={`h-5 text-sm font-medium ${textSecondary}`}>{location}</div>
        )}
      </div>
      <div className={`relative mt-7 text-xs font-normal ${textSecondary} ${fontClass}`}>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : (
          <>
            {displayText}
            {isLong && !expanded && (
              <button
                onClick={() => setExpanded(true)}
                className={`ml-1 text-xs font-semibold ${textSecondary}`}
              >
                ..더보기
              </button>
            )}
            {isLong && expanded && (
              <button
                onClick={() => setExpanded(false)}
                className={`ml-1 text-xs font-semibold ${textSecondary}`}
              >
                접기
              </button>
            )}
          </>
        )}
      </div>
      <div className="flex gap-1 mt-7 overflow-hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-27.5 h-28 shrink-0" />
            ))
          : images.map((src, index) => (
              <img className="w-27.5 h-28 rounded object-cover shrink-0" key={index} src={src} />
            ))}
      </div>
    </div>
  );
}

export default BoothInfoSection;
