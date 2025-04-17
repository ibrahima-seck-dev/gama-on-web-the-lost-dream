// utils/WallBuilder.js
import { MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";

class WallBuilder {
  static create(scene, groundLimits, options = {}) {
    const { minX, maxX, minZ, maxZ } = groundLimits;
    const wallHeight = options.wallHeight || 10;
    const thickness = options.thickness || 1;

    const mat = new StandardMaterial("wallMat", scene);
    mat.diffuseColor = new Color3(0.8, 0.8, 0.8);
    mat.alpha = 1;

    const makeWall = (width, height, depth, x, y, z) => {
      const wall = MeshBuilder.CreateBox("wall", { width, height, depth }, scene);
      wall.position.set(x, y, z);
      wall.checkCollisions = true;
      wall.material = mat;
    };

    // Bas
    makeWall(maxX - minX, wallHeight, thickness, (minX + maxX) / 2, wallHeight / 2, minZ);
    // Haut
    makeWall(maxX - minX, wallHeight, thickness, (minX + maxX) / 2, wallHeight / 2, maxZ);
    // Gauche
    makeWall(thickness, wallHeight, maxZ - minZ, minX, wallHeight / 2, (minZ + maxZ) / 2);
    // Droite
    makeWall(thickness, wallHeight, maxZ - minZ, maxX, wallHeight / 2, (minZ + maxZ) / 2);
  }
}

export default WallBuilder;
