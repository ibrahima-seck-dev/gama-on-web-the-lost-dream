import { Scene } from "@babylonjs/core";
import Player from "./models/Player";
import meshUrl from "../assets/meshs/Player.glb";

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
  // Méthode à appeler après pour créer la scène
  initScene() {
    this.importMesh();  // Charger le personnage directement ici
  }

  importMesh() {
    this.player = new Player(this._scene, meshUrl);  // Utilisation du meshUrl
    this.player.load();  // Charge et positionne le joueur
  }
}

export default BaseScene;
