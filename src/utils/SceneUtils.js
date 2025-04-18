import { MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";

class SceneUtils {
  /**
   * Crée un sol transparent avec collisions
   */
  static createGround(scene, width = 200, depth = 200) {
    const ground = MeshBuilder.CreateGround("Ground", { width, height: depth }, scene);
    const mat = new StandardMaterial("groundMat", scene);
    mat.alpha = 0;
    ground.material = mat;
    ground.checkCollisions = true;

    const margin = 2;
    return {
      mesh: ground,
      limits: {
        minX: -width / 2 + margin,
        maxX:  width / 2 - margin,
        minZ: -depth / 2 + margin,
        maxZ:  depth / 2 - margin
      }
    };
  }

  /**
   * Utilitaire pour rendre tous les enfants d’un mesh collisionnables
   */
  static enableCollisionsRecursively(mesh) {
    mesh.checkCollisions = true;
    mesh.getChildMeshes()?.forEach(child => child.checkCollisions = true);
  }
}

export default SceneUtils;
