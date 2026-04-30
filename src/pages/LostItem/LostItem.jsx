import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { getLostItems } from '@/api/lostItem';
import LockIcon from '@/assets/icons/lock.svg';
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
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFail, setLoginFail] = useState(false);

  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleTitleClick = () => {
    const next = titleClickCount + 1;
    if (next >= 5) {
      setTitleClickCount(0);
      if (isLoggedIn) {
        setShowLogoutModal(true);
      } else {
        setShowLoginModal(true);
      }
    } else {
      setTitleClickCount(next);
    }
  };

  const handleLogin = () => {
    if (loginPassword === 'likelion14') {
      localStorage.setItem('accessToken', 'admin');
      setShowLoginModal(false);
      setLoginPassword('');
      setLoginFail(false);
    } else {
      setLoginFail(true);
    }
  };
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
        onTitleClick={handleTitleClick}
        rightElement={
          isLoggedIn ? (
            <button
              type="button"
              onClick={() => navigate('/lost-items/new')}
              className="h-[2rem] px-[0.875rem] text-[0.875rem] font-semibold bg-[#7D2A25] text-[#FFDDDB] border border-[#C43A31]"
              style={{ letterSpacing: '-0.025em' }}
            >
              등록
            </button>
          ) : undefined
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
                isAdmin={isLoggedIn}
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

      {/* 로그아웃 모달 */}
      {showLogoutModal && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/50 px-[1.5rem]">
          <div
            className="flex flex-col items-center gap-[1.5rem] overflow-hidden"
            style={{
              width: '332px',
              height: '176px',
              background: '#353535',
              borderRadius: 0,
              boxShadow: 'inset 0 0 0 1px #595959',
              justifyContent: 'center',
              padding: '0 2rem',
            }}
          >
            <div className="flex flex-col items-center gap-[0.375rem]">
              <p
                className="text-[#C9C9C9] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{ letterSpacing: '-0.025em' }}
              >
                총학생회 CO:RE
              </p>
              <p
                className="text-[#F6F6F6] text-[1.25rem] font-semibold [font-family:Pretendard]"
                style={{ letterSpacing: '-0.025em', lineHeight: '32.7px' }}
              >
                로그아웃 하시겠습니까?
              </p>
            </div>
            <div className="flex w-full gap-[0.625rem]">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#7F7F7F] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  height: '40px',
                  padding: '15px 20px',
                  lineHeight: '160%',
                  letterSpacing: '0',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                뒤로 가기
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  setShowLogoutModal(false);
                }}
                className="flex-1 bg-[#7D2A25] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  height: '40px',
                  padding: '15px 20px',
                  lineHeight: '160%',
                  letterSpacing: '0',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/50 px-[1.5rem]">
          <div className="w-full bg-[#2e2e2e] px-[2rem] py-[2.5rem] flex flex-col items-center gap-[1.5rem]">
            <div className="flex flex-col items-center gap-[0.375rem]">
              <p
                className="text-[#C9C9C9] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{ letterSpacing: '-0.025em' }}
              >
                총학생회 CO:RE
              </p>
              <p
                className="text-[#F6F6F6] text-[1.5rem] font-semibold [font-family:Pretendard]"
                style={{ letterSpacing: '-0.025em', lineHeight: '32.7px' }}
              >
                관리자 비밀번호
              </p>
            </div>

            <div
              className="flex items-center gap-[0.75rem] px-[1rem]"
              style={{
                width: '276px',
                height: '40px',
                borderRadius: 0,
                background: loginFail ? 'rgba(196,58,49,0.2)' : 'rgba(53,53,53,0.2)',
                boxShadow: `inset 0 0 0 1px ${loginFail ? '#C43A31' : '#EFEFEF'}`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <img src={LockIcon} alt="" aria-hidden="true" style={{ width: 14, height: 18 }} />
              <input
                type="text"
                value={'*'.repeat(loginPassword.length)}
                onChange={(e) => {
                  setLoginFail(false);
                  const newDisplay = e.target.value;
                  const diff = newDisplay.length - loginPassword.length;
                  if (diff > 0) {
                    const added = newDisplay.replace(/\*/g, '');
                    setLoginPassword((prev) => prev + added);
                  } else if (diff < 0) {
                    setLoginPassword((prev) => prev.slice(0, newDisplay.length));
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="* * * * * * * * *"
                autoFocus
                autoComplete="off"
                className="flex-1 bg-transparent text-white text-[0.875rem] font-bold [font-family:Pretendard] outline-none placeholder-[#868686]"
                style={{ letterSpacing: '0.12em', lineHeight: '8px' }}
              />
            </div>
            {loginFail && (
              <p className="text-[#C43A31] text-[0.75rem] font-medium -mt-[0.75rem]">
                비밀번호가 올바르지 않습니다
              </p>
            )}

            <div className="flex w-full gap-[0.625rem]">
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginPassword('');
                  setLoginFail(false);
                }}
                className="bg-[#7F7F7F] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  width: '132px',
                  height: '40px',
                  padding: '15px 20px',
                  borderRadius: 0,
                  boxShadow: 'inset 0 0 0 1px #A0A0A0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                뒤로 가기
              </button>
              <button
                type="button"
                onClick={handleLogin}
                className="bg-[#8A2822] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  width: '132px',
                  height: '40px',
                  padding: '15px 20px',
                  borderRadius: 0,
                  boxShadow: 'inset 0 0 0 1px #C43A31',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 px-[1.25rem]">
          <div
            className="w-full flex flex-col items-center gap-[1.25rem]"
            style={{
              height: '212px',
              background: '#353535',
              borderRadius: 0,
              boxShadow: 'inset 0 0 0 1px #595959',
              padding: '1.5rem',
              justifyContent: 'center',
            }}
          >
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
              className="text-[#F6F6F6] text-[1.25rem] font-semibold [font-family:Pretendard]"
              style={{ letterSpacing: '-0.025em' }}
            >
              분실물을 삭제하시겠습니까?
            </p>
            <div className="flex gap-[0.625rem] w-full">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-[#7F7F7F] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  height: '40px',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
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
                className="flex-1 bg-[#7D2A25] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  height: '40px',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 관리 모달 */}
      {managingItem && !showDeleteConfirm && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-[1.25rem]"
          onClick={() => setManagingItem(null)}
        >
          <div
            className="w-full flex flex-col gap-[1.25rem] overflow-hidden"
            style={{
              background: '#353535',
              borderRadius: 0,
              boxShadow: 'inset 0 0 0 1px #595959',
              padding: '2rem 1.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 분실물 관리 */}
            <p
              className="text-[#F6F6F6] text-[1.5rem] font-semibold [font-family:Pretendard] text-center"
              style={{ letterSpacing: '-0.025em', lineHeight: '32.7px' }}
            >
              분실물 관리
            </p>
            <div className="flex flex-col gap-[0.625rem]">
              <button
                type="button"
                onClick={() => {
                  setManagingItem(null);
                  navigate(`/lost-items/${managingItem.id}/edit`, {
                    state: { item: managingItem },
                  });
                }}
                className="w-full bg-[#7F7F7F] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  height: '40px',
                  borderRadius: 0,
                  boxShadow: 'inset 0 0 0 1px #A0A0A0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-[#7F7F7F] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  height: '40px',
                  borderRadius: 0,
                  boxShadow: 'inset 0 0 0 1px #A0A0A0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                삭제
              </button>
            </div>

            {/* 상태 변경 */}
            <p
              className="text-[#F6F6F6] text-[1.5rem] font-semibold [font-family:Pretendard] text-center"
              style={{ letterSpacing: '-0.025em', lineHeight: '32.7px' }}
            >
              상태 변경
            </p>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div
                className="flex overflow-hidden"
                style={{ boxShadow: 'inset 0 0 0 1px #A0A0A0' }}
              >
                <button
                  type="button"
                  onClick={() => setClaimStatus('unclaimed')}
                  className={`flex-1 text-[0.875rem] font-semibold [font-family:Pretendard] transition-colors ${claimStatus === 'unclaimed' ? 'bg-[#7F7F7F] text-white' : 'bg-transparent text-[#A0A0A0]'}`}
                  style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  미수령 처리
                </button>
                <button
                  type="button"
                  onClick={() => setClaimStatus('claimed')}
                  className={`flex-1 text-[0.875rem] font-semibold [font-family:Pretendard] transition-colors ${claimStatus === 'claimed' ? 'bg-[#8A2822] text-white' : 'bg-transparent text-[#A0A0A0]'}`}
                  style={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
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
                className="w-full bg-[#8A2822] text-[#FFFFFF] text-[0.875rem] font-semibold [font-family:Pretendard]"
                style={{
                  height: '40px',
                  borderRadius: 0,
                  boxShadow: 'inset 0 0 0 1px #C43A31',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
