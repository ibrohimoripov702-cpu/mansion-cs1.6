import * as THREE from 'three';
import { WeaponType } from '../types/mansion';

export class CsViewModel {
  public group: THREE.Group;
  private currentWeapon: WeaponType = 'ak47';
  private weaponMeshes: Map<WeaponType, THREE.Group> = new Map();
  private muzzleFlash: THREE.PointLight;
  private recoilZ: number = 0;
  private bobTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'CS_ViewModel';
    // Offset viewmodel in front of camera
    this.group.position.set(0.32, -0.28, -0.65);

    // Muzzle flash light
    this.muzzleFlash = new THREE.PointLight(0xffaa22, 0, 8);
    this.muzzleFlash.position.set(0.35, -0.15, -1.2);
    this.group.add(this.muzzleFlash);

    this.createWeapons();
    this.setWeapon('ak47');
  }

  private createWeapons() {
    // 1. AK-47
    const akGroup = new THREE.Group();
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1f2326, metalness: 0.8, roughness: 0.3 });
    const woodStock = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

    // Receiver & barrel
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.55), darkMetal);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12), darkMetal);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.04, -0.42);

    // Wooden stock
    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.32), woodStock);
    stock.position.set(0, -0.04, 0.38);

    // Curved banana magazine
    const magMat = new THREE.MeshStandardMaterial({ color: 0x332a22, metalness: 0.5 });
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.12), magMat);
    mag.rotation.x = -0.35;
    mag.position.set(0, -0.18, -0.08);

    akGroup.add(receiver, barrel, stock, mag);
    this.weaponMeshes.set('ak47', akGroup);
    this.group.add(akGroup);

    // 2. M4A1 (with suppressor)
    const m4Group = new THREE.Group();
    const m4Metal = new THREE.MeshStandardMaterial({ color: 0x181a1c, metalness: 0.9, roughness: 0.25 });
    const m4Rec = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.11, 0.48), m4Metal);
    const silencer = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.38, 16), m4Metal);
    silencer.rotation.x = Math.PI / 2;
    silencer.position.set(0, 0.03, -0.5);
    const m4Stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.28), m4Metal);
    m4Stock.position.set(0, -0.03, 0.32);
    m4Group.add(m4Rec, silencer, m4Stock);
    this.weaponMeshes.set('m4a1', m4Group);
    this.group.add(m4Group);

    // 3. USP Tactical
    const uspGroup = new THREE.Group();
    const uspSlide = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.26), darkMetal);
    const uspGrip = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.16, 0.09), darkMetal);
    uspGrip.position.set(0, -0.1, 0.08);
    const uspSil = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.24, 12), darkMetal);
    uspSil.rotation.x = Math.PI / 2;
    uspSil.position.set(0, 0.015, -0.24);
    uspGroup.add(uspSlide, uspGrip, uspSil);
    this.weaponMeshes.set('usp', uspGroup);
    this.group.add(uspGroup);

    // 4. AWP Sniper Rifle
    const awpGroup = new THREE.Group();
    const awpGreen = new THREE.MeshStandardMaterial({ color: 0x3f4f38, roughness: 0.5 });
    const awpBody = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.75), awpGreen);
    const awpBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.65, 12), darkMetal);
    awpBarrel.rotation.x = Math.PI / 2;
    awpBarrel.position.set(0, 0.04, -0.65);
    // Scope
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.32, 16), darkMetal);
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0, 0.12, -0.1);
    awpGroup.add(awpBody, awpBarrel, scope);
    this.weaponMeshes.set('awp', awpGroup);
    this.group.add(awpGroup);

    // 5. Knife
    const knifeGroup = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.15 });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, 0.35), bladeMat);
    blade.position.set(0, 0.02, -0.18);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 8), darkMetal);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(0, 0, 0.08);
    knifeGroup.add(blade, handle);
    this.weaponMeshes.set('knife', knifeGroup);
    this.group.add(knifeGroup);
  }

  public setWeapon(type: WeaponType) {
    this.currentWeapon = type;
    this.weaponMeshes.forEach((mesh, key) => {
      mesh.visible = key === type;
    });
  }

  public triggerRecoil() {
    this.recoilZ = 0.08;
    this.muzzleFlash.intensity = 2.5;
    setTimeout(() => {
      this.muzzleFlash.intensity = 0;
    }, 45);
  }

  public update(delta: number, isMoving: boolean) {
    // Return from recoil
    this.recoilZ = THREE.MathUtils.damp(this.recoilZ, 0, 16.0, delta);

    // Weapon sway / bobbing while moving
    if (isMoving) {
      this.bobTime += delta * 10;
    } else {
      this.bobTime += delta * 2;
    }

    const bobX = Math.cos(this.bobTime * 0.5) * (isMoving ? 0.015 : 0.003);
    const bobY = Math.abs(Math.sin(this.bobTime)) * (isMoving ? 0.018 : 0.004);

    this.group.position.set(0.32 + bobX, -0.28 + bobY, -0.65 + this.recoilZ);
  }
}
