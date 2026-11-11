import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  Plane,
  Footprints,
  HelpCircle,
  Camera,
  X,
  Check,
  Globe,
  Waves,
} from 'lucide-react';
import { MovementMode, TeleportLocation, WeaponType } from '../types/mansion';
import { csAudio } from '../audio/csAudio';

interface MansionOverlayProps {
  movementMode: MovementMode;
  onToggleMovementMode: () => void;
  onTeleport: (pos: [number, number, number], rot?: [number, number]) => void;
  onCaptureScreenshot: () => void;
  isUzbek: boolean;
  onToggleLanguage: () => void;
}

const TELEPORT_LOCATIONS: TeleportLocation[] = [
  {
    id: 'ct_spawn',
    nameUz: 'CT Baza (Old hovli)',
    nameEn: 'CT Spawn (Front Yard)',
    position: [0, 1.75, 48],
    rotation: [Math.PI, 0],
  },
  {
    id: 'pool',
    nameUz: '🏊 Basseyn (Suzish joyi!)',
    nameEn: '🏊 Swimming Pool (Swim!)',
    position: [22, -0.2, -30],
    rotation: [0, 0],
  },
  {
    id: 'porch',
    nameUz: 'Mansion Oldi ustunlar',
    nameEn: 'Front Porch Pillars',
    position: [0, 1.75, 17],
    rotation: [Math.PI, 0],
  },
  {
    id: 'balcony',
    nameUz: '2-qavat Snayper Balkoni',
    nameEn: '2nd Floor Balcony',
    position: [0, 5.8, 17],
    rotation: [0, 0],
  },
  {
    id: 'hostages',
    nameUz: 'Garovdagilar xonasi',
    nameEn: 'Hostage Room',
    position: [-6, 5.8, -6],
    rotation: [-Math.PI / 2, 0],
  },
  {
    id: 'tunnel',
    nameUz: 'Yerosti Tunneli',
    nameEn: 'Underground Tunnel',
    position: [-10, -1.2, -18],
    rotation: [0, 0],
  },
];

