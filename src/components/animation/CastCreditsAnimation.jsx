import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const CAST_CREDITS_SCROLL_PX_PER_SEC = 18;
/** 크레딧 뷰포트 전체 여백 */
const CAST_VIEWPORT_HEIGHT_CLASS = 'h-[8rem]';

function CastCreditRow({ row }) {
  return (
    <div className="mb-[2rem] grid grid-cols-[5.6rem_1fr] items-start gap-x-[0rem] text-left">
      <p className="pl-[1.3rem] m-0 text-[0.75rem] font-black leading-[1.4] [font-family:Pretendard]">
        {row.role.includes('LEADER') ? (
          <>
            {row.role.replace(' LEADER', '')}{' '}
            <span className="relative left-[1rem] inline-block">LEADER</span>
          </>
        ) : row.role.includes('OWNER') ? (
          <>
            {row.role.replace(' OWNER', '')}{' '}
            <span className="relative left-[1.1rem] inline-block">OWNER</span>
          </>
        ) : row.role === 'BACKEND' ? (
          <span className="relative left-[0.5rem] inline-block">BACKEND</span>
        ) : (
          row.role
        )}
      </p>
      <p className="-ml-[-1.25rem] m-0 text-[0.75rem] font-semibold leading-[1.4] [font-family:Pretendard]">
        {row.names}
      </p>
    </div>
  );
}

export default function CastCreditsAnimation({ rows }) {
  const castSegmentARef = useRef(null);
  const castViewportRef = useRef(null);
  const castFrameRef = useRef(0);
  const castStartTsRef = useRef(0);
  const castIntroDoneRef = useRef(false);
  const castCreditsArmRef = useRef(false);
  const [castCreditsStarted, setCastCreditsStarted] = useState(false);
  const [castInView, setCastInView] = useState(false);
  const [castSegmentHeightPx, setCastSegmentHeightPx] = useState(0);
  const [castViewportHeightPx, setCastViewportHeightPx] = useState(0);
  const [castTranslateYPx, setCastTranslateYPx] = useState(0);
  const [castPrefersReducedMotion, setCastPrefersReducedMotion] = useState(false);

  const layoutMeasured = castViewportHeightPx > 0 && castSegmentHeightPx > 0;

  useLayoutEffect(() => {
    const segmentEl = castSegmentARef.current;
    const viewportEl = castViewportRef.current;
    if (!segmentEl || !viewportEl) return;

    const measure = () => {
      const segmentNext = segmentEl.offsetHeight;
      const viewportNext = viewportEl.clientHeight;
      setCastSegmentHeightPx((prev) => (prev === segmentNext ? prev : segmentNext));
      setCastViewportHeightPx((prev) => (prev === viewportNext ? prev : viewportNext));
    };

    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const ro = new ResizeObserver(() => measure());
    ro.observe(segmentEl);
    ro.observe(viewportEl);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setCastPrefersReducedMotion(Boolean(mq.matches));
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  useEffect(() => {
    const viewportEl = castViewportRef.current;
    if (!viewportEl) return;

    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setCastInView(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || castCreditsArmRef.current) return;
          setCastInView(true);
          observer.disconnect();
        });
      },
      { threshold: 0.65, rootMargin: '0px 0px -22% 0px' }
    );

    observer.observe(viewportEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!layoutMeasured || !castInView || castCreditsArmRef.current) return;
    castCreditsArmRef.current = true;
    queueMicrotask(() => {
      setCastTranslateYPx(castViewportHeightPx);
      setCastCreditsStarted(true);
    });
  }, [layoutMeasured, castInView, castViewportHeightPx]);

  useEffect(() => {
    if (!castCreditsStarted || castPrefersReducedMotion || castSegmentHeightPx <= 0) return;

    const step = (ts) => {
      if (!castStartTsRef.current) castStartTsRef.current = ts;
      const elapsedSec = (ts - castStartTsRef.current) / 1000;
      const distance = elapsedSec * CAST_CREDITS_SCROLL_PX_PER_SEC;

      if (!castIntroDoneRef.current) {
        const introY = Math.max(castViewportHeightPx - distance, 0);
        setCastTranslateYPx((prev) => (Math.abs(prev - introY) < 0.001 ? prev : introY));

        if (introY <= 0) {
          castIntroDoneRef.current = true;
          castStartTsRef.current = ts;
        }

        castFrameRef.current = window.requestAnimationFrame(step);
        return;
      }

      const nextY = -distance % castSegmentHeightPx;
      setCastTranslateYPx((prev) => (Math.abs(prev - nextY) < 0.001 ? prev : nextY));
      castFrameRef.current = window.requestAnimationFrame(step);
    };

    castFrameRef.current = window.requestAnimationFrame(step);
    return () => {
      window.cancelAnimationFrame(castFrameRef.current);
      castStartTsRef.current = 0;
      castIntroDoneRef.current = false;
    };
  }, [castCreditsStarted, castPrefersReducedMotion, castSegmentHeightPx, castViewportHeightPx]);

  return (
    <div
      ref={castViewportRef}
      className={`mt-[3rem] ${CAST_VIEWPORT_HEIGHT_CLASS} overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]`}
    >
      <div
        style={{
          opacity: layoutMeasured ? 1 : 0,
          transform: `translate3d(0, ${
            layoutMeasured
              ? castCreditsStarted
                ? castTranslateYPx
                : castViewportHeightPx
              : castViewportHeightPx
          }px, 0)`,
          willChange: 'transform',
        }}
        className="flex flex-col"
      >
        <div ref={castSegmentARef}>
          {rows.map((row) => (
            <CastCreditRow key={row.role} row={row} />
          ))}
          <div aria-hidden className={`${CAST_VIEWPORT_HEIGHT_CLASS} shrink-0`} />
        </div>
        <div aria-hidden>
          {rows.map((row) => (
            <CastCreditRow key={`dup-${row.role}`} row={row} />
          ))}
          <div aria-hidden className={`${CAST_VIEWPORT_HEIGHT_CLASS} shrink-0`} />
        </div>
      </div>
    </div>
  );
}
