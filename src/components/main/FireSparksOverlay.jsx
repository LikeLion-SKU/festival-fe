import { useMemo } from 'react';

import FireBigCircle1 from '@/assets/icons/main/fire-big-circle1.svg';
import FireBigCircle2 from '@/assets/icons/main/fire-big-circle2.svg';
import FireBigCircle3 from '@/assets/icons/main/fire-big-circle3.svg';
import FireBlur from '@/assets/icons/main/fire-blur.svg';
import FireLine1 from '@/assets/icons/main/fire-line1.svg';
import FireLine2 from '@/assets/icons/main/fire-line2.svg';
import FireLine3 from '@/assets/icons/main/fire-line3.svg';
import FireLine4 from '@/assets/icons/main/fire-line4.svg';
import FireSmallCircle1 from '@/assets/icons/main/fire-small-circle1.svg';
import FireSmallCircle2 from '@/assets/icons/main/fire-small-circle2.svg';

const FIRE_ICONS = [
  FireBigCircle1,
  FireBigCircle2,
  FireBigCircle3,
  FireBlur,
  FireLine1,
  FireLine2,
  FireLine3,
  FireLine4,
  FireSmallCircle1,
  FireSmallCircle2,
];

const SPARK_COUNT = 40;

function seeded(index, salt = 0) {
  const x = Math.sin(index * 97.31 + salt * 57.79) * 43758.5453;
  return x - Math.floor(x);
}

export default function FireSparksOverlay() {
  const sparks = useMemo(
    () =>
      Array.from({ length: SPARK_COUNT }, (_, index) => {
        const iconIndex = Math.floor(seeded(index, 1) * FIRE_ICONS.length);
        const left = 2 + seeded(index, 2) * 96;
        const top = -8 + seeded(index, 3) * 114;
        const size = 7 + seeded(index, 4) * 16;
        const driftX = 28 + seeded(index, 5) * 86;
        const swayX = -20 + seeded(index, 6) * 40;
        const dropY = 170 + seeded(index, 7) * 220;
        const duration = 2900 + seeded(index, 8) * 3200;
        const delay = -1 * (seeded(index, 8) * 4200);
        const baseOpacity = 0.24 + seeded(index, 9) * 0.34;
        const rotate = -16 + seeded(index, 10) * 32;

        return {
          id: `fire-spark-${index}`,
          src: FIRE_ICONS[iconIndex],
          left,
          top,
          size,
          driftX,
          swayX,
          dropY,
          duration,
          delay,
          baseOpacity,
          rotate,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes main-fire-spark-fall {
          0% {
            opacity: 0;
            transform: translate3d(0, -38px, 0) rotate(calc(var(--spark-rotate) * -0.5)) scale(0.84);
          }
          15% {
            opacity: var(--spark-opacity);
          }
          42% {
            opacity: calc(var(--spark-opacity) * 0.92);
            transform: translate3d(var(--spark-sway-x), calc(var(--spark-drop-y) * 0.42), 0) rotate(var(--spark-rotate)) scale(0.93);
          }
          70% {
            opacity: calc(var(--spark-opacity) * 0.78);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--spark-drift-x), var(--spark-drop-y), 0) rotate(calc(var(--spark-rotate) * 1.2)) scale(1);
          }
        }
      `}</style>
      {sparks.map((spark) => (
        <img
          key={spark.id}
          src={spark.src}
          alt=""
          className="absolute select-none"
          style={{
            left: `${spark.left}%`,
            top: `${spark.top}%`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            '--spark-drift-x': `${spark.driftX}px`,
            '--spark-sway-x': `${spark.swayX}px`,
            '--spark-drop-y': `${spark.dropY}px`,
            '--spark-opacity': String(spark.baseOpacity),
            '--spark-rotate': `${spark.rotate}deg`,
            animation: `main-fire-spark-fall ${spark.duration}ms linear ${spark.delay}ms infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
