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
  /** 리로드나 재라우팅 시 새 media 요소로 캐시된 재생 위치 섞임 방지 */
  const [videoMountKey] = useState(
    () => globalThis.crypto?.randomUUID?.() ?? `intro-video-${Date.now()}`
  );

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    hasStoppedRef.current = false;

    let kicked = false;
    const playFromStart = () => {
      if (kicked) return;
      kicked = true;
      el.currentTime = 0;
      hasStoppedRef.current = false;
      el.play().catch(() => {});
    };

    const onReady = () => playFromStart();
    el.addEventListener('canplay', onReady, { once: true });
    el.addEventListener('loadeddata', onReady, { once: true });
    el.load();

    const tryPlay = () => {
      el.play().catch(() => {});
    };
    const retryTimer = window.setTimeout(tryPlay, 160);

    return () => {
      el.removeEventListener('canplay', onReady);
      el.removeEventListener('loadeddata', onReady);
      window.clearTimeout(retryTimer);
    };
  }, []);

  useEffect(() => {
    const onPageShow = (e) => {
      if (!e.persisted) return;
      const el = videoRef.current;
      if (!el) return;
      hasStoppedRef.current = false;
      setVideoLoaded(false);
      el.pause();
      el.currentTime = 0;
      el.load();
      el.play().catch(() => {});
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
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
        key={videoMountKey}
        ref={videoRef}
        autoPlay
        muted
        defaultMuted
        loop={false}
        playsInline
        controls={false}
        preload="auto"
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
        className={`pointer-events-none absolute inset-0 z-[3] transition-opacity duration-150 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(187.071deg, rgb(31, 6, 5) 1%, rgb(213, 39, 45) 24%, rgba(255, 120, 0, 0) 40%)',
        }}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[4] transition-opacity duration-150 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(180deg, rgba(18,18,18,0) 0%, rgba(18,18,18,0) 72%, rgba(151,35,42,0.72) 92%, rgba(0,0,0,0.95) 99%)',
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
