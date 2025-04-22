import { Scene } from "@babylonjs/core";



class BaseScene {
  constructor(engine, canvas) {
    this._engine = engine;
    this._canvas = canvas;
    this._scene = new Scene(this._engine);  
    this.player = null;  
  }

  gameLoop() {
    this._engine.runRenderLoop(() => {
      this._scene.render();  
    });
  }

  get scene() {
    return this._scene;
  }
}

export default BaseScene;
