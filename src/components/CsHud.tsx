import React, { useState, useEffect } from 'react';
import { PlayerState, WeaponType } from '../types/mansion';
import { Shield, Heart, Clock, DollarSign, Crosshair, Waves, Compass } from 'lucide-react';

interface CsHudProps {
  playerState: PlayerState;
  onSelectWeapon: (weapon: WeaponType) => void;
  isPointerLocked: boolean;
  onRequestPointerLock: () => void;
  isUzbek: boolean;
}

export const CsHud: React.FC<CsHudProps> = ({
  playerState,
  onSelectWeapon,
  isPointerLocked,
  onRequestPointerLock,
  isUzbek,
}) => {
  const [timerSeconds, setTimerSeconds] = useState(120);

  // Round timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `0${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const weapons: { id: WeaponType; name: string; key: string }[] = [
    { id: 'knife', name: 'Knife (Pichoq)', key: '1' },
    { id: 'usp', name: 'USP Tactical', key: '2' },
    { id: 'm4a1', name: 'M4A1-S', key: '3' },
    { id: 'ak47', name: 'AK-47', key: '4' },
    { id: 'awp', name: 'AWP Magnum', key: '5' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-mono text-emerald-400">
      {/* 1. Classic CS 1.6 Green Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative w-7 h-7 flex items-center justify-center">
          {/* Top line */}
          <div className="absolute top-0 w-0.5 h-2 bg-emerald-400 shadow-[0_0_4px_#34d399]" />
          {/* Bottom line */}
          <div className="absolute bottom-0 w-0.5 h-2 bg-emerald-400 shadow-[0_0_4px_#34d399]" />
          {/* Left line */}
          <div className="absolute left-0 w-2 h-0.5 bg-emerald-400 shadow-[0_0_4px_#34d399]" />
          {/* Right line */}
          <div className="absolute right-0 w-2 h-0.5 bg-emerald-400 shadow-[0_0_4px_#34d399]" />
          {/* Center tiny dot */}
          <div className="w-1 h-1 bg-emerald-300 rounded-full" />
        </div>
      </div>

      {/* 2. Top-Left: Classic CS 1.6 Green Translucent Radar */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-emerald-500/60 bg-emerald-950/40 backdrop-blur-sm overflow-hidden flex items-center justify-center shadow-lg">
          {/* Radar grid rings */}
          <div className="absolute inset-2 rounded-full border border-emerald-500/25" />
          <div className="absolute inset-6 rounded-full border border-emerald-500/25" />
          <div className="absolute w-full h-[1px] bg-emerald-500/30" />
          <div className="absolute h-full w-[1px] bg-emerald-500/30" />

          {/* Sweeping radar line */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent origin-center rounded-full animate-spin"
            style={{ animationDuration: '4s' }}
          />

          {/* Mansion building outline indicator */}
          <div className="absolute w-9 h-7 border border-emerald-400/80 bg-emerald-900/30" />
          {/* Swimming pool blue indicator */}
          <div className="absolute top-4 right-4 w-4 h-6 border border-cyan-400/80 bg-cyan-900/50 rounded-xs" />

          {/* Center player marker */}
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444] z-10" />

          <span className="absolute bottom-1 text-[9px] font-bold text-emerald-400/80">
            cs_mansion
          </span>
        </div>
      </div>

      {/* 3. Top-Right: Classic CS 1.6 Killfeed Simulation */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 text-[11px] font-semibold text-right">
        <div className="px-2 py-0.5 rounded bg-black/60 border border-neutral-800 text-neutral-200">
          <span className="text-blue-400">Counter-Terrorist</span>{' '}
          <span className="text-yellow-400">[AK-47]</span>{' '}
          <span className="text-red-400">Terrorist</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-black/60 border border-neutral-800 text-neutral-200">
          <span className="text-blue-400">Hostage Rescuer</span>{' '}
          <span className="text-cyan-400">🏊 POOL</span>{' '}
          <span className="text-emerald-400">SWIM</span>
        </div>
      </div>

      {/* 4. Click to Lock Mouse Prompt (if not locked) */}
      {!isPointerLocked && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button
            onClick={onRequestPointerLock}
            className="px-5 py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 animate-bounce"
          >
            <Crosshair className="w-4 h-4" />
            <span>
              {isUzbek
                ? "Ekranga bosing — Kamerani sichqoncha bilan boshqarish (Click to Play)"
                : "Click to Control Camera with Mouse (Pointer Lock)"}
            </span>
          </button>
        </div>
      )}

      {/* 5. Swimming Indicator & Underwater Oxygen */}
      {playerState.isSwimming && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 bg-cyan-950/85 border border-cyan-400/80 px-4 py-2 rounded-xl backdrop-blur-md text-cyan-200 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{isUzbek ? "SUZISH REJIMI (SWIMMING POOL)" : "SWIMMING IN POOL"}</span>
          </div>
          {/* Oxygen bar */}
          <div className="flex items-center gap-2 text-[10px]">
            <span>{isUzbek ? "Kislorod:" : "O2:"}</span>
            <div className="w-32 h-2 bg-neutral-900 rounded-full overflow-hidden border border-cyan-600/50">
              <div
                className="h-full bg-cyan-400 transition-all"
                style={{ width: `${playerState.oxygen}%` }}
              />
            </div>
            <span>{Math.round(playerState.oxygen)}%</span>
          </div>
          <span className="text-[10px] text-cyan-300/80">
            {isUzbek
              ? "Space = Yuqoriga suzish | C = Sho'ng'ish"
              : "Space = Swim Up | C = Dive Down"}
          </span>
        </div>
      )}

      {/* 6. Bottom Center: Weapon Quick Switcher */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-auto hidden sm:flex items-center gap-1.5 p-1.5 rounded-xl bg-black/75 border border-emerald-900/60 backdrop-blur-md">
        {weapons.map((w) => {
          const isSelected = playerState.activeWeapon === w.id;
          return (
            <button
              key={w.id}
              onClick={() => onSelectWeapon(w.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-neutral-950 shadow-md'
                  : 'text-emerald-400/70 hover:text-emerald-200 hover:bg-emerald-950/40'
              }`}
            >
              <span className="text-[10px] text-emerald-800 font-mono mr-1">[{w.key}]</span>
              {w.name}
            </button>
          );
        })}
      </div>

      {/* 7. Classic Bottom Status Bar: HP, Armor, Timer, Ammo, Money */}
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-shadow-cs">
        {/* Left: Health & Armor */}
        <div className="flex items-center gap-6 bg-black/60 px-4 py-2 rounded-xl border border-emerald-900/50 backdrop-blur-sm">
          {/* Health */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider">
              {playerState.health}
            </span>
          </div>
          {/* Armor */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400 fill-blue-400" />
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider">
              {playerState.armor}
            </span>
          </div>
        </div>

        {/* Center: Round Timer */}
        <div className="flex items-center gap-2 bg-black/60 px-5 py-2 rounded-xl border border-emerald-900/50 backdrop-blur-sm">
          <Clock className="w-5 h-5 text-amber-400" />
          <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-widest">
            {formatTimer(timerSeconds)}
          </span>
        </div>

        {/* Right: Ammo & Money */}
        <div className="flex items-center gap-6 bg-black/60 px-4 py-2 rounded-xl border border-emerald-900/50 backdrop-blur-sm">
          {/* Ammo */}
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider">
              {playerState.activeWeapon === 'knife' ? '—' : '30 | 90'}
            </span>
          </div>
          {/* Money */}
          <div className="flex items-center text-emerald-400">
            <DollarSign className="w-6 h-6 stroke-[3]" />
            <span className="text-2xl sm:text-3xl font-black tracking-wider">
              {playerState.money.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
