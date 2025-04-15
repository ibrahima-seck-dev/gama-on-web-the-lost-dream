import { SceneLoader, Vector3 } from "@babylonjs/core";

class ImportMesh {
  constructor(scene, modelPath, position = new Vector3(0, 0, 0), name = "ImportedMesh") {
    this.scene = scene;
    this.modelPath = modelPath;
    this.position = position;
    this.name = name;
    this.mesh = null;  // Le mesh sera chargé ici
  }

  // Méthode pour charger le mesh de manière synchrone
  load() {
    SceneLoader.ImportMesh("", "", this.modelPath, this.scene, (meshes) => {
      if (meshes.length > 0) {
        this.mesh = meshes[0];  // Le premier mesh chargé
        this.mesh.position = this.position;  // Positionner le mesh dans la scène
        this.mesh.name = this.name;  // Donner un nom pour l'inspecteur
        console.log('Mesh loaded:', this.mesh);
      } else {
        console.error('Aucun mesh n\'a été chargé.');
      }
    });
  }
}

export default ImportMesh;
