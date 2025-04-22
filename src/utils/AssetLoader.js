import { SceneLoader } from "@babylonjs/core";

class AssetLoader {
  /**
   * Charge un mesh depuis un fichier glTF/glb
   * @param {Scene} scene
   * @param {string} url - chemin complet vers le fichier (ex: "assets/models/city.glb")
   * @returns {Promise<ImportMeshResult>}
   */
  static async loadMesh(scene, url) {
    try {
      const rootUrl = url.substring(0, url.lastIndexOf("/") + 1);
      const fileName = url.split("/").pop();
      const result = await SceneLoader.ImportMeshAsync("", rootUrl, fileName, scene);
      return result;
    } catch (err) {
      console.error(`Erreur lors du chargement du mesh : ${url}`, err);
      throw err;
    }
  }
}

export default AssetLoader;
