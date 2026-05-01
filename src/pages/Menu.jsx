import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import HorseIcon from '@/assets/icons/horse.svg';
import InstagramIcon from '@/assets/icons/instagram.svg?react';
import LinkIcon from '@/assets/icons/link.svg';
import BgMadeByMid2 from '@/assets/images/bg-madeby-mid-2.png';
import BgMadeByTop1 from '@/assets/images/bg-madeby-top-1.png';
import BgMadeByTop2 from '@/assets/images/bg-madeby-top-2.png';
import TitleLogo from '@/assets/images/title-logo.svg';
import MenuButton from '@/components/common/Button/MenuButton';

/** 말발굽 아이콘 main-red500 컬러로 변경 */
const RED_ICON_FILTER =
  'brightness(0) saturate(100%) invert(37%) sepia(43%) saturate(4458%) hue-rotate(336deg) brightness(92%) contrast(89%)';

/** 멋사 홈페이지 및 인스타그램 주소 */
const LIKELION_HOME_URL = 'https://skulikelion.com/';
const LIKELION_INSTAGRAM_URL =
  'https://www.instagram.com/likelion_skuniv?igsh=MW81d3l0YWp1ZmRpZQ==';

/** 제작자 페이지 이동 전 버튼 스타일 전환 시간 */
const MADE_BY_NAV_DELAY_MS = 220;

const MENU_ROW_BTN =
  'group relative flex w-full overflow-hidden border border-solid border-[#c43a31] bg-[#101010] px-4 py-3 transition-[background-color,box-shadow] duration-150 ease-out md:py-[0.875rem]';

const MENU_ROW_BTN_ACTIVE =
  'active:bg-[#c43a31] active:shadow-[inset_0_-2px_3.5px_rgba(0,0,0,0.25),inset_0_2px_2px_rgba(255,255,255,0.25)]';

const MENU_ROW_BTN_PRESSED =
  'bg-[#c43a31] shadow-[inset_0_-2px_3.5px_rgba(0,0,0,0.25),inset_0_2px_2px_rgba(255,255,255,0.25)]';

const MENU_ROW_LABEL =
  'text-center text-[1rem] font-semibold leading-6 tracking-[-0.025rem] text-[#c43a31] transition-colors duration-150 ease-out group-[&:active]:text-white [font-family:Pretendard]';

const MENU_ROW_LABEL_PRESSED =
  'text-center text-[1rem] font-semibold leading-6 tracking-[-0.025rem] text-white [font-family:Pretendard]';

function MenuHorseIcon({ variant }) {
  return (
    <img
      src={HorseIcon}
      alt=""
      aria-hidden="true"
      className="h-5 w-[1.1875rem] shrink-0 object-contain"
      style={variant === 'outline' ? { filter: RED_ICON_FILTER } : undefined}
    />
  );
}

/** 기본은 빨간 실루엣, 누르면 원본 아이콘으로 변함 */
function MenuRowHorseIcons() {
  return (
    <span
      className="relative inline-flex h-5 w-[1.1875rem] shrink-0 items-center justify-center"
      aria-hidden
    >
      <img
        src={HorseIcon}
        alt=""
        className="absolute max-h-full max-w-full object-contain opacity-100 transition-opacity duration-150 ease-out group-[&:active]:opacity-0"
        style={{ filter: RED_ICON_FILTER }}
      />
      <img
        src={HorseIcon}
        alt=""
        className="absolute max-h-full max-w-full object-contain opacity-0 transition-opacity duration-150 ease-out group-[&:active]:opacity-100"
      />
    </span>
  );
}

