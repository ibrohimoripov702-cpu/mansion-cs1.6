export type ColorVariantId = 'green' | 'midnight' | 'starlight' | 'blue' | 'pink' | 'red';

export interface ColorVariant {
  id: ColorVariantId;
  name: string;
  nameUz: string;
  hex: string;
  backHex: string;
  frameHex: string;
  accentHex: string;
  cameraBumpHex: string;
  metalness: number;
  roughness: number;
  description: string;
  descriptionUz: string;
}

export type LightingPreset = 'studio' | 'dark' | 'bright' | 'cyber';

export type ScreenMode = 'wallpaper' | 'camera' | 'off' | 'xray';

export type CameraPreset = 'hero' | 'front' | 'back' | 'camera_bump' | 'profile' | 'bottom';

export interface PhonePartOffsets {
  frontGlass: number;
  screenPanel: number;
  internals: number;
  battery: number;
  rearFrame: number;
  backGlass: number;
  cameraAssembly: number;
}