export const MansionOverlay: React.FC<MansionOverlayProps> = ({
  movementMode,
  onToggleMovementMode,
  onTeleport,
  onCaptureScreenshot,
  isUzbek,
  onToggleLanguage,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTeleportMenu, setShowTeleportMenu] = useState(false);

  const toggleSound = () => {
    const muted = csAudio.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-4 flex items-center justify-between">
        {/* Title badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 border border-emerald-900/80 backdrop-blur-md shadow-xl text-neutral-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="font-bold text-xs sm:text-sm tracking-wide text-white">
            CS 1.6 <span className="text-emerald-400 font-mono">cs_mansion</span> 3D
          </span>
        </div>

        {/* Right Tools Bar */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Teleport Quick Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTeleportMenu(!showTeleportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-neutral-900 border border-neutral-700/80 text-xs font-semibold text-neutral-200 backdrop-blur-md transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isUzbek ? 'Joylashuv' : 'Teleport'}</span>
            </button>

            {showTeleportMenu && (
              <div className="absolute right-0 mt-2 w-56 p-1.5 rounded-xl bg-neutral-950/95 border border-neutral-800 shadow-2xl backdrop-blur-xl z-40 animate-fadeIn">
                <div className="text-[10px] font-bold text-neutral-400 uppercase px-2 py-1">
                  {isUzbek ? 'Tezkor o\'tish:' : 'Locations:'}
                </div>
                {TELEPORT_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onTeleport(loc.position, loc.rotation);
                      setShowTeleportMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      loc.id === 'pool'
                        ? 'text-cyan-300 hover:bg-cyan-950/60 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-900'
                    }`}
                  >
                    <span>{isUzbek ? loc.nameUz : loc.nameEn}</span>
                    {loc.id === 'pool' && <Waves className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Movement Mode Toggle: Walk/Swim vs Fly/Noclip */}
          <button
            onClick={onToggleMovementMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-colors ${
              movementMode === 'fly'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : 'bg-black/80 border-neutral-700/80 text-neutral-300 hover:text-white'
            }`}
            title={isUzbek ? 'Uchish / Yurish rejimini almashtirish' : 'Toggle Fly / Walk Mode'}
          >
            {movementMode === 'fly' ? <Plane className="w-3.5 h-3.5" /> : <Footprints className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {movementMode === 'fly'
                ? isUzbek ? 'Uchish (Fly)' : 'Noclip'
                : isUzbek ? 'Yurish & Suzish' : 'Walk & Swim'}
            </span>
          </button>

          {/* Screenshot */}
          <button
            onClick={onCaptureScreenshot}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-black/80 hover:bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white backdrop-blur-md text-xs font-medium transition-colors"
            title={isUzbek ? 'Skrinshot olish' : 'Capture Screenshot'}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Audio Mute / Unmute */}
          <button
            onClick={toggleSound}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-black/80 hover:bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white backdrop-blur-md text-xs font-medium transition-colors"
            title={isMuted ? 'Ovozni yoqish' : 'Ovozni o\'chirish'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Help Modal Trigger */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-black/80 hover:bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white backdrop-blur-md text-xs font-medium transition-colors"
            title={isUzbek ? 'Boshqaruv tugmalari' : 'Controls Guide'}
          >
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {/* Language Switch */}
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1.5 rounded-xl bg-black/80 hover:bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white backdrop-blur-md text-xs font-bold transition-colors"
          >
            {isUzbek ? 'UZ' : 'EN'}
          </button>
        </div>
      </div>

      {/* Controls & Help Guide Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-5 text-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Footprints className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">
                  {isUzbek ? 'Boshqaruv qo\'llanmasi (CS 1.6 Mansion)' : 'Controls Guide (CS 1.6 Mansion)'}
                </h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                  <span className="font-mono text-emerald-400 font-bold block mb-1">W, A, S, D</span>
                  <span className="text-neutral-400">
                    {isUzbek ? 'Oldinga, orqaga, chapga, o\'ngga harakatlanish' : 'Move Forward / Back / Left / Right'}
                  </span>
                </div>
                <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                  <span className="font-mono text-emerald-400 font-bold block mb-1">
                    {isUzbek ? 'Sichqoncha (Mouse)' : 'Mouse Look'}
                  </span>
                  <span className="text-neutral-400">
                    {isUzbek ? 'Atrofga 360° qarash (Ekranga bosing)' : 'Look around in 360° (Click canvas)'}
                  </span>
                </div>
                <div className="bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-800/60 col-span-2">
                  <span className="font-mono text-cyan-300 font-bold block mb-1">
                    🌊 {isUzbek ? 'Basseyn va Suzish (Swimming Physics):' : 'Swimming Physics in Pool:'}
                  </span>
                  <span className="text-cyan-200/80 leading-relaxed block">
                    {isUzbek
                      ? "Basseyn suvida suzishingiz mumkin! Space = Yuqoriga suzish, C yoki Ctrl = Pastga sho'ng'ish. Suv ostida kislorod sarflanadi."
                      : "Jump into the swimming pool! Press Space to swim upward, C/Ctrl to dive down. Oxygen depletes when underwater."}
                  </span>
                </div>
                <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                  <span className="font-mono text-emerald-400 font-bold block mb-1">
                    {isUzbek ? 'Chap tugma (Click)' : 'Left Click'}
                  </span>
                  <span className="text-neutral-400">
                    {isUzbek ? 'Qurol bilan o\'q uzish / Pichoq zarbasi' : 'Fire weapon / Knife slash'}
                  </span>
                </div>
                <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-800">
                  <span className="font-mono text-emerald-400 font-bold block mb-1">1, 2, 3, 4, 5</span>
                  <span className="text-neutral-400">
                    {isUzbek ? 'Pichoq, USP, M4A1, AK-47, AWP tanlash' : 'Switch weapons (Knife, USP, M4, AK, AWP)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs"
              >
                {isUzbek ? 'Tushunarli, o\'ynash!' : 'Got it, let\'s play!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
