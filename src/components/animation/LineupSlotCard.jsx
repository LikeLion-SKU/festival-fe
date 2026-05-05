import { motion as Motion } from 'framer-motion';

import { animateForSlot } from './lineupMotion';

export default function LineupSlotCard({
  children,
  position,
  transition,
  stageShiftX,
  measureRef,
}) {
  return (
    <Motion.article
      ref={measureRef}
      className="pointer-events-none absolute left-0 top-0 w-[19.5rem] [transform-style:preserve-3d]"
      style={{
        transformOrigin: 'center center',
      }}
      initial={false}
      animate={animateForSlot(position, stageShiftX)}
      transition={transition}
    >
      {children}
    </Motion.article>
  );
}
