import React, { useState } from 'react';
import { CameraPreset, ColorVariant } from '../types/iphone';
import { Sparkles, Camera, Cpu, Shield, Smartphone } from 'lucide-react';

interface FeatureHotspotsProps {
  isUzbek: boolean;
  onSelectCamera: (preset: CameraPreset) => void;
  onSetExploded: (value: number) => void;
  onSelectColorGreen: () => void;
  currentColor: ColorVariant;
}

export const FeatureHotspots: React.FC<FeatureHotspotsProps> = ({
  isUzbek,
  onSelectCamera,
  onSetExploded,
  onSelectColorGreen,
  currentColor,
}) => {
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  const features = [
    {
      id: 'camera',
      icon: <Camera className="w-3.5 h-3.5" />,
      labelUz: 'Diagonal Kamera',
      labelEn: 'Diagonal Camera',
      detailUz: 'Ikkita 12MP linza 45° burchakda joylashtirilgan. Sensor-shift OIS bilan jihozlangan eng katta sensor.',
      detailEn: 'Dual 12MP lenses arranged diagonally at 45° with sensor-shift optical image stabilization.',
      action: () => {
        onSetExploded(0);
        onSelectCamera('camera_bump');
      },
    },
    {
      id: 'internals',
      icon: <Cpu className="w-3.5 h-3.5" />,
      labelUz: 'A15 Bionic & MagSafe',
      labelEn: 'A15 Bionic & MagSafe',
      detailUz: '16 yadroli Neural Engine, 3227 mA·s batareya va mis o\'ramli simsiz MagSafe magnit halqasi.',
      detailEn: '16-core Neural Engine, 3,227 mAh battery, and copper MagSafe wireless charging coil.',
      action: () => {
        onSetExploded(0.75);
        onSelectCamera('hero');
      },
    },
    {
      id: 'screen',
      icon: <Smartphone className="w-3.5 h-3.5" />,
      labelUz: '20% Kichik Notch',
      labelEn: '20% Smaller Notch',
      detailUz: 'Super Retina XDR OLED ekranda Face ID tirqishi 20% ga qisqartirilib, dinamik yuqori romga ko\'chirilgan.',
      detailEn: '20% smaller FaceID notch with ear speaker relocated to the top perimeter bezel.',
      action: () => {
        onSetExploded(0);
        onSelectCamera('front');
      },
    },
    {
      id: 'green_color',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
      labelUz: 'Yashil (Pine Green)',
      labelEn: 'Forest Green Finish',
      detailUz: 'To\'q ignabargli yashil mat shisha va aerokosmik yashil alyuminiy rom.',
      detailEn: 'Signature deep forest green satin glass back and matching aerospace aluminum frame.',
      action: () => {
        onSelectColorGreen();
        onSetExploded(0);
        onSelectCamera('hero');
      },
    },
  ];

  return (
    <div className="fixed top-18 right-4 z-20 hidden lg:flex flex-col gap-2 pointer-events-none">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-2 pointer-events-auto flex items-center justify-between">
        <span>{isUzbek ? 'Asosiy xususiyatlar' : 'Key Highlights'}</span>
        {activeCallout && (
          <button
            onClick={() => setActiveCallout(null)}
            className="text-[10px] text-neutral-500 hover:text-white"
          >
            {isUzbek ? 'Yopish' : 'Close'}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5 pointer-events-auto">
        {features.map((f) => {
          const isActive = activeCallout === f.id;
          return (
            <div key={f.id} className="relative group">
              <button
                onClick={() => {
                  f.action();
                  setActiveCallout(isActive ? null : f.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md border transition-all ${
                  isActive
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-lg'
                    : 'bg-neutral-950/70 border-neutral-800/80 text-neutral-300 hover:bg-neutral-900/90 hover:text-white'
                }`}
              >
                {f.icon}
                <span>{isUzbek ? f.labelUz : f.labelEn}</span>
              </button>

              {/* Detail Popover */}
              {isActive && (
                <div className="absolute right-full mr-2 top-0 w-64 p-3 bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-xl shadow-2xl text-xs text-neutral-300 animate-fadeIn z-30">
                  <p className="font-semibold text-white mb-1">
                    {isUzbek ? f.labelUz : f.labelEn}
                  </p>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {isUzbek ? f.detailUz : f.detailEn}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
