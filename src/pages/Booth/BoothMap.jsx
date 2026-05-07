import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

import { getAllBooth } from '@/api/booth';
import backgroundImg from '@/assets/images/about-fire2.svg';
import BoothPlaceholderImg from '@/assets/images/booth_image.svg';
import BoothCard from '@/components/Booth/BoothCard';
import BoothMap from '@/components/Booth/BoothMap';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import { BUILDING_ID_TO_API_LOCATION, formatBoothLocationKo } from '@/constants/boothBuildingData';
import { BUILDINGS } from '@/constants/mainDummyData';

function normalizeBoothList(payload) {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.content)) return payload.content;
  if (Array.isArray(payload.booths)) return payload.booths;
  return [];
}

function sortBoothRowsByDepartmentKo(rows) {
  return [...rows].sort((a, b) =>
    String(a.departmentName ?? '').localeCompare(String(b.departmentName ?? ''), 'ko', {
      sensitivity: 'base',
    })
  );
}

/** GET /booths 응답의 boothNumbers 배열을 카드 라벨용으로 바꿈 */
function normalizeBoothNumbersFromApi(item) {
  const raw = item?.boothNumbers;
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const cleaned = raw.map((n) => String(n).trim()).filter((s) => s.length > 0);
  return cleaned.length > 0 ? cleaned : undefined;
}

const BUILDING_BUTTON_ORDER = ['hyein', 'eunju1', 'eunju2', 'cheongun', 'daeil'];

