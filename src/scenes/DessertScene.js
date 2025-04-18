import { 
  Scene, 
  FreeCamera, 
  HemisphericLight, 
  MeshBuilder, 
  Vector3 
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

import BaseScene from "../BaseScene";
import Player from "../models/Player";
import Constants from "../utils/Constants";  // Pour les chemins de mesh

class DessertScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.player = null;
  }

  async initScene() {
    await this.importMeshPlayer();

    const camera = new FreeCamera("cameraDessert", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

    const light = new HemisphericLight("lightDessert", new Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;

    const ground = MeshBuilder.CreateGround("groundDessert", { width: 10, height: 10 }, this._scene);

    Inspector.Show(this._scene, {});

    return this._scene;
  }

  async importMeshPlayer() {
    this.player = new Player(this._scene, Constants.PLAYER_MESH_URL);
    const { mesh } = await this.player.load();

    mesh.position = new Vector3(0, 1.2, 0); // Positionnement
    mesh.checkCollisions = true;
    mesh.ellipsoid = new Vector3(0.5, 1, 0.5);
    mesh.ellipsoidOffset = new Vector3(0, 1, 0);
  }
}

export default DessertScene;
