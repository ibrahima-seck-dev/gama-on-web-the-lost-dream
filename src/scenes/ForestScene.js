import { Scene, FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import BaseScene from "../BaseScene";
import { Inspector } from "@babylonjs/inspector";
import Player from "../models/Player";

class ForestScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.player = null;
  }

  initScene() {
    super.initScene();  // Appelle l'initialisation du joueur
    const camera = new FreeCamera("cameraMontagne", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

    // Configuration de la lumière
    const light = new HemisphericLight("lightMontagne", new Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;

    // Création du sol
    const ground = MeshBuilder.CreateGround("groundMontagne", { width: 10, height: 10 }, this._scene);
    this.player = new Player(this._scene, "path/to/your/playerModel.glb");
    this.player.load();
    // Affichage de l'inspecteur (pour debug)
    Inspector.Show(this._scene, {});

    return this._scene;  // Retourne la scène
  }
  importMesh() {
    this.player = new Player(this._scene, meshUrl);  // Utilisation du meshUrl
    this.player.load();  // Charge et positionne le joueur
  }
}

export default ForestScene;
