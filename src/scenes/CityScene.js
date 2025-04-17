// CityScene.js
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
import ImportMesh from "../models/ImportMesh";
import Player from "../models/Player";
import PlayerController from "../controllers/PlayerController";
import WallBuilder from "../utlils/WallBuilder"; // vérifie le chemin !

// URLs des assets
import playerMeshUrl from "../../assets/meshs/Player.glb";
import cityMeshUrl   from "../../assets/meshs/city.glb";
import jumpSoundUrl  from "../../assets/sounds/jump2.wav";

class CityScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.jumpSound   = null;
    this.groundLimits= null;
    this.cityMeshes  = [];
    this.player      = null;
  }

  initScene() {
    // 1) Caméra + collisions
    this.createSceneCity();

    // 2) Sons, sol, murs
    this.loadJumpSound();
    this.createGround();
    this.createBoundaryWalls();

    // 3) Charger la ville et activer collisions sur objects_99
    this.importMeshScene();

    // 4) Charger le joueur et le contrôleur
    this.importMeshPlayer();

    Inspector.Show(this._scene, {});

    // Occlusion alternative (optionnel, tu peux garder ou supprimer)
    this._scene.registerBeforeRender(() => {
      const cam    = this.camera;
      const target = cam.lockedTarget;
      if (!target) return;

      cam.position.y = target.position.y + cam.heightOffset;
      const origin = cam.position;
      const dir    = target.position.subtract(origin).normalize();
      const ray    = new Ray(origin, dir, Vector3.Distance(origin, target.position));

      this.cityMeshes.forEach(m => m.visibility = 1);
      this._scene.multiPickWithRay(ray, m => this.cityMeshes.includes(m))
        .forEach(p => p.pickedMesh && (p.pickedMesh.visibility = 0.2));
    });

    return this._scene;
  }

  createSceneCity() {
    // Active globalement les collisions
    this._scene.collisionsEnabled = true;

    // Caméra tiers‑personne
    this.camera = new FollowCamera("cameraCity", new Vector3(0, 10, 15), this._scene);
    this.camera.heightOffset = 5;
    this.camera.rotationOffset = 0;
    this.camera.cameraAcceleration = 0.05;
    this.camera.maxCameraSpeed = 20;

    // Bloquer zoom
    this.camera.radius = 10;
    this.camera.lowerRadiusLimit = 10;
    this.camera.upperRadiusLimit = 10;
    this.camera.inputs.removeByType("FreeCameraMouseWheelInput");

    // Activer collision & recul auto
    this.camera.checkCollisions = true;
    this.camera.collisionRadius = new Vector3(1, 1, 1);
    this.camera.applyGravity    = false;

    this.camera.attachControl(this._canvas, true);
    this._scene.activeCamera = this.camera;

    // Lumière + ciel
    new HemisphericLight("lightCity", new Vector3(0, 1, 0), this._scene);
    this._scene.clearColor = new Color3(0.7, 0.85, 1);
    const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, this._scene);
    const skyMat = new SkyMaterial("skyMaterial", this._scene);
    skyMat.backFaceCulling = false;
    skyMat.inclination    = 0;
    skybox.material       = skyMat;
  }

  loadJumpSound() {
    this.jumpSound = new Sound("jumpSound", jumpSoundUrl, this._scene, null, { volume: 5 });
  }

  createGround() {
    const width = 200, depth = 200;
    const ground = MeshBuilder.CreateGround("Playground", { width, height: depth }, this._scene);
    ground.position.y = 0;
    ground.checkCollisions = true;
    const mat = new StandardMaterial("groundMat", this._scene);
    mat.alpha = 0;
    ground.material = mat;

    const halfW = width / 2, halfD = depth / 2, margin = 2;
    this.groundLimits = {
      minX: -halfW + margin,
      maxX:  halfW - margin,
      minZ: -halfD + margin,
      maxZ:  halfD - margin
    };
  }

  createBoundaryWalls() {
    WallBuilder.create(this._scene, this.groundLimits, {
      wallHeight:   10,
      thickness:    1,
      color:        new Color3(0.8, 0.8, 0.8),
      materialAlpha:1
    });
  }

  importMeshScene() {
    const city = new ImportMesh(this._scene, cityMeshUrl, Vector3.Zero(), "CityBuildings");
    city.load(mesh => {
      mesh.position.y = 0;

      // Activer collisions sur le root objects_99
      if (mesh.name === "objects_99") {
        mesh.checkCollisions = true;
        mesh.getChildren().forEach(c => c.isMesh && (c.checkCollisions = true));
      }

      this.cityMeshes.push(mesh);
    });
  }

  importMeshPlayer() {
    this.player = new Player(this._scene, playerMeshUrl);
    this.player.load((mesh, animations) => {
      mesh.checkCollisions       = true;
      mesh.ellipsoid              = new Vector3(0.5, 1, 0.5);
      mesh.ellipsoidOffset        = new Vector3(0, 1, 0);
      mesh.position               = new Vector3(0, 1.2, 0);

      this.playerController = new PlayerController(
        this._scene, mesh, animations,
        0.1, this.jumpSound, this.groundLimits
      );

      // Verrouiller la caméra sur le joueur
      this.camera.lockedTarget = mesh;
    });
  }
}

export default CityScene;
