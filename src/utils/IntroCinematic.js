import { Animation, Vector3 } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";

class IntroCinematic {
  static async play(scene, camera, targetMesh, message) {
    const startPos = new Vector3(
      targetMesh.position.x,
      targetMesh.position.y + 30,
      targetMesh.position.z - 20
    );
    const endPos = new Vector3(
      targetMesh.position.x,
      targetMesh.position.y + 5,
      targetMesh.position.z + 10
    );

    camera.position = startPos;
    camera.setTarget(targetMesh.position);

    const frameRate = 60;
    const durationInSeconds = 6; // ⬅️ plus long qu'avant
    const totalFrames = durationInSeconds * frameRate;

    const animation = new Animation(
      "cameraIntro",
      "position",
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    animation.setKeys([
      { frame: 0, value: startPos },
      { frame: totalFrames, value: endPos }
    ]);

    camera.animations = [animation];

    // GUI rouge
    const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("IntroUI", true, scene);
    const textBlock = new GUI.TextBlock("introText", message);
    textBlock.color = "red"; // ⬅️ couleur rouge
    textBlock.fontSize = 28;
    textBlock.outlineWidth = 4;
    textBlock.outlineColor = "black";
    textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    textBlock.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    ui.addControl(textBlock);

    // Lance l'animation
    await scene.beginAnimation(camera, 0, totalFrames, false).waitAsync();

    // Supprime le texte après 2 sec
    setTimeout(() => {
      ui.removeControl(textBlock);
    }, 2000);

    // Re-lock la cible
    camera.lockedTarget = targetMesh;
  }
}

export default IntroCinematic;
