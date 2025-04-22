import { SceneLoader, Vector3 } from "@babylonjs/core";

export default class KeyItem {
  constructor(scene, mesh) {
    this.scene = scene;
    this.mesh = mesh;
    this.collected = false;
  }

  static async create(scene, url) {
    const result = await SceneLoader.ImportMeshAsync("", url, "", scene);
    const mesh = result.meshes[0];
    mesh.name = "Key";
    mesh.setEnabled(true); // visible au départ
    return new KeyItem(scene, mesh);
  }

  collect(playerMesh, skeleton = null) {
    this.collected = true;
    this.mesh.setEnabled(true);

    if (skeleton) {
      const handBone = skeleton.bones.find(b => b.name.toLowerCase().includes("hand"));
      if (handBone) {
        handBone.attachToBone(this.mesh, playerMesh);
        this.mesh.position = new Vector3(0, 0, 0);
      }
    } else {
      this.mesh.setParent(playerMesh);
      this.mesh.position = new Vector3(0.3, 1.3, 0.2);
      this.mesh.rotation = new Vector3(0, Math.PI / 2, 0);
    }
  }
}
