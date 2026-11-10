'use client';
// Replaces src/components/Character1ScrollCanvas.jsx

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFrameSequence, nearestLoaded } from '../hooks/useFrameSequence';
import { createFrameEaser } from '../hooks/frameEaser';

const FRAME_EASE = 0.18; // frame glide: 0.1 = floatier, 0.3 = snappier
const FOLDER = 'character1Animation';
const TOTAL_CHARACTER_FRAMES = 150;

function drawFrame(ctx, canvas, img) {
  if (!ctx || !canvas || !img || img.naturalWidth === 0) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;

  let drawW, drawH, drawX, drawY;
  if (imgRatio > canvasRatio) {
    drawW = canvas.width;
    drawH = canvas.width / imgRatio;
    drawX = 0;
    drawY = (canvas.height - drawH) / 2;
  } else {
    drawH = canvas.height;
    drawW = canvas.height * imgRatio;
    drawX = (canvas.width - drawW) / 2;
    drawY = 0;
  }
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

export default function Character1ScrollCanvas({ isLoading, triggerId = 'story' }) {
  const canvasRef = useRef(null);
  const currentFrameRef = useRef(0);
  const redrawRef = useRef(null);

  // These frames are also in LoadingScreen's critical list, so by the time the loader
  // finishes they are already in the shared cache: this call costs nothing extra.
  const { framesRef, ready } = useFrameSequence(FOLDER, TOTAL_CHARACTER_FRAMES);

  useEffect(() => {
    if (isLoading) return;

    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const targetElement = document.getElementById(triggerId) || canvas;
    if (!canvas || !targetElement) return;

    const ctx = canvas.getContext('2d');

    const draw = (index) => {
      currentFrameRef.current = index;
      drawFrame(ctx, canvas, nearestLoaded(framesRef.current, index));
    };
    redrawRef.current = () => draw(currentFrameRef.current);

    draw(0);

    // The displayed frame eases toward the scroll position (smooth on mobile/tablet too)
    const easer = createFrameEaser({ ease: FRAME_EASE, onFrame: draw });

    // Pin the entire story section so text stays fixed while character animates
    const trigger = ScrollTrigger.create({
      trigger: targetElement,
      start: 'top top',
      end: '+=1200',
      pin: true,
      pinSpacing: true,
      scrub: true, // smoothing is handled by Lenis + the frame easer, not by GSAP
      onUpdate: (self) => easer.setTarget(self.progress * (TOTAL_CHARACTER_FRAMES - 1)),
    });

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      easer.kill();
      trigger.kill();
      clearTimeout(refreshTimer);
      redrawRef.current = null;
    };
  }, [isLoading, triggerId, framesRef]);

  useEffect(() => {
    if (!ready) return;
    redrawRef.current?.();
  }, [ready]);

  return (
    <div className="w-full flex justify-center items-center py-2 relative z-10">
      <div className="relative max-h-[620px] w-full flex items-center justify-center">
        {/* Canvas for rendering 150 character animation frames with blend mode to seamlessly fit background */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="max-h-[580px] w-auto object-contain mix-blend-multiply"
        />

        {/* Floating status badge next to character */}
        <div className="absolute bottom-6 right-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-soft border border-white/60 flex items-center gap-3 animate-float-1 z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-jabee-orange" />
          <span className="text-xs font-semibold text-jabee-black">Scroll Down to commute</span>
        </div>
      </div>
    </div>
  );
}
