import {
  FollowCamera,
  HemisphericLight,
  Vector3,
  Sound,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Ray
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import { Inspector } from "@babylonjs/inspector";

import BaseScene from "../BaseScene";
import AssetLoader from "../utils/AssetLoader";
import SceneUtils from "../utils/SceneUtils";
import WallBuilder from "../utils/WallBuilder";
import Constants from "../utils/Constants";
import Player from "../models/Player";
import PlayerController from "../controllers/PlayerController";

class CityScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.jumpSound = null;
    this.groundLimits = null;
    this.cityMeshes = [];
    this.player = null;
    this.walls = [];
  }

  async initScene() {
    this.createSceneCity();
    this.loadJumpSound();
    this.createGround();

    const [cityMesh, playerData] = await Promise.all([
      this.importCityMesh(),
      this.importPlayer()
    ]);

    this.createBoundaryWalls();

    cityMesh.setEnabled(true);
    playerData.mesh.setEnabled(true);
    this.walls.forEach(w => w.setEnabled(true));

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

  createSceneCity() {
    this._scene.collisionsEnabled = true;

    this.camera = new FollowCamera("cameraCity", new Vector3(0, 10, 15), this._scene);
    this.camera.heightOffset = 5;
    this.camera.rotationOffset = 0;
    this.camera.cameraAcceleration = 0.05;
    this.camera.maxCameraSpeed = 20;
    this.camera.radius = 10;
    this.camera.lowerRadiusLimit = 10;
    this.camera.upperRadiusLimit = 10;
    this.camera.inputs.removeByType("FreeCameraMouseWheelInput");
    this.camera.checkCollisions = true;
    this.camera.collisionRadius = new Vector3(1, 1, 1);
    this.camera.applyGravity = false;

    this.camera.attachControl(this._canvas, true);
    this._scene.activeCamera = this.camera;

    new HemisphericLight("lightCity", new Vector3(0, 1, 0), this._scene);
    this._scene.clearColor = new Color3(0.7, 0.85, 1);

    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, this._scene);
    const skyMat = new SkyMaterial("skyMaterial", this._scene);
    skyMat.backFaceCulling = false;
    skyMat.inclination = 0;
    skybox.material = skyMat;
  }

  loadJumpSound() {
    this.jumpSound = new Sound("jumpSound", Constants.JUMP_SOUND_URL, this._scene, null, { volume: 5 });
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
    const result = await AssetLoader.loadMesh(this._scene, Constants.CITY_MESH_URL); // Chemin relatif type 'assets/meshs/City.glb'
    const rootMesh = result.meshes[0];
    rootMesh.name = "CityBuildings";
    rootMesh.position.y = 0;
    rootMesh.setEnabled(false);

    SceneUtils.enableCollisionsRecursively(rootMesh);
    this.cityMeshes.push(rootMesh);
    return rootMesh;
  }

  async importPlayer() {
    this.player = new Player(this._scene, Constants.PLAYER_MESH_URL); // Chemin relatif type 'assets/meshs/Player.glb'
    const { mesh, animations } = await this.player.load();

    mesh.setEnabled(false);
    mesh.checkCollisions = true;
    mesh.ellipsoid = new Vector3(0.5, 1, 0.5);
    mesh.ellipsoidOffset = new Vector3(0, 1, 0);
    mesh.position = new Vector3(0, 1.2, 0);

    this.playerController = new PlayerController(
      this._scene,
      mesh,
      animations,
      0.1,
      this.jumpSound,
      this.groundLimits
    );

    this.camera.lockedTarget = mesh;
    return { mesh, animations };
  }
}

export default CityScene;
