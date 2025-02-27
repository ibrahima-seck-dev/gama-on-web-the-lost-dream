// ImportMesh.js
import { SceneLoader, Vector3 } from "@babylonjs/core";

class ImportMesh {
  constructor(scene, modelPath, position = new Vector3(0, 0, 0), name = "ImportedMesh") {
    this.scene = scene;
    this.modelPath = modelPath;
    this.position = position;
    this.name = name;
    this.mesh = null;  // Le mesh sera chargé ici
  }

  load() {
    SceneLoader.ImportMesh("", "", this.modelPath, this.scene, (meshes) => {
      if (meshes.length > 0) {
        this.mesh = meshes[0];  // Le premier mesh chargé
        this.mesh.position = this.position;  // Positionner le mesh dans la scène
        this.mesh.name = this.name;  // Donner un nom pour l'inspecteur
      }
    });
  }
}

export default ImportMesh;
