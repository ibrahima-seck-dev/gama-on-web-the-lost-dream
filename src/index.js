import { Engine } from "@babylonjs/core";
import MainMenuScene from "./scenes/MainMenuScene";
import ForestScene from "./scenes/ForestScene";
import DessertScene from "./scenes/DessertScene";
import CityScene from "./scenes/CityScene";

class Index {
  constructor() {
    this.canvas = document.getElementById("renderCanvas");
    this.engine = new Engine(this.canvas, true);
    this.currentScene = null;
    this.currentSceneName = "";
    this.scenes = {};
  }

  // Initialisation du jeu
  initGame() {
    // Créer les scènes dès le début
    const mainMenuScene = new MainMenuScene(this.engine, this.canvas);
    const forestScene = new ForestScene(this.engine, this.canvas);
    const dessertScene = new DessertScene(this.engine, this.canvas);
    const cityScene = new CityScene(this.engine, this.canvas);

    // Stocker les scènes dans un objet
    this.scenes = {
      "mainMenu": mainMenuScene,
      "forest": forestScene,
      "dessert": dessertScene,
      "city": cityScene
    };

    // Initialiser la scène principale (Menu)
    this.switchScene("mainMenu");
  }

  // Méthode pour changer de scène de manière synchrone
  switchScene(sceneName) {
    if (this.scenes[sceneName]) {
      console.log(`Switching to scene: ${sceneName}`);
  
   
  
      this.currentScene = this.scenes[sceneName];
      this.currentScene.initScene();  // Appel de la méthode synchrone pour initialiser la scène
      this.currentSceneName = sceneName;
    } else {
      console.error(`Scene ${sceneName} does not exist!`);
    }
  }

  // Méthode pour démarrer le moteur de jeu
  start() {
    window.onload = () => {
      console.log('Game Starting...');
      
      // Initialiser le jeu (scènes)
      this.initGame();

      // Démarrer la boucle de rendu
      this.engine.runRenderLoop(() => {
        if (this.currentScene && this.currentScene.scene) {
          this.currentScene.scene.render();
        }
      });

      // Adapter la taille du moteur à la taille du canvas
      window.addEventListener("resize", () => {
        this.engine.resize();
      });
    };
  }
}

// Créer une instance du jeu et l'attacher à window pour un accès global
const game = new Index();
window.game = game;  // ⚠️ Important pour l'accès global

// Démarrer le jeu
game.start();

export { Index };
