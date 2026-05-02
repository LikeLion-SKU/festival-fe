import About from '@/components/main/About.jsx';
import Booth from '@/components/main/Booth.jsx';
import Intro from '@/components/main/Intro.jsx';
import Introduce from '@/components/main/Introduce.jsx';
import Lineup from '@/components/main/Lineup.jsx';
import Safety from '@/components/main/Safety.jsx';
import Timetable from '@/components/main/Timetable.jsx';
import Footer from '@/layouts/Footer.jsx';

export default function Main() {
  return (
    <div className="min-h-dvh bg-[#121212]">
      <div className="mx-auto w-full max-w-[450px] min-h-dvh">
        <Intro />
        <Introduce />
        <Timetable />
        <Lineup />
        <Booth />
        <Safety />
        <About />
        <Footer />
      </div>
    </div>
  );
}
