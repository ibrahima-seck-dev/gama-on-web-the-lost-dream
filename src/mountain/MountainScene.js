import { Scene, FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import BaseScene from "../BaseScene";
import { Inspector } from "@babylonjs/inspector";

class MontainScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
    
  }
  
  createScene() {
    this._scene = new Scene(this._engine);

    const camera = new FreeCamera("cameraMontagne", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

    // Configuration de la lumière
    const light = new HemisphericLight("lightMontagne", new Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;

    // Création du sol
    const ground = MeshBuilder.CreateGround("groundMontagne", { width: 10, height: 10 }, this._scene);

    // Affichage de l'inspecteur (pour debug)
    Inspector.Show(this._scene, {});

    return this._scene;  // ✅ On retourne bien `_scene`
  }
}

export default MontainScene;
