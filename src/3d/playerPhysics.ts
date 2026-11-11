import * as THREE from 'three';
import { PoolVolume } from './mansionBuilder';
import { csAudio } from '../audio/csAudio';
import { MovementMode, PlayerState, WeaponType } from '../types/mansion';

export interface PlayerInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  crouch: boolean;
  sprint: boolean;
  swimUp: boolean;
  swimDown: boolean;
}

export class PlayerController {
  public camera: THREE.PerspectiveCamera;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public rotation: THREE.Euler; // pitch and yaw

  public state: PlayerState;
  public input: PlayerInput;

  private collisionBoxes: THREE.Box3[] = [];
  private poolVolume: PoolVolume;

  private wasSwimming: boolean = false;
  private swimStrokeTimer: number = 0;
  private footstepTimer: number = 0;

  private playerRadius = 0.55;
  private standingHeight = 1.75;
  private crouchingHeight = 1.05;

  constructor(camera: THREE.PerspectiveCamera, poolVolume: PoolVolume, collisionBoxes: THREE.Box3[]) {
    this.camera = camera;
    this.poolVolume = poolVolume;
    this.collisionBoxes = collisionBoxes;

    // Start at CT Spawn facing the Mansion!
    this.position = new THREE.Vector3(0, 1.75, 48);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, Math.PI, 0, 'YXZ'); // looking towards -Z (Mansion)

