import { Animation, Vector3 } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

class IntroCinematic {
  static async play(scene, camera, targetMesh, message) {
    const frameRate = 60;
    const duration = 5;
    const totalFrames = duration * frameRate;

    const center = targetMesh.position.clone();
    const startRadius = 80;
    const endRadius = 12;
    const heightStart = center.y + 40;
    const heightEnd = center.y + 5;

    const rotations = 1.5;
    const keys = [];

    for (let i = 0; i <= totalFrames; i++) {
      const t = i / totalFrames;
      const angle = 2 * Math.PI * rotations * t;

      const radius = startRadius * (1 - t) + endRadius * t;
      const x = center.x + radius * Math.cos(angle);
      const z = center.z + radius * Math.sin(angle);
      const y = heightStart * (1 - t) + heightEnd * t;

      keys.push({ frame: i, value: new Vector3(x, y, z) });
    }

    const animation = new Animation(
      "cameraIntro",
      "position",
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    animation.setKeys(keys);
    camera.animations = [animation];

    // UI
    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("IntroUI", true, scene);
    const textBlock = new GUI.TextBlock("introText", message);
    textBlock.color = "white";
    textBlock.fontSize = 28;
    textBlock.outlineWidth = 4;
    textBlock.outlineColor = "black";
    textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    ui.addControl(textBlock);

    // Suivre le joueur à chaque frame de l'animation
    const observer = scene.onBeforeRenderObservable.add(() => {
      camera.setTarget(center);
    });

    await scene.beginAnimation(camera, 0, totalFrames, false).waitAsync();

    scene.onBeforeRenderObservable.remove(observer);
    camera.lockedTarget = targetMesh;

    setTimeout(() => {
      ui.removeControl(textBlock);
    }, 2000);
  }
}

export default IntroCinematic;
