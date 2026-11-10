'use client';
// Replaces src/components/LoadingScreen.jsx (same prop: onComplete)
// Needs these two files in /public:
//   zubby-loader-5s.mp4        (the 4.2 s loader video)
//   zubby-loader-still.webp    (its last frame: only used if the browser blocks autoplay)

import React, { useEffect, useRef, useState } from 'react';
import { loadSequence } from '../hooks/useFrameSequence';

const VIDEO_SRC = '/zubby-loader-5s.mp4';
const STILL_SRC = '/zubby-loader-still.webp';

// Only what the first screen needs. The page itself is already rendered underneath the loader
// and keeps loading while the video plays.
const CRITICAL = [{ folder: 'character1Animation', count: 150 }];

const MAX_TIME = 5000;        // hard limit for the whole loading phase (video + bar), in ms
const END_HOLD_MS = 250;      // short rest on the video's last frame before the glass reveal
const FALLBACK_MIN_MS = 1500; // only used when the video can't play (autoplay blocked / reduced motion)
const EXIT_MS = 1100;         // length of the glass blur-out
const SKIP_ON_REPEAT_VISIT = false; // true = returning visitors in the same session skip the video

const SEEN_KEY = 'zubby-loader-seen';

export default function LoadingScreen({ onComplete }) {
  const videoRef = useRef(null);
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [useStill, setUseStill] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // ---- Should the video play at all? ----
    let seen = false;
    try { seen = SKIP_ON_REPEAT_VISIT && sessionStorage.getItem(SEEN_KEY) === '1'; } catch {}
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let skipVideo = seen || reduceMotion;
    if (skipVideo) setUseStill(true);

    // ---- Real progress of the first-screen content ----
    const total = CRITICAL.reduce((s, c) => s + c.count, 0);
    const loadedByFolder = {};
    let real = 0; // 0..1
    CRITICAL.forEach(({ folder, count }) => {
      loadedByFolder[folder] = 0;
      loadSequence(folder, count, (fraction) => {
        loadedByFolder[folder] = fraction * count;
        real = Object.values(loadedByFolder).reduce((a, b) => a + b, 0) / total;
      });
    });

    // ---- Play the video once; it rests on its last frame when it ends ----
    const video = videoRef.current;
    const start = performance.now();
    let videoDone = skipVideo;
    let videoDoneAt = skipVideo ? start : 0;

    const markDone = () => {
      if (videoDone) return;
      videoDone = true;
      videoDoneAt = performance.now();
      if (video) video.pause(); // stays frozen on the final frame
    };

    if (!skipVideo && video) {
      video.muted = true; // required for autoplay
      video.loop = false; // plays exactly one time
      video.addEventListener('ended', markDone, { once: true });
      const p = video.play();
      if (p && p.catch) {
        p.catch(() => {
          // autoplay blocked (e.g. iPhone Low Power Mode): show the final frame instead
          skipVideo = true;
          setUseStill(true);
          videoDone = true;
          videoDoneAt = performance.now();
        });
      }
    }

    // ---- Loop: drives the bar and decides when to start the glass reveal ----
    let shown = 0;
    let lastPct = -1;
    let finished = false;
    let raf;
    let exitTimer;

    const finish = () => {
      try { sessionStorage.setItem(SEEN_KEY, '1'); } catch {}
      setHidden(true);
      document.body.style.overflow = '';
      onCompleteRef.current?.();
    };

    const tick = (now) => {
      const elapsed = now - start;
      const timedOut = elapsed >= MAX_TIME;

      shown += (real - shown) * 0.1; // eased toward real progress, never jumps
      if (real >= 1 && 1 - shown < 0.002) shown = 1;

      // the bar can't run ahead of the video, so it completes exactly as the video ends
      const videoProgress = videoDone
        ? 1
        : video && video.duration ? Math.min(1, video.currentTime / video.duration) : 0;
      const fallbackCap = skipVideo ? Math.min(1, elapsed / FALLBACK_MIN_MS) : 1;
      let display = Math.min(shown, videoProgress, fallbackCap);

      if (timedOut) {
        display = 1; // hard limit reached: complete the bar
        if (barRef.current) barRef.current.style.transitionDuration = '300ms';
      }

      if (barRef.current) barRef.current.style.width = `${display * 100}%`;
      const pct = Math.floor(display * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        if (pctRef.current) pctRef.current.textContent = `${pct}%`;
      }

      const videoRested = videoDone && now - videoDoneAt >= END_HOLD_MS;
      if (!finished && ((videoRested && display >= 1) || timedOut)) {
        finished = true;
        if (video) video.pause();
        setExiting(true);
        exitTimer = setTimeout(finish, EXIT_MS + 60);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, []); // runs once; onComplete is read through the ref

  if (hidden) return null;

  const videoStyle = {
    // soften the very edges so a stray spark never shows a hard cut on wide screens
    WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 3%, #000 97%, transparent 100%)',
    maskImage: 'linear-gradient(to right, transparent 0, #000 3%, #000 97%, transparent 100%)',
  };

  return (
    <>
      <style>{`
        /* The black screen turns into frosted glass, then clears to reveal the page */
        @keyframes zubbyGlassOut {
          0%   { background-color: rgba(0,0,0,1);    -webkit-backdrop-filter: blur(0px) saturate(100%);  backdrop-filter: blur(0px) saturate(100%); }
          30%  { background-color: rgba(0,0,0,0.55); -webkit-backdrop-filter: blur(28px) saturate(150%); backdrop-filter: blur(28px) saturate(150%); }
          100% { background-color: rgba(0,0,0,0);    -webkit-backdrop-filter: blur(0px) saturate(100%);  backdrop-filter: blur(0px) saturate(100%); }
        }
        /* faint light sheen that sells the "glass" look while it is frosted */
        @keyframes zubbyGlassSheen {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes zubbyContentOut {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.97); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
        style={{
          backgroundColor: '#000000', // perfect black, same as the video's background
          pointerEvents: exiting ? 'none' : 'auto',
          animation: exiting
            ? `zubbyGlassOut ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
            : 'none',
        }}
      >
        {/* glass sheen layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.10) 100%)',
            opacity: 0,
            animation: exiting ? `zubbyGlassSheen ${EXIT_MS}ms ease-in-out forwards` : 'none',
          }}
        />

        {/* video + bar */}
        <div
          className="relative flex flex-col items-center w-full"
          style={{ animation: exiting ? 'zubbyContentOut 450ms ease-out forwards' : 'none' }}
        >
          <div
            className="relative"
            style={{ width: 'min(100vw, 62vh, 700px)', aspectRatio: '1080 / 1072' }}
          >
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain bg-black"
              style={videoStyle}
            />
            {useStill && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={STILL_SRC}
                alt=""
                className="absolute inset-0 w-full h-full object-contain bg-black"
                style={videoStyle}
              />
            )}
          </div>

          {/* loading bar: same design as before */}
          <div className="flex flex-col items-center gap-3.5 mt-2 z-10 w-full max-w-xs px-6">
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden p-0 border border-white/5">
              <div
                ref={barRef}
                className="h-full bg-gradient-to-r from-orange-600 via-jabee-orange to-amber-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_#FF6B1A]"
                style={{ width: '0%' }}
              />
            </div>
            <div className="flex items-center justify-between w-full text-xs font-semibold tracking-wider font-display">
              <span className="uppercase text-[10px] tracking-[0.2em] text-neutral-400 flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-jabee-orange animate-ping" />
                Initializing ZUBBY
              </span>
              <span ref={pctRef} className="text-white font-mono font-bold text-sm">0%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
