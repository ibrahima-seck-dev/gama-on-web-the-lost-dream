// Importation des classes nécessaires de Babylon.js
import { 
  Color3, 
  FreeCamera, 
  HemisphericLight, 
  MeshBuilder, 
  Scene, 
  ShadowGenerator, 
  SpotLight, 
  StandardMaterial, 
  Texture, 
  Vector3, 
  KeyboardEventTypes
} from "@babylonjs/core";
import { Inspector } from "@babylonjs/inspector";

// Importation des textures utilisées pour le sol
import floorUrl from "../assets/textures/floor.png";
import floorBumpUrl from "../assets/textures/floor_bump.png";

class Game {
  // Définition des propriétés privées
  #engine;
  #canvas;
  #gameScene;
  #sphere;
  #phase = 0.0;
  #vitesseY = 0.0018;
  inputMap = {};
  actions = {};
  #zoneA

  // Constructeur de la classe
  constructor(canvas, engine) {
      this.#canvas = canvas;
      this.#engine = engine;
  }

  // Méthode pour démarrer le jeu
    start() {
      this.initGame();
      this.gameLoop();
  }

  // Méthode pour créer et configurer la scène Babylon
  createScene() {
      const scene = new Scene(this.#engine);

      // Création et configuration de la caméra
      const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(this.#canvas, true);

      // Création et configuration de la lumière
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;

      // Création d'une lampe spot pour les ombres
      const sLight = new SpotLight("spot1", new Vector3(0, 20, 20), new Vector3(0, -1, -1), 1.2, 24, scene);
      const shadowGenerator = new ShadowGenerator(1024, sLight);
      shadowGenerator.useBlurCloseExponentialShadowMap = true;

      // Création et configuration de la sphère
      const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
      this.#sphere = sphere;
      sphere.position.y = 1;
      shadowGenerator.addShadowCaster(sphere);

      // Création et configuration du sol
      const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
      ground.receiveShadows = true;

      // Application des textures sur le sol
      const matGround = new StandardMaterial("boue", scene);
      matGround.diffuseTexture = new Texture(floorUrl);
      matGround.bumpTexture = new Texture(floorBumpUrl);
      ground.material = matGround;

      // Création et application du matériau de la sphère
      const matSphere = new StandardMaterial("silver", scene);
      matSphere.diffuseColor = new Color3(0.8, 0.8, 1);
      matSphere.specularColor = new Color3(0.4, 0.4, 1);
      sphere.material = matSphere;
      this.#zoneA = MeshBuilder.CreateBox("zoneA", {width:8, height:0.2, depth:8},
        scene);
        let zoneMat = new StandardMaterial("zoneA", scene);
        zoneMat.diffuseColor = Color3.Red();
        zoneMat.alpha = 0.5;
        this.#zoneA.material = zoneMat;
        this.#zoneA.position = new Vector3(12, 0.1, 12);
      // Affichage de l'inspecteur Babylon.js
      Inspector.Show(scene, {});
      return scene;
  }
  
  // Initialisation du jeu
  initGame() {
      this.#gameScene = this.createScene();
      this.initInput();
  }

  // Boucle principale du jeu
  gameLoop() {
      const divFps = document.getElementById("fps");
      this.#engine.runRenderLoop(() => {
          this.updateGame();
          if (divFps) {
              divFps.innerHTML = this.#engine.getFps().toFixed() + " fps";
          }
          this.#gameScene.render();
      });
  }

  // Mise à jour de la logique du jeu
  updateGame() {
      let delta = this.#engine.getDeltaTime();
      this.#phase += this.#vitesseY * delta;
      this.#sphere.position.y = 2 + Math.sin(this.#phase);

      // Gestion des déplacements avec le clavier
      if (this.inputMap["KeyA"]) {
        this.#sphere.position.x -= 0.01 * delta;
      } else if (this.inputMap["KeyD"]) {
        this.#sphere.position.x += 0.01 * delta;
      }
      if (this.inputMap["KeyW"]) {
        this.#sphere.position.z += 0.01 * delta;
      } else if (this.inputMap["KeyS"]) {
        this.#sphere.position.z -= 0.01 * delta;
      }
      
      // Augmentation de la vitesse avec la touche Espace
      if (this.actions["Space"]) {
        this.#vitesseY *= 1.25;
      }
      
      // Effet d'oscillation sur la sphère
      this.#sphere.scaling.y = 1 + 0.125 * Math.sin(this.#phase);
      if (this.#sphere.intersectsMesh(this.#zoneA, false))
        this.#sphere.material.emissiveColor = Color3.Red();
        else
        this.#sphere.material.emissiveColor = Color3.Black();
  }

  // Gestion des entrées clavier
  initInput() {
      this.#gameScene.onKeyboardObservable.add((kbInfo) => {
          switch (kbInfo.type) {
              case KeyboardEventTypes.KEYDOWN:
                  this.inputMap[kbInfo.event.code] = true;
                  console.log(`KEY DOWN: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                  break;
              case KeyboardEventTypes.KEYUP:
                  this.inputMap[kbInfo.event.code] = false;
                  this.actions[kbInfo.event.code] = true;
                  console.log(`KEY UP: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                  break;
          }
      });
  }
}

export default Game;
