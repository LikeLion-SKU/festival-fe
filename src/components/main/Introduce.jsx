import HorseIcon from '@/assets/icons/horse.svg';

const INTRODUCE_LINES = [
  '‘Blooming’이라는 단어는',
  '[꽃 피는], [개화] 라는 의미를 가지고 있습니다.',
  '대학생활을 거치며 서경대학교 학우들의 인생에',
  '활짝 꽃이 피기를 염원하는 의미를 담고 있으며,',
  '축제는 대학의 꽃이기에 축제 기간동안',
  '청춘의 개화기가 시작된다는 의미 또한 담겨있습니다.',
];

export default function Introduce() {
  return (
    <section
      id="introduce"
      className="min-h-[38dvh] bg-[#141414] px-[3.65625rem] pt-[3.75rem]"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 31%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 125%)',
      }}
    >
      <div className="flex flex-col items-center gap-[1.3125rem]">
        <div className="flex flex-col items-center gap-[0.25rem]">
          <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
          <p className="text-center text-[1rem] leading-[1] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
            INTRODUCE
          </p>
        </div>

        <div className="text-center text-[0.75rem] tracking-[-0.0225rem] text-[#fdfdfd] [font-family:Pretendard]">
          {INTRODUCE_LINES.map((line) => (
            <p key={line} className="m-0 leading-[1.3rem]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
