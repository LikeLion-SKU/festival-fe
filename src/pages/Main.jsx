import Intro from '@/components/main/Intro.jsx';
import Introduce from '@/components/main/Introduce.jsx';

const MAIN_SECTIONS = ['Intro', 'Introduce', 'Timetable', 'Lineup', 'Booth', 'Safety', 'About'];

export default function Main() {
  return (
    <div className="min-h-dvh bg-[#141414]">
      <div className="mx-auto w-full max-w-[450px] min-h-dvh">
        {MAIN_SECTIONS.map((sectionName) =>
          sectionName === 'Intro' ? (
            <Intro key={sectionName} />
          ) : sectionName === 'Introduce' ? (
            <Introduce key={sectionName} />
          ) : (
            <section
              key={sectionName}
              id={sectionName.toLowerCase()}
              className="min-h-[100dvh] bg-[#141414]"
            />
          )
        )}
        <footer id="footer" className="min-h-[100dvh]"></footer>
      </div>
    </div>
  );
}
