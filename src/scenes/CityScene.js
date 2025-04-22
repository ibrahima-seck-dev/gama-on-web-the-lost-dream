import {
  FollowCamera,
  HemisphericLight,
  Vector3,
  Sound,
  Ray,
  Color3
} from "@babylonjs/core";

import { Inspector } from "@babylonjs/inspector";

import BaseScene from "../BaseScene";
import AssetLoader from "../utils/AssetLoader";
import SceneUtils from "../utils/SceneUtils";
import WallBuilder from "../utils/WallBuilder";
import Constants from "../utils/Constants";
import PlayerFactory from "../utils/PlayerFactory";
import CameraUtils from "../utils/CameraUtils";
import MiniMap from "../utils/MiniMap";
import FindKeyMission from "../missions/FindKeyMission";
import IntroCinematic from "../utils/IntroCinematic";

class CityScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.jumpSound = null;
    this.ambientCitySound = null;
    this.groundLimits = null;
    this.cityMeshes = [];
    this.player = null;
    this.playerController = null;
    this.walls = [];
  }

  async initScene() {
    this._scene.collisionsEnabled = true;
    CameraUtils.setupLightAndSky(this._scene);
    this.camera = CameraUtils.createFollowCamera(this._scene, this._canvas, null);

    this.loadJumpSound();
    this.loadCityAmbientSound();
    this.createGround();

    const [cityMesh, playerData] = await Promise.all([
      this.importCityMesh(),
      this.importPlayer()
    ]);

    this.createBoundaryWalls();

    cityMesh.setEnabled(true);
    playerData.mesh.setEnabled(true);
    this.walls.forEach(w => w.setEnabled(true));

    new MiniMap(this._scene, this.camera);

    await IntroCinematic.play(
      this._scene,
      this.camera,
      playerData.mesh,
      "Mission : Trouve la clé pour ouvrir la porte"
    );

    const mission = new FindKeyMission(
      this._scene,
      playerData.mesh,
      playerData.animations.skeleton ?? null,
      (result) => {
        if (result === "retry") {
          window.game.switchScene("city"); // Relance propre de la scène
        } else {
          window.game.switchScene("success"); // Passage à la scène de succès
        }
      }
    );

    await mission.start();

    Inspector.Show(this._scene, {});

    this._scene.registerBeforeRender(() => {
      const cam = this.camera;
      const target = cam.lockedTarget;
      if (!target) return;

      cam.position.y = target.position.y + cam.heightOffset;

      const origin = cam.position;
      const dir = target.position.subtract(origin).normalize();
      const ray = new Ray(origin, dir, Vector3.Distance(origin, target.position));

      this.cityMeshes.forEach(m => m.visibility = 1);
      const hits = this._scene.multiPickWithRay(ray, m => this.cityMeshes.includes(m));
      hits?.forEach(p => p.pickedMesh && (p.pickedMesh.visibility = 0.2));
    });

    return this._scene;
  }

  loadJumpSound() {
    this.jumpSound = new Sound("jumpSound", Constants.JUMP_SOUND_URL, this._scene, null, {
      volume: 5
    });
  }

  loadCityAmbientSound() {
    this.ambientCitySound = new Sound("cityAmbient", Constants.CITY_SOUND_URL, this._scene, null, {
      loop: true,
      autoplay: true,
      volume: 0.6
    });
  }

  createGround() {
    const { mesh, limits } = SceneUtils.createGround(this._scene, 200, 200);
    this.groundLimits = limits;
  }

  createBoundaryWalls() {
    const walls = WallBuilder.create(this._scene, this.groundLimits, {
      wallHeight: 10,
      thickness: 1,
      color: new Color3(0.8, 0.8, 0.8),
      materialAlpha: 1
    });

    walls.forEach(w => {
      w.setEnabled(false);
      this.walls.push(w);
    });
  }

  async importCityMesh() {
    const result = await AssetLoader.loadMesh(this._scene, Constants.CITY_MESH_URL);
    const rootMesh = result.meshes[0];
    rootMesh.name = "CityBuildings";
    rootMesh.position.y = 0;
    rootMesh.setEnabled(false);

    SceneUtils.enableCollisionsRecursively(rootMesh);
    this.cityMeshes = rootMesh.getChildMeshes(false);
    return rootMesh;
  }

  async importPlayer() {
    const { mesh, animations, controller } = await PlayerFactory.create(
      this._scene,
      Constants.PLAYER_MESH_URL,
      this.jumpSound,
      this.groundLimits
    );

    this.playerController = controller;
    this.camera.lockedTarget = mesh;
    return { mesh, animations };
  }

  setLimits(boundaries) {
    this.playerController.setLimits(boundaries);
  }

  clampPosition(pos) {
    return this.playerController.clampPosition(pos);
  }

  playAnimation(name, loop = true) {
    this.playerController.playAnimation(name, loop);
  }

  setPlayerActive(active) {
    this.playerController.active = active;
  }
}

export default CityScene