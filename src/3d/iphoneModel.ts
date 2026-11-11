import * as THREE from 'three';
import { IPHONE_DIMENSIONS } from '../constants/iphoneData';
import { ColorVariant, ScreenMode } from '../types/iphone';
import {
  createIosWallpaperTexture,
  createBackGlassTexture,
  createInternalComponentsTexture,
  createCameraLensTexture,
} from './proceduralTextures';

export interface IphoneModelBundle {
  rootGroup: THREE.Group;
  updateColor: (color: ColorVariant) => void;
  updateScreenMode: (mode: ScreenMode, isUzbek: boolean) => void;
  updateExploded: (progress: number) => void;
  dispose: () => void;
}

/**
 * Creates a rounded rectangle 2D shape.
 */
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = radius;

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

/**
 * Procedurally generates the full iPhone 13 3D Model with all authentic parts.
 */
export function createIphone13Model(
  initialColor: ColorVariant,
  isSoftwareGl: boolean = false
): IphoneModelBundle {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'iPhone_13_Root';

  // Subgroups for Exploded View separation
  const frontGlassGroup = new THREE.Group();
  frontGlassGroup.name = 'Front_Glass_Group';

  const screenPanelGroup = new THREE.Group();
  screenPanelGroup.name = 'Screen_Panel_Group';

  const internalsGroup = new THREE.Group();
  internalsGroup.name = 'Internals_Group';

  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'Chassis_Group';

  const cameraAssemblyGroup = new THREE.Group();
  cameraAssemblyGroup.name = 'Camera_Assembly_Group';

  const backGlassGroup = new THREE.Group();
  backGlassGroup.name = 'Back_Glass_Group';

  rootGroup.add(frontGlassGroup);
  rootGroup.add(screenPanelGroup);
  rootGroup.add(internalsGroup);
  rootGroup.add(chassisGroup);
  rootGroup.add(cameraAssemblyGroup);
  rootGroup.add(backGlassGroup);

  // Reusable materials list for disposal
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  const { width, height, depth, cornerRadius, bumpSize, bumpDepth, lensRadius } = IPHONE_DIMENSIONS;

  // -------------------------------------------------------------
  // 1. ALUMINUM CHASSIS (Flat Aerospace-grade frame)
  // -------------------------------------------------------------
  const chassisShape = createRoundedRectShape(width, height, cornerRadius);
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: depth,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.022,
    bevelThickness: 0.022,
  };
  const chassisGeometry = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
  chassisGeometry.center();
  disposables.push(chassisGeometry);

  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialColor.frameHex),
    metalness: 0.88,
    roughness: 0.28,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
  });
  disposables.push(frameMaterial);

  const chassisMesh = new THREE.Mesh(chassisGeometry, frameMaterial);
  chassisMesh.castShadow = !isSoftwareGl;
  chassisMesh.receiveShadow = !isSoftwareGl;
  chassisGroup.add(chassisMesh);

  // Antenna bands (4 composite polymer slits on perimeter)
  const antennaMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(initialColor.frameHex).multiplyScalar(0.7),
  });
  disposables.push(antennaMaterial);

  const antennaPositions = [
    { x: width / 2 + 0.015, y: height * 0.38, z: 0, rotZ: 0 },
    { x: width / 2 + 0.015, y: -height * 0.38, z: 0, rotZ: 0 },
    { x: -width / 2 - 0.015, y: height * 0.38, z: 0, rotZ: 0 },
    { x: -width / 2 - 0.015, y: -height * 0.38, z: 0, rotZ: 0 },
  ];
  for (const pos of antennaPositions) {
    const bandGeo = new THREE.BoxGeometry(0.02, 0.04, depth + 0.04);
    disposables.push(bandGeo);
    const bandMesh = new THREE.Mesh(bandGeo, antennaMaterial);
    bandMesh.position.set(pos.x, pos.y, pos.z);
    chassisGroup.add(bandMesh);
  }

  // -------------------------------------------------------------
  // 2. BUTTONS & PORTS
  // -------------------------------------------------------------
  // Power / Side Button (Right side)
  const powerBtnGeo = new THREE.BoxGeometry(0.05, 0.85, 0.12);
  disposables.push(powerBtnGeo);
  const powerBtn = new THREE.Mesh(powerBtnGeo, frameMaterial);
  powerBtn.position.set(width / 2 + 0.035, 0.7, 0);
  powerBtn.castShadow = !isSoftwareGl;
  chassisGroup.add(powerBtn);

  // Volume Up Button (Left side)
  const volUpGeo = new THREE.BoxGeometry(0.05, 0.52, 0.12);
  disposables.push(volUpGeo);
  const volUp = new THREE.Mesh(volUpGeo, frameMaterial);
  volUp.position.set(-width / 2 - 0.035, 1.1, 0);
  chassisGroup.add(volUp);

  // Volume Down Button (Left side)
  const volDownGeo = new THREE.BoxGeometry(0.05, 0.52, 0.12);
  disposables.push(volDownGeo);
  const volDown = new THREE.Mesh(volDownGeo, frameMaterial);
  volDown.position.set(-width / 2 - 0.035, 0.45, 0);
  chassisGroup.add(volDown);

  // Ring / Silent Switch (Left side)
  const muteSwitchGeo = new THREE.BoxGeometry(0.04, 0.28, 0.08);
  disposables.push(muteSwitchGeo);
  const muteSwitch = new THREE.Mesh(muteSwitchGeo, frameMaterial);
  muteSwitch.position.set(-width / 2 - 0.03, 1.75, 0);
  chassisGroup.add(muteSwitch);

  // SIM Tray slot (Right side lower)
  const simTrayGeo = new THREE.BoxGeometry(0.015, 0.65, 0.08);
  disposables.push(simTrayGeo);
  const simMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  disposables.push(simMat);
  const simMesh = new THREE.Mesh(simTrayGeo, simMat);
  simMesh.position.set(width / 2 + 0.02, -1.1, 0);
  chassisGroup.add(simMesh);

  // Bottom Lightning Port & Speaker Grilles
  const portGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.32, 16);
  disposables.push(portGeo);
  const portMesh = new THREE.Mesh(portGeo, simMat);
  portMesh.rotation.z = Math.PI / 2;
  portMesh.position.set(0, -height / 2 - 0.02, 0);
  chassisGroup.add(portMesh);

  // Speaker & Mic laser holes (Bottom)
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  disposables.push(holeMat);
  const holeGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.06, 8);
  disposables.push(holeGeo);

  // Left mic: 3 holes
  for (let i = 0; i < 3; i++) {
    const h = new THREE.Mesh(holeGeo, holeMat);
    h.position.set(-0.35 - i * 0.1, -height / 2 - 0.015, 0);
    chassisGroup.add(h);
  }
  // Right speaker: 5 holes
  for (let i = 0; i < 5; i++) {
    const h = new THREE.Mesh(holeGeo, holeMat);
    h.position.set(0.35 + i * 0.1, -height / 2 - 0.015, 0);
    chassisGroup.add(h);
  }

  // Pentalobe screws (2 screws flanking port)
  const screwMat = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.3 });
  disposables.push(screwMat);
  const screwGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.02, 8);
  disposables.push(screwGeo);
  const sLeft = new THREE.Mesh(screwGeo, screwMat);
  sLeft.position.set(-0.22, -height / 2 - 0.02, 0);
  const sRight = new THREE.Mesh(screwGeo, screwMat);
  sRight.position.set(0.22, -height / 2 - 0.02, 0);
  chassisGroup.add(sLeft);
  chassisGroup.add(sRight);

  // -------------------------------------------------------------
  // 3. BACK SATIN GLASS & APPLE LOGO
  // -------------------------------------------------------------
  let backGlassTex = createBackGlassTexture(initialColor.backHex, initialColor.accentHex);
  disposables.push(backGlassTex);

  const backShape = createRoundedRectShape(width - 0.04, height - 0.04, cornerRadius - 0.02);
  const backGeo = new THREE.ShapeGeometry(backShape);
  disposables.push(backGeo);

  const backGlassMat = new THREE.MeshPhysicalMaterial({
    map: backGlassTex,
    color: 0xffffff,
    metalness: 0.18,
    roughness: 0.32,
    clearcoat: 0.7,
    clearcoatRoughness: 0.22,
    reflectivity: 0.5,
  });
  disposables.push(backGlassMat);

  const backGlassMesh = new THREE.Mesh(backGeo, backGlassMat);
  backGlassMesh.rotation.y = Math.PI; // Face outwards to back
  backGlassMesh.position.set(0, 0, -depth / 2 - 0.018);
  backGlassMesh.receiveShadow = !isSoftwareGl;
  backGlassGroup.add(backGlassMesh);

  // -------------------------------------------------------------
  // 4. SIGNATURE IPHONE 13 CAMERA PLATEAU & DIAGONAL DUAL LENSES
  // -------------------------------------------------------------
  // Rounded square plateau bump (top-left on back)
  // When looking at the back of the phone, top-left is at +X (since Y-rot is 180)
  const bumpCenter = new THREE.Vector3(0.86, 2.7, -depth / 2 - bumpDepth / 2 - 0.016);
  const bumpShape = createRoundedRectShape(bumpSize, bumpSize, 0.38);
  const bumpExtrude: THREE.ExtrudeGeometryOptions = {
    depth: bumpDepth,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  };
  const bumpGeo = new THREE.ExtrudeGeometry(bumpShape, bumpExtrude);
  bumpGeo.center();
  disposables.push(bumpGeo);

  const bumpMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialColor.cameraBumpHex),
    metalness: 0.2,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });
  disposables.push(bumpMat);

  const bumpMesh = new THREE.Mesh(bumpGeo, bumpMat);
  bumpMesh.position.copy(bumpCenter);
  bumpMesh.castShadow = !isSoftwareGl;
  bumpMesh.receiveShadow = !isSoftwareGl;
  cameraAssemblyGroup.add(bumpMesh);

  // Procedural Camera Lens Texture
  const lensTex = createCameraLensTexture();
  disposables.push(lensTex);

  const lensGlassMat = new THREE.MeshPhysicalMaterial({
    map: lensTex,
    roughness: 0.04,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
  });
  disposables.push(lensGlassMat);

  const lensRingMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialColor.frameHex).multiplyScalar(1.1),
    metalness: 0.92,
    roughness: 0.2,
  });
  disposables.push(lensRingMat);

  // iPhone 13 signature 45-degree DIAGONAL camera positions
  // Top-left lens: Wide 12MP
  // Bottom-right lens: Ultra-wide 12MP
  const diagonalOffset = 0.36;
  const cameraLenses = [
    { x: bumpCenter.x - diagonalOffset, y: bumpCenter.y + diagonalOffset, name: 'Wide 12MP (Sensor-shift OIS)' },
    { x: bumpCenter.x + diagonalOffset, y: bumpCenter.y - diagonalOffset, name: 'Ultra Wide 12MP (120° FOV)' },
  ];

  for (const cam of cameraLenses) {
    const lensGroup = new THREE.Group();
    lensGroup.position.set(cam.x, cam.y, bumpCenter.z - bumpDepth / 2 - 0.04);

    // Raised outer aluminum protective ring
    const ringGeo = new THREE.CylinderGeometry(lensRadius, lensRadius + 0.03, 0.08, 32);
    ringGeo.rotateX(Math.PI / 2);
    disposables.push(ringGeo);
    const ringMesh = new THREE.Mesh(ringGeo, lensRingMat);
    ringMesh.castShadow = !isSoftwareGl;
    lensGroup.add(ringMesh);

    // Sapphire glass element with multi-coated iris texture
    const glassGeo = new THREE.CylinderGeometry(lensRadius - 0.03, lensRadius - 0.03, 0.03, 32);
    glassGeo.rotateX(Math.PI / 2);
    disposables.push(glassGeo);
    const glassMesh = new THREE.Mesh(glassGeo, lensGlassMat);
    glassMesh.position.z = -0.035;
    lensGroup.add(glassMesh);

    cameraAssemblyGroup.add(lensGroup);
  }

  // True Tone Dual LED Flash (Top-right of camera plateau)
  const flashGroup = new THREE.Group();
  flashGroup.position.set(bumpCenter.x + diagonalOffset, bumpCenter.y + diagonalOffset, bumpCenter.z - bumpDepth / 2 - 0.01);
  const flashBezelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.03, 24);
  flashBezelGeo.rotateX(Math.PI / 2);
  disposables.push(flashBezelGeo);
  const flashBezel = new THREE.Mesh(flashBezelGeo, lensRingMat);
  flashGroup.add(flashBezel);

  const flashDomeGeo = new THREE.SphereGeometry(0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  flashDomeGeo.rotateX(-Math.PI / 2);
  disposables.push(flashDomeGeo);
  const flashMat = new THREE.MeshStandardMaterial({
    color: 0xfff4d6,
    emissive: 0xffeaad,
    emissiveIntensity: 0.45,
    roughness: 0.3,
  });
  disposables.push(flashMat);
  const flashDome = new THREE.Mesh(flashDomeGeo, flashMat);
  flashDome.position.z = -0.015;
  flashGroup.add(flashDome);
  cameraAssemblyGroup.add(flashGroup);

  // Rear Microphone Hole (Bottom-left of camera plateau)
  const rearMicGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16);
  rearMicGeo.rotateX(Math.PI / 2);
  disposables.push(rearMicGeo);
  const rearMic = new THREE.Mesh(rearMicGeo, simMat);
  rearMic.position.set(bumpCenter.x - diagonalOffset, bumpCenter.y - diagonalOffset, bumpCenter.z - bumpDepth / 2 - 0.02);
  cameraAssemblyGroup.add(rearMic);

  // -------------------------------------------------------------
  // 5. INTERNAL ARCHITECTURE (A15 Bionic, Battery, MagSafe)
  // -------------------------------------------------------------
  const internalTex = createInternalComponentsTexture();
  disposables.push(internalTex);

  const internalGeo = new THREE.PlaneGeometry(width - 0.12, height - 0.12);
  disposables.push(internalGeo);
  const internalMat = new THREE.MeshStandardMaterial({
    map: internalTex,
    roughness: 0.4,
    metalness: 0.35,
  });
  disposables.push(internalMat);

  const internalMesh = new THREE.Mesh(internalGeo, internalMat);
  internalMesh.position.set(0, 0, 0);
  internalsGroup.add(internalMesh);

  // MagSafe 3D ring accents for realistic depth
  const magRingGeo = new THREE.RingGeometry(0.85, 0.98, 48);
  disposables.push(magRingGeo);
  const magRingMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4af37, // Copper / Gold
    metalness: 0.85,
    roughness: 0.25,
    side: THREE.DoubleSide,
  });
  disposables.push(magRingMat);
  const magRing = new THREE.Mesh(magRingGeo, magRingMat);
  magRing.position.set(0, -0.4, 0.01);
  internalsGroup.add(magRing);

  // -------------------------------------------------------------
  // 6. OLED DISPLAY PANEL & NOTCH
  // -------------------------------------------------------------
  let currentScreenTex = createIosWallpaperTexture(initialColor.accentHex, 'lockscreen', true);
  disposables.push(currentScreenTex);

  const screenShape = createRoundedRectShape(width - 0.18, height - 0.18, cornerRadius - 0.08);
  const screenGeo = new THREE.ShapeGeometry(screenShape);
  disposables.push(screenGeo);

  const screenMat = new THREE.MeshBasicMaterial({
    map: currentScreenTex,
    toneMapped: false,
  });
  disposables.push(screenMat);

  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, depth / 2 + 0.016);
  screenPanelGroup.add(screenMesh);

  // iPhone 13 iconic 20% smaller FaceID Notch (Bezel area)
  // Width ~ 1.15, Height ~ 0.28
  const notchShape = new THREE.Shape();
  const nw = 1.15;
  const nh = 0.28;
  const nr = 0.12;
  notchShape.moveTo(-nw / 2, 0);
  notchShape.lineTo(-nw / 2, -nh + nr);
  notchShape.quadraticCurveTo(-nw / 2, -nh, -nw / 2 + nr, -nh);
  notchShape.lineTo(nw / 2 - nr, -nh);
  notchShape.quadraticCurveTo(nw / 2, -nh, nw / 2, -nh + nr);
  notchShape.lineTo(nw / 2, 0);
  notchShape.closePath();

  const notchGeo = new THREE.ShapeGeometry(notchShape);
  disposables.push(notchGeo);
  const notchMat = new THREE.MeshBasicMaterial({ color: 0x010203 });
  disposables.push(notchMat);
  const notchMesh = new THREE.Mesh(notchGeo, notchMat);
  notchMesh.position.set(0, height / 2 - 0.09, depth / 2 + 0.019);
  screenPanelGroup.add(notchMesh);

  // Ear speaker slit (Moved up to top bezel in iPhone 13!)
  const earSpeakerGeo = new THREE.BoxGeometry(0.48, 0.024, 0.02);
  disposables.push(earSpeakerGeo);
  const earSpeaker = new THREE.Mesh(earSpeakerGeo, simMat);
  earSpeaker.position.set(0, height / 2 - 0.065, depth / 2 + 0.02);
  screenPanelGroup.add(earSpeaker);

  // Front TrueDepth Camera & FaceID Dot Projector
  const selfieGeo = new THREE.CircleGeometry(0.045, 16);
  disposables.push(selfieGeo);
  const selfieMat = new THREE.MeshPhysicalMaterial({
    color: 0x111c30,
    metalness: 0.3,
    roughness: 0.1,
    clearcoat: 1.0,
  });
  disposables.push(selfieMat);
  const selfieCam = new THREE.Mesh(selfieGeo, selfieMat);
  selfieCam.position.set(-0.25, height / 2 - 0.2, depth / 2 + 0.02);
  screenPanelGroup.add(selfieCam);

  // Infrared sensor dot
  const irGeo = new THREE.CircleGeometry(0.035, 12);
  disposables.push(irGeo);
  const irMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  disposables.push(irMat);
  const irDot = new THREE.Mesh(irGeo, irMat);
  irDot.position.set(0.25, height / 2 - 0.2, depth / 2 + 0.02);
  screenPanelGroup.add(irDot);

  // -------------------------------------------------------------
  // 7. CERAMIC SHIELD FRONT GLASS
  // -------------------------------------------------------------
  const frontGlassShape = createRoundedRectShape(width - 0.04, height - 0.04, cornerRadius - 0.02);
  const frontGlassGeo = new THREE.ShapeGeometry(frontGlassShape);
  disposables.push(frontGlassGeo);

  const frontGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.06,
    transmission: isSoftwareGl ? 0 : 0.94,
    transparent: true,
    opacity: isSoftwareGl ? 0.28 : 0.98,
    ior: 1.52,
    reflectivity: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });
  disposables.push(frontGlassMat);

  const frontGlassMesh = new THREE.Mesh(frontGlassGeo, frontGlassMat);
  frontGlassMesh.position.set(0, 0, depth / 2 + 0.025);
  frontGlassGroup.add(frontGlassMesh);

  // -------------------------------------------------------------
  // UPDATE METHODS
  // -------------------------------------------------------------
  const updateColor = (color: ColorVariant) => {
    // Update frame & buttons
    frameMaterial.color.set(color.frameHex);
    bumpMat.color.set(color.cameraBumpHex);
    lensRingMat.color.set(new THREE.Color(color.frameHex).multiplyScalar(1.1));
    antennaMaterial.color.set(new THREE.Color(color.frameHex).multiplyScalar(0.7));

    // Update back glass texture
    const oldBackTex = backGlassMat.map;
    const newBackTex = createBackGlassTexture(color.backHex, color.accentHex);
    backGlassMat.map = newBackTex;
    backGlassMat.needsUpdate = true;
    if (oldBackTex) oldBackTex.dispose();
  };

  const updateScreenMode = (mode: ScreenMode, isUzbek: boolean) => {
    if (mode === 'off') {
      screenMesh.visible = true;
      screenMat.map = null;
      screenMat.color.set(0x020304);
      screenMat.needsUpdate = true;
      return;
    }

    if (mode === 'xray') {
      screenMesh.visible = false;
      frontGlassMesh.visible = false;
      return;
    }

    screenMesh.visible = true;
    frontGlassMesh.visible = true;
    screenMat.color.set(0xffffff);

    const oldScreenTex = screenMat.map;
    const texMode = mode === 'camera' ? 'camera' : 'lockscreen';
    const newTex = createIosWallpaperTexture(initialColor.accentHex, texMode, isUzbek);
    screenMat.map = newTex;
    screenMat.needsUpdate = true;
    if (oldScreenTex) oldScreenTex.dispose();
  };

  const updateExploded = (progress: number) => {
    // Smooth multi-layer dissection along Z axis
    // progress: 0.0 (closed) to 1.0 (fully exploded)
    frontGlassGroup.position.z = progress * 3.6;
    screenPanelGroup.position.z = progress * 2.4;
    internalsGroup.position.z = progress * 0.9;
    cameraAssemblyGroup.position.z = -progress * 1.8;
    backGlassGroup.position.z = -progress * 3.2;

    // Slight lateral spread on camera assembly and logic board for clearer visual inspection
    cameraAssemblyGroup.position.x = progress * 0.4;
    cameraAssemblyGroup.position.y = progress * 0.2;
    internalsGroup.position.x = -progress * 0.3;
  };

  const dispose = () => {
    for (const item of disposables) {
      item.dispose();
    }
  };

  return {
    rootGroup,
    updateColor,
    updateScreenMode,
    updateExploded,
    dispose,
  };
}
