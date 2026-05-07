import { useRef } from 'react';

import HorseIcon from '@/assets/icons/horse.svg';
import {
  MAIN_SECTION_BODY_SCROLL_FADE,
  MAIN_SECTION_ICON_SCROLL_FADE,
  useScrollDrivenOpacity,
} from '@/components/animation/useScrollDrivenOpacity';

const INTRODUCE_LINES = [
  `‘Ready, Set, Go!’는`,
  `출발 직전의 긴장감과 설렘, 폭발적인 시작을 상징하는 표현입니다.`,
  `서경대학교 학우들이 일상에서 벗어나 축제로 향하는 순간의`,
  `고조된 에너지와 기대감을 담아내고자 했습니다.`,
  ``,
  `‘Ready’는 준비의 축적, ‘Set’은 긴장이 최고조에 이르는 순간,`,
  ` ‘Go’는 모든 에너지가 터져 나오며,`,
  `축제가 본격적으로 질주하는 절정을 의미합니다.`,
];

function renderLine(text) {
  return text.split(/(Ready|Set|Go)/).map((part, j) =>
    part === 'Ready' || part === 'Set' || part === 'Go' ? (
      <span key={j} className="font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function Introduce() {
  const iconBlockRef = useRef(null);
  const bodyBlockRef = useRef(null);
  const iconOpacity = useScrollDrivenOpacity(iconBlockRef, MAIN_SECTION_ICON_SCROLL_FADE);
  const bodyOpacity = useScrollDrivenOpacity(bodyBlockRef, MAIN_SECTION_BODY_SCROLL_FADE);

  return (
    <section
      id="introduce"
      className="min-h-[21rem] bg-[#141414] px-[3.65625rem] pt-[6rem]"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 31%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 125%)',
      }}
    >
      <div className="flex flex-col items-center gap-[0.75rem]">
        <div
          ref={iconBlockRef}
          style={{ opacity: iconOpacity, willChange: 'opacity' }}
          className="flex flex-col items-center gap-[0.25rem]"
        >
          <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
          <p className="text-center text-[1rem] leading-[3.2] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
            INTRODUCE
          </p>
        </div>

        <div
          ref={bodyBlockRef}
          style={{ opacity: bodyOpacity, willChange: 'opacity' }}
          className="font-medium text-center text-[0.75rem] tracking-[-0.0225rem] text-[#fdfdfd] [font-family:Pretendard]"
        >
          {INTRODUCE_LINES.map((line, i) =>
            line.trim() === '' ? (
              <div key={i} style={{ height: '1.3rem' }} aria-hidden />
            ) : (
              <p key={i} className="m-0 leading-[1.3rem] whitespace-nowrap">
                {renderLine(line)}
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}
