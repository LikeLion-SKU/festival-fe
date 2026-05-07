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

export default function Main() {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasScrolled(true), 4200);
    return () => clearTimeout(timer);
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
