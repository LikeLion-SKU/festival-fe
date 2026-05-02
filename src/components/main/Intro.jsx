import { useEffect, useRef, useState } from 'react';

import HatIcon from '@/assets/icons/hat.svg';
import ZeroIcon from '@/assets/icons/main/0.svg';
import OneIcon from '@/assets/icons/main/1.svg';
import ThreeIcon from '@/assets/icons/main/3.svg';
import FiveIcon from '@/assets/icons/main/5.svg';
import HyphenIcon from '@/assets/icons/main/hypen.svg';
import SpotIcon from '@/assets/icons/main/spot.svg';

function DateDot() {
  return (
    <span
      className="inline-flex shrink-0"
      style={{ transform: 'translateY(6px) scale(0.7)', transformOrigin: 'center' }}
    >
      <img
        src={SpotIcon}
        alt=""
        aria-hidden="true"
        className="block h-[0.4rem] w-[0.5rem] max-w-none"
      />
    </span>
  );
}

export default function Intro() {
  const videoRef = useRef(null);
  const hasStoppedRef = useRef(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.currentTime = 0;
    hasStoppedRef.current = false;
    const tryPlay = () => {
      el.play().catch(() => {});
    };

    tryPlay();
    const timer = window.setTimeout(tryPlay, 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      id="intro"
      className="relative flex min-h-[48rem] flex-col bg-[#121212] px-[1.5rem] pb-[5rem] pt-[6.1875rem]"
    >
      {!videoLoaded && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[#121212]" />
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        defaultMuted
        loop={false}
        playsInline
        controls={false}
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        onLoadedData={(e) => {
          setVideoLoaded(true);
          e.currentTarget.play().catch(() => {});
        }}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (hasStoppedRef.current) return;
          if (!Number.isFinite(video.duration) || video.duration <= 0) return;
          const stopAt = Math.max(video.duration - 0.5, 0);
          if (video.currentTime >= stopAt) {
            hasStoppedRef.current = true;
            video.currentTime = stopAt;
            video.pause();
          }
        }}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-150 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src="/video/main-animation.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[0rem] z-[1] h-[58rem]"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.05) 85%, rgba(18,18,18,0.5) 90%, rgba(18,18,18,0.5) 95%, rgba(18,18,18,0.7) 97%, rgba(18,18,18,1) 100%)',
        }}
      />
      <div className="relative z-[10] flex flex-1 flex-col items-center justify-between">
        <div className="flex w-[8.5625rem] flex-col items-center gap-[1.0625rem] text-center">
          <img src={HatIcon} alt="" aria-hidden="true" className="h-auto w-[2.3125rem]" />
          <div className="w-full">
            <p className="text-[0.75rem] leading-[1.024rem] text-white tracking-[-0.015rem] [font-family:Pretendard] whitespace-nowrap">
              <span className="font-medium">2026 </span>
              <span className="font-bold">서경대학교</span>
              <span className="font-medium"> 대동제</span>
            </p>
            <div className="mt-[0.375rem] h-[0.03125rem] w-full bg-[#FFFFFF]" />
            <div className="mt-[0.8125rem] flex items-center justify-center gap-[0.0625rem]">
              <img src={ZeroIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <img src={FiveIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <DateDot />
              <img src={OneIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <img src={ThreeIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <img src={HyphenIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <img src={ZeroIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <img src={FiveIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <DateDot />
              <img src={OneIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
              <img src={FiveIcon} alt="" aria-hidden="true" className="h-auto w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
