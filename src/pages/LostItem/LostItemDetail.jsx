import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { getLostItemDetail } from '@/api/lostItem';
import backgroundImg from '@/assets/images/about-fire2.svg';
import airpodImg from '@/assets/images/airpod.png';
import PageHeader from '@/components/common/PageHeader';

const KO_DAY_MAP = ['일', '월', '화', '수', '목', '금', '토'];

function formatDate(dateTimeStr) {
  const date = new Date(dateTimeStr);
  if (isNaN(date)) return '-';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayNum = String(date.getDate()).padStart(2, '0');
  const day = KO_DAY_MAP[date.getDay()];
  return `${month}.${dayNum} ${day}`;
}

const MOCK_DETAIL = {
  id: 1,
  name: '에어팟 Airpods',
  foundAt: '2025-05-14T10:00:00',
  foundLocation: '유담관 앞',
  imageUrls: [airpodImg, airpodImg],
};

function ArrowButton({ direction, onClick, disabled }) {
  const isLeft = direction === 'left';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? '이전 이미지' : '다음 이미지'}
      className="rounded-full flex items-center justify-center transition-all active:scale-95 disabled:opacity-30"
      style={{
        width: '40px',
        height: '40px',
        background: isLeft ? '#ffffff' : '#3a3a3a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      {/* 빨간 삼각형 */}
      <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
        {isLeft ? (
          <polygon points="11,2 11,14 3,8" fill="#DA3328" />
        ) : (
          <polygon points="5,2 5,14 13,8" fill="#DA3328" />
        )}
      </svg>
    </button>
  );
}

export default function LostItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(MOCK_DETAIL);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    getLostItemDetail(id)
      .then((res) => setItem(res.data ?? MOCK_DETAIL))
      .catch(() => setItem(MOCK_DETAIL));
  }, [id]);

  const images = item?.imageUrls ?? [];

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
          <div className="w-full h-full overflow-hidden bg-white/10">
            {images.length > 0 ? (
              <img src={images[imgIndex]} alt={item.name} className="w-full h-full object-cover" />
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
        <div className="mt-[1.5rem] flex flex-col gap-[1.25rem] pl-[0.5rem]">
          <h2
            className="text-white text-[1.625rem] font-semibold"
            style={{ letterSpacing: '-0.01em' }}
          >
            {item.name}
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
                {formatDate(item.foundAt)}
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
                {item.foundLocation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
