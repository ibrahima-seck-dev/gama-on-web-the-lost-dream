import { FollowCamera, Vector3, HemisphericLight, MeshBuilder, Color3 } from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";

class CameraUtils {
  static createFollowCamera(scene, canvas, target) {
    const camera = new FollowCamera("FollowCam", new Vector3(0, 10, 15), scene);
    camera.heightOffset = 5;
    camera.radius = 10;
    camera.lowerRadiusLimit = 10;
    camera.upperRadiusLimit = 10;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.05;
    camera.maxCameraSpeed = 20;
    camera.checkCollisions = true;
    camera.collisionRadius = new Vector3(1, 1, 1);
    camera.applyGravity = false;
    camera.inputs.removeByType("FreeCameraMouseWheelInput");

    camera.attachControl(canvas, true);
    scene.activeCamera = camera;
    camera.lockedTarget = target;

    return camera;
  }

  static setupLightAndSky(scene) {
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    scene.clearColor = new Color3(0.7, 0.85, 1);

    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    skyMaterial.inclination = 0;
    skybox.material = skyMaterial;
  }
}

export default CameraUtils;
