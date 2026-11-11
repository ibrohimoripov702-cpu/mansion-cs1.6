import React, { useState, useRef } from 'react';
import { MansionScene, MansionSceneHandle } from './3d/MansionScene';
import { CsHud } from './components/CsHud';
import { MansionOverlay } from './components/MansionOverlay';
import { TouchControls } from './components/TouchControls';
import { MovementMode, PlayerState, WeaponType } from './types/mansion';
import { Check } from 'lucide-react';

export default function App() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    health: 100,
    armor: 100,
    money: 16000,
    isSwimming: false,
    waterDepth: 0,
    isGrounded: true,
    isCrouching: false,
    oxygen: 100,
    activeWeapon: 'ak47',
    movementMode: 'walk',
  });

  const [activeWeapon, setActiveWeapon] = useState<WeaponType>('ak47');
  const [movementMode, setMovementMode] = useState<MovementMode>('walk');
  const [isPointerLocked, setIsPointerLocked] = useState<boolean>(false);
  const [isUzbek, setIsUzbek] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sceneRef = useRef<MansionSceneHandle>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTeleport = (pos: [number, number, number], rot?: [number, number]) => {
    if (sceneRef.current) {
      sceneRef.current.teleportTo(pos, rot);
      showToast(isUzbek ? "Manzilga ko'chirildi!" : "Teleported to location!");
    }
  };

  const handleSelectWeapon = (weapon: WeaponType) => {
    setActiveWeapon(weapon);
    if (sceneRef.current) {
      sceneRef.current.setWeapon(weapon);
    }
  };

  const handleToggleMovementMode = () => {
    const nextMode = movementMode === 'walk' ? 'fly' : 'walk';
    setMovementMode(nextMode);
    if (sceneRef.current) {
      sceneRef.current.setMovementMode(nextMode);
    }
    showToast(
      nextMode === 'fly'
        ? isUzbek ? "Erkin uchish rejimi (Noclip) yoqildi!" : "Fly / Noclip mode enabled!"
        : isUzbek ? "Yurish va suzish rejimi yoqildi!" : "Walk & Swim mode enabled!"
    );
  };

  const handleCaptureScreenshot = () => {
    if (!sceneRef.current) return;
    const dataUrl = sceneRef.current.captureScreenshot();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `CS16-Mansion-3D-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast(isUzbek ? "Skrinshot saqlandi!" : "Screenshot saved!");
    }
  };

  const handleRequestPointerLock = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock?.();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* 3D CS 1.6 Mansion Scene */}
      <MansionScene
        ref={sceneRef}
        onPlayerStateChange={setPlayerState}
        onPointerLockChange={setIsPointerLocked}
        activeWeapon={activeWeapon}
        movementMode={movementMode}
      />

      {/* Counter-Strike 1.6 HUD (Crosshair, HP, Armor, Ammo, Money, Radar) */}
      <CsHud
        playerState={playerState}
        onSelectWeapon={handleSelectWeapon}
        isPointerLocked={isPointerLocked}
        onRequestPointerLock={handleRequestPointerLock}
        isUzbek={isUzbek}
      />

      {/* Top Overlay Controls (Teleport, Fly/Walk toggle, Mute, Help, Lang) */}
      <MansionOverlay
        movementMode={movementMode}
        onToggleMovementMode={handleToggleMovementMode}
        onTeleport={handleTeleport}
        onCaptureScreenshot={handleCaptureScreenshot}
        isUzbek={isUzbek}
        onToggleLanguage={() => setIsUzbek(!isUzbek)}
      />

      {/* Mobile / Touch On-Screen D-pad and Action Buttons */}
      <TouchControls
        onInput={(key, val) => sceneRef.current?.setVirtualInput(key, val)}
        onFire={() => sceneRef.current?.fireWeapon()}
        onLookDelta={(dx, dy) => sceneRef.current?.addLookDelta(dx, dy)}
        isSwimming={playerState.isSwimming}
        isUzbek={isUzbek}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/95 border border-emerald-500 text-emerald-200 text-xs font-bold shadow-2xl backdrop-blur-md animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
