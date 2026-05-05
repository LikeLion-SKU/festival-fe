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

      <div className="fixed z-50 left-1/2 -translate-x-1/2" style={{ bottom: '2.75rem' }}>
        <MenuButton onClick={() => navigate('/menu')} />
      </div>
    </div>
  );
}
