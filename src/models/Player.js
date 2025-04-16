import { SceneLoader, Vector3 } from "@babylonjs/core";

class Player {
  constructor(scene, meshUrl) {
    this.scene = scene;
    this.meshUrl = meshUrl;
    this.mesh = null;
    this.animations = {};
  }

  load(callback) {
    SceneLoader.ImportMesh("", "", this.meshUrl, this.scene, (meshes, _, __, animationGroups) => {
      this.mesh = meshes[0];
      this.mesh.name = "Player";
      this.mesh.checkCollisions = true;
      this.mesh.bakeCurrentTransformIntoVertices();

      animationGroups.forEach((anim) => {
        this.animations[anim.name] = anim;
      });

      if (callback) callback(this.mesh, this.animations);
    });
  }
}

export default Player;
