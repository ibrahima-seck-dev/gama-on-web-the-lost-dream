import { SceneLoader } from "@babylonjs/core";

class AssetLoader {
  /**
   * Charge un mesh depuis un fichier glTF/glb
   * @param {Scene} scene
   * @param {string} url - chemin complet vers le mesh (glb/gltf)
   * @returns {Promise<ImportMeshResult>}
   */
  static async loadMesh(scene, url) {
    try {
      const result = await SceneLoader.ImportMeshAsync("", "", url, scene);
      return result;
    } catch (err) {
      console.error(`Erreur lors du chargement du mesh : ${url}`, err);
      throw err;
    }
  }
}

export default AssetLoader;
