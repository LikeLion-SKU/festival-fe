import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import MenuButton from '@/components/common/Button/MenuButton';
import About from '@/components/main/About.jsx';
import Booth from '@/components/main/Booth.jsx';
import FireSparksOverlay from '@/components/main/FireSparksOverlay.jsx';
import Intro from '@/components/main/Intro.jsx';
import Introduce from '@/components/main/Introduce.jsx';
import Lineup from '@/components/main/Lineup.jsx';
import Safety from '@/components/main/Safety.jsx';
import Timetable from '@/components/main/Timetable.jsx';
import Footer from '@/layouts/Footer.jsx';
import { preloadBoothAssets } from '@/utils/boothAssetPreload';
import { preloadLineupAssets } from '@/utils/lineupAssetPreload';

/** 첫 로드에 라인업·부스 전 이미지를 받지 않고, 해당 섹션이 가까워질 때만 프리로드 */
const SECTION_PRELOAD_ROOT_MARGIN = '280px 0px';

export default function Main() {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    let lineupStarted = false;
    let boothStarted = false;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (id === 'lineup' && !lineupStarted) {
            lineupStarted = true;
            void preloadLineupAssets();
          }
          if (id === 'booth' && !boothStarted) {
            boothStarted = true;
            void preloadBoothAssets();
          }
        }
      },
      { root: null, rootMargin: SECTION_PRELOAD_ROOT_MARGIN, threshold: 0 }
    );

    const lineupEl = document.getElementById('lineup');
    const boothEl = document.getElementById('booth');
    if (lineupEl) io.observe(lineupEl);
    if (boothEl) io.observe(boothEl);

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHasScrolled(true), 4200);
    const onScroll = () => {
      if (window.scrollY >= document.documentElement.scrollHeight * 0.05) {
        setHasScrolled(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-[#121212]">
      <div className="mx-auto w-full max-w-[450px] min-h-dvh">
        <div className="relative isolate">
          <FireSparksOverlay />
          <Intro />
          <Introduce />
          <Timetable />
          <Lineup />
          <Booth />
          <Safety />
          <About />
        </div>
        <Footer />
      </div>

      <style>{`
        @keyframes hint-float-down {
          0%   { opacity: 0;   transform: translateY(-4px); }
          40%  { opacity: 0.9; transform: translateY(0px); }
          70%  { opacity: 0.9; transform: translateY(0px); }
          100% { opacity: 0;   transform: translateY(4px); }
        }
        .hint-down-1 { animation: hint-float-down 1.5s ease-in-out infinite; }
        .hint-down-2 { animation: hint-float-down 1.5s ease-in-out infinite 0.22s; }
      `}</style>

      {/* 아래 화살표 힌트 — 스크롤 전에만 표시 */}
      <div
        className="fixed z-[100] left-1/2 flex flex-col items-center gap-1 pointer-events-none"
        style={{
          bottom: '3.5rem',
          transform: 'translateX(-50%)',
          opacity: hasScrolled ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
        aria-hidden
      >
        <svg className="hint-down-1" width="20" height="12" viewBox="0 0 20 12" fill="none">
          <polyline
            points="2,2 10,10 18,2"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg className="hint-down-2" width="20" height="12" viewBox="0 0 20 12" fill="none">
          <polyline
            points="2,2 10,10 18,2"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 햄버거 버튼 — 스크롤 후 자연스럽게 등장 */}
      <div
        className="fixed z-[100] left-1/2"
        style={{
          bottom: '2.75rem',
          transform: `translateX(-50%) translateY(${hasScrolled ? '0px' : '10px'})`,
          opacity: hasScrolled ? 1 : 0,
          pointerEvents: hasScrolled ? 'auto' : 'none',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <MenuButton onClick={() => navigate('/menu', { state: { from: '/' } })} />
      </div>
    </div>
  );
}
