// On importe les classes nécessaires de Babylon.js
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
    Vector3 
  } from "@babylonjs/core";
  import { Inspector } from '@babylonjs/inspector';

// ... YOUR SCENE CREATION

  
  // On importe les textures utilisées pour le sol
  import floorUrl from "../assets/textures/floor.png";
  import floorBumpUrl from "../assets/textures/floor_bump.png";
  
  class Game {
    // Propriétés privées pour l'engine et le canvas
    #engine;
    #canvas;
  
    // Le constructeur reçoit le canvas HTML et l'engine Babylon
    constructor(canvas, engine) {
      this.#canvas = canvas;
      this.#engine = engine;
    }
  
    // Méthode pour démarrer le jeu
    start() {
      // Création de la scène
      const scene = this.createScene();
  
      // Boucle de rendu de Babylon qui appelle la méthode render() sur la scène
      this.#engine.runRenderLoop(() => {
        scene.render();
      });
    }
  
    // Méthode pour créer et configurer la scène Babylon
    createScene() {  // Remarque : correction de "creteScene" en "createScene"
      // Création de la scène
      const scene = new Scene(this.#engine);
  
      // Création d'une caméra libre placée en (0,5,-10)
      const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
      // La caméra cible le point (0, 0, 0)
      camera.setTarget(Vector3.Zero());
      // Permet à l'utilisateur de contrôler la caméra avec la souris
      camera.attachControl(this.#canvas, true);
  
      // Création d'une lumière hémisphérique pour éclairer la scène globalement
      // Notez qu'ici le constructeur attend une position (0,1,0) et la scène en deuxième paramètre
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      // Intensité de la lumière (entre 0 et 1)
      light.intensity = 0.7;
  
      // Création d'une lampe spot pour des ombres plus marquées
      const sLight = new SpotLight("spot1", new Vector3(0, 20, 20), new Vector3(0, -1, -1), 1.2, 24, scene);
      // Création d'un générateur d'ombres qui utilise la lumière spot
      const shadowGenerator = new ShadowGenerator(1024, sLight);
      // Active l'effet de flou pour les ombres proches
      shadowGenerator.useBlurCloseExponentialShadowMap = true;
  
      // Création d'une sphère qui recevra des ombres et sera éclairée
      const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
      // Positionnement de la sphère au-dessus du sol (y = 1)
      sphere.position.y = 1;
      // On indique que la sphère peut générer des ombres
      shadowGenerator.addShadowCaster(sphere);
  
      // Création du sol
      const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
      // Le sol peut recevoir les ombres projetées par d'autres objets
      ground.receiveShadows = true;
  
      // Création d'un matériau pour le sol
      const matGround = new StandardMaterial("boue", scene);
      // On applique une texture diffuse au sol
      matGround.diffuseTexture = new Texture(floorUrl);
      // On applique une texture de relief (bump) pour simuler des irrégularités
      matGround.bumpTexture = new Texture(floorBumpUrl);
      // Affectation du matériau au sol
      ground.material = matGround;
  
      // Création d'un matériau pour la sphère
      const matSphere = new StandardMaterial("silver", scene);
      // Couleur diffuse de la sphère
      matSphere.diffuseColor = new Color3(0.8, 0.8, 1);
      // Couleur spéculaire pour donner un effet brillant
      matSphere.specularColor = new Color3(0.4, 0.4, 1);
      // Affectation du matériau à la sphère
      sphere.material = matSphere;
      Inspector.Show(scene, {});
      // Retourne la scène créée
      return scene;
    }
  }
  
  // On exporte la classe Game pour pouvoir l'importer dans d'autres modules
  export default Game;
  