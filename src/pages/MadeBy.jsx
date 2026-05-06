import { useEffect, useRef, useState } from 'react';

import HatIcon from '@/assets/icons/hat.svg';
import HorseIcon from '@/assets/icons/horse.svg';
import SkuLogo from '@/assets/icons/sku-logo.svg';
import BgMadeByBottom from '@/assets/images/bg-madeby-bottom.png';
import BgMadeByMid1 from '@/assets/images/bg-madeby-mid-1.png';
import BgMadeByMid2 from '@/assets/images/bg-madeby-mid-2.png';
import BgMadeByMiddle1 from '@/assets/images/bg-madeby-middle-1.png';
import BgMadeByTop1 from '@/assets/images/bg-madeby-top-1.png';
import BgMadeByTop2 from '@/assets/images/bg-madeby-top-2.png';
import ChaerinImg from '@/assets/images/chaerin.png';
import DahyunImg from '@/assets/images/dahyun.png';
import HeejunImg from '@/assets/images/heejun.png';
import HyunsuImg from '@/assets/images/hyunsu.png';
import JunghyunImg from '@/assets/images/junghyun.png';
import MokjinImg from '@/assets/images/mokjin.png';
import NakyungImg from '@/assets/images/nakyung.png';
import SeohyeonImg from '@/assets/images/seohyeon.png';
import SieonImg from '@/assets/images/sieon.png';
import UnzoImg from '@/assets/images/unzo.png';
import YeongjinImg from '@/assets/images/yeongjin.png';
import PageHeader from '@/components/common/PageHeader';
import Footer from '@/layouts/Footer';

const PROJECT_LEADER = [
  { name: '윤희준', role: '소웨20', image: HeejunImg },
  { name: '임다현', role: '소웨23', image: DahyunImg },
];

const PRODUCT_OWNER = [
  { name: '정영진', role: '비디20', image: YeongjinImg },
  { name: '최운조', role: '비디22', image: UnzoImg },
  { name: '김정현', role: '아텍23', image: JunghyunImg },
];

const FRONTEND_DEV = [
  { name: '심서현', role: '소웨23', image: SeohyeonImg },
  { name: '정목진', role: '소웨22', image: MokjinImg },
  { name: '김현수', role: '소웨25', image: HyunsuImg },
];

const BACKEND_DEV = [
  { name: '금시언', role: '소웨21', image: SieonImg },
  { name: '신채린', role: '소웨23', image: ChaerinImg },
  { name: '김나경', role: '소웨22', image: NakyungImg },
];

const COUNCIL_MEMBERS = [
  { name: '한영균', role: '학생과 처장' },
  { name: '방효영', role: '학생과 과장' },
  { name: '김영규', role: '학생과 직원' },
  { name: '김훈이', role: '학생과 직원' },
];

const CORE_MEMBERS = [
  { name: '구진모', role: '총학생회장 글비 23' },
  { name: '김태휘', role: '부총학생회장 군사 23' },
  { name: '심은교', role: '정책기획국장 아텍 23' },
  { name: '길서현', role: '사무국장 공공 23' },
  { name: '박승아', role: '홍보국장 라디 21' },
  { name: '윤정현', role: '대외협력국장 전자 22' },
  { name: '전은율', role: '복지국장 코뷰 24' },
  { name: '김동훈', role: '운영집행국장 글비 23' },
  { name: '김승준', role: '미래교육국장 경영 21' },
  { name: '엄태윤', role: '홍보부장 비디 22' },
  { name: '심소민', role: '홍보부장 라디 22' },
  { name: '곽서인', role: '복지부장 환화공 25' },
  { name: '노유승', role: '운영집행부장 미융IT 25' },
  { name: '황시준', role: '미래교육부장 군사 23' },
  { name: '박수빈', role: '대외협력국원 미융 26' },
  { name: '박수환', role: '복지국원 자전 26' },
  { name: '임수민', role: '복지국원 미융 26' },
  { name: '김서윤', role: '운영집행국원 미융 26' },
  { name: '홍세준', role: '미래교육국원 미융 26' },
];

const ANIMATION_STYLE = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function stagger(delay) {
  return {
    opacity: 0,
    animation: 'fadeInUp 0.85s ease forwards',
    animationDelay: `${delay}ms`,
  };
}

