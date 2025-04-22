import Player from "../models/Player";
import PlayerController from "../controllers/PlayerController";
import { Vector3 } from "@babylonjs/core";

class PlayerFactory {
  static async create(scene, meshUrl, jumpSound, groundLimits) {
    const player = new Player(scene, meshUrl);
    const { mesh, animations } = await player.load();

    mesh.setEnabled(false);
    mesh.checkCollisions = true;
    mesh.ellipsoid = new Vector3(0.5, 1, 0.5);
    mesh.ellipsoidOffset = new Vector3(0, 1, 0);

    const groundY = groundLimits?.minY ?? 0;
    mesh.position = new Vector3(0, groundY + 0.3, 0);

    const controller = new PlayerController(
      scene,
      mesh,
      animations,
      0.1,
      jumpSound,
      groundLimits
    );

    return { mesh, animations, controller };
  }
}

export default PlayerFactory;
