import { SceneLoader, Vector3 } from "@babylonjs/core";

class Player {
  constructor(scene, meshUrl) {
    this.scene = scene;
    this.meshUrl = meshUrl;
    this.mesh = null;
    this.animations = {}; // Clés : "Jump", "Idle", "Run"
  }

  load(callback) {
    SceneLoader.ImportMesh("", "", this.meshUrl, this.scene, (meshes, particleSystems, skeletons, animationGroups) => {
      // On prend le premier mesh comme le joueur
      this.mesh = meshes[0];
      this.mesh.name = "Player";
      this.mesh.checkCollisions = true;
      this.mesh.bakeCurrentTransformIntoVertices();

      // Stockage des animations avec leurs noms exacts
      animationGroups.forEach((anim) => {
        this.animations[anim.name] = anim;
      });

      if (callback) callback(this.mesh, this.animations);
    });
  }
}

export default Player;
