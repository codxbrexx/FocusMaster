import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

export const useThreeScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  const onWindowResize = useCallback(() => {
    if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;

    const width = containerRef.current?.clientWidth || window.innerWidth;
    const height = containerRef.current?.clientHeight || window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5); // Cap at 1.5x for performance

    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(pixelRatio);

    if (cameraRef.current instanceof THREE.PerspectiveCamera) {
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.z = 60;
    cameraRef.current = camera;

    // Renderer setup
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    containerRef.current.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
    });

    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3, 100, Math.PI / 4, 1, 2);
    spotLight.position.set(50, 50, 50);
    scene.add(spotLight);

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    return {
      scene,
      camera,
      renderer,
      canvas,
    };
  }, [onWindowResize]);

  useEffect(() => {
    const setup = initScene();
    if (!setup) return;

    return () => {
      window.removeEventListener('resize', onWindowResize);

      // Cleanup
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      setup.renderer.dispose();
      setup.canvas.remove();
    };
  }, [initScene, onWindowResize]);

  return {
    containerRef,
    canvasRef,
    sceneRef,
    cameraRef,
    rendererRef,
    frameIdRef,
    onWindowResize,
  };
};
