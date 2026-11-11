import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createIphone13Model, IphoneModelBundle } from './iphoneModel';
import { createContactShadowTexture } from './proceduralTextures';
import { ColorVariant, LightingPreset, ScreenMode, CameraPreset } from '../types/iphone';
import { CAMERA_PRESETS } from '../constants/iphoneData';

export interface IphoneStudioHandle {
  captureScreenshot: () => string | null;
  resetView: () => void;
  setCameraPreset: (preset: CameraPreset) => void;
}

interface IphoneStudioProps {
  currentColor: ColorVariant;
  lightingPreset: LightingPreset;
  screenMode: ScreenMode;
  explodedProgress: number;
  autoRotate: boolean;
  isUzbek: boolean;
  onExplodedChange?: (progress: number) => void;
}

export const IphoneStudio = forwardRef<IphoneStudioHandle, IphoneStudioProps>(function IphoneStudio(
  {
    currentColor,
    lightingPreset,
    screenMode,
    explodedProgress,
    autoRotate,
    isUzbek,
  },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const bundleRef = useRef<IphoneModelBundle | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Lighting refs
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Camera transition targets
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(3.8, 2.2, 7.5));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isTransitioningCam = useRef<boolean>(false);

  // Smooth exploded progress interpolation
  const currentExplodedRef = useRef<number>(explodedProgress);
  const targetExplodedRef = useRef<number>(explodedProgress);

  useEffect(() => {
    targetExplodedRef.current = explodedProgress;
  }, [explodedProgress]);

  // Imperative API for parent
  useImperativeHandle(ref, () => ({
    captureScreenshot: () => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (!renderer || !scene || !camera) return null;
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL('image/png');
    },
    resetView: () => {
      targetCamPos.current.set(3.8, 2.2, 7.5);
      targetCamLook.current.set(0, 0, 0);
      isTransitioningCam.current = true;
    },
    setCameraPreset: (preset: CameraPreset) => {
      const p = CAMERA_PRESETS.find((item) => item.id === preset);
      if (p) {
        targetCamPos.current.set(...p.position);
        targetCamLook.current.set(...p.target);
        isTransitioningCam.current = true;
      }
    },
  }));

  // Update Color
  useEffect(() => {
    if (bundleRef.current) {
      bundleRef.current.updateColor(currentColor);
    }
  }, [currentColor]);

  // Update Screen Mode
  useEffect(() => {
    if (bundleRef.current) {
      bundleRef.current.updateScreenMode(screenMode, isUzbek);
    }
  }, [screenMode, isUzbek]);

  // Update Lighting Presets
  useEffect(() => {
    const key = keyLightRef.current;
    const fill = fillLightRef.current;
    const rim = rimLightRef.current;
    const hemi = hemiLightRef.current;
    const scene = sceneRef.current;
    if (!key || !fill || !rim || !hemi || !scene) return;

    if (lightingPreset === 'studio') {
      key.color.set('#ffffff');
      key.intensity = 2.4;
      key.position.set(5, 7, 6);
      fill.color.set('#d8eaff');
      fill.intensity = 1.2;
      rim.color.set('#ffffff');
      rim.intensity = 1.8;
      hemi.color.set('#e6f0ff');
      hemi.groundColor.set('#1a2620');
      hemi.intensity = 0.9;
      scene.background = new THREE.Color('#0c1014');
    } else if (lightingPreset === 'dark') {
      key.color.set('#d8e4dc');
      key.intensity = 1.6;
      key.position.set(4, 5, 5);
      fill.color.set('#1a3028');
      fill.intensity = 0.6;
      rim.color.set('#34c759');
      rim.intensity = 2.2;
      hemi.color.set('#203429');
      hemi.groundColor.set('#040806');
      hemi.intensity = 0.4;
      scene.background = new THREE.Color('#05070a');
    } else if (lightingPreset === 'bright') {
      key.color.set('#ffffff');
      key.intensity = 3.0;
      key.position.set(6, 8, 7);
      fill.color.set('#f0f5ff');
      fill.intensity = 2.0;
      rim.color.set('#ffffff');
      rim.intensity = 2.0;
      hemi.color.set('#ffffff');
      hemi.groundColor.set('#445544');
      hemi.intensity = 1.3;
      scene.background = new THREE.Color('#141a20');
    } else if (lightingPreset === 'cyber') {
      key.color.set('#2efe74'); // Emerald laser
      key.intensity = 2.8;
      key.position.set(4, 6, 4);
      fill.color.set('#00e5ff'); // Cyan
      fill.intensity = 1.5;
      rim.color.set('#50ff90');
      rim.intensity = 3.0;
      hemi.color.set('#052818');
      hemi.groundColor.set('#000c06');
      hemi.intensity = 0.5;
      scene.background = new THREE.Color('#030b06');
    }
  }, [lightingPreset]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene & Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0e14');
    sceneRef.current = scene;

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.8, 2.2, 7.5);
    cameraRef.current = camera;

    // 4. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 5. Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4);
    keyLight.position.set(5, 7, 6);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -5;
      keyLight.shadow.camera.right = 5;
      keyLight.shadow.camera.top = 5;
      keyLight.shadow.camera.bottom = -5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight('#d8eaff', 1.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.DirectionalLight('#ffffff', 1.8);
    rimLight.position.set(0, 7, -6);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const hemiLight = new THREE.HemisphereLight('#e6f0ff', '#1a2620', 0.9);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // 7. Grounding Contact Shadow
    const shadowTex = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(8.5, 8.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.85;
    scene.add(shadowMesh);

    // 8. Add iPhone 13 Procedural Model
    const bundle = createIphone13Model(currentColor, isSoftwareGl);
    bundle.rootGroup.position.set(0, 0, 0);
    scene.add(bundle.rootGroup);
    bundleRef.current = bundle;

    // 9. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.5;
    controls.maxDistance = 16;
    controls.maxPolarAngle = Math.PI / 2 + 0.25; // allow looking slightly from below
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isTransitioningCam.current = false;
    });

    // 10. Animation Loop with frame pacing and smooth exponential damping
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

      // Smooth camera preset interpolation
      if (isTransitioningCam.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 5.0, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 5.0, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 5.0, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, targetCamLook.current.x, 5.0, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, targetCamLook.current.y, 5.0, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, targetCamLook.current.z, 5.0, delta);

        if (camera.position.distanceTo(targetCamPos.current) < 0.05) {
          isTransitioningCam.current = false;
        }
      }

      // Smooth Exploded Separation interpolation
      if (Math.abs(currentExplodedRef.current - targetExplodedRef.current) > 0.001) {
        currentExplodedRef.current = THREE.MathUtils.damp(
          currentExplodedRef.current,
          targetExplodedRef.current,
          6.0,
          delta
        );
        bundle.updateExploded(currentExplodedRef.current);
      }

      // Smooth Turntable Auto-Rotation
      if (autoRotate && !isTransitioningCam.current) {
        bundle.rootGroup.rotation.y += delta * 0.45;
      }

      controls.update();
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

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        window.clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      controls.dispose();
      bundle.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden" />;
});
