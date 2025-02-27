import { SceneLoader, Vector3 } from "@babylonjs/core";

class Player {
  constructor(scene, modelPath, position = new Vector3(0, 0, 0), name = "player") {
    this.scene = scene;
    this.modelPath = modelPath;
    this.position = position;
    this.mesh = null;
    this.name = name; // Nom du player
  }

  load() {
    // Importation du mesh du joueur
    SceneLoader.ImportMesh("", "", this.modelPath, this.scene, (meshes) => {
      this.mesh = meshes[0]; // Le mesh du player
      this.mesh.position = this.position; // Positionner le mesh du player dans la scène
      this.mesh.name = this.name; // Assigner le nom au mesh
    });
  }
}

export default Player;
