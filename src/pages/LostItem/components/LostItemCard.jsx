import horseImg from '@/assets/icons/horse.svg';

const DAY_MAP = {
  MONDAY: 'MON',
  TUESDAY: 'TUE',
  WEDNESDAY: 'WED',
  THURSDAY: 'THU',
  FRIDAY: 'FRI',
  SATURDAY: 'SAT',
  SUNDAY: 'SUN',
};

function formatDate(foundDate, dayOfWeek) {
  if (!foundDate) return { date: '--', day: '--' };
  const [, month, day] = foundDate.split('-');
  return { date: `${month}.${day}`, day: DAY_MAP[dayOfWeek] ?? '--' };
}

export default function LostItemCard({ item, onClick, onManage, isAdmin, className }) {
  const { date, day } = formatDate(item.foundDate, item.dayOfWeek);

  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className={`relative w-full flex items-stretch text-left active:brightness-90 transition-all ${className ?? ''}`}
      style={{
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 24px rgba(0,0,0,0.35)',
        background: 'rgba(255,255,255,0.04)',
      }}
    >
      {/* 썸네일 */}
      <div className="relative shrink-0 w-[9.375rem] h-full overflow-hidden bg-white/10">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#A0A0A0] text-[0.625rem]">
            없음
          </div>
        )}
        {item.returned && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-[0.5rem]">
            <img src={horseImg} alt="수령 완료" className="w-[3rem] h-[3rem]" />
            <p
              className="text-white text-[0.75rem] font-bold"
              style={{ letterSpacing: '-0.025em' }}
            >
              주인이 찾아갔어요!
            </p>
          </div>
        )}
      </div>

      {/* 정보 */}
      <div
        className={`flex-1 min-w-0 bg-black/20 pl-[1rem] flex flex-col justify-center gap-[0.375rem] ${isAdmin ? 'pr-[4rem]' : 'pr-[1rem]'}`}
      >
        <p
          className="text-[#A0A0A0] text-[0.875rem] font-bold"
          style={{ letterSpacing: '-0.025em' }}
        >
          {date} {day}
        </p>
        <p
          className="text-[#C9C9C9] text-[1.125rem] font-semibold truncate"
          style={{ letterSpacing: '-0.025em' }}
        >
          {item.name}
        </p>
        <p
          className="text-[#A0A0A0] text-[0.75rem] font-bold truncate"
          style={{ letterSpacing: '-0.025em' }}
        >
          습득위치{' '}
          <span className="inline-block w-[0.0625rem] h-[1rem] bg-[#A0A0A0] mx-[0.375rem] align-middle" />
          <span
            className="text-[#C9C9C9] text-[0.875rem] font-semibold"
            style={{ letterSpacing: '-0.025em', lineHeight: '1.25rem' }}
          >
            {item.foundPlace}
          </span>
        </p>
      </div>

      {/* 관리 버튼 */}
      {isAdmin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onManage?.(item);
          }}
          className="absolute bottom-[7px] right-[7px] h-[2rem] px-[0.875rem] text-[0.875rem] font-semibold bg-[#7D2A25] text-white border border-[#C43A31]"
          style={{ letterSpacing: '-0.025em' }}
        >
          관리
        </button>
      )}
    </button>
  );
}
