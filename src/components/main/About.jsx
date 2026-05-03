import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import SkuLogo from '@/assets/icons/sku-logo.svg';
import AboutFire2 from '@/assets/images/about-fire2.svg';
import AboutFire from '@/assets/images/about-fire.svg';
import CastCreditsAnimation from '@/components/animation/CastCreditsAnimation';
import {
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/components/animation/useScrollDrivenOpacity';

const CAST_ROWS = [
  { role: 'PROJECT LEADER', names: 'Yoon Heejun, Lim Dahyun' },
  { role: 'PRODUCT OWNER', names: 'Jeong Youngjin, Choi Unjo, Kim Junghyeon' },
  { role: 'FRONTEND', names: 'Sim SeoHyeon, Jeong Mokjin, Kim Hyunsu' },
  { role: 'BACKEND', names: 'Keum Sieon, Kim NaKyung, Shin Chaerin' },
];

export default function About() {
  const navigate = useNavigate();
  const heroBlockRef = useRef(null);
  const heroOpacity = useScrollDrivenOpacity(heroBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);

  return (
    <section
      id="about"
      className="relative min-h-[85rem] overflow-hidden bg-[#141414] px-[3.65625rem] pt-[3.75rem]"
    >
      <img
        src={AboutFire}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-[0] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <img
        src={AboutFire2}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-[0] w-[28.125rem] max-w-none -translate-x-1/2 object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[16rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.15) 90%,rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        ref={heroBlockRef}
        style={{ opacity: heroOpacity, willChange: 'opacity' }}
        className="relative z-10 flex flex-col items-center pt-[0.5rem] text-center text-white"
      >
        <p className="text-[1.25rem] leading-[1.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
          ABOUT
        </p>
        <div className="mt-[2.25rem] flex flex-col items-center gap-[1.3rem]">
          <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-white" />
          <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-white opacity-70" />
          <span className="h-[0.3125rem] w-[0.3125rem] rounded-full bg-white opacity-30" />
        </div>
        <img src={SkuLogo} alt="SKU LIKELION 로고" className="mt-[3.125rem] h-[9rem] w-[9rem]" />
        <p className="mt-[2rem] text-[1.125rem] leading-[1.2] text-[#fefefe] [font-family:Sekuya]">
          SKU LIKELION 14TH
        </p>
        <p className="mt-[3.25rem] text-[0.75rem] font-regular leading-[1.6] text-[#fefefe] [font-family:Pretendard] whitespace-nowrap">
          안녕하세요, 서경대학교 <span className="font-bold">멋쟁이사자처럼</span> 입니다.
        </p>
        <div className="mt-[1rem] text-[0.75rem] font-regular leading-[1.6] text-[#fefefe] [font-family:Pretendard] whitespace-nowrap">
          <p className="m-0 whitespace-nowrap">
            올해에도 여러분의 축제를 더 쉽고 편하게 만들어드리고자
          </p>
          <p className="m-[-0.1rem] whitespace-nowrap">축제 페이지를 준비했습니다 ♡</p>
          <p className="mt-[1rem] whitespace-nowrap">
            유용하게 사용해주시고 즐거운 축제 즐기시길 바랍니다 :)
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-[6rem] flex w-full flex-col items-center text-center text-white">
        <div className="-mx-[1rem] w-[calc(100%+2rem)] text-[#C43A31]">
          <p className="text-center text-[1.125rem] leading-[1.2] [font-family:Sekuya]">CAST</p>
          <CastCreditsAnimation rows={CAST_ROWS} />
        </div>
        <div className="mt-[8rem] -mx-[1rem] flex w-[calc(100%+2rem)] flex-col gap-[0.55rem]">
          <button
            type="button"
            onClick={() => navigate('/made-by')}
            className="h-[3rem] w-full border border-[rgba(255,255,255,0.2)] bg-[rgba(34,34,34,0.72)] text-[1rem] font-semibold leading-none text-white [font-family:Pretendard]"
          >
            제작자 보러가기
          </button>
          <button
            type="button"
            onClick={() => navigate('/booth-map')}
            className="h-[3rem] w-full border border-[rgba(255,255,255,0.2)] bg-[rgba(34,34,34,0.72)] text-[1rem] font-semibold leading-none text-white [font-family:Pretendard]"
          >
            부스 보러가기
          </button>
        </div>
      </div>
    </section>
  );
}
