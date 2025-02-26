// On importe le moteur de Babylon.js
import { Engine } from "@babylonjs/core";
// On importe la classe Game que nous venons de créer
import Game from "./game";

// Déclaration des variables pour le canvas et l'engine
let canvas;
let engine;

// Fonction d'initialisation asynchrone pour configurer le canvas et l'engine
const babylonInit = async () => {
  // Récupère l'élément canvas dans le HTML grâce à son id
  canvas = document.getElementById("renderCanvas");

  // Crée une instance d'Engine pour le rendu avec le canvas, sans antialiasing
  engine = new Engine(canvas, false, {
    adaptToDeviceRatio: true, // Adapte le rendu à la densité de pixels de l'appareil
  });

  // Redimensionne le canvas si la taille de la fenêtre change
  window.addEventListener("resize", () => {
    engine.resize();
  });
};

// Une fois la fenêtre chargée, on initialise Babylon et on démarre le jeu
window.onload = () => {
  babylonInit().then(() => {
    // Création d'une instance de Game avec le canvas et l'engine
    const game = new Game(canvas, engine);
    // Démarre la boucle de rendu et donc le jeu
    game.start();
  });
};
