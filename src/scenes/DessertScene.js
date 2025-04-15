import { Scene, FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import BaseScene from "../BaseScene";
import { Inspector } from '@babylonjs/inspector';
import Player from "../models/Player";
import meshUrl from "../../assets/meshs/Player.glb";

class DessertScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
  }

  initScene() {
  this.importMeshPlayer()
    const camera = new FreeCamera("cameraDessert", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

    // Configuration de la lumière
    const light = new HemisphericLight("lightDessert", new Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;

    // Création du sol
    const ground = MeshBuilder.CreateGround("groundDessert", { width: 10, height: 10 }, this._scene);

    // Affichage de l'inspecteur pour debug
    Inspector.Show(this._scene, {});

    // Ajout des éléments spécifiques au désert
    

    return this._scene;  // Retourne la scène
  }
  importMeshPlayer() {
    this.player = new Player(this._scene, meshUrl);  // Utilisation du meshUrl
    this.player.load();  // Charge et positionne le joueur
  }
}

export default DessertScene;
