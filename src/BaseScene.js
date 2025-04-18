import { Scene } from "@babylonjs/core";
import Player from "./models/Player";


class BaseScene {
  constructor(engine, canvas) {
    this._engine = engine;
    this._canvas = canvas;
    this._scene = new Scene(this._engine);  // La scène est initialisée sans la créer encore
    this.player = null;  // Ajout de la propriété player
  }

  gameLoop() {
    this._engine.runRenderLoop(() => {
      this._scene.render();  // Boucle de rendu
    });
  }

  get scene() {
    return this._scene;
  }
}

export default BaseScene;
