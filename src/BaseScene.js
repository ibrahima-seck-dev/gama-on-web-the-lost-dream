import { Scene } from "@babylonjs/core";

class BaseScene {
  constructor(engine, canvas) {
    this._engine = engine;
    this._canvas = canvas;
    this._scene = new Scene(this._engine);  // La scène est initialisée sans la créer encore
  }

  gameLoop() {
    this._engine.runRenderLoop(() => {
      this._scene.render();  // Boucle de rendu
    });
  }

  get scene() {
    return this._scene;
  }

  // Méthode à appeler après pour créer la scène
  initScene() {
    // Appelle cette méthode dans la sous-classe pour effectuer la création spécifique de la scène
  }
}

export default BaseScene;