    this.state = {
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
    };

    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
      crouch: false,
      sprint: false,
      swimUp: false,
      swimDown: false,
    };

    this.updateCamera();
  }

  public setPosition(pos: [number, number, number], rot?: [number, number]) {
    this.position.set(pos[0], pos[1], pos[2]);
    this.velocity.set(0, 0, 0);
    if (rot) {
      this.rotation.y = rot[0];
      this.rotation.x = rot[1];
    }
    this.updateCamera();
  }

  public addMouseRotation(deltaX: number, deltaY: number, sensitivity: number = 0.0022) {
    this.rotation.y -= deltaX * sensitivity;
    this.rotation.x -= deltaY * sensitivity;
    // Clamp pitch
    const maxPitch = Math.PI / 2 - 0.05;
    this.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, this.rotation.x));
    this.updateCamera();
  }

  public update(delta: number) {
    // 1. Check if inside Swimming Pool Volume
    const inPoolX = this.position.x >= this.poolVolume.minX && this.position.x <= this.poolVolume.maxX;
    const inPoolZ = this.position.z >= this.poolVolume.minZ && this.position.z <= this.poolVolume.maxZ;
    const inPoolY = this.position.y <= this.poolVolume.surfaceY + 0.3 && this.position.y >= this.poolVolume.minY;

    const isSwimmingNow = inPoolX && inPoolZ && inPoolY;
    this.state.isSwimming = isSwimmingNow;

    // Splash sound when entering water
    if (isSwimmingNow && !this.wasSwimming) {
      csAudio.playWaterSplash();
      this.velocity.y *= 0.3; // water impact slows downward fall
    }
    this.wasSwimming = isSwimmingNow;

    // Depth & Oxygen
    if (isSwimmingNow) {
      const surface = this.poolVolume.surfaceY;
      const bottom = this.poolVolume.minY;
      this.state.waterDepth = Math.max(0, Math.min(1, (surface - this.position.y) / (surface - bottom)));

      // If head is submerged below water surface
      if (this.position.y < surface - 0.1) {
        this.state.oxygen = Math.max(0, this.state.oxygen - delta * 6);
      } else {
        this.state.oxygen = Math.min(100, this.state.oxygen + delta * 25);
      }
    } else {
      this.state.waterDepth = 0;
      this.state.oxygen = Math.min(100, this.state.oxygen + delta * 30);
    }

    // 2. Movement Logic
    if (this.state.movementMode === 'fly') {
      this.updateFlyMovement(delta);
    } else if (isSwimmingNow) {
      this.updateSwimMovement(delta);
    } else {
      this.updateWalkMovement(delta);
    }

    this.updateCamera();
  }

  // -----------------------------------------------------------------
  // SWIMMING MOVEMENT (Buoyancy, 3D strokes, diving, surface breach)
  // -----------------------------------------------------------------
  private updateSwimMovement(delta: number) {
    this.state.isGrounded = false;

    // Camera view directions
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.rotation);
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, this.rotation.y, 0));

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (this.input.forward) moveDir.add(forward);
    if (this.input.backward) moveDir.sub(forward);
    if (this.input.right) moveDir.add(right);
    if (this.input.left) moveDir.sub(right);

    // Swimming vertical controls (Space = swim up, C = dive down)
    if (this.input.jump || this.input.swimUp) {
      moveDir.y += 1.2;
    }
    if (this.input.crouch || this.input.swimDown) {
      moveDir.y -= 1.2;
    }

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
      const swimSpeed = this.input.sprint ? 9.5 : 6.0;
      this.velocity.x = THREE.MathUtils.damp(this.velocity.x, moveDir.x * swimSpeed, 4.0, delta);
      this.velocity.y = THREE.MathUtils.damp(this.velocity.y, moveDir.y * swimSpeed, 4.0, delta);
      this.velocity.z = THREE.MathUtils.damp(this.velocity.z, moveDir.z * swimSpeed, 4.0, delta);

      // Play swimming stroke sound
      this.swimStrokeTimer += delta;
      if (this.swimStrokeTimer > 0.65) {
        csAudio.playSwimStroke();
        this.swimStrokeTimer = 0;
      }
    } else {
      // Water drag / resistance
      this.velocity.x = THREE.MathUtils.damp(this.velocity.x, 0, 3.5, delta);
      this.velocity.z = THREE.MathUtils.damp(this.velocity.z, 0, 3.5, delta);
      // Gentle buoyancy / floating toward surface
      const targetBuoyancy = this.position.y < this.poolVolume.surfaceY - 0.3 ? 0.8 : -0.2;
      this.velocity.y = THREE.MathUtils.damp(this.velocity.y, targetBuoyancy, 2.0, delta);
    }

    // Apply movement
    this.position.addScaledVector(this.velocity, delta);

    // Keep player inside pool bounds while swimming
    this.position.x = Math.max(this.poolVolume.minX + 0.4, Math.min(this.poolVolume.maxX - 0.4, this.position.x));
    this.position.z = Math.max(this.poolVolume.minZ + 0.4, Math.min(this.poolVolume.maxZ - 0.4, this.position.z));
    this.position.y = Math.max(this.poolVolume.minY + 0.5, Math.min(this.poolVolume.surfaceY + 0.3, this.position.y));
  }

  // -----------------------------------------------------------------
  // NORMAL WALKING MOVEMENT (Gravity, ground collisions, jumping, stairs)
  // -----------------------------------------------------------------
  private updateWalkMovement(delta: number) {
    this.state.isCrouching = this.input.crouch;
    const currentHeight = this.state.isCrouching ? this.crouchingHeight : this.standingHeight;

    // Horizontal direction based on yaw
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);

    const moveDir = new THREE.Vector3(0, 0, 0);
    if (this.input.forward) moveDir.add(forward);
    if (this.input.backward) moveDir.sub(forward);
    if (this.input.right) moveDir.add(right);
    if (this.input.left) moveDir.sub(right);

    let speed = 7.5; // normal run
    if (this.state.isCrouching) speed = 3.2;
    else if (this.input.sprint) speed = 11.0;

    if (moveDir.lengthSq() > 0.001) {
      moveDir.normalize();
      this.velocity.x = THREE.MathUtils.damp(this.velocity.x, moveDir.x * speed, 12.0, delta);
      this.velocity.z = THREE.MathUtils.damp(this.velocity.z, moveDir.z * speed, 12.0, delta);

      // Footstep sound
      if (this.state.isGrounded) {
        this.footstepTimer += delta * (this.input.sprint ? 1.4 : 1.0);
        if (this.footstepTimer > 0.38) {
          const surface = Math.abs(this.position.z) < 14 && Math.abs(this.position.x) < 17 ? 'wood' : 'concrete';
          csAudio.playFootstep(surface);
          this.footstepTimer = 0;
        }
      }
    } else {
      this.velocity.x = THREE.MathUtils.damp(this.velocity.x, 0, 14.0, delta);
      this.velocity.z = THREE.MathUtils.damp(this.velocity.z, 0, 14.0, delta);
    }

    // Jump
    if (this.input.jump && this.state.isGrounded) {
      this.velocity.y = 8.5;
      this.state.isGrounded = false;
      csAudio.playJump();
    }

    // Gravity
    const gravity = 24.0;
    this.velocity.y -= gravity * delta;

    // Predict position
    const nextX = this.position.x + this.velocity.x * delta;
    const nextY = this.position.y + this.velocity.y * delta;
    const nextZ = this.position.z + this.velocity.z * delta;

    // Check Ground level
    let floorY = 0; // Ground plane

    // Check stairs & boxes below feet
    for (const box of this.collisionBoxes) {
      if (
        nextX >= box.min.x - this.playerRadius &&
        nextX <= box.max.x + this.playerRadius &&
        nextZ >= box.min.z - this.playerRadius &&
        nextZ <= box.max.z + this.playerRadius
      ) {
        // If box is below player
        if (box.max.y <= this.position.y + 0.35 && box.max.y >= floorY) {
          floorY = box.max.y;
        }
      }
    }

    // Resolve Y (floor landing)
    if (nextY <= floorY + currentHeight) {
      this.position.y = floorY + currentHeight;
      this.velocity.y = 0;
      this.state.isGrounded = true;
    } else {
      this.position.y = nextY;
      this.state.isGrounded = false;
    }

    // Horizontal collisions (Walls, pillars, crates)
    let finalX = nextX;
    let finalZ = nextZ;

    for (const box of this.collisionBoxes) {
      const playerMinY = this.position.y - currentHeight;
      const playerMaxY = this.position.y;

      // Only collide if vertically overlapping
      if (playerMinY < box.max.y && playerMaxY > box.min.y + 0.25) {
        if (
          finalX + this.playerRadius > box.min.x &&
          finalX - this.playerRadius < box.max.x &&
          this.position.z + this.playerRadius > box.min.z &&
          this.position.z - this.playerRadius < box.max.z
        ) {
          finalX = this.position.x; // Block X movement
        }

        if (
          this.position.x + this.playerRadius > box.min.x &&
          this.position.x - this.playerRadius < box.max.x &&
          finalZ + this.playerRadius > box.min.z &&
          finalZ - this.playerRadius < box.max.z
        ) {
          finalZ = this.position.z; // Block Z movement
        }
      }
    }

    this.position.x = finalX;
    this.position.z = finalZ;
  }

  // -----------------------------------------------------------------
  // FREE FLY / NOCLIP MOVEMENT
  // -----------------------------------------------------------------
  private updateFlyMovement(delta: number) {
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.rotation);
    const right = new THREE.Vector3(1, 0, 0).applyEuler(this.rotation);
    const up = new THREE.Vector3(0, 1, 0);

    const dir = new THREE.Vector3(0, 0, 0);
    if (this.input.forward) dir.add(forward);
    if (this.input.backward) dir.sub(forward);
    if (this.input.right) dir.add(right);
    if (this.input.left) dir.sub(right);
    if (this.input.jump) dir.add(up);
    if (this.input.crouch) dir.sub(up);

    if (dir.lengthSq() > 0.001) {
      dir.normalize();
      const flySpeed = this.input.sprint ? 28 : 14;
      this.position.addScaledVector(dir, flySpeed * delta);
    }
  }

  private updateCamera() {
    this.camera.position.copy(this.position);
    this.camera.rotation.copy(this.rotation);
  }
}
