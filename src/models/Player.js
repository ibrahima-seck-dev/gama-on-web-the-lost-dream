import AssetLoader from "../utils/AssetLoader";
import { Vector3 } from "@babylonjs/core";

class Player {
  constructor(scene, meshUrl) {
    this.scene = scene;
    this.meshUrl = meshUrl;
    this.mesh = null;
    this.animations = {};
  }

  async load() {
    try {
      const result = await AssetLoader.loadMesh(this.scene, this.meshUrl);
      const mesh = result.meshes.find(m => m && m.isMesh && m.name !== "__root__") || result.meshes[0];
      if (!mesh) throw new Error("No valid player mesh found");

      this.mesh = mesh;
      this.mesh.name = "Player";
      this.mesh.checkCollisions = true;
      this.mesh.ellipsoid = new Vector3(0.5, 1, 0.5);
      this.mesh.ellipsoidOffset = new Vector3(0, 1, 0);

      if (this.mesh.bakeCurrentTransformIntoVertices) {
        this.mesh.bakeCurrentTransformIntoVertices();
      }

      result.animationGroups.forEach(group => {
        if (group?.name) {
          this.animations[group.name] = group;
        }
      });

      return { mesh: this.mesh, animations: this.animations };
    } catch (error) {
      console.error("Erreur lors du chargement du joueur:", error);
      throw error;
    }
  }
}

export default Player;
