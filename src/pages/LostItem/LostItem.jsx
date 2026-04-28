import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { getLostItems } from '@/api/lostItem';
import backgroundImg from '@/assets/images/about-fire2.svg';
import airpodImg from '@/assets/images/airpod.png';
import FilterTab from '@/components/common/FilterTab';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import Toast from '@/components/common/Toast';

import LostItemCard from './components/LostItemCard';
import Pagination from './components/Pagination';

const DATE_TABS = [
  { label: '전체', value: 'all' },
  { label: '5/13', value: '2026-05-13' },
  { label: '5/14', value: '2026-05-14' },
  { label: '5/15', value: '2026-05-15' },
];

const CARD_GAP = 8;
const CARD_MIN_HEIGHT = 110;

const MOCK_ITEMS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ['에어팟 Airpod pro2', '지갑', '핸드폰 갤럭시', '우산', '텀블러'][i % 5],
  foundAt: `2026-05-${13 + (i % 3)}T${10 + i}:00:00`,
  foundLocation: ['유담관 앞에서 찾음', '학생회관', '도서관 앞', '공학관'][i % 4],
  imageUrl: airpodImg,
}));

export default function LostItem() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [managingItem, setManagingItem] = useState(null);
  const [claimStatus, setClaimStatus] = useState('unclaimed');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const cardContainerRef = useRef(null);

  useEffect(() => {
    const el = cardContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      const cardHeightWith4 = (h - CARD_GAP * 3) / 4;
      setPageSize(cardHeightWith4 < CARD_MIN_HEIGHT ? 3 : 4);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const params = {
      page: currentPage,
      size: pageSize,
      ...(query && { keyword: query }),
      ...(selectedDate !== 'all' && { date: selectedDate }),
    };

    getLostItems(params)
      .then((res) => {
        setItems(res.data.content ?? []);
        setTotalPages(res.data.totalPages ?? 1);
      })
      .catch(() => {
        const filtered =
          selectedDate === 'all'
            ? MOCK_ITEMS
            : MOCK_ITEMS.filter((item) => item.foundAt.startsWith(selectedDate));
        const start = (currentPage - 1) * pageSize;
        setItems(filtered.slice(start, start + pageSize));
        setTotalPages(Math.ceil(filtered.length / pageSize));
      });
  }, [selectedDate, currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (value) => {
    setSelectedDate(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
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
      <PageHeader
        title="분실물"
        rightElement={
          <button
            type="button"
            onClick={() => navigate('/lost-items/new')}
            className="h-[2rem] px-[0.875rem] text-[0.875rem] font-semibold bg-[#7D2A25] text-[#FFDDDB] border border-[#C43A31]"
            style={{ letterSpacing: '-0.025em' }}
          >
            등록
          </button>
        }
      />

      <div
        className="flex-1 overflow-hidden flex flex-col"
        style={{ paddingTop: 'min(8rem, 16dvh)' }}
      >
        <div className="px-[1.25rem] flex flex-col gap-[1.25rem]">
          <SearchInput
            placeholder="분실물 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onSearch={handleSearch}
          />
          <FilterTab tabs={DATE_TABS} selected={selectedDate} onChange={handleDateChange} />
          <p
            className="text-[#A0A0A0] text-[0.625rem] font-semibold"
            style={{ letterSpacing: '-0.025em', lineHeight: '0.875rem' }}
          >
            모든 분실물은 총학생회 부스에서 관리합니다.
          </p>
        </div>

        <div
          ref={cardContainerRef}
          className="flex-1 min-h-0 flex flex-col gap-[0.5rem] px-[1.25rem]"
          style={{ marginTop: '1.5dvh', marginBottom: '3dvh' }}
        >
          {Array.from({ length: pageSize }, (_, i) =>
            items[i] ? (
              <LostItemCard
                key={items[i].id}
                item={items[i]}
                className="flex-1 min-h-0 overflow-hidden"
                onClick={(item) => navigate(`/lost-items/${item.id}`)}
                isAdmin
                onManage={(item) => {
                  setManagingItem(item);
                  setClaimStatus(item.status ?? 'unclaimed');
                }}
              />
            ) : (
              <div key={`empty-${i}`} className="flex-1 min-h-0" />
            )
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        duration={toast.duration ?? 2000}
        onClose={() => setToast({ visible: false, message: '' })}
      />

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 px-[1.25rem]">
          <div className="w-full rounded-[1rem] bg-[#353535]/40 backdrop-blur-xl border border-[#A0A0A0]/30 px-[1.5rem] py-[2rem] flex flex-col items-center gap-[1.25rem]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            <p
              className="text-white text-[1.125rem] font-semibold"
              style={{ letterSpacing: '-0.025em' }}
            >
              분실물을 삭제하시겠습니까?
            </p>
            <div className="flex gap-[0.75rem] w-full">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-[3rem] rounded-[0.5rem] bg-white/20 border border-[#A0A0A0] text-white text-[0.9375rem] font-semibold"
                style={{ letterSpacing: '-0.025em' }}
              >
                뒤로 가기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setManagingItem(null);
                  setToast({ visible: true, message: '삭제가 완료되었습니다' });
                }}
                className="flex-1 h-[3rem] rounded-[0.5rem] bg-[#7D2A25] border border-[#C43A31] text-white text-[0.9375rem] font-semibold"
                style={{ letterSpacing: '-0.025em' }}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 관리 모달 */}
      {managingItem && !showDeleteConfirm && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-[1.25rem]"
          onClick={() => setManagingItem(null)}
        >
          <div
            className="relative w-full rounded-[1rem] bg-[#353535]/40 backdrop-blur-xl border border-[#A0A0A0]/30 px-[1.5rem] py-[2rem] flex flex-col gap-[1.25rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setManagingItem(null)}
              className="absolute top-[1rem] right-[1rem] text-[#A0A0A0] text-[1.25rem] leading-none"
              aria-label="닫기"
            >
              ✕
            </button>
            {/* 분실물 관리 */}
            <p
              className="text-white text-[1.125rem] font-semibold text-center"
              style={{ letterSpacing: '-0.025em' }}
            >
              분실물 관리
            </p>
            <div className="flex flex-col gap-[0.75rem]">
              <button
                type="button"
                onClick={() => {
                  setManagingItem(null);
                  navigate(`/lost-items/${managingItem.id}/edit`, {
                    state: { item: managingItem },
                  });
                }}
                className="w-full h-[3rem] rounded-[0.5rem] border border-[#A0A0A0] text-white text-[0.9375rem] font-semibold bg-white/10"
                style={{ letterSpacing: '-0.025em' }}
              >
                수정하기
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full h-[3rem] rounded-[0.5rem] border border-[#A0A0A0] text-white text-[0.9375rem] font-semibold bg-white/10"
                style={{ letterSpacing: '-0.025em' }}
              >
                삭제하기
              </button>
            </div>

            {/* 상태 변경 */}
            <p
              className="text-white text-[1.125rem] font-semibold text-center mt-[0.25rem]"
              style={{ letterSpacing: '-0.025em' }}
            >
              상태 변경
            </p>
            <div className="flex rounded-[0.5rem] overflow-hidden border border-[#A0A0A0]">
              <button
                type="button"
                onClick={() => setClaimStatus('unclaimed')}
                className={`flex-1 h-[3rem] text-[0.9375rem] font-semibold transition-colors ${claimStatus === 'unclaimed' ? 'bg-white/20 text-white' : 'bg-transparent text-[#A0A0A0]'}`}
                style={{ letterSpacing: '-0.025em' }}
              >
                미수령 처리
              </button>
              <button
                type="button"
                onClick={() => setClaimStatus('claimed')}
                className={`flex-1 h-[3rem] text-[0.9375rem] font-semibold transition-colors ${claimStatus === 'claimed' ? 'bg-[#7D2A25] text-white' : 'bg-transparent text-[#A0A0A0]'}`}
                style={{ letterSpacing: '-0.025em' }}
              >
                수령 처리
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setItems((prev) =>
                  prev.map((it) =>
                    it.id === managingItem.id ? { ...it, status: claimStatus } : it
                  )
                );
                setManagingItem(null);
                setToast({ visible: true, message: '저장되었습니다', duration: 1500 });
              }}
              className="w-full h-[3rem] rounded-[0.5rem] bg-[#7D2A25] border border-[#C43A31] text-white text-[0.9375rem] font-semibold"
              style={{ letterSpacing: '-0.025em' }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
