import { SceneLoader } from "@babylonjs/core";

export default class Door {
  constructor(scene, mesh) {
    this.scene = scene;
    this.mesh = mesh;
    this.isOpen = false;
  }

  static async create(scene, url) {
    const result = await SceneLoader.ImportMeshAsync("", url, "", scene);
    const mesh = result.meshes[0];
    mesh.name = "Door";
    return new Door(scene, mesh);
  }

  open() {
    if (!this.isOpen) {
      this.mesh.rotation.y += Math.PI / 2; // ouvrir en tournant
      this.isOpen = true;
    }
  }
}
