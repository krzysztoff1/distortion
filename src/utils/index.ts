import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function createRenderer(options?: THREE.WebGLRendererParameters) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    stencil: false,
    ...options,
  });

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}

export function createCamera({
  fov = 75,
  aspect = window.innerWidth / window.innerHeight,
  near = 0.1,
  far = 1000,
  position = [0, 0, 2],
}) {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const [x, y, z] = position;
  camera.position.set(x, y, z);
  return camera;
}

export function loadHDRI(
  url: string,
  renderer: THREE.WebGLRenderer
): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const loader = new RGBELoader();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    loader.load(url, (texture: THREE.Texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      texture.dispose();
      pmremGenerator.dispose();
      resolve(envMap);
    });
  });
}

export async function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve) => resolve(new THREE.TextureLoader().load(url)));
}

export async function loadHdrTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const loader = new RGBELoader();
    loader.load(url, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      resolve(texture);
    });
  });
}
