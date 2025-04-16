import { FollowCamera, HemisphericLight, Vector3, Sound } from "@babylonjs/core";
import BaseScene from "../BaseScene";
import { Inspector } from "@babylonjs/inspector";
import ImportMesh from "../models/ImportMesh";
import Player from "../models/Player";
import PlayerController from "../controllers/PlayerController";

// URLs des assets
import playerMeshUrl from "../../assets/meshs/Player.glb";
import cityMeshUrl from "../../assets/meshs/cityBuildings.glb";
import jumpSoundUrl from "../../assets/sounds/jump2.wav";

class CityScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.jumpSound = null;
  }

  initScene() {
    this.createSceneCity();
    this.loadJumpSound();
    this.importMeshPlayer();
    this.importMeshScene();
    Inspector.Show(this._scene, {}); // Debug
     // Attends 2 secondes le temps que les meshes soient chargés
    return this._scene;
  }

  createSceneCity() {
    // Caméra suiveuse
    this.camera = new FollowCamera("cameraCity", new Vector3(0, 10, -10), this._scene);
    this.camera.radius = 10;
    this.camera.heightOffset = 5;
    this.camera.rotationOffset = 180;
    this.camera.cameraAcceleration = 0.05;
    this.camera.maxCameraSpeed = 20;
    this.camera.attachControl(this._canvas, true);

    // Caméra active
    this._scene.activeCamera = this.camera;

    // Lumière
    const light = new HemisphericLight("lightCity", new Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;
  }

  loadJumpSound() {
    // Chargement du son de saut
    this.jumpSound = new Sound("jumpSound", jumpSoundUrl, this._scene, null, {
      volume: 5,
    });
  }

  importMeshPlayer() {
    this.player = new Player(this._scene, playerMeshUrl);
    this.player.load((mesh, animations) => {
      // Création du contrôleur du joueur avec le son de saut
      this.playerController = new PlayerController(this._scene, mesh, animations, 0.1, this.jumpSound);

      // Caméra suit le joueur
      this.camera.lockedTarget = mesh;

      // Position de départ du joueur
      mesh.position = new Vector3(0, 0.5, 0);
    });
  }

  importMeshScene() {
    const cityMesh = new ImportMesh(this._scene, cityMeshUrl, new Vector3(0, 0, 0), "CityBuildings");
    cityMesh.load();
  }
}

export default CityScene;
