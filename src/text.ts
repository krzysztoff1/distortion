import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
//@ts-ignore
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export function createText(
  text: string,
  options: Record<string, number | boolean> = {}
): Promise<TextGeometry> {
  return new Promise((resolve) => {
    const fontLoader = new FontLoader();
    const fontUrl =
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json";

    fontLoader.load(fontUrl, (font) => {
      const fontGeometry: TextGeometry = new TextGeometry(text, {
        font,
        ...options,
      });

      resolve(fontGeometry);
    });
  });
}
