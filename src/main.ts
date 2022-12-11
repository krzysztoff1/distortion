import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createCamera, createRenderer, loadTexture } from "./utils";
import { createText } from "./text";
import { isDev } from "./constants";

import "./style.css";

const SPHERE_RADIUS = 10;

async function init() {
  const renderer = createRenderer();
  document.body.insertBefore(renderer.domElement, document.body.firstChild);

  const scene = new THREE.Scene();

  const camera = createCamera({
    position: [0, 0, SPHERE_RADIUS * 3],
  });

  if (isDev) {
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();
  }

  const clearcoatNormal = await loadTexture(
    "/xvGB-Scratched_gold_01_1K_Normal.png"
  );

  const material = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    clearcoat: 1,
    clearcoatNormalMap: clearcoatNormal,
    transmission: 1,
    //@ts-ignore
    thickness: 10,
    ior: 1.4,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.grain = { value: 0.3 };
    shader.uniforms.grainSize = { value: 0.4 };

    shader.vertexShader = `
      uniform float grain;
      uniform float grainSize;
      ${shader.vertexShader}
    `;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
        vec3 transformed = vec3( position );  
        transformed += grain * (sin(position.x * grainSize) + sin(position.y * grainSize) + sin(position.z * grainSize));
        transformed += grain * (sin(position.x * grainSize) + sin(position.y * grainSize) + sin(position.z * grainSize));
      `
    );

    shader.fragmentShader = `
      uniform float grain;
      uniform float grainSize;
      ${shader.fragmentShader}
    `;
  };

  const mainSphere = new THREE.Mesh(
    new THREE.SphereGeometry(SPHERE_RADIUS, 100, 100),
    material
  );

  scene.add(mainSphere);

  const textGeometry = await createText("Distorion", {
    size: 7,
    height: 2,
    bevelEnabled: false,
    depth: 0,
  });

  const textMesh = new THREE.Mesh(
    textGeometry,
    new THREE.MeshBasicMaterial({
      color: "white",
      side: THREE.DoubleSide,
    })
  );

  textMesh.position.set(-(SPHERE_RADIUS * 2), 0, -(SPHERE_RADIUS * 2));
  scene.add(textMesh);

  window.requestAnimationFrame(function render() {
    mainSphere.rotation.x += 0.01;
    mainSphere.rotation.y += 0.009;
    mainSphere.rotation.z -= 0.001;

    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function handleCameraRotation(x: number, y: number, z: number) {
    camera.position.x = x;
    camera.position.z = z;
    camera.position.y = y;

    camera.lookAt(0, 0, 0);
  }

  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    const degLimit = 0.3;

    handleCameraRotation(
      SPHERE_RADIUS * 3 * Math.sin((x - 0.5) * degLimit),
      SPHERE_RADIUS * 3 * Math.sin((y - 0.5) * degLimit),
      SPHERE_RADIUS * 3 * Math.cos((x - 0.5) * degLimit)
    );
  });
}

init();
