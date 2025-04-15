import { Scene, FreeCamera, HemisphericLight, Vector3 } from "@babylonjs/core";
import BaseScene from "../BaseScene";
import { Inspector } from "@babylonjs/inspector";
import ImportMesh from "../models/ImportMesh";  
import Player from "../models/Player";
import playerMeshUrl from "../../assets/meshs/Player.glb";  // Renommage de l'URL du joueur
import cityMeshUrl from "../../assets/meshs/cityBuildings.glb";  // Renommage de l'URL des bâtiments

class CityScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
  }

  initScene() {
    this.createSceneCity();  // Appel de la méthode de création de la scène
    this.importMeshPlayer();  // Appel pour importer le mesh du joueur
    this.importMeshScene();  // Appel pour importer la scène (les bâtiments)
    Inspector.Show(this._scene, {}); // Affichage de l'inspecteur pour le débogage

    return this._scene; 
  }

  createSceneCity() {
    // Création de la caméra
    const camera = new FreeCamera("cameraCity", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

    // Création de la lumière
    const light = new HemisphericLight("lightCity", new Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;
  }

  importMeshPlayer() {
    this.player = new Player(this._scene, playerMeshUrl);  // Utilisation de l'URL du joueur
    this.player.load();  // Charge et positionne le joueur
  }

  importMeshScene() {
    const cityMesh = new ImportMesh(this._scene, cityMeshUrl, new Vector3(0, 0, 0), "CityBuildings");
    cityMesh.load();  // Charge et positionne les bâtiments
  }
}

export default CityScene;
