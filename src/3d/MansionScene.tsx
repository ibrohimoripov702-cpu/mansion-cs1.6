import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildCsMansion, MansionMapData } from './mansionBuilder';
import { PlayerController } from './playerPhysics';
import { CsViewModel } from './csViewModel';
import { csAudio } from '../audio/csAudio';
import { MovementMode, PlayerState, WeaponType } from '../types/mansion';

export interface MansionSceneHandle {
  teleportTo: (pos: [number, number, number], rot?: [number, number]) => void;
  setWeapon: (weapon: WeaponType) => void;
  setMovementMode: (mode: MovementMode) => void;
  fireWeapon: () => void;
  setVirtualInput: (key: string, value: boolean) => void;
  addLookDelta: (dx: number, dy: number) => void;
  captureScreenshot: () => string | null;
}

interface MansionSceneProps {
  onPlayerStateChange: (state: PlayerState) => void;
  onPointerLockChange: (isLocked: boolean) => void;
  activeWeapon: WeaponType;
  movementMode: MovementMode;
}

export const MansionScene = forwardRef<MansionSceneHandle, MansionSceneProps>(function MansionScene(
  { onPlayerStateChange, onPointerLockChange, activeWeapon, movementMode },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerController | null>(null);
  const viewModelRef = useRef<CsViewModel | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mapDataRef = useRef<MansionMapData | null>(null);

  const [isUnderwater, setIsUnderwater] = useState<boolean>(false);

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    teleportTo: (pos, rot) => {
      if (playerRef.current) {
        playerRef.current.setPosition(pos, rot);
      }
    },
    setWeapon: (weapon) => {
      if (viewModelRef.current) {
        viewModelRef.current.setWeapon(weapon);
      }
      if (playerRef.current) {
        playerRef.current.state.activeWeapon = weapon;
      }
    },
    setMovementMode: (mode) => {
      if (playerRef.current) {
        playerRef.current.state.movementMode = mode;
      }
    },
    fireWeapon: () => {
      handleFire();
    },
    setVirtualInput: (key, value) => {
      if (!playerRef.current) return;
      const input = playerRef.current.input;
      if (key === 'forward') input.forward = value;
      else if (key === 'backward') input.backward = value;
      else if (key === 'left') input.left = value;
      else if (key === 'right') input.right = value;
      else if (key === 'jump') input.jump = value;
      else if (key === 'crouch') input.crouch = value;
      else if (key === 'sprint') input.sprint = value;
      else if (key === 'swimUp') input.swimUp = value;
      else if (key === 'swimDown') input.swimDown = value;
    },
    addLookDelta: (dx, dy) => {
      if (playerRef.current) {
        playerRef.current.addMouseRotation(dx, dy, 0.0035);
      }
    },
    captureScreenshot: () => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const player = playerRef.current;
      if (!renderer || !scene || !player) return null;
      renderer.render(scene, player.camera);
      return renderer.domElement.toDataURL('image/png');
    },
  }));

  // Fire weapon handler
  const handleFire = () => {
    if (!playerRef.current || !viewModelRef.current) return;
    const weapon = playerRef.current.state.activeWeapon;
    csAudio.playWeaponFire(weapon);
    viewModelRef.current.triggerRecoil();
  };

  // Sync weapon
  useEffect(() => {
    if (viewModelRef.current) {
      viewModelRef.current.setWeapon(activeWeapon);
    }
    if (playerRef.current) {
      playerRef.current.state.activeWeapon = activeWeapon;
    }
  }, [activeWeapon]);

  // Sync mode
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.state.movementMode = movementMode;
    }
  }, [movementMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Sky
    const scene = new THREE.Scene();
    const normalFog = new THREE.Fog(0x8cb8d0, 45, 120);
    const waterFog = new THREE.FogExp2(0x0e5d7a, 0.12);
    scene.fog = normalFog;
    scene.background = new THREE.Color(0x8cb8d0); // CS 1.6 sunny blue sky
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment for metal/water reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Sunny Daylight Lighting Rig (Classic CS 1.6 Mansion Sunlight)
    const sunLight = new THREE.DirectionalLight(0xfff3db, 2.2);
    sunLight.position.set(30, 45, 25);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 5;
      sunLight.shadow.camera.far = 140;
      sunLight.shadow.camera.left = -50;
      sunLight.shadow.camera.right = 50;
      sunLight.shadow.camera.top = 50;
      sunLight.shadow.camera.bottom = -50;
      sunLight.shadow.bias = -0.0004;
    }
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xbde0fe, 0x475538, 0.95);
    scene.add(hemiLight);

    // Indoor Mansion Accent Lights
    const indoorLight1 = new THREE.PointLight(0xffddaa, 1.8, 18);
    indoorLight1.position.set(0, 3.8, 0); // Foyer
    scene.add(indoorLight1);

    const indoorLight2 = new THREE.PointLight(0xffddaa, 1.8, 18);
    indoorLight2.position.set(0, 8.0, 0); // 2nd Floor
    scene.add(indoorLight2);

    // 6. Build the CS 1.6 Mansion Map
    const mapData = buildCsMansion(isSoftwareGl);
    scene.add(mapData.sceneGroup);
    mapDataRef.current = mapData;

    // 7. Player Controller
    const player = new PlayerController(camera, mapData.poolVolume, mapData.collisionBoxes);
    playerRef.current = player;

    // 8. Attach Viewmodel to Camera
    const viewModel = new CsViewModel();
    camera.add(viewModel.group);
    scene.add(camera);
    viewModelRef.current = viewModel;

    // 9. Input & Pointer Lock Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default on gaming keys
      if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        // let it pass
      }
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') player.input.forward = true;
      if (code === 'KeyS' || code === 'ArrowDown') player.input.backward = true;
      if (code === 'KeyA' || code === 'ArrowLeft') player.input.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') player.input.right = true;
      if (code === 'Space') player.input.jump = true;
      if (code === 'KeyC' || code === 'ControlLeft') player.input.crouch = true;
      if (code === 'ShiftLeft' || code === 'ShiftRight') player.input.sprint = true;

      // Weapon quick switch keys
      if (code === 'Digit1') viewModel.setWeapon('knife');
      if (code === 'Digit2') viewModel.setWeapon('usp');
      if (code === 'Digit3') viewModel.setWeapon('m4a1');
      if (code === 'Digit4') viewModel.setWeapon('ak47');
      if (code === 'Digit5') viewModel.setWeapon('awp');

      // Radio chatter sound on 'X' or 'C'
      if (code === 'KeyX') csAudio.playRadioBeep();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') player.input.forward = false;
      if (code === 'KeyS' || code === 'ArrowDown') player.input.backward = false;
      if (code === 'KeyA' || code === 'ArrowLeft') player.input.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') player.input.right = false;
      if (code === 'Space') player.input.jump = false;
      if (code === 'KeyC' || code === 'ControlLeft') player.input.crouch = false;
      if (code === 'ShiftLeft' || code === 'ShiftRight') player.input.sprint = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === container || document.pointerLockElement === renderer.domElement) {
        player.addMouseRotation(e.movementX, e.movementY);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        // Left click to shoot
        if (document.pointerLockElement !== container && document.pointerLockElement !== renderer.domElement) {
          // Request pointer lock
          renderer.domElement.requestPointerLock?.();
        } else {
          handleFire();
        }
      }
    };

    const handlePointerLockChange = () => {
      const isLocked =
        document.pointerLockElement === container ||
        document.pointerLockElement === renderer.domElement;
      onPointerLockChange(isLocked);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // 10. Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function animate() {
      const delta = Math.min(clock.getDelta(), 0.1);

      // Update player physics (walking, jumping, swimming)
      player.update(delta);

      // Check if camera head is underwater
      const submerged = player.state.isSwimming && camera.position.y < mapData.poolVolume.surfaceY;
      if (submerged) {
        scene.fog = waterFog;
        scene.background = new THREE.Color(0x0e5d7a); // deep pool underwater hue
      } else {
        scene.fog = normalFog;
        scene.background = new THREE.Color(0x8cb8d0); // sunny blue sky
      }

      // Viewmodel update
      const isMoving =
        player.input.forward ||
        player.input.backward ||
        player.input.left ||
        player.input.right;
      viewModel.update(delta, isMoving);

      // Map animation (water caustics)
      mapData.update(delta);

      // Notify parent of state (for HUD update)
      onPlayerStateChange({ ...player.state });

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    }

    // Start loop
    if (isSoftwareGl) {
      afterDraw(animate);
    } else {
      frameId = requestAnimationFrame(animate);
    }

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Initial audio radio beep
    csAudio.playRadioBeep();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('resize', handleResize);

      if (isSoftwareGl) {
        window.clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }

      mapData.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-crosshair overflow-hidden select-none"
    />
  );
});
