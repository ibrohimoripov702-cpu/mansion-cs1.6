import React, { useRef } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Crosshair, ArrowUp, ArrowDown } from 'lucide-react';

interface TouchControlsProps {
  onInput: (key: string, value: boolean) => void;
  onFire: () => void;
  onLookDelta: (dx: number, dy: number) => void;
  isSwimming: boolean;
  isUzbek: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onInput,
  onFire,
  onLookDelta,
  isSwimming,
  isUzbek,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Swipe-to-look touch handler
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    onLookDelta(dx, dy);
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-4">
      {/* Right side swipe area for camera look (only on mobile) */}
      <div
        className="absolute top-20 right-4 w-1/2 h-3/5 pointer-events-auto rounded-3xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Controls (Mobile/Touch only) */}
      <div className="flex items-end justify-between pointer-events-auto sm:hidden pb-14">
        {/* Left D-pad Movement */}
        <div className="relative w-32 h-32 bg-black/50 border border-neutral-700/60 rounded-full p-2 flex items-center justify-center backdrop-blur-md">
          {/* Up */}
          <button
            onPointerDown={() => onInput('forward', true)}
            onPointerUp={() => onInput('forward', false)}
            onPointerLeave={() => onInput('forward', false)}
            className="absolute top-1 w-10 h-10 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center text-white"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          {/* Down */}
          <button
            onPointerDown={() => onInput('backward', true)}
            onPointerUp={() => onInput('backward', false)}
            onPointerLeave={() => onInput('backward', false)}
            className="absolute bottom-1 w-10 h-10 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center text-white"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
          {/* Left */}
          <button
            onPointerDown={() => onInput('left', true)}
            onPointerUp={() => onInput('left', false)}
            onPointerLeave={() => onInput('left', false)}
            className="absolute left-1 w-10 h-10 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          {/* Right */}
          <button
            onPointerDown={() => onInput('right', true)}
            onPointerUp={() => onInput('right', false)}
            onPointerLeave={() => onInput('right', false)}
            className="absolute right-1 w-10 h-10 bg-neutral-800/80 active:bg-emerald-600 rounded-lg flex items-center justify-center text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col items-end gap-2.5">
          {/* Fire / Shoot Button */}
          <button
            onPointerDown={onFire}
            className="w-14 h-14 rounded-full bg-red-600 active:bg-red-500 border-2 border-red-400 text-white flex items-center justify-center shadow-lg active:scale-95"
          >
            <Crosshair className="w-7 h-7" />
          </button>

          <div className="flex items-center gap-2">
            {/* Swim / Jump Up */}
            <button
              onPointerDown={() => onInput(isSwimming ? 'swimUp' : 'jump', true)}
              onPointerUp={() => onInput(isSwimming ? 'swimUp' : 'jump', false)}
              onPointerLeave={() => onInput(isSwimming ? 'swimUp' : 'jump', false)}
              className="w-12 h-12 rounded-full bg-emerald-700 active:bg-emerald-600 border border-emerald-400 text-white flex flex-col items-center justify-center text-[10px] font-bold"
            >
              <ArrowUp className="w-4 h-4" />
              <span>{isSwimming ? 'SUZISH' : 'SAKRASH'}</span>
            </button>

            {/* Dive / Crouch Down */}
            <button
              onPointerDown={() => onInput(isSwimming ? 'swimDown' : 'crouch', true)}
              onPointerUp={() => onInput(isSwimming ? 'swimDown' : 'crouch', false)}
              onPointerLeave={() => onInput(isSwimming ? 'swimDown' : 'crouch', false)}
              className="w-12 h-12 rounded-full bg-neutral-800 active:bg-neutral-700 border border-neutral-600 text-white flex flex-col items-center justify-center text-[10px] font-bold"
            >
              <ArrowDown className="w-4 h-4" />
              <span>{isSwimming ? "SHO'NG'ISH" : "O'TIRISH"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
