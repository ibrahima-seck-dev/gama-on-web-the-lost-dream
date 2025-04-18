import AssetLoader from "../utils/AssetLoader";

class ImportMesh {
  constructor(scene, meshUrl, position = null, name = "ImportedMesh") {
    this.scene = scene;
    this.meshUrl = meshUrl;
    this.position = position;
    this.name = name;
  }

  async load() {
    try {
      const result = await AssetLoader.loadMesh(this.scene, this.meshUrl);
      const rootMesh = result.meshes[0];
      if (!rootMesh) throw new Error("Mesh not found");

      rootMesh.name = this.name;
      if (this.position) rootMesh.position = this.position;

      return rootMesh;
    } catch (error) {
      console.error("Erreur lors du chargement du mesh:", error);
      throw error;
    }
  }
}

export default ImportMesh;
