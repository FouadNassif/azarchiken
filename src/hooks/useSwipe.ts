"use client";

import { useRef } from "react";

const SWIPE_DISTANCE_THRESHOLD = 45;
const SWIPE_VELOCITY_THRESHOLD = 0.25;
const OFF_AXIS_TOLERANCE = 60;

/**
 * Detects a deliberate horizontal swipe (fast, mostly-horizontal drag) without
 * hijacking vertical scrolling or ordinary taps on buttons/inputs inside the area.
 */
export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const origin = start.current;
    start.current = null;
    if (!origin) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;
    const dt = Math.max(Date.now() - origin.t, 1);

    if (Math.abs(dy) > OFF_AXIS_TOLERANCE) return;
    if (Math.abs(dx) < SWIPE_DISTANCE_THRESHOLD) return;

    const velocity = Math.abs(dx) / dt;
    if (velocity < SWIPE_VELOCITY_THRESHOLD && Math.abs(dx) < 90) return;

    if (dx < 0) onSwipeLeft();
    else onSwipeRight();
  };

  return { onTouchStart, onTouchEnd };
}
