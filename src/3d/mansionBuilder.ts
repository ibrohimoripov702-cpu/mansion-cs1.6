import * as THREE from 'three';
import {
  createBrickTexture,
  createWoodCrateTexture,
  createPoolTilesTexture,
  createWaterTexture,
  createGrassTexture,
  createConcreteTexture,
  createWoodFloorTexture,
  createCctvTexture,
} from './csTextures';

export interface PoolVolume {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  surfaceY: number;
}

export interface MansionMapData {
  sceneGroup: THREE.Group;
  collisionBoxes: THREE.Box3[];
  poolVolume: PoolVolume;
  waterMesh: THREE.Mesh;
  hostageMeshes: THREE.Group[];
  update: (delta: number) => void;
  dispose: () => void;
}

export function buildCsMansion(isSoftwareGl: boolean = false): MansionMapData {
  const sceneGroup = new THREE.Group();
  sceneGroup.name = 'CS_Mansion_Map';

  const collisionBoxes: THREE.Box3[] = [];
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // Helper to add a collision box
  function addCollider(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number) {
    collisionBoxes.push(new THREE.Box3(
      new THREE.Vector3(minX, minY, minZ),
      new THREE.Vector3(maxX, maxY, maxZ)
    ));
  }

  // 1. Textures & Materials
  const brickTex = createBrickTexture();
  brickTex.repeat.set(4, 2);
  disposables.push(brickTex);

  const brickMat = new THREE.MeshStandardMaterial({
    map: brickTex,
    roughness: 0.85,
    metalness: 0.05,
  });
  disposables.push(brickMat);

  const crateTex = createWoodCrateTexture();
  disposables.push(crateTex);
  const crateMat = new THREE.MeshStandardMaterial({
    map: crateTex,
    roughness: 0.75,
    metalness: 0.1,
  });
  disposables.push(crateMat);

  const grassTex = createGrassTexture();
  grassTex.repeat.set(16, 16);
  disposables.push(grassTex);
  const grassMat = new THREE.MeshStandardMaterial({
    map: grassTex,
    roughness: 0.9,
    metalness: 0.02,
  });
  disposables.push(grassMat);

  const concreteTex = createConcreteTexture();
  concreteTex.repeat.set(8, 8);
  disposables.push(concreteTex);
  const concreteMat = new THREE.MeshStandardMaterial({
    map: concreteTex,
    roughness: 0.8,
    metalness: 0.1,
  });
  disposables.push(concreteMat);

  const woodFloorTex = createWoodFloorTexture();
  woodFloorTex.repeat.set(6, 6);
  disposables.push(woodFloorTex);
  const woodFloorMat = new THREE.MeshStandardMaterial({
    map: woodFloorTex,
    roughness: 0.6,
    metalness: 0.05,
  });
  disposables.push(woodFloorMat);

  const poolTilesTex = createPoolTilesTexture();
  poolTilesTex.repeat.set(8, 8);
  disposables.push(poolTilesTex);
  const poolTilesMat = new THREE.MeshStandardMaterial({
    map: poolTilesTex,
    roughness: 0.2,
    metalness: 0.1,
  });
  disposables.push(poolTilesMat);

  const waterTex = createWaterTexture();
  disposables.push(waterTex);
  const waterMat = new THREE.MeshStandardMaterial({
    map: waterTex,
    color: 0x2ae0ff,
    transparent: true,
    opacity: 0.72,
    roughness: 0.08,
    metalness: 0.2,
  });
  disposables.push(waterMat);

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x5a2d18,
    roughness: 0.85,
  });
  disposables.push(roofMat);

  // -------------------------------------------------------------
  // 2. GROUND & SURROUNDING PERIMETER WALLS
  // -------------------------------------------------------------
  // Yard Ground Plane
  const groundGeo = new THREE.PlaneGeometry(100, 130);
  groundGeo.rotateX(-Math.PI / 2);
  disposables.push(groundGeo);
  const groundMesh = new THREE.Mesh(groundGeo, grassMat);
  groundMesh.position.set(0, 0, 0);
  groundMesh.receiveShadow = !isSoftwareGl;
  sceneGroup.add(groundMesh);

  // Driveway / Sidewalk from CT Spawn to Mansion front porch
  const driveGeo = new THREE.PlaneGeometry(10, 40);
  driveGeo.rotateX(-Math.PI / 2);
  disposables.push(driveGeo);
  const driveMesh = new THREE.Mesh(driveGeo, concreteMat);
  driveMesh.position.set(0, 0.02, 38);
  driveMesh.receiveShadow = !isSoftwareGl;
  sceneGroup.add(driveMesh);

  // High Perimeter Stone Walls (Keeps player inside the estate)
  const wallH = 8;
  const wallThick = 2;

  // North wall (Back)
  const nWallGeo = new THREE.BoxGeometry(100, wallH, wallThick);
  disposables.push(nWallGeo);
  const nWall = new THREE.Mesh(nWallGeo, brickMat);
  nWall.position.set(0, wallH / 2, -64);
  sceneGroup.add(nWall);
  addCollider(-50, 0, -65, 50, wallH, -63);

  // South wall (CT Spawn Front)
  const sWallGeo = new THREE.BoxGeometry(100, wallH, wallThick);
  disposables.push(sWallGeo);
  const sWall = new THREE.Mesh(sWallGeo, brickMat);
  sWall.position.set(0, wallH / 2, 64);
  sceneGroup.add(sWall);
  addCollider(-50, 0, 63, 50, wallH, 65);

  // West wall (Left)
  const wWallGeo = new THREE.BoxGeometry(wallThick, wallH, 130);
  disposables.push(wWallGeo);
  const wWall = new THREE.Mesh(wWallGeo, brickMat);
  wWall.position.set(-48, wallH / 2, 0);
  sceneGroup.add(wWall);
  addCollider(-49, 0, -65, -47, wallH, 65);

  // East wall (Right)
  const eWallGeo = new THREE.BoxGeometry(wallThick, wallH, 130);
  disposables.push(eWallGeo);
  const eWall = new THREE.Mesh(eWallGeo, brickMat);
  eWall.position.set(48, wallH / 2, 0);
  sceneGroup.add(eWall);
  addCollider(47, 0, -65, 49, wallH, 65);

  // -------------------------------------------------------------
  // 3. THE MANSION BUILDING (2 Floors + Balcony + Porch)
  // Dimensions: Width = 34, Depth = 28, Height = 9.5
  // Centered at X = 0, Z = 0
  // -------------------------------------------------------------
  const mW = 32;
  const mD = 26;
  const mH = 9.2;
  const floor1H = 4.4;

  // 1st Floor Wood Flooring
  const f1FloorGeo = new THREE.BoxGeometry(mW - 0.5, 0.2, mD - 0.5);
  disposables.push(f1FloorGeo);
  const f1Floor = new THREE.Mesh(f1FloorGeo, woodFloorMat);
  f1Floor.position.set(0, 0.1, 0);
  f1Floor.receiveShadow = !isSoftwareGl;
  sceneGroup.add(f1Floor);

  // 2nd Floor Ceiling / Flooring
  const f2FloorGeo = new THREE.BoxGeometry(mW, 0.35, mD);
  disposables.push(f2FloorGeo);
  const f2Floor = new THREE.Mesh(f2FloorGeo, woodFloorMat);
  f2Floor.position.set(0, floor1H, 0);
  f2Floor.receiveShadow = !isSoftwareGl;
  sceneGroup.add(f2Floor);

  // Exterior Mansion Walls with Openings:
  // Front Wall (Z = mD/2 = 13) with Front Entrance Door opening
  const fWallL = new THREE.Mesh(new THREE.BoxGeometry(13, mH, 1), brickMat);
  fWallL.position.set(-9.5, mH / 2, mD / 2);
  sceneGroup.add(fWallL);
  addCollider(-16, 0, mD / 2 - 0.5, -3, mH, mD / 2 + 0.5);

  const fWallR = new THREE.Mesh(new THREE.BoxGeometry(13, mH, 1), brickMat);
  fWallR.position.set(9.5, mH / 2, mD / 2);
  sceneGroup.add(fWallR);
  addCollider(3, 0, mD / 2 - 0.5, 16, mH, mD / 2 + 0.5);

  // Front wall lintel above entrance door
  const fWallLintel = new THREE.Mesh(new THREE.BoxGeometry(6, mH - 3.2, 1), brickMat);
  fWallLintel.position.set(0, 3.2 + (mH - 3.2) / 2, mD / 2);
  sceneGroup.add(fWallLintel);

  // Back Wall (Z = -mD/2 = -13) with Back Door to Pool area
  const bWallL = new THREE.Mesh(new THREE.BoxGeometry(13, mH, 1), brickMat);
  bWallL.position.set(-9.5, mH / 2, -mD / 2);
  sceneGroup.add(bWallL);
  addCollider(-16, 0, -mD / 2 - 0.5, -3, mH, -mD / 2 + 0.5);

  const bWallR = new THREE.Mesh(new THREE.BoxGeometry(13, mH, 1), brickMat);
  bWallR.position.set(9.5, mH / 2, -mD / 2);
  sceneGroup.add(bWallR);
  addCollider(3, 0, -mD / 2 - 0.5, 16, mH, -mD / 2 + 0.5);

  const bWallLintel = new THREE.Mesh(new THREE.BoxGeometry(6, mH - 3.2, 1), brickMat);
  bWallLintel.position.set(0, 3.2 + (mH - 3.2) / 2, -mD / 2);
  sceneGroup.add(bWallLintel);

  // Left Wall (X = -mW/2 = -16)
  const lWall = new THREE.Mesh(new THREE.BoxGeometry(1, mH, mD), brickMat);
  lWall.position.set(-mW / 2, mH / 2, 0);
  sceneGroup.add(lWall);
  addCollider(-mW / 2 - 0.5, 0, -mD / 2, -mW / 2 + 0.5, mH, mD / 2);

  // Right Wall (X = mW/2 = 16) with window cutout
  const rWall = new THREE.Mesh(new THREE.BoxGeometry(1, mH, mD), brickMat);
  rWall.position.set(mW / 2, mH / 2, 0);
  sceneGroup.add(rWall);
  addCollider(mW / 2 - 0.5, 0, -mD / 2, mW / 2 + 0.5, mH, mD / 2);

  // Interior Dividing Wall (1st & 2nd floor foyer / rooms)
  const intWall1 = new THREE.Mesh(new THREE.BoxGeometry(18, floor1H, 0.6), brickMat);
  intWall1.position.set(4, floor1H / 2, 0);
  sceneGroup.add(intWall1);
  addCollider(-5, 0, -0.4, 13, floor1H, 0.4);

  // -------------------------------------------------------------
  // 4. FRONT PORCH & ICONIC 2ND FLOOR BALCONY
  // -------------------------------------------------------------
  const porchW = 20;
  const porchD = 6;
  const balconyZ = mD / 2 + porchD / 2;

  // Balcony Floor
  const balconyFloorGeo = new THREE.BoxGeometry(porchW, 0.35, porchD);
  disposables.push(balconyFloorGeo);
  const balconyFloor = new THREE.Mesh(balconyFloorGeo, concreteMat);
  balconyFloor.position.set(0, floor1H, balconyZ);
  balconyFloor.receiveShadow = !isSoftwareGl;
  sceneGroup.add(balconyFloor);

  // 4 Front Porch Pillars supporting the balcony
  const pillarGeo = new THREE.BoxGeometry(0.8, floor1H, 0.8);
  disposables.push(pillarGeo);
  const pillarXPositions = [-8, -2.6, 2.6, 8];
  for (const px of pillarXPositions) {
    const pil = new THREE.Mesh(pillarGeo, concreteMat);
    pil.position.set(px, floor1H / 2, mD / 2 + porchD - 0.5);
    pil.castShadow = !isSoftwareGl;
    sceneGroup.add(pil);
    addCollider(px - 0.5, 0, mD / 2 + porchD - 1, px + 0.5, floor1H, mD / 2 + porchD);
  }

  // Balcony Railing (Where Terrorist Snipers position in CS 1.6!)
  const railMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
  disposables.push(railMat);
  const railFrontGeo = new THREE.BoxGeometry(porchW, 1.1, 0.2);
  const railFront = new THREE.Mesh(railFrontGeo, railMat);
  railFront.position.set(0, floor1H + 0.55, mD / 2 + porchD - 0.1);
  sceneGroup.add(railFront);
  addCollider(-porchW / 2, floor1H, mD / 2 + porchD - 0.3, porchW / 2, floor1H + 1.2, mD / 2 + porchD + 0.1);

  // Balcony side railings
  const railSideGeo = new THREE.BoxGeometry(0.2, 1.1, porchD);
  const railL = new THREE.Mesh(railSideGeo, railMat);
  railL.position.set(-porchW / 2, floor1H + 0.55, balconyZ);
  sceneGroup.add(railL);
  const railR = new THREE.Mesh(railSideGeo, railMat);
  railR.position.set(porchW / 2, floor1H + 0.55, balconyZ);
  sceneGroup.add(railR);

  // Doorway opening from 2nd floor onto the balcony
  const balcDoorGeo = new THREE.BoxGeometry(3.2, 3.0, 1.2);
  // (Leaves space in front wall)

  // -------------------------------------------------------------
  // 5. STAIRCASE LEADING TO 2ND FLOOR
  // -------------------------------------------------------------
  const numSteps = 14;
  const stairW = 3.6;
  const stepH = floor1H / numSteps;
  const stepD = 0.55;
  const stairStartZ = -4;
  for (let s = 0; s < numSteps; s++) {
    const stepGeo = new THREE.BoxGeometry(stairW, stepH, stepD);
    const step = new THREE.Mesh(stepGeo, woodFloorMat);
    const sy = s * stepH + stepH / 2;
    const sz = stairStartZ + s * stepD;
    step.position.set(-10, sy, sz);
    step.receiveShadow = !isSoftwareGl;
    sceneGroup.add(step);
    addCollider(-10 - stairW / 2, 0, sz - stepD / 2, -10 + stairW / 2, sy + stepH / 2, sz + stepD / 2);
  }

  // -------------------------------------------------------------
  // 6. ROOFTOP
  // -------------------------------------------------------------
  const roofGeo = new THREE.ConeGeometry(24, 4.5, 4);
  roofGeo.rotateY(Math.PI / 4);
  disposables.push(roofGeo);
  const roofMesh = new THREE.Mesh(roofGeo, roofMat);
  roofMesh.position.set(0, mH + 2.2, 0);
  roofMesh.castShadow = !isSoftwareGl;
  sceneGroup.add(roofMesh);

  // -------------------------------------------------------------
  // 7. THE FAMOUS CS 1.6 SWIMMING POOL (SUZISH!)
  // Dimensions: 12m wide, 18m long, 3m deep sunken pool!
  // Located in the backyard at X = 20, Z = -28
  // -------------------------------------------------------------
  const poolCenter = { x: 22, z: -32 };
  const poolW = 12;
  const poolL = 18;
  const poolDepth = 3.0; // sunken below Y = 0
  const waterSurfaceY = -0.4;

  const poolVolume: PoolVolume = {
    minX: poolCenter.x - poolW / 2 + 0.3,
    maxX: poolCenter.x + poolW / 2 - 0.3,
    minY: -poolDepth - 0.2,
    maxY: waterSurfaceY,
    minZ: poolCenter.z - poolL / 2 + 0.3,
    maxZ: poolCenter.z + poolL / 2 - 0.3,
    surfaceY: waterSurfaceY,
  };

  // Pool Basin Floor (tiled blue mosaic)
  const poolFloorGeo = new THREE.BoxGeometry(poolW, 0.4, poolL);
  disposables.push(poolFloorGeo);
  const poolFloor = new THREE.Mesh(poolFloorGeo, poolTilesMat);
  poolFloor.position.set(poolCenter.x, -poolDepth, poolCenter.z);
  poolFloor.receiveShadow = !isSoftwareGl;
  sceneGroup.add(poolFloor);

  // Pool Interior Tiled Walls (Sunken)
  // North pool wall
  const pWallN = new THREE.Mesh(new THREE.BoxGeometry(poolW, poolDepth, 0.6), poolTilesMat);
  pWallN.position.set(poolCenter.x, -poolDepth / 2, poolCenter.z - poolL / 2);
  sceneGroup.add(pWallN);
  // South pool wall
  const pWallS = new THREE.Mesh(new THREE.BoxGeometry(poolW, poolDepth, 0.6), poolTilesMat);
  pWallS.position.set(poolCenter.x, -poolDepth / 2, poolCenter.z + poolL / 2);
  sceneGroup.add(pWallS);
  // West pool wall
  const pWallW = new THREE.Mesh(new THREE.BoxGeometry(0.6, poolDepth, poolL), poolTilesMat);
  pWallW.position.set(poolCenter.x - poolW / 2, -poolDepth / 2, poolCenter.z);
  sceneGroup.add(pWallW);
  // East pool wall
  const pWallE = new THREE.Mesh(new THREE.BoxGeometry(0.6, poolDepth, poolL), poolTilesMat);
  pWallE.position.set(poolCenter.x + poolW / 2, -poolDepth / 2, poolCenter.z);
  sceneGroup.add(pWallE);

  // Pool Surrounding Coping / Sun Deck (White concrete deck)
  const deckW = poolW + 5;
  const deckL = poolL + 5;
  const deckGeo = new THREE.BoxGeometry(deckW, 0.2, deckL);
  disposables.push(deckGeo);
  const deck = new THREE.Mesh(deckGeo, concreteMat);
  deck.position.set(poolCenter.x, 0.05, poolCenter.z);
  deck.receiveShadow = !isSoftwareGl;
  sceneGroup.add(deck);

  // Pool Diving Board
  const boardGeo = new THREE.BoxGeometry(1.4, 0.12, 4.0);
  disposables.push(boardGeo);
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x0077cc, roughness: 0.3 });
  disposables.push(boardMat);
  const divingBoard = new THREE.Mesh(boardGeo, boardMat);
  divingBoard.position.set(poolCenter.x, 0.45, poolCenter.z + poolL / 2 + 1.2);
  sceneGroup.add(divingBoard);
  addCollider(poolCenter.x - 0.7, 0, poolCenter.z + poolL / 2, poolCenter.x + 0.7, 0.5, poolCenter.z + poolL / 2 + 3);

  // Pool Metal Ladder (Iconic CS 1.6 pool ladder)
  const ladderGroup = new THREE.Group();
  ladderGroup.position.set(poolCenter.x - poolW / 2 + 0.4, 0, poolCenter.z);
  const railGeo = new THREE.CylinderGeometry(0.04, 0.04, poolDepth + 0.8);
  disposables.push(railGeo);
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1 });
  disposables.push(chromeMat);
  const r1 = new THREE.Mesh(railGeo, chromeMat);
  r1.position.set(0, -poolDepth / 2 + 0.4, -0.3);
  const r2 = new THREE.Mesh(railGeo, chromeMat);
  r2.position.set(0, -poolDepth / 2 + 0.4, 0.3);
  ladderGroup.add(r1);
  ladderGroup.add(r2);
  for (let s = 0; s < 5; s++) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6), chromeMat);
    rung.rotation.x = Math.PI / 2;
    rung.position.set(0, -0.4 - s * 0.5, 0);
    ladderGroup.add(rung);
  }
  sceneGroup.add(ladderGroup);

  // Translucent Animated Water Mesh
  const waterGeo = new THREE.PlaneGeometry(poolW - 0.1, poolL - 0.1);
  waterGeo.rotateX(-Math.PI / 2);
  disposables.push(waterGeo);
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.set(poolCenter.x, waterSurfaceY, poolCenter.z);
  sceneGroup.add(waterMesh);

  // -------------------------------------------------------------
  // 8. UNDERGROUND SEWER / VENTILATION TUNNEL
  // Connecting Basement to Backyard!
  // -------------------------------------------------------------
  const tunnelMat = new THREE.MeshStandardMaterial({ color: 0x333330, roughness: 0.9 });
  disposables.push(tunnelMat);
  const tunnelGroup = new THREE.Group();
  tunnelGroup.position.set(-10, -2.5, -20);
  const tunFloor = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 24), concreteMat);
  tunnelGroup.add(tunFloor);
  const tunCeil = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 24), tunnelMat);
  tunCeil.position.y = 2.4;
  tunnelGroup.add(tunCeil);
  const tunWallL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 24), tunnelMat);
  tunWallL.position.set(-1.6, 1.2, 0);
  tunnelGroup.add(tunWallL);
  const tunWallR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 24), tunnelMat);
  tunWallR.position.set(1.6, 1.2, 0);
  tunnelGroup.add(tunWallR);
  sceneGroup.add(tunnelGroup);

  // -------------------------------------------------------------
  // 9. WOODEN CRATES (CS 1.6 JUMP BOXES)
  // Scattered in CT spawn, yard, and inside mansion
  // -------------------------------------------------------------
  const cratePositions = [
    // CT Spawn stacks (Z = 45)
    { x: -6, y: 0.9, z: 46, s: 1.8 },
    { x: -6, y: 2.7, z: 46, s: 1.8 },
    { x: -4.2, y: 0.9, z: 46, s: 1.8 },
    { x: 8, y: 0.9, z: 48, s: 1.8 },
    { x: 9.8, y: 0.9, z: 48, s: 1.8 },
    { x: 8.9, y: 2.7, z: 48, s: 1.8 },
    // Courtyard boxes
    { x: -14, y: 0.9, z: 22, s: 1.8 },
    { x: 12, y: 0.9, z: 24, s: 1.8 },
    // Near Pool area
    { x: 10, y: 0.9, z: -18, s: 1.8 },
    { x: 10, y: 2.7, z: -18, s: 1.8 },
    // Inside 1st floor living room
    { x: 8, y: 0.9, z: -4, s: 1.8 },
    // Balcony sniper crate
    { x: 7, y: floor1H + 0.9, z: balconyZ - 0.5, s: 1.8 },
  ];

  for (const c of cratePositions) {
    const cGeo = new THREE.BoxGeometry(c.s, c.s, c.s);
    const cMesh = new THREE.Mesh(cGeo, crateMat);
    cMesh.position.set(c.x, c.y, c.z);
    cMesh.castShadow = !isSoftwareGl;
    cMesh.receiveShadow = !isSoftwareGl;
    sceneGroup.add(cMesh);

    addCollider(
      c.x - c.s / 2,
      c.y - c.s / 2,
      c.z - c.s / 2,
      c.x + c.s / 2,
      c.y + c.s / 2,
      c.z + c.s / 2
    );
  }

  // -------------------------------------------------------------
  // 10. CT SPAWN SWAT VAN & BARRICADES
  // -------------------------------------------------------------
  const vanGroup = new THREE.Group();
  vanGroup.position.set(-12, 1.4, 52);
  const vanMat = new THREE.MeshStandardMaterial({ color: 0x112233, metalness: 0.7, roughness: 0.3 });
  disposables.push(vanMat);
  const vanBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 7.5), vanMat);
  vanBody.castShadow = !isSoftwareGl;
  vanGroup.add(vanBody);

  // Wheels
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
  const wheelGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const w1 = new THREE.Mesh(wheelGeo, wheelMat);
  w1.position.set(-2.1, -0.7, 2.2);
  const w2 = new THREE.Mesh(wheelGeo, wheelMat);
  w2.position.set(2.1, -0.7, 2.2);
  const w3 = new THREE.Mesh(wheelGeo, wheelMat);
  w3.position.set(-2.1, -0.7, -2.2);
  const w4 = new THREE.Mesh(wheelGeo, wheelMat);
  w4.position.set(2.1, -0.7, -2.2);
  vanGroup.add(w1, w2, w3, w4);
  sceneGroup.add(vanGroup);
  addCollider(-14.5, 0, 48, -9.5, 3.0, 56);

  // -------------------------------------------------------------
  // 11. CCTV SECURITY MONITOR (2nd Floor Room)
  // -------------------------------------------------------------
  const cctvTex = createCctvTexture();
  disposables.push(cctvTex);
  const cctvMat = new THREE.MeshBasicMaterial({ map: cctvTex });
  disposables.push(cctvMat);
  const cctvScreenGeo = new THREE.PlaneGeometry(3.2, 2.4);
  const cctvScreen = new THREE.Mesh(cctvScreenGeo, cctvMat);
  cctvScreen.position.set(12, floor1H + 2.2, -6);
  cctvScreen.rotation.y = -Math.PI / 2;
  sceneGroup.add(cctvScreen);

  // -------------------------------------------------------------
  // 12. 4 CLASSIC CS 1.6 HOSTAGES (Upstairs hostage room)
  // -------------------------------------------------------------
  const hostageMeshes: THREE.Group[] = [];
  const hostageMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.6 }); // Scientist labcoat
  const hostagePantsMat = new THREE.MeshStandardMaterial({ color: 0x223366, roughness: 0.7 });
  const hostageHeadMat = new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.5 });
  disposables.push(hostageMat, hostagePantsMat, hostageHeadMat);

  const hostagePositions = [
    { x: -8, z: -8 },
    { x: -5, z: -8 },
    { x: -8, z: -5 },
    { x: -5, z: -5 },
  ];

  for (let i = 0; i < hostagePositions.length; i++) {
    const hp = hostagePositions[i];
    const hGroup = new THREE.Group();
    hGroup.position.set(hp.x, floor1H, hp.z);

    // Torso (White Labcoat)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.45), hostageMat);
    torso.position.y = 1.1;
    torso.castShadow = !isSoftwareGl;
    hGroup.add(torso);

    // Head with glasses
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), hostageHeadMat);
    head.position.y = 1.85;
    hGroup.add(head);

    // Tie
    const tieMat = new THREE.MeshBasicMaterial({ color: 0xcc2222 });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.05), tieMat);
    tie.position.set(0, 1.1, 0.25);
    hGroup.add(tie);

    // Legs
    const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.35), hostagePantsMat);
    lLeg.position.set(-0.2, 0.45, 0);
    const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.35), hostagePantsMat);
    rLeg.position.set(0.2, 0.45, 0);
    hGroup.add(lLeg, rLeg);

    sceneGroup.add(hGroup);
    hostageMeshes.push(hGroup);
    addCollider(hp.x - 0.5, floor1H, hp.z - 0.5, hp.x + 0.5, floor1H + 2.2, hp.z + 0.5);
  }

  // -------------------------------------------------------------
  // 13. TREES & YARD FOLIAGE
  // -------------------------------------------------------------
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e12, roughness: 0.9 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x225518, roughness: 0.8 });
  disposables.push(trunkMat, foliageMat);

  const treePositions = [
    { x: -24, z: 32 },
    { x: 26, z: 35 },
    { x: -32, z: 12 },
    { x: -28, z: -15 },
    { x: 34, z: -8 },
    { x: -30, z: -45 },
    { x: 0, z: -48 },
  ];

  for (const tp of treePositions) {
    const tree = new THREE.Group();
    tree.position.set(tp.x, 0, tp.z);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.6, 5), trunkMat);
    trunk.position.y = 2.5;
    trunk.castShadow = !isSoftwareGl;
    tree.add(trunk);

    const f1 = new THREE.Mesh(new THREE.ConeGeometry(3.2, 4.5, 7), foliageMat);
    f1.position.y = 5.2;
    f1.castShadow = !isSoftwareGl;
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(2.4, 3.8, 7), foliageMat);
    f2.position.y = 7.0;
    f2.castShadow = !isSoftwareGl;
    tree.add(f1, f2);

    sceneGroup.add(tree);
    addCollider(tp.x - 0.8, 0, tp.z - 0.8, tp.x + 0.8, 6, tp.z + 0.8);
  }

  // -------------------------------------------------------------
  // ANIMATION UPDATE
  // -------------------------------------------------------------
  let time = 0;
  const update = (delta: number) => {
    time += delta;
    // Animate water caustics / UV offset
    if (waterTex) {
      waterTex.offset.x = (time * 0.04) % 1;
      waterTex.offset.y = (time * 0.06) % 1;
    }
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    sceneGroup,
    collisionBoxes,
    poolVolume,
    waterMesh,
    hostageMeshes,
    update,
    dispose,
  };
}
