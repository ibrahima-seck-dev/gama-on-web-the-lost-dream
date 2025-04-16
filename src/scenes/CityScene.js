import {
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Sound
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import BaseScene from "../BaseScene";
import ImportMesh from "../models/ImportMesh";
import Player from "../models/Player";
import PlayerController from "../controllers/PlayerController";

import playerMeshUrl from "../../assets/meshs/Player.glb";
import cityMeshUrl from "../../assets/meshs/cityBuildings.glb";
import jumpSoundUrl from "../../assets/sounds/jump2.wav";

class CityScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.jumpSound = null;
    this.cityMeshRef = null;
    this.playerController = null;
  }

  initScene() {
    this.createCityScene();
    this.loadJumpSound();
    this.importCityMesh();
    this.importPlayerMesh();
    Inspector.Show(this._scene, {});
    return this._scene;
  }

  createCityScene() {
    // Caméra qui suit le joueur
    this.cameraPlayer = new ArcRotateCamera(
      "cameraPlayer",
      Math.PI / 2,
      Math.PI / 3,
      8,
      new Vector3(0, 1, 0),
      this._scene
    );
    this.cameraPlayer.attachControl(this._canvas, true);
    this.cameraPlayer.lowerBetaLimit = 0.1;
    this.cameraPlayer.upperBetaLimit = Math.PI - 0.1;
    this.cameraPlayer.wheelPrecision = 50;

    // Caméra fixe
    this.cameraWorld = new ArcRotateCamera(
      "cameraWorld",
      Math.PI / 2,
      Math.PI / 3.5,
      40,
      new Vector3(0, 5, 0),
      this._scene
    );

    this._scene.activeCamera = this.cameraPlayer;

    // Lumière
    new HemisphericLight("lightCity", new Vector3(0, 1, 0), this._scene);

    // Touche pour changer de caméra
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "c") {
        this.switchCamera();
      }
    });
  }

  switchCamera() {
    if (this._scene.activeCamera === this.cameraPlayer) {
      this.cameraPlayer.detachControl(this._canvas);
      this._scene.activeCamera = this.cameraWorld;
      this.cameraWorld.attachControl(this._canvas, true);
      if (this.playerController) this.playerController.active = false;
    } else {
      this.cameraWorld.detachControl(this._canvas);
      this._scene.activeCamera = this.cameraPlayer;
      this.cameraPlayer.attachControl(this._canvas, true);
      if (this.playerController) this.playerController.active = true;
    }
  }

  loadJumpSound() {
    this.jumpSound = new Sound("jumpSound", jumpSoundUrl, this._scene, null, {
      volume: 5,
    });
  }

  importCityMesh() {
    const city = new ImportMesh(this._scene, cityMeshUrl, new Vector3(0, 0, 0), "City");
    city.load((mesh) => {
      this.cityMeshRef = mesh;
      if (this.playerController) {
        this.playerController.setLimits(mesh);
      }
    });
  }

  importPlayerMesh() {
    this.player = new Player(this._scene, playerMeshUrl);
    this.player.load((mesh, animations) => {
      this.playerController = new PlayerController(this._scene, mesh, animations, 0.1, this.jumpSound);
      this.playerController.active = true;

      mesh.position = new Vector3(0, 0.5, 0);

      if (this.cityMeshRef) {
        this.playerController.setLimits(this.cityMeshRef);
      }

      this.cameraPlayer.target = mesh;
    });
  }
}

export default CityScene;
