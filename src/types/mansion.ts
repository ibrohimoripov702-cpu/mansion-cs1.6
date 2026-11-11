export type WeaponType = 'knife' | 'usp' | 'm4a1' | 'ak47' | 'awp';

export interface Weapon {
  id: WeaponType;
  name: string;
  nameUz: string;
  ammo: number;
  maxAmmo: number;
  reserveAmmo: number;
  damage: number;
  fireRate: number; // ms
  isAutomatic: boolean;
}

export type MovementMode = 'walk' | 'fly';

export interface PlayerState {
  health: number;
  armor: number;
  money: number;
  isSwimming: boolean;
  waterDepth: number; // 0 (surface) to 1 (bottom)
  isGrounded: boolean;
  isCrouching: boolean;
  oxygen: number;
  activeWeapon: WeaponType;
  movementMode: MovementMode;
}

export interface TeleportLocation {
  id: string;
  nameUz: string;
  nameEn: string;
  position: [number, number, number];
  rotation: [number, number]; // [yaw, pitch]
}
