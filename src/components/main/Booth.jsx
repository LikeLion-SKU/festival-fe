import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import HorseIcon from '@/assets/icons/horse.svg';
import BoothPaper from '@/assets/images/booth-paper.svg';
import DesertBg from '@/assets/images/desert.svg';
import FenceBg from '@/assets/images/fence.svg';
import { BOOTH_CARDS, BUILDINGS } from '@/constants/mainDummyData';

function getTitleLines(title) {
  if (!Array.isArray(title)) {
    return [String(title).slice(0, 10)];
  }

  const mergedTitle = title.join(' ');
  const mergedLength = mergedTitle.replace(/\s+/g, '').length;
  if (mergedLength <= 9) {
    return [mergedTitle.slice(0, 10)];
  }

  return title.map((line) => String(line).slice(0, 10));
}

function BoothCardTitle({ title }) {
  const lines = getTitleLines(title);
  const isSingleLine = lines.length === 1;
  return (
    <div className="flex w-full flex-col gap-0 px-1 text-center text-[clamp(1rem,4.3vw,1.25rem)] font-extrabold leading-[1.08] tracking-[-0.03125rem] text-[#141414]">
      {lines.map((line, i) => (
        <p key={`${line}-${i}`} className={clsx(isSingleLine && 'whitespace-nowrap')}>
          {line}
        </p>
      ))}
    </div>
  );
}

/** @param {{ image: string; subtitle: string; title: string | string[] }} props */
function BoothCard({ image, subtitle, title }) {
  const titleLabel = Array.isArray(title) ? title.join(' ') : title;
  const imageAlt = `${titleLabel} 부스`;
  const titleLines = getTitleLines(title);
  const isSingleLineTitle = titleLines.length === 1;
  const hasWrappedTitle = titleLines.length > 1;

  return (
    <article className="relative h-[13.25rem] w-full overflow-hidden shadow-[1px_1px_0px_rgba(0,0,0,0.12)]">
      <img
        src={BoothPaper}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <div className="relative flex flex-col gap-2 px-[1.125rem] pb-[0.875rem] pt-4">
        <div
          className={clsx(
            'relative w-full shrink-0 overflow-hidden bg-white',
            isSingleLineTitle ? 'h-[6.625rem]' : 'h-[5.375rem]'
          )}
        >
          <img src={image} alt={imageAlt} className="size-full object-cover" />
        </div>
        <div className="flex flex-col items-center text-[#141414]">
          <div className="h-px w-full shrink-0 bg-[#141414]" aria-hidden />
          <div className="flex min-h-[4rem] w-full flex-col items-center pt-[0.7rem]">
            <p className="w-full max-w-[11rem] text-center text-xs font-regular tracking-[-.01875rem]">
              {subtitle}
            </p>
            <div className="mt-[0.45rem]">
              <BoothCardTitle title={title} />
            </div>
          </div>
          <div
            className={clsx(
              'h-px w-full shrink-0 bg-[#141414]',
              hasWrappedTitle ? 'mt-[0.85rem]' : 'mt-[0.2rem]'
            )}
            aria-hidden
          />
        </div>
      </div>
    </article>
  );
}

export default function Booth() {
  const navigate = useNavigate();
  const [activeBuildingId, setActiveBuildingId] = useState(BUILDINGS[0].id);

  const visibleCards = useMemo(
    () => BOOTH_CARDS.filter((card) => card.buildingId === activeBuildingId),
    [activeBuildingId]
  );

  return (
    <section
      id="booth"
      className="relative min-h-[46rem] overflow-hidden bg-[#141414] px-[1.5rem] pb-[9.0rem] pt-[2.5rem]"
    >
      <div className="pointer-events-none absolute left-1/2 top-[-29rem] z-0 flex w-[28.125rem] max-w-none -translate-x-1/2 flex-col">
        <img src={FenceBg} alt="" aria-hidden="true" className="w-full object-cover" />
        <img src={DesertBg} alt="" aria-hidden="true" className="-mt-[20rem] w-full object-cover" />
      </div>

      <div className="relative z-10 mx-auto flex w-full flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <img src={HorseIcon} alt="" aria-hidden="true" className="h-[2.5rem] w-[2.4375rem]" />
            <p className="text-center text-[1rem] leading-[1.3] text-[#fefefe] [font-family:Sekuya] [text-shadow:1px_1px_0px_rgba(0,0,0,0.11)]">
              BOOTH
            </p>
          </div>

          <div
            className="flex w-full flex-nowrap justify-center gap-2"
            role="tablist"
            aria-label="건물별 부스"
          >
            {BUILDINGS.map((b) => {
              const active = b.id === activeBuildingId;
              return (
                <button
                  key={b.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveBuildingId(b.id)}
                  className={clsx(
                    'h-9 w-[clamp(2.2rem,14.5vw,3.5rem)] min-w-0 border border-solid border-white px-1 text-center text-[clamp(0.62rem,2.65vw,0.75rem)] tracking-[-0.01875rem] whitespace-nowrap transition-colors sm:px-3',
                    active
                      ? 'bg-white font-bold text-[#141414]'
                      : 'bg-transparent font-medium text-white'
                  )}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4">
          {visibleCards.map((card) => (
            <BoothCard
              key={card.id}
              image={card.image}
              subtitle={card.subtitle}
              title={card.title}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/booth-map')}
          className="mt-4 flex h-[3.25rem] w-full shrink-0 items-center justify-center border border-solid border-white bg-[rgba(255,255,255,0.15)] px-4 py-[0.875rem] text-base font-semibold leading-6 tracking-[-0.025rem] text-white shadow-[1px_1px_0px_rgba(0,0,0,0.12)]"
        >
          한눈에 보기
        </button>
      </div>
    </section>
  );
}
