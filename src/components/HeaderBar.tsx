import React from 'react';
import { Camera, Info, RotateCcw, Globe, Sparkles } from 'lucide-react';
import { ColorVariant } from '../types/iphone';

interface HeaderBarProps {
  currentColor: ColorVariant;
  isUzbek: boolean;
  onToggleLanguage: () => void;
  onOpenSpecs: () => void;
  onCaptureScreenshot: () => void;
  onResetView: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentColor,
  isUzbek,
  onToggleLanguage,
  onOpenSpecs,
  onCaptureScreenshot,
  onResetView,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Brand & Model Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-neutral-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-neutral-800/80 shadow-lg">
          <svg className="w-5 h-5 text-white" viewBox="0 0 170 170" fill="currentColor">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.85-11.96-14.42-5.77-8.91-10.36-19.14-13.78-30.68-3.42-11.54-5.13-22.38-5.13-32.53 0-14.77 3.59-26.83 10.77-36.17 7.18-9.34 16.5-14.13 27.95-14.37 4.9 0 10.15 1.25 15.75 3.75 5.6 2.5 9.49 3.8 11.67 3.91 1.74 0 5.88-1.42 12.43-4.26 6.54-2.84 12.06-4.14 16.55-3.9 12.42.76 22.35 5.39 29.8 13.88-10.89 6.64-16.22 15.89-16 27.75.22 9.58 3.92 17.52 11.1 23.82 7.18 6.3 15.77 9.8 25.77 10.51-2.07 6.42-4.68 12.98-7.83 19.68zM119.22 31.84c0-7.18 2.61-13.93 7.83-20.24 5.22-6.31 11.64-10.33 19.26-12.06.44 1.3.65 2.61.65 3.91 0 7.29-2.61 14.15-7.83 20.57-5.22 6.42-11.75 10.45-19.59 12.09-.22-1.41-.32-2.83-.32-4.27z" />
          </svg>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white tracking-tight">iPhone 13</span>
              <span
                className="inline-block w-2.5 h-2.5 rounded-full border border-white/30"
                style={{ backgroundColor: currentColor.hex }}
              />
              <span className="text-xs text-neutral-300 font-medium">
                {isUzbek ? currentColor.nameUz : currentColor.name}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Subtle Specs Pill (Desktop) */}
        <div className="hidden md:flex pointer-events-auto items-center gap-3 px-4 py-1.5 bg-neutral-950/70 backdrop-blur-md rounded-full border border-neutral-800/70 text-xs text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            {isUzbek ? "Yashil nashr" : "Green Edition"}
          </span>
          <span className="text-neutral-600">•</span>
          <span>A15 Bionic</span>
          <span className="text-neutral-600">•</span>
          <span>{isUzbek ? "Diagonal 12MP Kamera" : "Diagonal 12MP Dual"}</span>
          <span className="text-neutral-600">•</span>
          <span>Ceramic Shield</span>
        </div>

        {/* Right: Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Reset Camera View */}
          <button
            onClick={onResetView}
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur-md transition-colors"
            title={isUzbek ? "Kamerani dastlabki holatga qaytarish" : "Reset Camera"}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Screenshot Capture */}
          <button
            onClick={onCaptureScreenshot}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur-md text-xs font-medium transition-colors"
            title={isUzbek ? "Yuqori sifatli rasm olish" : "Capture Snapshot"}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isUzbek ? 'Rasm olish' : 'Snapshot'}</span>
          </button>

          {/* Specs Info Modal Trigger */}
          <button
            onClick={onOpenSpecs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 backdrop-blur-md text-xs font-medium transition-colors"
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">{isUzbek ? 'Xususiyatlar' : 'Specs'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 backdrop-blur-md text-xs font-semibold transition-colors"
            title="Tilni o'zgartirish / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>{isUzbek ? 'UZ' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
