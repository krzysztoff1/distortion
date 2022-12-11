import {
  EffectComposer,
  EffectPass,
  DepthOfFieldEffect,
  RenderPass,
} from "postprocessing";

export function renderWithComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  callback?: () => void
) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(
    new EffectPass(
      camera,
      new DepthOfFieldEffect(camera, {
        focusDistance: 94,
        focalLength: 0.02,
        bokehScale: 2,
        height: 480,
      })
    )
  );

  requestAnimationFrame(function render() {
    if (callback) {
      callback();
    }

    composer.render();
    requestAnimationFrame(render);
  });
}
