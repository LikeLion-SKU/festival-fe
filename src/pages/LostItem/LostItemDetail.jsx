import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { getLostItemDetail } from '@/api/lostItem';
import backgroundImg from '@/assets/images/about-fire2.svg';
import ArrowButton from '@/components/common/Button/ArrowButton';
import PageHeader from '@/components/common/PageHeader';

const KO_DAY_MAP = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

function formatDate(foundDate, dayOfWeek) {
  if (!foundDate) return '-';
  const [, month, day] = foundDate.split('-');
  const dow = KO_DAY_MAP[dayOfWeek] ?? '';
  return `${month}.${day} ${dow}`;
}

export default function LostItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    getLostItemDetail(id)
      .then((res) => setItem(res.data))
      .catch(() => setItem(null));
  }, [id]);

  const images = item?.imageUrls ?? [];
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 40) return;
    if (diff > 0 && imgIndex < images.length - 1) setImgIndex((i) => i + 1);
    if (diff < 0 && imgIndex > 0) setImgIndex((i) => i - 1);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0d0d0d',
      }}
    >
      <PageHeader title="분실물" />

      <div className="flex-1 flex flex-col pt-[8rem] px-[1.25rem]">
        {/* 이미지 캐러셀 */}
        <div className="relative w-full aspect-square">
          <div
            className="w-full h-full overflow-hidden bg-white/10"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 0 ? (
              <div
                className="flex h-full"
                style={{
                  width: `${images.length * 100}%`,
                  transform: `translateX(-${(imgIndex / images.length) * 100}%)`,
                  transition: 'transform 0.3s ease',
                }}
              >
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="h-full shrink-0"
                    style={{ width: `${100 / images.length}%` }}
                  >
                    <img
                      src={src}
                      alt={`${item.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#A0A0A0] text-[0.75rem]">
                이미지 없음
              </div>
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-between px-[0.75rem] pointer-events-none">
            <div className="pointer-events-auto">
              {imgIndex > 0 && (
                <ArrowButton direction="left" onClick={() => setImgIndex((i) => i - 1)} />
              )}
            </div>
            <div className="pointer-events-auto">
              {imgIndex < images.length - 1 && (
                <ArrowButton direction="right" onClick={() => setImgIndex((i) => i + 1)} />
              )}
            </div>
          </div>

          {/* 도트 인디케이터 */}
          {images.length > 1 && (
            <div className="absolute bottom-[0.75rem] left-0 right-0 flex justify-center gap-[0.375rem]">
              {images.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: i === imgIndex ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    display: 'inline-block',
                    transition: 'background 0.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="mt-[1.5rem] flex flex-col gap-[1.25rem]">
          <h2
            className="text-white text-[1.625rem] font-semibold"
            style={{ letterSpacing: '-0.01em' }}
          >
            {item?.name}
          </h2>

          <div className="flex flex-col gap-[0.75rem]">
            <div className="flex items-center gap-[1rem]">
              <span
                className="text-[#A0A0A0] text-[0.9375rem] font-semibold w-[1.75rem] shrink-0"
                style={{ letterSpacing: '-0.025em', lineHeight: '160%' }}
              >
                날짜
              </span>
              <span
                className="text-white text-[0.9375rem] font-semibold"
                style={{ letterSpacing: '-0.025em', lineHeight: '160%' }}
              >
                {formatDate(item?.foundDate, item?.dayOfWeek)}
              </span>
            </div>
            <div className="flex items-center gap-[1rem]">
              <span
                className="text-[#A0A0A0] text-[0.9375rem] font-semibold w-[1.75rem] shrink-0"
                style={{ letterSpacing: '-0.025em', lineHeight: '160%' }}
              >
                위치
              </span>
              <span
                className="text-white text-[0.9375rem] font-semibold"
                style={{ letterSpacing: '-0.025em', lineHeight: '160%' }}
              >
                {item?.foundPlace}
              </span>
            </div>
            {item?.returned && (
              <div className="flex items-center gap-[1rem]">
                <span
                  className="text-[#A0A0A0] text-[0.9375rem] font-semibold w-[1.75rem] shrink-0"
                  style={{ letterSpacing: '-0.025em', lineHeight: '160%' }}
                >
                  상태
                </span>
                <span
                  className="text-[#C43A31] text-[0.9375rem] font-semibold"
                  style={{ letterSpacing: '-0.025em', lineHeight: '160%' }}
                >
                  수령완료
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
