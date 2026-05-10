import { useEffect, useRef, useState } from 'react';

import { motion as Motion, useAnimationControls } from 'framer-motion';

import {
  LINEUP_ORBIT_FILTER_TRANSITION,
  LINEUP_ORBIT_LAYOUT_TRANSITION,
  LINEUP_ORBIT_SLOT_EASE,
  LINEUP_TWEEN_TRANSITION,
  animateFilterForSlot,
  animateGeometryForSlot,
  buildOrbitSlotChangeKeyframes,
} from './lineupMotion';

export default function LineupSlotCard({
  children,
  position,
  stageShiftX,
  measureRef,
  reduceMotion,
}) {
  const controls = useAnimationControls();
  const prevPositionRef = useRef(null);
  const [filterTransition, setFilterTransition] = useState(LINEUP_ORBIT_FILTER_TRANSITION);

  useEffect(() => {
    const target = animateGeometryForSlot(position, stageShiftX);
    const prev = prevPositionRef.current;
    prevPositionRef.current = position;

    if (prev != null && prev !== position && !reduceMotion) {
      controls.stop();
      const kf = buildOrbitSlotChangeKeyframes(prev, position, stageShiftX);
      const { times, duration, ...kfMotion } = kf;
      setFilterTransition({ filter: { duration, ease: LINEUP_ORBIT_SLOT_EASE } });
      void controls.start({
        ...kfMotion,
        transition: { type: 'tween', duration, ease: LINEUP_ORBIT_SLOT_EASE, times },
      });
    } else {
      setFilterTransition(
        reduceMotion ? { filter: { duration: 0.12 } } : LINEUP_ORBIT_FILTER_TRANSITION
      );
      void controls.start({
        ...target,
        transition: reduceMotion ? LINEUP_TWEEN_TRANSITION : LINEUP_ORBIT_LAYOUT_TRANSITION,
      });
    }
  }, [position, stageShiftX, reduceMotion, controls]);

  return (
    <Motion.article
      ref={measureRef}
      layout={false}
      initial={false}
      animate={controls}
      className="pointer-events-none absolute left-0 top-0 h-[19.5rem] w-[19.5rem] [transform-style:preserve-3d]"
      style={{
        transformOrigin: '50% 50%',
      }}
    >
      <Motion.div
        layout={false}
        className="relative h-full w-full [transform-style:preserve-3d]"
        initial={false}
        animate={animateFilterForSlot(position)}
        transition={filterTransition}
      >
        {children}
      </Motion.div>
    </Motion.article>
  );
}
