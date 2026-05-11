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
      style={{ transform: 'translateY(6px) scale(0.8)', transformOrigin: 'center' }}
    >
      <img
        src={SpotIcon}
        alt=""
        aria-hidden="true"
        className="block h-[0.5rem] w-[0.6rem] max-w-none"
      />
    </span>
  );
}

export default function Intro() {
  const videoRef = useRef(null);
  const hasStoppedRef = useRef(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  /** 리로드나 재라우팅 시 새 media 요소로 캐시된 재생 위치 섞임 방지 */
  const [videoMountKey] = useState(
    () => globalThis.crypto?.randomUUID?.() ?? `intro-video-${Date.now()}`
  );

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute('muted', '');
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', 'true');
    hasStoppedRef.current = false;

    const attemptPlay = () => {
      if (hasStoppedRef.current) return;
      if (!el.paused) return;
      el.play().catch(() => {});
    };

    attemptPlay();
    const retryTimers = [160, 450, 900].map((ms) => window.setTimeout(attemptPlay, ms));
    const retryInterval = window.setInterval(attemptPlay, 300);
    const stopRetryTimer = window.setTimeout(() => window.clearInterval(retryInterval), 4200);

    return () => {
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(retryInterval);
      window.clearTimeout(stopRetryTimer);
    };
  }, []);

  useEffect(() => {
    const onPageShow = (e) => {
      if (!e.persisted) return;
      const el = videoRef.current;
      if (!el) return;
      hasStoppedRef.current = false;
      setVideoPlaying(false);
      el.pause();
      el.currentTime = 0;
      el.play().catch(() => {});
    };
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;
      const el = videoRef.current;
      if (!el || hasStoppedRef.current) return;
      el.play().catch(() => {});
    };
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const tryPlayFromUserGesture = () => {
    if (hasStoppedRef.current) return;
    const el = videoRef.current;
    if (!el || videoPlaying) return;
    el.muted = true;
    el.defaultMuted = true;
    el.play().catch(() => {});
  };

  return (
    <section
      id="intro"
      className="relative flex min-h-[48rem] flex-col bg-[#121212] px-[1.5rem] pb-[5rem] pt-[4.5rem]"
      onPointerDownCapture={tryPlayFromUserGesture}
    >
      <img
        src="/images/main-poster.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <video
        key={videoMountKey}
        ref={videoRef}
        autoPlay
        muted
        defaultMuted
        playsInline
        controls={false}
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        onPlaying={() => setVideoPlaying(true)}
        onError={() => setVideoPlaying(false)}
        onLoadedData={(e) => {
          const v = e.currentTarget;
          v.muted = true;
          v.defaultMuted = true;
          v.play().catch(() => {});
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
        style={{ top: '-12px' }}
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-full w-full object-cover transition-opacity duration-150 ${
          videoPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src="/video/main-animation-no-audio.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            'linear-gradient(187.071deg, rgb(31, 6, 5) 1%, rgb(213, 39, 45) 24%, rgba(255, 120, 0, 0) 40%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,18,18,0) 0%, rgba(18,18,18,0) 72%, rgba(151,35,42,0.72) 92%, rgba(0,0,0,0.95) 99%)',
        }}
      />
      <div className="relative z-[10] flex flex-1 flex-col items-center justify-between">
        <div className="flex w-[8.5625rem] flex-col items-center gap-[1.0625rem] text-center">
          <img src={HatIcon} alt="" aria-hidden="true" className="h-auto w-[2.3125rem]" />
          <div className="w-full">
            <p className="text-[0.9rem] leading-[1.425rem] text-white tracking-[-0.005rem] [font-family:Inter] whitespace-nowrap">
              <span className="font-medium">2026 </span>
              <span className="font-bold">서경대학교</span>
              <span className="font-medium"> 대동제</span>
            </p>
            <div className="relative left-1/2 mt-[0.375rem] h-[0.03125rem] w-[10.5rem] -translate-x-1/2 bg-[#FFFFFF]" />
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