/*헤더 + 검색바 + 부스 안내 지도 + 하단 모달창 */
export default function BoothMapPage() {
  const navigate = useNavigate();
  const [activeBuildingId, setActiveBuildingId] = useState(null);
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [isHyeinFlashing, setIsHyeinFlashing] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIsHyeinFlashing(true), 500);
    const t2 = setTimeout(() => setIsHyeinFlashing(false), 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const touchStartY = useRef(0);
  const sheetPanelRef = useRef(null);
  const sheetScrollRef = useRef(null);
  const touchStartedInScrollRef = useRef(false);
  const scrollWasAtTopOnStartRef = useRef(false);
  const collapseArmedRef = useRef(false);

  /** 지도 화면에서는 배경 스크롤 잠금, 검색 화면에서는 결과 스크롤 허용 */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOb: html.style.overscrollBehavior,
      bodyOb: body.style.overscrollBehavior,
    };
    if (searchMode) {
      html.style.overflow = '';
      body.style.overflow = '';
      html.style.overscrollBehavior = '';
      body.style.overscrollBehavior = '';
    } else {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.style.overscrollBehavior = 'none';
      body.style.overscrollBehavior = 'none';
    }
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOb;
      body.style.overscrollBehavior = prev.bodyOb;
    };
  }, [searchMode]);

  /** 시트에서 스크롤 목록이 아닌 영역의 세로 드래그가 뷰포트로 전달되지 않게 */
  useEffect(() => {
    const panel = sheetPanelRef.current;
    if (!panel || searchMode) return;

    const onTouchMove = (e) => {
      const scrollEl = panel.querySelector('[data-booth-sheet-scroll]');
      if (scrollEl?.contains(e.target)) return;
      e.preventDefault();
    };

    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => panel.removeEventListener('touchmove', onTouchMove);
  }, [searchMode]);

  const orderedBuildingButtons = useMemo(() => {
    const map = new Map(BUILDINGS.map((item) => [item.id, item]));
    return BUILDING_BUTTON_ORDER.map((id) => map.get(id)).filter(Boolean);
  }, []);

  const apiLocation =
    searchMode || !activeBuildingId ? undefined : BUILDING_ID_TO_API_LOCATION[activeBuildingId];

  const {
    data: boothListPayload,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['boothList', apiLocation ?? 'all'],
    queryFn: () => getAllBooth(apiLocation),
  });

  const boothRows = useMemo(() => {
    const raw = normalizeBoothList(boothListPayload);
    const mapped = raw.map((item, index) => ({
      id: String(item.boothId ?? `idx-${index}`),
      boothId: item.boothId,
      thumbnailUrl: item.thumbnailUrl,
      locationCode: String(item.location ?? '').trim(),
      location: formatBoothLocationKo(item.location),
      locationDescription: item.locationDescription ?? '',
      departmentName: item.departmentName ?? '',
      boothNumbers: normalizeBoothNumbersFromApi(item),
    }));
    return sortBoothRowsByDepartmentKo(mapped);
  }, [boothListPayload]);

  const searchQ = search.trim().toLowerCase();

  const sheetBoothRows = useMemo(() => {
    if (!searchQ) return boothRows;
    return boothRows.filter((r) => {
      const matchDept = r.departmentName.toLowerCase().includes(searchQ);
      const matchLoc =
        r.location.toLowerCase().includes(searchQ) ||
        r.locationCode.toLowerCase().includes(searchQ) ||
        r.locationDescription.toLowerCase().includes(searchQ);
      const matchNum =
        Array.isArray(r.boothNumbers) &&
        r.boothNumbers.some((n) => String(n).toLowerCase().includes(searchQ));
      return matchDept || matchLoc || matchNum;
    });
  }, [boothRows, searchQ]);

  /** 검색 오버레이: 건물 탭 무관하게 전체 부스 중 검색 */
  const searchOverlayRows = useMemo(() => {
    if (!searchQ) return [];
    return boothRows.filter((r) => {
      const matchDept = r.departmentName.toLowerCase().includes(searchQ);
      const matchLoc =
        r.location.toLowerCase().includes(searchQ) ||
        r.locationCode.toLowerCase().includes(searchQ) ||
        r.locationDescription.toLowerCase().includes(searchQ);
      const matchNum =
        Array.isArray(r.boothNumbers) &&
        r.boothNumbers.some((n) => String(n).toLowerCase().includes(searchQ));
      return matchDept || matchLoc || matchNum;
    });
  }, [boothRows, searchQ]);

  const sectionBgStyle = searchMode
    ? { backgroundColor: '#121212' }
    : {
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#121212',
      };

  return (
    <section
      className={clsx(
        'relative min-h-dvh text-white',
        !searchMode && 'overflow-hidden',
        !searchMode && 'overscroll-none',
        searchMode && 'flex flex-col'
      )}
      style={sectionBgStyle}
    >
      <style>{`
        @keyframes hyein-panel-flash {
          0%   { background-color: #121212; }
          50%  { background-color: #8A2822; }
          100% { background-color: #121212; }
        }
        @keyframes hyein-btn-flash {
          0%   { opacity: 0; }
          50%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <PageHeader
        title="부스 안내"
        to="/"
        onBack={() => {
          if (searchMode) {
            setSearchMode(false);
            setSearch('');
            setActiveBuildingId(null);
            return;
          }
          navigate('/');
        }}
      />

      <div
        className={clsx(
          'mx-auto flex w-full max-w-[450px] flex-col px-4 pt-[max(5rem,calc(env(safe-area-inset-top)+2.75rem))]',
          searchMode
            ? 'min-h-0 flex-1 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'
            : 'pb-[11.5rem]'
        )}
      >
        <div className="mt-5 shrink-0 px-1">
          <SearchInput
            placeholder="학과명으로 부스 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchMode(true)}
          />
        </div>

        {!searchMode && (
          <div className="mt-5 w-full shrink-0">
            <BoothMap
              activeBuildingId={activeBuildingId}
              isHyeinFlashing={isHyeinFlashing}
              onSelectBuilding={(id) => setActiveBuildingId((prev) => (prev === id ? null : id))}
              onMapBackdropClick={() => setActiveBuildingId(null)}
            />
          </div>
        )}

        {searchMode && (
          <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain pb-2 [-webkit-overflow-scrolling:touch] [touch-action:pan-y]">
              {!search.trim() ? (
                <div className="min-h-[min(50vh,24rem)]" aria-hidden />
              ) : isPending ? (
                <p className="py-12 text-center text-sm text-white/50 [font-family:Pretendard]">
                  불러오는 중…
                </p>
              ) : isError ? (
                <p className="py-12 text-center text-sm text-white/50 [font-family:Pretendard]">
                  부스 목록을 불러오지 못했습니다.
                </p>
              ) : searchOverlayRows.length === 0 ? (
                <p className="py-12 text-center text-sm text-white/50 [font-family:Pretendard]">
                  검색 결과가 없습니다.
                </p>
              ) : (
                <ul className="flex flex-col gap-3 px-1 pb-4">
                  {searchOverlayRows.map((row) => (
                    <li key={row.id} className="min-w-0">
                      <BoothCard
                        variant="search"
                        to={row.boothId != null ? `/order/${row.boothId}` : undefined}
                        imageSrc={row.thumbnailUrl || BoothPlaceholderImg}
                        location={row.location}
                        departmentName={row.departmentName}
                        boothNumbers={row.boothNumbers}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className={clsx(
          'pointer-events-none fixed inset-x-0 bottom-2 z-50 flex justify-center transition-opacity duration-200',
          searchMode && 'invisible opacity-0'
        )}
        aria-hidden={searchMode}
      >
        <div
          ref={sheetPanelRef}
          className={`pointer-events-auto flex h-[28rem] w-full min-w-0 max-w-[450px] flex-col overscroll-contain rounded-t-[2.875rem] border border-white/15 bg-gradient-to-b from-[rgba(26,26,26,0.92)] to-[rgba(16,16,16,0.96)] pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-8 transition-transform duration-300 ${
            sheetExpanded ? 'translate-y-[0%]' : 'translate-y-[82%]'
          }`}
          onTouchStart={(e) => {
            touchStartY.current = e.touches[0].clientY;
            const scrollEl = sheetScrollRef.current;
            const startedInScrollArea = Boolean(scrollEl?.contains(e.target));
            touchStartedInScrollRef.current = startedInScrollArea;
            if (!startedInScrollArea || !scrollEl) {
              scrollWasAtTopOnStartRef.current = false;
              return;
            }
            scrollWasAtTopOnStartRef.current = scrollEl.scrollTop <= 0;
          }}
          onTouchEnd={(e) => {
            const deltaY = e.changedTouches[0].clientY - touchStartY.current;
            if (deltaY < -35) setSheetExpanded(true);
            if (deltaY > 35) {
              if (!touchStartedInScrollRef.current) {
                setSheetExpanded(false);
                return;
              }

              const scrollEl = sheetScrollRef.current;
              const isAtTop = (scrollEl?.scrollTop ?? 0) <= 0;

              // 리스트를 위로 다 올린 직후의 스와이프에서는 접지 않고, 한 번 더 내릴 때만 접음
              if (isAtTop && scrollWasAtTopOnStartRef.current && collapseArmedRef.current) {
                setSheetExpanded(false);
                collapseArmedRef.current = false;
                return;
              }

              if (isAtTop) {
                collapseArmedRef.current = true;
              } else {
                collapseArmedRef.current = false;
              }
            }
          }}
        >
          {!sheetExpanded && (
            <div
              className="pointer-events-none absolute inset-x-0 -top-14 flex flex-col items-center gap-1"
              aria-hidden
            >
              <style>{`
                @keyframes hint-float {
                  0%   { opacity: 0;    transform: translateY(6px); }
                  40%  { opacity: 0.55; transform: translateY(0px); }
                  70%  { opacity: 0.55; transform: translateY(0px); }
                  100% { opacity: 0;    transform: translateY(-6px); }
                }
                .hint-arrow { animation: hint-float 1.6s ease-in-out infinite; }
                .hint-arrow-delay { animation: hint-float 1.6s ease-in-out infinite 0.25s; }
              `}</style>
              <svg className="hint-arrow" width="20" height="12" viewBox="0 0 20 12" fill="none">
                <polyline
                  points="2,10 10,2 18,10"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="hint-arrow-delay"
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
              >
                <polyline
                  points="2,10 10,2 18,10"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          <div className="mx-[27px] min-w-0 shrink-0">
            <div className="flex w-full min-w-0 flex-nowrap items-stretch gap-1.5 sm:gap-2">
              {orderedBuildingButtons.map((item) => {
                const active = item.id === activeBuildingId;
                const flashing = item.id === 'hyein' && isHyeinFlashing && !active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() =>
                      setActiveBuildingId((prev) => (prev === item.id ? null : item.id))
                    }
                    className={clsx(
                      'relative overflow-hidden flex h-8 min-h-8 min-w-0 flex-[1_1_60px] items-center justify-center border border-solid px-1 text-[clamp(9px,2.6vw,12px)] font-medium leading-none tracking-[-0.02em] [font-family:Pretendard]',
                      active
                        ? 'border-[#C43A31] bg-[rgba(196,58,49,0.6)] text-[#FFDDDB]'
                        : 'border-[#595959] bg-[#353535] text-[#a0a0a0]'
                    )}
                  >
                    {flashing && (
                      <span
                        className="pointer-events-none absolute inset-0"
                        style={{
                          backgroundColor: '#8A2822',
                          animation: 'hyein-btn-flash 1.2s ease-in 2 forwards',
                        }}
                      />
                    )}
                    <span className="relative z-10 block max-w-full truncate text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div
            data-booth-sheet-scroll
            ref={sheetScrollRef}
            className="mx-[27px] mt-5 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pb-2 [-webkit-overflow-scrolling:touch]"
            onScroll={(e) => {
              if (e.currentTarget.scrollTop > 0) {
                collapseArmedRef.current = false;
              }
            }}
          >
            {isPending ? (
              <p className="py-8 text-center text-sm text-white/50 [font-family:Pretendard]">
                불러오는 중…
              </p>
            ) : isError ? (
              <p className="py-8 text-center text-sm text-white/50 [font-family:Pretendard]">
                부스 목록을 불러오지 못했습니다.
              </p>
            ) : sheetBoothRows.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/50 [font-family:Pretendard]">
                {search.trim() ? '검색 결과가 없습니다.' : '등록된 부스 목록이 없습니다.'}
              </p>
            ) : (
              <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-4">
                {sheetBoothRows.map((row) => (
                  <BoothCard
                    key={row.id}
                    to={row.boothId != null ? `/order/${row.boothId}` : undefined}
                    imageSrc={row.thumbnailUrl || BoothPlaceholderImg}
                    location={row.location}
                    departmentName={row.departmentName}
                    boothNumbers={row.boothNumbers}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
