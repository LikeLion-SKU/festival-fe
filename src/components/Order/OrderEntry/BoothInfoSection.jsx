import { useState } from 'react';

import Skeleton from '@/components/common/Skeleton';

const CONTENT_LIMIT = 150;

function BoothInfoSection({
  boothName,
  departmentName,
  location,
  isOpen,
  content,
  images,
  isLoading,
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content?.length > CONTENT_LIMIT;
  const displayText = isLong && !expanded ? content.slice(0, CONTENT_LIMIT) : content;

  return (
    <div className="relative px-7 mt-18">
      <div className="relative flex justify-between items-center">
        {isLoading ? (
          <Skeleton className="h-7 w-40" />
        ) : (
          <div className="text-2xl font-bold">{boothName}</div>
        )}
        {isLoading ? (
          <Skeleton className="w-12 h-6" />
        ) : isOpen ? (
          <div className="flex w-12 h-6 rounded-[5px] outline justify-center items-center bg-button-red-bg outline-button-red">
            <div className="text-center justify-start text-button-red text-xs font-semibold font-['Pretendard']">
              영업 중
            </div>
          </div>
        ) : (
          <div className="flex w-12 h-6 rounded-[5px] outline justify-center items-center bg-button-gray-bg outline-button-gray">
            <div className="text-center justify-start text-button-gray text-xs font-semibold font-['Pretendard']">
              오픈 전
            </div>
          </div>
        )}
      </div>
      <div className="relative flex mt-2.5 gap-3">
        <div className="w-7 h-5 font-medium text-text-gray">학과</div>
        {isLoading ? (
          <Skeleton className="w-24 h-5" />
        ) : (
          <div className="h-5 font-medium text-deep-gray">{departmentName}</div>
        )}
      </div>
      <div className="relative flex mt-1.5 gap-3">
        <div className="w-7 h-5 font-medium text-text-gray">위치</div>
        {isLoading ? (
          <Skeleton className="w-24 h-5" />
        ) : (
          <div className="h-5 font-medium text-deep-gray">{location}</div>
        )}
      </div>
      <div className="relative mt-6 text-sm font-normal text-deep-gray">
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
                className="ml-1 text-sm font-semibold text-deep-gray"
              >
                ..더보기
              </button>
            )}
            {isLong && expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="ml-1 text-sm font-semibold text-deep-gray"
              >
                접기
              </button>
            )}
          </>
        )}
      </div>
      <div className="flex gap-1 mt-6 overflow-hidden">
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