export default function Menu() {
  const navigate = useNavigate();
  const [madeByNavigating, setMadeByNavigating] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="h-dvh max-h-dvh overflow-hidden overscroll-none bg-[#161616]">
      <div className="relative mx-auto h-full min-h-0 w-full max-w-[450px] overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 w-full" aria-hidden="true">
          <div
            className="relative w-full"
            style={{
              maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
            }}
          >
            <img
              src={BgMadeByTop1}
              alt=""
              className="w-full object-cover"
              style={{ opacity: 0.6 }}
            />
            <img
              src={BgMadeByTop2}
              alt=""
              className="absolute left-0 top-0 w-full object-cover"
              style={{ opacity: 0.13, mixBlendMode: 'difference' }}
            />
          </div>
          <img
            src={BgMadeByMid2}
            alt=""
            className="w-full object-cover"
            style={{
              height: '80rem',
              objectFit: 'cover',
              objectPosition: 'top',
              opacity: 0.5,
              mixBlendMode: 'screen',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)',
            }}
          />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden px-[1.75rem] pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))] pt-[max(4.75rem,calc(env(safe-area-inset-top)+0.75rem))] md:pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pt-[calc(8.33vh+2.675rem)]">
          <div aria-hidden className="min-h-0 w-full flex-1 shrink basis-0" />

          <img
            src={TitleLogo}
            alt="2026 서경대학교 대동제"
            className="mx-auto mb-10 h-auto w-[9.75rem] max-w-[82vw] shrink-0 md:mb-3 md:w-[10.875rem] md:max-w-[90vw]"
          />

          <div className="flex w-full shrink-0 flex-col gap-5 md:gap-7">
            <div className="flex flex-col gap-1.5">
              <Link to="/" className={`${MENU_ROW_BTN} ${MENU_ROW_BTN_ACTIVE}`}>
                <span className="flex flex-1 items-center justify-center gap-[0.625rem]">
                  <MenuRowHorseIcons />
                  <span className={MENU_ROW_LABEL}>메인 화면</span>
                </span>
              </Link>

              <Link to="/#booth" className={`${MENU_ROW_BTN} ${MENU_ROW_BTN_ACTIVE}`}>
                <span className="flex flex-1 items-center justify-center gap-[0.625rem]">
                  <MenuRowHorseIcons />
                  <span className={MENU_ROW_LABEL}>부스 안내</span>
                </span>
              </Link>

              <Link to="/lost-items" className={`${MENU_ROW_BTN} ${MENU_ROW_BTN_ACTIVE}`}>
                <span className="flex flex-1 items-center justify-center gap-[0.625rem]">
                  <MenuRowHorseIcons />
                  <span className={MENU_ROW_LABEL}>분실물 검색</span>
                </span>
              </Link>
            </div>

            <div className="flex flex-col gap-[max(2rem,calc(1rem+2.5dvh))] md:gap-[max(3.5rem,calc(1.75rem+3.5dvh))]">
              <button
                type="button"
                aria-busy={madeByNavigating}
                disabled={madeByNavigating}
                onClick={() => {
                  if (madeByNavigating) return;
                  setMadeByNavigating(true);
                  window.setTimeout(() => navigate('/made-by'), MADE_BY_NAV_DELAY_MS);
                }}
                className={[
                  MENU_ROW_BTN,
                  madeByNavigating ? `${MENU_ROW_BTN_PRESSED} cursor-wait` : MENU_ROW_BTN_ACTIVE,
                ].join(' ')}
              >
                <span className="flex flex-1 items-center justify-center gap-[0.625rem]">
                  {madeByNavigating ? <MenuHorseIcon variant="filled" /> : <MenuRowHorseIcons />}
                  <span className={madeByNavigating ? MENU_ROW_LABEL_PRESSED : MENU_ROW_LABEL}>
                    제작자 보러가기
                  </span>
                </span>
              </button>

              <div className="flex flex-nowrap -translate-x-1 -translate-y-3 items-center justify-center gap-x-[max(1.25rem,calc(0.75rem+2dvh))] px-0.5 md:-translate-x-1.5 md:-translate-y-0.5 md:gap-x-[max(1rem,calc(0.625rem+2.5dvh))]">
                <a
                  href={LIKELION_HOME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-semibold leading-none tracking-[-0.0234375rem] text-[#c43a31] [font-family:Pretendard] md:text-[0.9375rem] md:leading-6"
                >
                  <img
                    src={LinkIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 object-contain"
                  />
                  <span className="whitespace-nowrap">멋사 홈페이지</span>
                </a>

                <span
                  className="mx-0.5 h-5 w-px shrink-0 self-center bg-[#c43a31] md:mx-1 md:h-6 md:w-0.5"
                  aria-hidden="true"
                />

                <a
                  href={LIKELION_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-semibold leading-none tracking-[-0.0234375rem] text-[#c43a31] [font-family:Pretendard] md:text-[0.9375rem] md:leading-6"
                >
                  <InstagramIcon
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[#C43A31] md:h-[1.125rem] md:w-[1.125rem]"
                  />
                  <span className="whitespace-nowrap">멋사 인스타</span>
                </a>
              </div>
            </div>
          </div>

          <div aria-hidden className="min-h-0 w-full flex-1 shrink basis-0" />
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center">
          <div
            className="pointer-events-auto flex w-full max-w-[450px] justify-center px-[1.75rem]"
            style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
          >
            <MenuButton variant="close" onClick={() => navigate(-1)} />
          </div>
        </div>
      </div>
    </div>
  );
}
