// CityScene.js
import { Scene, FreeCamera, HemisphericLight, MeshBuilder, Vector3 } from "@babylonjs/core";
import BaseScene from "../BaseScene";
import { Inspector } from "@babylonjs/inspector";
import ImportMesh from "../models/ImportMesh";  

import meshUrl from "../../assets/meshs/cityBuildings.glb";

class CityScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
  }

  initScene() {
    super.initScene();
    
    // Création de la caméra
    const camera = new FreeCamera("cameraCity", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);

    // Configuration de la lumière
    const light = new HemisphericLight("lightCity", new Vector3(0, 1, 0), this._scene);
    light.intensity = 0.7;

    // Création du sol
    const ground = MeshBuilder.CreateGround("groundCity", { width: 10, height: 10 }, this._scene);

    // Ajout d'un bâtiment
   
    // Importation de la ville en tant que mesh
    const cityMesh = new ImportMesh(this._scene, meshUrl, new Vector3(0, 0, 0), "CityBuildings");
    cityMesh.load();

    // Affichage de l'inspecteur pour debug
    Inspector.Show(this._scene, {});

    return this._scene;  // Retourne la scène
  }
}

export default CityScene;
