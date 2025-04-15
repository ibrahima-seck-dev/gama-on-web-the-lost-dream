import { SceneLoader, Vector3 } from "@babylonjs/core";

class Player {
  constructor(scene, modelPath, position = new Vector3(0, 0, 0), name = "player") {
    this.scene = scene;
    this.modelPath = modelPath;
    this.position = position;
    this.mesh = null;
    this.name = name;  // Nom du player
  }

  // Méthode pour charger le mesh du joueur de manière synchrone
  load() {
    SceneLoader.ImportMesh("", "", this.modelPath, this.scene, (meshes) => {
      if (meshes.length > 0) {
        this.mesh = meshes[0];  // Le mesh du player
        this.mesh.position = this.position;  // Positionner le mesh du player dans la scène
        this.mesh.name = this.name;  // Assigner le nom au mesh
        console.log('Mesh du joueur chargé:', this.mesh);
      } else {
        console.error('Aucun mesh du joueur n\'a été chargé.');
      }
    });
  }
}

export default Player;
