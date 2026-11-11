import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Palette,
  Camera,
  Sun,
  RotateCw,
  Eye,
  Sliders,
  Check,
  Smartphone,
} from 'lucide-react';
import { ColorVariant, LightingPreset, ScreenMode, CameraPreset } from '../types/iphone';
import { COLOR_VARIANTS, CAMERA_PRESETS, LIGHTING_PRESETS } from '../constants/iphoneData';

interface BottomControlDockProps {
  currentColor: ColorVariant;
  onSelectColor: (color: ColorVariant) => void;
  lightingPreset: LightingPreset;
  onSelectLighting: (preset: LightingPreset) => void;
  screenMode: ScreenMode;
  onSelectScreenMode: (mode: ScreenMode) => void;
  explodedProgress: number;
  onExplodedChange: (value: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  isUzbek: boolean;
}

type TabType = 'exploded' | 'colors' | 'camera' | 'studio';

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  currentColor,
  onSelectColor,
  lightingPreset,
  onSelectLighting,
  screenMode,
  onSelectScreenMode,
  explodedProgress,
  onExplodedChange,
  autoRotate,
  onToggleAutoRotate,
  onSelectCameraPreset,
  isUzbek,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('colors');

  const tabs: { id: TabType; labelUz: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'colors', labelUz: 'Ranglar', labelEn: 'Finishes', icon: <Palette className="w-4 h-4" /> },
    { id: 'exploded', labelUz: 'Qismlar (3D)', labelEn: 'Exploded View', icon: <Layers className="w-4 h-4" /> },
    { id: 'camera', labelUz: 'Rakurslar', labelEn: 'Angles', icon: <Camera className="w-4 h-4" /> },
    { id: 'studio', labelUz: 'Yoritish & Ekran', labelEn: 'Studio & Display', icon: <Sun className="w-4 h-4" /> },
  ];

  return (
    <div
      className="fixed z-30 transition-transform duration-300 ease-out"
      style={{
        bottom: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isOpen ? '0' : 'calc(100% - 38px)'})`,
        width: 'min(940px, 95vw)',
      }}
    >
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 bg-neutral-900/90 border border-neutral-700/80 shadow-lg hover:text-white hover:bg-neutral-800 transition-colors backdrop-blur-md"
        >
          {isOpen ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>{isUzbek ? 'Boshqaruvni yashirish' : 'Hide Controls'}</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>{isUzbek ? 'Boshqaruv paneli' : 'Show Controls'}</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Dock Container */}
      <div className="bg-neutral-950/85 backdrop-blur-xl border border-neutral-800/80 rounded-2xl shadow-2xl p-3 sm:p-4 text-white">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-800/70 pb-2.5 mb-3 gap-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  {tab.icon}
                  <span>{isUzbek ? tab.labelUz : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Turntable Toggle */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
              autoRotate
                ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title={isUzbek ? "Avtomatik 360° aylantirish" : "Auto 360° Turntable"}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">{isUzbek ? '360° Aylanish' : 'Turntable'}</span>
          </button>
        </div>

        {/* Tab 1: Colors & Finishes */}
        {activeTab === 'colors' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">
                {isUzbek ? "Tanlangan rang: " : "Current finish: "}
                <strong className="text-emerald-400 font-semibold">{isUzbek ? currentColor.nameUz : currentColor.name}</strong>
              </span>
              {currentColor.id === 'green' && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-400 border border-emerald-700/50">
                  {isUzbek ? '⭐ Asosiy so\'ralgan model' : '⭐ Requested Model'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLOR_VARIANTS.map((c) => {
                const isSelected = currentColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectColor(c)}
                    className={`relative flex flex-col items-center p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/30 ring-1 ring-emerald-500/50'
                        : 'border-neutral-800/90 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/80'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-full shadow-inner mb-1.5 flex items-center justify-center border border-white/20" style={{ backgroundColor: c.hex }}>
                      {isSelected && <Check className={`w-4 h-4 ${c.id === 'starlight' || c.id === 'pink' ? 'text-neutral-900' : 'text-white'}`} />}
                    </div>
                    <span className="text-xs font-medium text-neutral-200 truncate w-full text-center">
                      {isUzbek ? c.nameUz.split(' ')[0] : c.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 truncate w-full text-center">
                      {c.id === 'green' ? 'Forest' : c.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Exploded View / Qismlarga ajratish */}
        {activeTab === 'exploded' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                {isUzbek ? 'Qatlamlarni ajratish (Dissection):' : 'Exploded separation distance:'}
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {Math.round(explodedProgress * 100)}%
              </span>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">{isUzbek ? 'Yopiq' : 'Solid'}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedProgress}
                onChange={(e) => onExplodedChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs text-neutral-400">{isUzbek ? 'Ochiq' : 'Exploded'}</span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onExplodedChange(0)}
                className={`flex-1 py-1 px-2 text-xs rounded-lg border transition-colors ${
                  explodedProgress === 0
                    ? 'bg-neutral-800 text-white border-neutral-600'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                0% ({isUzbek ? 'Yig\'ilgan' : 'Assembled'})
              </button>
              <button
                onClick={() => onExplodedChange(0.5)}
                className={`flex-1 py-1 px-2 text-xs rounded-lg border transition-colors ${
                  explodedProgress > 0.3 && explodedProgress < 0.7
                    ? 'bg-neutral-800 text-white border-neutral-600'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                50% ({isUzbek ? 'Yarim' : 'Half'})
              </button>
              <button
                onClick={() => onExplodedChange(1)}
                className={`flex-1 py-1 px-2 text-xs rounded-lg border transition-colors ${
                  explodedProgress === 1
                    ? 'bg-neutral-800 text-white border-neutral-600'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                100% ({isUzbek ? 'To\'liq ichki tuzilma' : 'Full Architecture'})
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Camera Angles */}
        {activeTab === 'camera' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-neutral-400">
              {isUzbek ? 'Kamerani yo\'naltirish (Kinematik silliq o\'tish):' : 'Cinematic camera angles:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {CAMERA_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectCameraPreset(p.id)}
                  className="px-2.5 py-2 rounded-xl text-xs font-medium bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/90 hover:border-neutral-700 text-neutral-200 transition-colors text-center"
                >
                  {isUzbek ? p.labelUz : p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Studio Lighting & Display State */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Lighting */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-400 font-medium">{isUzbek ? 'Yoritish muhiti:' : 'Studio Lighting:'}</span>
              <div className="grid grid-cols-2 gap-1.5">
                {LIGHTING_PRESETS.map((lp) => {
                  const isSelected = lightingPreset === lp.id;
                  return (
                    <button
                      key={lp.id}
                      onClick={() => onSelectLighting(lp.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-neutral-900/50 border-neutral-800 text-neutral-300 hover:bg-neutral-900'
                      }`}
                    >
                      <span>{isUzbek ? lp.labelUz : lp.label}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display State */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-400 font-medium">{isUzbek ? 'Ekran holati:' : 'Display State:'}</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'wallpaper', labelUz: 'Qulflangan ekran', labelEn: 'Lock Screen' },
                  { id: 'camera', labelUz: 'Kamera rejimi', labelEn: 'Camera View' },
                  { id: 'off', labelUz: 'Ekran o\'chiq', labelEn: 'Screen Off' },
                  { id: 'xray', labelUz: 'Ichki Rentgen', labelEn: 'Internal X-Ray' },
                ].map((s) => {
                  const isSelected = screenMode === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectScreenMode(s.id as ScreenMode)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-neutral-900/50 border-neutral-800 text-neutral-300 hover:bg-neutral-900'
                      }`}
                    >
                      <span>{isUzbek ? s.labelUz : s.labelEn}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
