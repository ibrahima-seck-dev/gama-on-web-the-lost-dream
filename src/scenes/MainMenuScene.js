import {
  Scene,
  FreeCamera,
  HemisphericLight,
  Vector3,
  Texture,
  Animation,
  StandardMaterial,
  MeshBuilder
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Button,
  Control,
  TextBlock
} from "@babylonjs/gui";
import { Inspector } from "@babylonjs/inspector";
import BaseScene from "../BaseScene";
const backgroundUrl = "/assets/textures/background.jpg"; // URL de l'image de fond


class MainMenuScene extends BaseScene {
  constructor(engine, canvas) {
    super(engine, canvas);
  }

  initScene() {
    this._scene = new Scene(this._engine);

    // Initialisation de la caméra et de la lumière
    this._initCamera();
    this._initLight();

    // Ajout du fond d'écran plein écran
    this._createBackground();

    // Interface utilisateur
    this._initUI();

    Inspector.Show(this._scene, {}); // Afficher l'inspecteur pour débogage

    return this._scene;
  }

  // Fonction d'initialisation de la caméra
  _initCamera() {
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this._scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this._canvas, true);
  }

  // Fonction d'initialisation de la lumière
  _initLight() {
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), this._scene);
  }

  // Fonction pour créer le fond d'écran plein écran
  _createBackground() {
    const aspectRatio = this._engine.getRenderWidth() / this._engine.getRenderHeight();
    const planeHeight = 10;
    const planeWidth = planeHeight * aspectRatio;

    const backgroundPlane = MeshBuilder.CreatePlane("backgroundPlane", {
      width: planeWidth, 
      height: planeHeight 
    }, this._scene);

    // Position du plan (devant la caméra)
    backgroundPlane.position = new Vector3(0, 0, 0); 
    backgroundPlane.rotation = new Vector3(Math.PI / 2, 0, 0); // Rotation pour le rendre visible par la caméra

    const backgroundMaterial = new StandardMaterial("bgMat", this._scene);
    backgroundMaterial.diffuseTexture = new Texture(backgroundUrl, this._scene); 
    backgroundMaterial.emissiveTexture = backgroundMaterial.diffuseTexture;
    backgroundMaterial.disableLighting = true;
    backgroundMaterial.backFaceCulling = false; // Désactiver le culling de la face arrière
    backgroundPlane.material = backgroundMaterial;
    backgroundPlane.isPickable = false;
  }

  // Fonction pour initialiser l'interface utilisateur
  _initUI() {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this._scene);

    // Titre animé
    this._createTitle(advancedTexture);

    // Bouton start
    this._createStartButton(advancedTexture);
  }

  // Fonction pour créer le titre animé
  _createTitle(advancedTexture) {
    const titleLabel = new TextBlock();
    titleLabel.text = "Welcome to the Game!";
    titleLabel.color = "white";
    titleLabel.fontSize = 40;
    titleLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    titleLabel.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleLabel.top = "30px";
    advancedTexture.addControl(titleLabel);

    const animation = new Animation("titleAnim", "alpha", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    animation.setKeys([
      { frame: 0, value: 0 },
      { frame: 60, value: 1 },
      { frame: 120, value: 0 }
    ]);
    titleLabel.animations = [animation];
    this._scene.beginAnimation(titleLabel, 0, 120, true);
  }

  // Fonction pour créer le bouton start
  _createStartButton(advancedTexture) {
    const startButton = Button.CreateSimpleButton("startButton", "Start Game");
    startButton.width = "200px";
    startButton.height = "50px";
    startButton.color = "white";
    startButton.background = "green";
    startButton.fontSize = 20;

    startButton.onPointerEnterObservable.add(() => {
      startButton.scaleX = 1.1;
      startButton.scaleY = 1.1;
      startButton.background = "blue";
    });

    startButton.onPointerOutObservable.add(() => {
      startButton.scaleX = 1;
      startButton.scaleY = 1;
      startButton.background = "green";
    });

    startButton.onPointerUpObservable.add(() => {
      if (window.game && typeof window.game.switchScene === "function") {
        window.game.switchScene("city");
      }
    });

    startButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    startButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(startButton);
  }
}

export default MainMenuScene;
