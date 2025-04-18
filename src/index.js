import { Engine } from "@babylonjs/core";
import MainMenuScene from "./scenes/MainMenuScene";
import ForestScene from "./scenes/ForestScene";
import DessertScene from "./scenes/DessertScene";
import CityScene from "./scenes/CityScene";

class Game {
  constructor() {
    this.canvas = document.getElementById("renderCanvas");
    this.engine = new Engine(this.canvas, true);
    this.currentScene = null;
    this.currentSceneName = "";
    this.scenes = {};
    this.loader = document.getElementById("loader");
  }

  async initGame() {
    this.scenes = {
      mainMenu: new MainMenuScene(this.engine, this.canvas),
      forest: new ForestScene(this.engine, this.canvas),
      dessert: new DessertScene(this.engine, this.canvas),
      city: new CityScene(this.engine, this.canvas)
    };

    await this.switchScene("mainMenu");
  }

  async switchScene(sceneName) {
    if (!this.scenes[sceneName]) {
      console.error(`Scene ${sceneName} does not exist`);
      return;
    }

    this.showLoader();

    this.currentScene = this.scenes[sceneName];
    const scene = await this.currentScene.initScene(); // Assure-toi que initScene() est async
    this.currentSceneName = sceneName;

    this.hideLoader();
  }

  showLoader() {
    if (this.loader) this.loader.style.display = "flex";
  }

  hideLoader() {
    if (this.loader) this.loader.style.display = "none";
  }

  start() {
    window.addEventListener("DOMContentLoaded", async () => {
      await this.initGame();

      this.engine.runRenderLoop(() => {
        if (this.currentScene && this.currentScene.scene) {
          this.currentScene.scene.render();
        }
      });

      window.addEventListener("resize", () => {
        this.engine.resize();
      });
    });
  }
}

const game = new Game();
window.game = game;
game.start();
