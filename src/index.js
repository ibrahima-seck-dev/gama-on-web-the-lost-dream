import { Engine } from "@babylonjs/core";
import ForestScene from "./scenes/ForestScene";
import DessertScene from "./scenes/DessertScene";
import CityScene from "./scenes/CityScene";

window.onload = () => {
    console.log('Hello World!');

    const canvas = document.getElementById("renderCanvas");
    const engine = new Engine(canvas, true);
    let currentScene;

    // Dictionnaire des scènes disponibles
    const scenes = {
        "forest": new ForestScene(engine, canvas),
        "dessert": new DessertScene(engine, canvas),
        "city": new CityScene(engine, canvas)
    };

    // Fonction pour changer de scène
    function switchScene(sceneName) {
        if (scenes[sceneName]) {
            console.log(`Switching to scene: ${sceneName}`);
            currentScene = scenes[sceneName];
            currentScene.initScene();  // Appelle la méthode pour initialiser la scène
        }
    }

    // Sélectionner la scène par défaut
    switchScene("city");

    // Lancer la boucle de rendu
    engine.runRenderLoop(() => {
        if (currentScene && currentScene.scene) {
            currentScene.scene.render();
        }
    });

    // Ajuster la taille du canvas lors du redimensionnement
    window.addEventListener("resize", () => {
        engine.resize();
    });

    // Ajouter des boutons pour changer de scène
    document.getElementById("montainBtn").addEventListener("click", () => switchScene("montain"));
    document.getElementById("dessertBtn").addEventListener("click", () => switchScene("dessert"));
    document.getElementById("cityBtn").addEventListener("click", () => switchScene("city"));
};