function ScrollFade({ children, className = '' }) {
  const ref = useRef(null);
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId;

    const update = () => {
      const vh = window.innerHeight;
      const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 5;
      if (atBottom) {
        setOpacity(1);
        return;
      }
      const rect = el.getBoundingClientRect();
      // 요소 상단이 뷰포트 하단에 닿을 때 0.3, 중앙 도달 시 1.0
      const progress = (vh - rect.top) / (vh * 0.5);
      setOpacity(Math.min(1, Math.max(0.3, 0.3 + 0.7 * progress)));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ opacity }}>
      {children}
    </div>
  );
}

function SectionIcon() {
  return <img src={HorseIcon} alt="" aria-hidden="true" className="w-[2.25rem] h-[2.25rem]" />;
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center gap-[1rem]">
      <SectionIcon />
      <p className="text-center text-[0.875rem] font-normal leading-[1.32] text-white [font-family:Sekuya]">
        {title}
      </p>
      {subtitle && (
        <p className="mt-[-0.125rem] text-center text-[0.75rem] font-medium leading-normal tracking-[0] text-white [font-family:Pretendard]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PersonCard({ person }) {
  return (
    <div className="relative aspect-[140/168] w-full overflow-hidden bg-[#2a2a2a]">
      {person.image && (
        <img
          src={person.image}
          alt={person.name}
          className="h-full w-full object-cover object-top"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #000000 100%)',
          opacity: 0.25,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 px-[0.6rem] pb-[0.75rem] text-center">
        <p className="text-[1.04313rem] font-bold leading-none tracking-[0] text-white [font-family:Pretendard]">
          {person.name}
        </p>
        <p className="mt-[0.25rem] text-[0.625rem] font-medium leading-none tracking-[0] text-[#D3D3D3] [font-family:Pretendard]">
          {person.role}
        </p>
      </div>
    </div>
  );
}

function PersonGrid({ members }) {
  return (
    <div className="mt-[1.625rem] grid grid-cols-2 gap-[0.75rem]">
      {members.map((person) => (
        <PersonCard key={person.name} person={person} />
      ))}
    </div>
  );
}

export default function MadeBy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-dvh bg-[#161616]">
      <style>{ANIMATION_STYLE}</style>
      <div className="relative mx-auto w-full max-w-[450px] min-h-dvh">
        <PageHeader to="/" className="z-20" />

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

        {/* 상단 헤더 */}
        <div className="relative z-10 flex flex-col items-center pt-[calc(6dvh+3.5rem+3.9375rem)] px-[2rem] text-center">
          <div style={stagger(0)} className="flex flex-col items-center">
            <img src={HatIcon} alt="" aria-hidden="true" className="w-[1.75rem] h-[1rem]" />
            <p className="mt-[1rem] text-[1rem] leading-[1.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
              MADE BY
            </p>
          </div>
          <div style={stagger(220)}>
            <img
              src={SkuLogo}
              alt="SKU LIKELION 로고"
              className="mt-[1.25rem] w-[30vw] h-[30vw] max-w-[7.5rem] max-h-[7.5rem]"
            />
          </div>
          <p
            className="mt-[2.5rem] text-[1.125rem] leading-[1.2] text-[#fefefe] [font-family:Sekuya]"
            style={stagger(420)}
          >
            SKU LIKELION 14TH
          </p>
          <div
            className="mt-[1rem] text-[0.75rem] font-normal tracking-[-0.04em] text-white [font-family:Pretendard]"
            style={stagger(620)}
          >
            <p className="m-0">
              안녕하세요, <span className="font-bold">서경대학교 멋쟁이사자처럼</span>입니다 🦁
            </p>
            <p className="mt-[1rem] m-0">저희 서비스를 이용해주셔서 정말 감사합니다!</p>
            <p className="m-0">축제 사이트 덕분에 축제를 더 편하게 즐기셨다면</p>
            <p className="m-0">저희는 그것만으로도 충분히 보람을 느낍니다.</p>
            <p className="mt-[1rem] m-0">
              여러분의 한 번의 방문, 한 번의 이용이 저희에게는 큰 힘이 됩니다.
            </p>
            <p className="mt-[1rem] m-0">앞으로도 더 좋은 서비스로 찾아뵙겠습니다.</p>
            <p className="m-0">멋쟁이사자처럼의 활동도 많이 지켜봐 주세요!</p>
            <p className="mt-[1rem] m-0">감사합니다 😊</p>
          </div>
          <button
            type="button"
            aria-label="메뉴 열기"
            className="mt-[4.25rem] flex h-[3.4375rem] w-[3.4375rem] items-center justify-center overflow-hidden rounded-[12.5rem] relative"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid transparent',
              ...stagger(820),
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: '0 0 8px rgba(255,255,255,0.22)', filter: 'blur(1.2px)' }}
            />
            <span className="sr-only">menu</span>
            <span
              aria-hidden="true"
              className="relative z-10 flex h-[2rem] w-[2rem] flex-col items-center justify-center gap-[0.3125rem]"
            >
              <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
              <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
              <span className="h-[0.125rem] w-[1.3rem] rounded-full bg-[#DA3328]" />
            </span>
          </button>
        </div>

        {/* PROJECT LEADER */}
        <section className="px-[2rem] pt-[7.5rem] pb-[2rem]">
          <ScrollFade>
            <SectionHeader title="PROJECT LEADER" />
            <PersonGrid members={PROJECT_LEADER} />
          </ScrollFade>
        </section>

        {/* PRODUCT OWNER */}
        <section className="relative px-[2rem] pt-[6.25rem] pb-[2rem]">
          <img
            src={BgMadeByMid1}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-0 w-full object-cover"
            style={{
              top: 0,
              height: '80rem',
              objectFit: 'cover',
              objectPosition: 'top',
              opacity: 1,
              mixBlendMode: 'color-dodge',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)',
            }}
          />
          <div className="relative z-10">
            <ScrollFade>
              <SectionHeader title="PRODUCT OWNER" />
              <PersonGrid members={PRODUCT_OWNER} />
            </ScrollFade>
          </div>
        </section>

        {/* FRONTEND DEV */}
        <section className="relative px-[2rem] pt-[6.25rem] pb-[2rem]">
          <img
            src={BgMadeByMiddle1}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-0 w-full object-cover"
            style={{
              top: 0,
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
          <div className="relative z-10">
            <ScrollFade>
              <SectionHeader title="FRONTEND DEV" />
              <PersonGrid members={FRONTEND_DEV} />
            </ScrollFade>
          </div>
        </section>

        {/* BACKEND DEV */}
        <section className="relative px-[2rem] pt-[6.25rem] pb-[2rem]">
          <img
            src={BgMadeByBottom}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-0 w-full object-cover"
            style={{
              top: 0,
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
          <div className="relative z-10">
            <ScrollFade>
              <SectionHeader title="BACKEND DEV" />
              <PersonGrid members={BACKEND_DEV} />
            </ScrollFade>
          </div>
        </section>

        {/* CO:RE */}
        <section className="px-[2rem] pt-[10.375rem] pb-[0]">
          <ScrollFade>
            <SectionHeader title="CO:RE" subtitle="축제를 기획해주신 총학생회 'CO:RE' 구성원" />
            <div className="mt-[3rem] grid grid-cols-2 gap-x-[0.5rem] gap-y-[1.5rem]">
              {CORE_MEMBERS.map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center">
                  <p className="text-[1.125rem] font-bold leading-normal tracking-[0] text-white [font-family:Pretendard]">
                    {member.name}
                  </p>
                  <p className="text-[0.75rem] font-normal leading-normal tracking-[0] text-white [font-family:Pretendard]">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </ScrollFade>
        </section>

        {/* 대학본부 학생처 */}
        <section className="px-[2rem] pt-[7.5rem] pb-[6.75rem]">
          <ScrollFade>
            <SectionHeader
              title="For Students, By Students Student Affairs Office"
              subtitle="학생을 위해, 학생처가 함께 만들었습니다"
            />
            <div className="mt-[3rem] grid grid-cols-2 gap-x-[0.5rem] gap-y-[1.5rem]">
              {COUNCIL_MEMBERS.map((member) => (
                <div key={member.name} className="flex flex-col items-center text-center">
                  <p className="text-[1.125rem] font-bold leading-normal tracking-[0] text-white [font-family:Pretendard]">
                    {member.name}
                  </p>
                  <p className="text-[0.75rem] font-normal leading-normal tracking-[0] text-white [font-family:Pretendard]">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </ScrollFade>
        </section>

        <Footer />
      </div>
    </div>
  );
}
